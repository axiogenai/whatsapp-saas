import path from 'path';
import fs from 'fs';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WAMessage,
  WASocket,
  ConnectionState,
  Browsers,
  downloadMediaMessage,
  WACallEvent,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';
import pino from 'pino';
import {
  handleTenantIncomingMessage,
  registerTenantDispatchers,
  handleTenantUserPresence,
  handleTenantIncomingCall,
} from './botManager';
import { transcribeAudioBuffer } from './groq';

export type GatewayConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'qr_ready'
  | 'connected'
  | 'reconnecting';

export interface TenantSessionState {
  tenantId: string;
  status: GatewayConnectionStatus;
  qrCodeDataUrl: string | null;
  rawQr: string | null;
  pairingCode: string | null;
  connectedPhone: string | null;
  connectedName: string | null;
  lastConnectedAt: string | null;
  lastError: string | null;
}

interface ActiveSessionRecord {
  state: TenantSessionState;
  sock: WASocket | null;
  reconnectAttempts: number;
}

const AUTH_ROOT = path.resolve(__dirname, '../auth_info_baileys');
const TENANTS_AUTH_DIR = path.join(AUTH_ROOT, 'tenants');

// Active sessions map: tenantId -> ActiveSessionRecord
const sessions = new Map<string, ActiveSessionRecord>();

function getTenantAuthDir(tenantId: string): string {
  if (tenantId === 'default') {
    return AUTH_ROOT;
  }
  return path.join(TENANTS_AUTH_DIR, tenantId);
}

function getOrCreateRecord(tenantId: string): ActiveSessionRecord {
  let record = sessions.get(tenantId);
  if (!record) {
    record = {
      state: {
        tenantId,
        status: 'disconnected',
        qrCodeDataUrl: null,
        rawQr: null,
        pairingCode: null,
        connectedPhone: null,
        connectedName: null,
        lastConnectedAt: null,
        lastError: null,
      },
      sock: null,
      reconnectAttempts: 0,
    };
    sessions.set(tenantId, record);
  }
  return record;
}

export function getTenantState(tenantId: string = 'default'): TenantSessionState {
  return { ...getOrCreateRecord(tenantId).state };
}

export async function ensureTenantSession(tenantId: string = 'default'): Promise<TenantSessionState> {
  const record = getOrCreateRecord(tenantId);
  if (!record.sock && record.state.status === 'disconnected') {
    console.log(`[Baileys] Auto-initializing session for tenant '${tenantId}'...`);
    initTenantBaileys(tenantId, false).catch((err) => {
      console.error(`[Baileys] Failed to auto-init tenant '${tenantId}':`, err);
    });
  }
  return { ...record.state };
}

export function getAllActiveTenantStates(): TenantSessionState[] {
  return Array.from(sessions.values()).map((r) => ({ ...r.state }));
}

function extractMessageText(msg: WAMessage): string {
  const m = msg.message;
  if (!m) return '';

  if (m.conversation) return m.conversation;
  if (m.extendedTextMessage?.text) return m.extendedTextMessage.text;
  if (m.imageMessage?.caption) return m.imageMessage.caption;
  if (m.videoMessage?.caption) return m.videoMessage.caption;
  if (m.documentMessage?.caption) return m.documentMessage.caption;

  const ephemeral = m.ephemeralMessage?.message;
  if (ephemeral) {
    if (ephemeral.conversation) return ephemeral.conversation;
    if (ephemeral.extendedTextMessage?.text) return ephemeral.extendedTextMessage.text;
    if (ephemeral.imageMessage?.caption) return ephemeral.imageMessage.caption;
  }

  const viewOnce = (m as any).viewOnceMessage?.message || (m as any).viewOnceMessageV2?.message;
  if (viewOnce) {
    if (viewOnce.conversation) return viewOnce.conversation;
    if (viewOnce.extendedTextMessage?.text) return viewOnce.extendedTextMessage.text;
  }

  return '';
}

export async function initTenantBaileys(
  tenantId: string = 'default',
  forceNewSession = false
): Promise<WASocket> {
  const record = getOrCreateRecord(tenantId);
  const authDir = getTenantAuthDir(tenantId);

  if (forceNewSession) {
    try {
      if (fs.existsSync(authDir)) {
        if (tenantId === 'default') {
          const files = fs.readdirSync(authDir);
          for (const f of files) {
            if (f.endsWith('.json') && !f.includes('tenants')) {
              fs.unlinkSync(path.join(authDir, f));
            }
          }
        } else {
          fs.rmSync(authDir, { recursive: true, force: true });
        }
        console.log(`[Baileys] Cleared auth state for tenant '${tenantId}'.`);
      }
    } catch (e) {
      console.error(`[Baileys] Error removing auth directory for tenant '${tenantId}':`, e);
    }
  }

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  record.state.status = 'connecting';
  record.state.lastError = null;

  // Ultra-lean configuration optimized for 1GB RAM VM
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'error' }),
    browser: Browsers.macOS('Desktop'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    keepAliveIntervalMs: 30000,
    connectTimeoutMs: 90000,
    defaultQueryTimeoutMs: 90000,
    retryRequestDelayMs: 2000,
  });

  record.sock = sock;

  // Register socket dispatchers for this tenant
  registerTenantDispatchers(
    tenantId,
    async (jid: string, text: string) => {
      if (!sock) throw new Error(`Socket not connected for tenant ${tenantId}`);
      await sock.sendMessage(jid, { text });
    },
    async (presence: 'composing' | 'paused' | 'recording', jid: string) => {
      if (!sock) return;
      try {
        await sock.sendPresenceUpdate(presence, jid);
      } catch (_) {}
    },
    async (jid: string, audioBuffer: Buffer) => {
      if (!sock) throw new Error(`Socket not connected for tenant ${tenantId}`);
      await sock.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
      });
    }
  );

  sock.ev.on('creds.update', saveCreds);

  // Incoming WhatsApp Call Event Listener (Real Calling Support)
  sock.ev.on('call', async (calls: WACallEvent[]) => {
    try {
      for (const call of calls) {
        if (call.status === 'offer') {
          const callerJid = call.from;
          if (callerJid) {
            handleTenantIncomingCall(tenantId, {
              jid: callerJid,
              callId: call.id,
              isVideo: Boolean(call.isVideo),
            }).catch((err) => {
              console.error(`[Baileys] Error handling incoming call from ${callerJid}:`, err);
            });
          }
        }
      }
    } catch (callErr) {
      console.error(`[Baileys] Call event handler exception:`, callErr);
    }
  });

  // Client typing presence detection
  sock.ev.on('presence.update', async (update) => {
    try {
      const { id, presences } = update;
      if (!id || !presences) return;
      for (const [_, presenceObj] of Object.entries(presences)) {
        const presence = (presenceObj as any)?.lastKnownPresence;
        if (presence) {
          handleTenantUserPresence(tenantId, id, presence);
        }
      }
    } catch (_) {}
  });

  sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      record.state.rawQr = qr;
      record.state.status = 'qr_ready';
      try {
        record.state.qrCodeDataUrl = await qrcode.toDataURL(qr, {
          width: 320,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        console.log(`[Baileys] Tenant '${tenantId}': QR code rendered for pairing.`);
      } catch (err) {
        console.error(`[Baileys] Failed to render QR for tenant ${tenantId}:`, err);
      }
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      record.state.qrCodeDataUrl = null;
      record.state.rawQr = null;
      record.state.pairingCode = null;

      console.warn(`[Baileys] Tenant '${tenantId}' connection closed (code: ${statusCode}).`);

      if (statusCode === DisconnectReason.loggedOut) {
        record.state.status = 'disconnected';
        record.state.connectedPhone = null;
        record.state.connectedName = null;
        record.state.lastError = 'Logged out from WhatsApp.';
        try {
          if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
          }
        } catch (_) {}
      } else if (shouldReconnect) {
        record.state.status = 'reconnecting';
        record.reconnectAttempts++;
        const backoff = Math.min(record.reconnectAttempts * 2000, 15000);
        console.log(`[Baileys] Tenant '${tenantId}': Reconnecting in ${backoff}ms...`);
        setTimeout(() => initTenantBaileys(tenantId, false), backoff);
      } else {
        record.state.status = 'disconnected';
      }
    } else if (connection === 'open') {
      record.reconnectAttempts = 0;
      record.state.status = 'connected';
      record.state.qrCodeDataUrl = null;
      record.state.rawQr = null;
      record.state.pairingCode = null;
      record.state.lastConnectedAt = new Date().toISOString();
      record.state.lastError = null;

      const userJid = sock?.user?.id || '';
      record.state.connectedPhone = userJid.split(':')[0].replace('@s.whatsapp.net', '');
      record.state.connectedName = sock?.user?.name || 'WhatsApp Business';

      console.log(
        `[Baileys] Tenant '${tenantId}' ONLINE! Connected as: +${record.state.connectedPhone} (${record.state.connectedName})`
      );
    }
  });

  sock.ev.on('messages.upsert', async (event) => {
    if (!event.messages || event.type !== 'notify') return;

    for (const msg of event.messages) {
      try {
        const jid = msg.key.remoteJid;
        if (!jid) continue;

        // STRICT FILTER: Absolutely ignore WhatsApp status broadcasts / stories and group chats
        if (
          jid === 'status@broadcast' ||
          jid.endsWith('@broadcast') ||
          jid.includes('@broadcast') ||
          jid.includes('status') ||
          jid.endsWith('@g.us') ||
          jid.includes('@g.us')
        ) {
          continue;
        }

        let text = extractMessageText(msg);

        // Detect Audio & Voice Notes ("it must listen everything")
        const audioMsg =
          msg.message?.audioMessage ||
          msg.message?.ephemeralMessage?.message?.audioMessage ||
          (msg.message as any)?.viewOnceMessage?.message?.audioMessage ||
          (msg.message as any)?.viewOnceMessageV2?.message?.audioMessage;

        if (audioMsg && !text) {
          console.log(`[Baileys] Voice note / audio detected from ${jid}. Downloading & transcribing with Groq Whisper...`);
          try {
            const buffer = await downloadMediaMessage(
              msg,
              'buffer',
              {},
              {
                logger: pino({ level: 'silent' }),
                reuploadRequest: sock.updateMediaMessage,
              }
            );

            if (buffer && Buffer.isBuffer(buffer) && buffer.length > 0) {
              const transcription = await transcribeAudioBuffer(tenantId, buffer);
              if (transcription) {
                text = `[Voice Note]: "${transcription}"`;
                console.log(`[Voice Note Transcribed] ${jid}: "${transcription}"`);
              }
            }
          } catch (audioErr: any) {
            console.error(`[Baileys] Voice note transcription failed for ${jid}:`, audioErr?.message || audioErr);
          }
        }

        if (!text) continue;

        await handleTenantIncomingMessage(tenantId, {
          jid,
          fromMe: !!msg.key.fromMe,
          text,
          pushName: msg.pushName || undefined,
          messageId: msg.key.id || `msg-${Date.now()}`,
          isVoice: Boolean(audioMsg),
        });
      } catch (err) {
        console.error(`[Baileys] Error processing incoming message for tenant ${tenantId}:`, err);
      }
    }
  });

  return sock;
}

export async function requestTenantPairingCode(tenantId: string, phoneNumber: string): Promise<string> {
  let record = sessions.get(tenantId);
  if (!record || !record.sock) {
    await initTenantBaileys(tenantId, false);
    record = getOrCreateRecord(tenantId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const sock = record.sock;
  if (!sock) throw new Error('Could not initialize WhatsApp socket for pairing.');

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    throw new Error('Invalid phone format. Include country code + phone digits only.');
  }

  try {
    console.log(`[Baileys] Tenant '${tenantId}': Requesting pairing code for ${cleanPhone}...`);
    const code = await sock.requestPairingCode(cleanPhone);
    const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
    record.state.pairingCode = formatted;
    return formatted;
  } catch (err: any) {
    console.error(`[Baileys] Tenant '${tenantId}' failed pairing code request:`, err);
    throw new Error(err?.message || 'Failed to request pairing code');
  }
}

export async function sendTenantManualMessage(
  tenantId: string,
  phoneNumber: string,
  text: string
): Promise<void> {
  const record = sessions.get(tenantId);
  if (!record?.sock) throw new Error(`WhatsApp socket not connected for tenant ${tenantId}.`);

  let jid = phoneNumber.trim();
  if (!jid.includes('@')) {
    jid = `${jid.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
  }
  await record.sock.sendMessage(jid, { text });
}

export async function logoutTenant(tenantId: string): Promise<void> {
  const record = sessions.get(tenantId);
  if (record?.sock) {
    try {
      await record.sock.logout();
    } catch (_) {}
    record.sock = null;
  }

  const authDir = getTenantAuthDir(tenantId);
  if (fs.existsSync(authDir)) {
    try {
      if (tenantId === 'default') {
        const files = fs.readdirSync(authDir);
        for (const f of files) {
          if (f.endsWith('.json') && !f.includes('tenants')) {
            fs.unlinkSync(path.join(authDir, f));
          }
        }
      } else {
        fs.rmSync(authDir, { recursive: true, force: true });
      }
    } catch (_) {}
  }

  const st = getOrCreateRecord(tenantId).state;
  st.status = 'disconnected';
  st.connectedPhone = null;
  st.connectedName = null;
  st.qrCodeDataUrl = null;
  st.rawQr = null;
  st.pairingCode = null;
  st.lastError = 'Logged out manually.';

  setTimeout(() => initTenantBaileys(tenantId, false), 2000);
}

/**
 * Scan all stored tenant auth directories and auto-boot authenticated sessions on startup
 */
export async function bootExistingSessions(): Promise<void> {
  console.log('[Baileys] Scanning for saved tenant sessions...');

  // 1. Boot default tenant if creds exist
  const defaultCreds = path.join(AUTH_ROOT, 'creds.json');
  if (fs.existsSync(defaultCreds)) {
    console.log('[Baileys] Found active credentials for default tenant. Starting session...');
    initTenantBaileys('default', false).catch((e) =>
      console.error('[Baileys] Error booting default session:', e)
    );
  } else {
    initTenantBaileys('default', false).catch((e) =>
      console.error('[Baileys] Error starting default session:', e)
    );
  }

  // 2. Scan multi-tenant directories in ./auth_info_baileys/tenants/
  if (fs.existsSync(TENANTS_AUTH_DIR)) {
    const tenantEntries = fs.readdirSync(TENANTS_AUTH_DIR, { withFileTypes: true });
    for (const ent of tenantEntries) {
      if (ent.isDirectory()) {
        const tenantCreds = path.join(TENANTS_AUTH_DIR, ent.name, 'creds.json');
        if (fs.existsSync(tenantCreds)) {
          console.log(`[Baileys] Found active credentials for tenant '${ent.name}'. Starting session...`);
          initTenantBaileys(ent.name, false).catch((e) =>
            console.error(`[Baileys] Error booting session for tenant ${ent.name}:`, e)
          );
        }
      }
    }
  }
}

// Backwards compatibility aliases for server.ts
export const initBaileys = (force?: boolean) => initTenantBaileys('default', force);
export const getGatewayState = () => getTenantState('default');
export const requestPairingCode = (phone: string) => requestTenantPairingCode('default', phone);
export const sendManualMessage = (phone: string, text: string) => sendTenantManualMessage('default', phone, text);
export const logoutGateway = () => logoutTenant('default');
