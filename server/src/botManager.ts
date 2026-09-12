import fs from 'fs';
import path from 'path';
import { getTenantConfig } from './config';
import { generateAiReply, appendMessage } from './groq';
import { startReminderScheduler } from './reminderManager';
import { synthesizeSpeech } from './voiceEngine';
import {
  getResolvedContactName,
  isAiEnabledForContact,
  getContactVoiceMode,
} from './contactStore';

export interface TelemetryMessage {
  id: string;
  tenantId: string;
  jid: string;
  senderName: string;
  fromMe: boolean;
  text: string;
  timestamp: number;
  isBotReply?: boolean;
}

export interface ContactSummary {
  jid: string;
  senderName: string;
  lastMessage: string;
  lastTimestamp: number;
  isHumanTakeover: boolean;
  takeoverRemainingMs: number;
}

export type SendMessageFn = (jid: string, text: string) => Promise<void>;
export type SendPresenceFn = (presence: 'composing' | 'paused' | 'recording', jid: string) => Promise<void>;
export type SendAudioFn = (jid: string, audioBuffer: Buffer) => Promise<void>;

interface TenantDispatchers {
  sendMsg: SendMessageFn;
  sendPresence: SendPresenceFn;
  sendAudioMsg: SendAudioFn;
}

// Multi-tenant socket dispatchers: tenantId -> TenantDispatchers
const tenantDispatchers = new Map<string, TenantDispatchers>();

// Human takeover timestamps: "tenantId:jid" -> expiresAt
const humanTakeovers = new Map<string, number>();

// Debounce buffers: "tenantId:jid" -> { texts: string[], timer: NodeJS.Timeout, contactName: string, isVoice: boolean }
const debounceBuffers = new Map<
  string,
  {
    texts: string[];
    timer: NodeJS.Timeout;
    contactName: string;
    isVoice: boolean;
  }
>();

// Call reply timestamps: "tenantId:jid" -> lastReplyTimestamp (prevent spamming on multiple rings)
const callReplyTimestamps = new Map<string, number>();

// Persistent voice reply counter per contact: data/voice-reply-counts.json
const DATA_DIR = path.resolve(__dirname, '../data');
const VOICE_COUNTS_FILE = path.join(DATA_DIR, 'voice-reply-counts.json');
let voiceCountsCache: Record<string, number> | null = null;

function loadVoiceCounts(): Record<string, number> {
  if (voiceCountsCache) return voiceCountsCache;
  try {
    if (fs.existsSync(VOICE_COUNTS_FILE)) {
      const raw = fs.readFileSync(VOICE_COUNTS_FILE, 'utf-8');
      voiceCountsCache = JSON.parse(raw) || {};
      return voiceCountsCache!;
    }
  } catch (_) {}
  voiceCountsCache = {};
  return voiceCountsCache;
}

function saveVoiceCounts(counts: Record<string, number>): void {
  try {
    const dir = path.dirname(VOICE_COUNTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(VOICE_COUNTS_FILE, JSON.stringify(counts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[BotManager] Failed to persist voice counts:', err);
  }
}

export function normalizeContactId(jid: string): string {
  return jid.split('@')[0].split(':')[0];
}

export function getVoiceSentCount(tenantId: string, jid: string): number {
  const counts = loadVoiceCounts();
  const key = `${tenantId}:${normalizeContactId(jid)}`;
  return counts[key] || 0;
}

export function incrementVoiceSentCount(tenantId: string, jid: string): number {
  const counts = loadVoiceCounts();
  const key = `${tenantId}:${normalizeContactId(jid)}`;
  const next = (counts[key] || 0) + 1;
  counts[key] = next;
  saveVoiceCounts(counts);
  return next;
}

// Telemetry logs keyed per tenant: tenantId -> TelemetryMessage[] (capped at 100 per tenant)
const tenantTelemetries = new Map<string, TelemetryMessage[]>();
const MAX_LOGS_PER_TENANT = 100;

function getKey(tenantId: string, jid: string): string {
  return `${tenantId}:${jid}`;
}

// ==================== DISPATCHERS & TELEMETRY ====================

export function registerTenantDispatchers(
  tenantId: string,
  sendMsg: SendMessageFn,
  sendPresence: SendPresenceFn,
  sendAudioMsg: SendAudioFn
): void {
  tenantDispatchers.set(tenantId, { sendMsg, sendPresence, sendAudioMsg });
}

export function addTenantTelemetry(tenantId: string, msg: TelemetryMessage): void {
  if (
    !msg.jid ||
    msg.jid === 'status@broadcast' ||
    msg.jid.endsWith('@broadcast') ||
    msg.jid.includes('broadcast') ||
    msg.jid.includes('status') ||
    msg.jid.endsWith('@g.us') ||
    msg.jid.includes('@g.us')
  ) {
    return;
  }
  const logs = tenantTelemetries.get(tenantId) || [];
  logs.unshift(msg);
  if (logs.length > MAX_LOGS_PER_TENANT) {
    logs.pop();
  }
  tenantTelemetries.set(tenantId, logs);
}

export function getTenantTelemetry(tenantId: string): TelemetryMessage[] {
  const logs = tenantTelemetries.get(tenantId) || [];
  return logs.filter(
    (m) =>
      m.jid &&
      m.jid !== 'status@broadcast' &&
      !m.jid.endsWith('@broadcast') &&
      !m.jid.includes('broadcast') &&
      !m.jid.includes('status') &&
      !m.jid.endsWith('@g.us') &&
      !m.jid.includes('@g.us')
  );
}

export function getTenantContacts(tenantId: string): ContactSummary[] {
  const logs = getTenantTelemetry(tenantId);
  const contactsMap = new Map<string, ContactSummary>();

  for (const m of logs) {
    if (
      !m.jid ||
      m.jid === 'status@broadcast' ||
      m.jid.endsWith('@broadcast') ||
      m.jid.includes('broadcast') ||
      m.jid.includes('status') ||
      m.jid.endsWith('@g.us') ||
      m.jid.includes('@g.us')
    ) {
      continue;
    }
    if (!contactsMap.has(m.jid)) {
      const resolved = getResolvedContactName(tenantId, m.jid, m.senderName);
      contactsMap.set(m.jid, {
        jid: m.jid,
        senderName: resolved.name,
        lastMessage: m.text,
        lastTimestamp: m.timestamp,
        isHumanTakeover: isTenantTakeoverActive(tenantId, m.jid),
        takeoverRemainingMs: getTenantTakeoverRemainingMs(tenantId, m.jid),
      });
    }
  }

  return Array.from(contactsMap.values());
}

// ==================== HUMAN TAKEOVER ====================

export function isTenantTakeoverActive(tenantId: string, jid: string): boolean {
  const key = getKey(tenantId, jid);
  const expiresAt = humanTakeovers.get(key);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    humanTakeovers.delete(key);
    console.log(
      `[Takeover] Tenant '${tenantId}': 15m human inactivity cooldown expired for ${jid}. Bot automatically resumed.`
    );
    return false;
  }
  return true;
}

export function setTenantHumanTakeover(tenantId: string, jid: string, minutes?: number): void {
  const config = getTenantConfig(tenantId);
  const cooldownMin = minutes ?? config.humanTakeoverCooldownMinutes ?? 15;
  const duration = cooldownMin * 60 * 1000;
  const key = getKey(tenantId, jid);
  humanTakeovers.set(key, Date.now() + duration);
  console.log(
    `[Takeover] Tenant '${tenantId}': Takeover active for ${jid} for ${cooldownMin}m. Will automatically resume after ${cooldownMin}m if no human message is sent.`
  );
}

export function clearTenantHumanTakeover(tenantId: string, jid: string): void {
  humanTakeovers.delete(getKey(tenantId, jid));
  console.log(`[Takeover] Tenant '${tenantId}': Takeover cleared for ${jid}. Bot active.`);
}

export function getTenantTakeoverRemainingMs(tenantId: string, jid: string): number {
  const key = getKey(tenantId, jid);
  const expiresAt = humanTakeovers.get(key);
  if (!expiresAt) return 0;
  const rem = expiresAt - Date.now();
  return rem > 0 ? rem : 0;
}

// ==================== PRESENCE ====================

export function handleTenantUserPresence(tenantId: string, jid: string, presence: string): void {
  if (presence === 'composing' || presence === 'recording') {
    const key = getKey(tenantId, jid);
    const existing = debounceBuffers.get(key);
    if (existing) {
      clearTimeout(existing.timer);
      const config = getTenantConfig(tenantId);
      const waitMs = Math.max(config.debounceWaitMs || 6500, 5000);
      console.log(`[Presence] Tenant '${tenantId}': Client ${jid} is typing. Extending wait by ${waitMs}ms...`);
      existing.timer = setTimeout(() => processDebouncedMessage(tenantId, jid), waitMs);
    }
  }
}

// ==================== INCOMING CALL HANDLING ====================

export async function handleTenantIncomingCall(
  tenantId: string,
  params: {
    jid: string;
    callId: string;
    isVideo: boolean;
  }
): Promise<void> {
  const { jid, isVideo } = params;
  const config = getTenantConfig(tenantId);
  const callType = isVideo ? 'Video' : 'Voice';

  console.log(`[Call Event] Tenant '${tenantId}': Received ${callType} call from ${jid}`);

  // Log in telemetry
  addTenantTelemetry(tenantId, {
    id: `call-${Date.now()}`,
    tenantId,
    jid,
    senderName: jid.split('@')[0],
    fromMe: false,
    text: `[Missed WhatsApp ${callType} Call]`,
    timestamp: Date.now(),
    isBotReply: false,
  });

  if (!config.autoReplyEnabled) return;
  if (isTenantTakeoverActive(tenantId, jid)) return;

  // Debounce call auto-replies (max 1 auto-reply per 5 minutes per contact)
  const key = getKey(tenantId, jid);
  const lastReply = callReplyTimestamps.get(key) || 0;
  if (Date.now() - lastReply < 5 * 60 * 1000) {
    console.log(`[Call Event] Tenant '${tenantId}': Auto-reply suppressed (already replied in last 5m).`);
    return;
  }

  callReplyTimestamps.set(key, Date.now());

  const dispatchers = tenantDispatchers.get(tenantId);
  if (!dispatchers) return;

  // Personalized displayName (e.g. "Aditya Patil" / "Aditya") - never hardcode 'Team Axiogen'
  const displayName =
    config.ownerName ||
    config.botName ||
    (config.businessName && !config.businessName.toLowerCase().includes('team axiogen') ? config.businessName : '') ||
    'Aditya';

  const autoReply =
    tenantId === 'default'
      ? "Hey! Saw you called just now. I am currently tied up and could not pick up right now. What's up? Let me know here, or tell me when you are free and I can schedule a call for us."
      : `Hello! Thank you for calling ${displayName}. I could not take your call right now. Please leave your message here or let me know a convenient time to connect.`;

  // Brief delay before sending
  setTimeout(async () => {
    try {
      await dispatchers.sendMsg(jid, autoReply);
      addTenantTelemetry(tenantId, {
        id: `bot-call-reply-${Date.now()}`,
        tenantId,
        jid,
        senderName: config.botName || 'AI Assistant',
        fromMe: true,
        text: autoReply,
        timestamp: Date.now(),
        isBotReply: true,
      });
      console.log(`[Call Auto-Reply Sent] To ${jid}: "${autoReply}"`);
    } catch (err) {
      console.error(`[Call Error] Failed sending call auto-reply to ${jid}:`, err);
    }
  }, 3000);
}

// ==================== INCOMING MESSAGE HANDLING ====================

export async function handleTenantIncomingMessage(
  tenantId: string,
  params: {
    jid: string;
    fromMe: boolean;
    text: string;
    pushName?: string;
    messageId: string;
    isVoice?: boolean;
  }
): Promise<void> {
  const { jid, fromMe, text, pushName, messageId, isVoice = false } = params;
  const config = getTenantConfig(tenantId);

  // STRICT FILTER: Absolutely ignore channels, newsletters, communities, groups, and broadcasts.
  // ONLY personal 1-to-1 DMs are processed.
  const isNewsletter = jid.endsWith('@newsletter') || jid.includes('newsletter');
  const isGroup = jid.endsWith('@g.us') || jid.includes('@g.us');
  const isBroadcast = jid.endsWith('@broadcast') || jid.includes('broadcast') || jid.startsWith('status@');
  const isSystem = jid.startsWith('0@');

  if (isNewsletter || isGroup || isBroadcast || isSystem || (!jid.endsWith('@s.whatsapp.net') && !jid.endsWith('@lid'))) {
    return;
  }

  const cleanText = text.trim();
  if (!cleanText) return;

  const senderName = pushName || jid.split('@')[0];

  // Log in telemetry
  addTenantTelemetry(tenantId, {
    id: messageId,
    tenantId,
    jid,
    senderName,
    fromMe,
    text: cleanText,
    timestamp: Date.now(),
    isBotReply: false,
  });

  // If message was sent manually by business owner from phone
  if (fromMe) {
    console.log(`[Manual Action] Tenant '${tenantId}' owner texted ${jid}. Pausing bot for 15m.`);
    setTenantHumanTakeover(tenantId, jid, 15);
    appendMessage(tenantId, jid, 'assistant', cleanText);
    return;
  }

  // Extract cleaned phone digits for matching
  const phoneOnly = jid.split('@')[0].split(':')[0].replace(/\D/g, '');

  // 1. Check blocked list / blacklist
  if (config.blockedNumbers && config.blockedNumbers.length > 0) {
    const isBlocked = config.blockedNumbers.some((b) => {
      const cleanB = b.replace(/\D/g, '');
      return cleanB === phoneOnly || phoneOnly.endsWith(cleanB) || cleanB.endsWith(phoneOnly);
    });
    if (isBlocked) {
      console.log(`[Bot Filter] Tenant '${tenantId}': Suppressed message from blocked number ${phoneOnly}.`);
      return;
    }
  }

  // 2. Identify VIP Contact if configured
  const vip = config.vipContacts?.find((v) => {
    const vPhone = v.phone.replace(/\D/g, '');
    return vPhone === phoneOnly || phoneOnly.endsWith(vPhone) || vPhone.endsWith(phoneOnly);
  });

  // 3. Check Audience Mode
  const audienceMode = config.audienceMode || 'all';
  if (audienceMode === 'whitelist_only') {
    const isAllowed =
      (config.allowedNumbers &&
        config.allowedNumbers.some((a) => {
          const cleanA = a.replace(/\D/g, '');
          return cleanA === phoneOnly || phoneOnly.endsWith(cleanA) || cleanA.endsWith(phoneOnly);
        })) ||
      Boolean(vip);

    if (!isAllowed) {
      console.log(`[Bot Audience] Tenant '${tenantId}': Skipping ${phoneOnly} (audienceMode: whitelist_only).`);
      return;
    }
  } else if (audienceMode === 'exclude_vip') {
    if (vip) {
      console.log(`[Bot Audience] Tenant '${tenantId}': VIP contact ${phoneOnly} (${vip.name}) received message while audienceMode is exclude_vip. Flagging for human takeover.`);
      setTenantHumanTakeover(tenantId, jid, 60);
      return;
    }
  }

  // 4. Check VIP Specific Delivery Rule or Contact-level AI mute
  if (vip && vip.rule === 'human_only') {
    console.log(`[Bot VIP] Tenant '${tenantId}': VIP contact ${phoneOnly} (${vip.name}) is 'human_only'. Pausing bot for 60m.`);
    setTenantHumanTakeover(tenantId, jid, 60);
    return;
  }

  // Check if contact specifically has AI disabled in directory (Human Only)
  if (!isAiEnabledForContact(tenantId, jid)) {
    console.log(`[Bot Filter] Tenant '${tenantId}': Contact ${phoneOnly} has AI disabled (Human Only). Pausing bot for 60m.`);
    setTenantHumanTakeover(tenantId, jid, 60);
    return;
  }

  // 5. Fallback check for allowedNumbers if audienceMode is 'all'
  if (config.allowedNumbers && config.allowedNumbers.length > 0) {
    const isAllowed =
      config.allowedNumbers.some((a) => {
        const cleanA = a.replace(/\D/g, '');
        return cleanA === phoneOnly || phoneOnly.endsWith(cleanA) || cleanA.endsWith(phoneOnly);
      }) || Boolean(vip);

    if (!isAllowed) {
      return;
    }
  }

  // Check auto-reply master toggle
  if (!config.autoReplyEnabled) {
    return;
  }

  // Check human takeover
  if (isTenantTakeoverActive(tenantId, jid)) {
    console.log(`[Bot] Tenant '${tenantId}': Human takeover active for ${jid}. Bot muted.`);
    return;
  }

  // Debounce multi-part messages
  const key = getKey(tenantId, jid);
  const existing = debounceBuffers.get(key);
  const debounceWindow = Math.max(config.debounceWaitMs || 6500, 5000);

  if (existing) {
    clearTimeout(existing.timer);
    existing.texts.push(cleanText);
    existing.contactName = senderName;
    if (isVoice) existing.isVoice = true;
    console.log(`[Debounce] Tenant '${tenantId}': Appended message part from ${jid} (voice: ${existing.isVoice}).`);
  } else {
    debounceBuffers.set(key, {
      texts: [cleanText],
      contactName: senderName,
      isVoice,
      timer: setTimeout(() => processDebouncedMessage(tenantId, jid), debounceWindow),
    });
    console.log(`[Debounce] Tenant '${tenantId}': Started ${debounceWindow}ms debounce for ${jid} (voice: ${isVoice}).`);
    return;
  }

  existing.timer = setTimeout(() => processDebouncedMessage(tenantId, jid), debounceWindow);
}

/**
 * Process debounced messages and invoke AI Brain
 */
async function processDebouncedMessage(tenantId: string, jid: string): Promise<void> {
  const key = getKey(tenantId, jid);
  const buffered = debounceBuffers.get(key);
  debounceBuffers.delete(key);

  if (!buffered || buffered.texts.length === 0) return;

  const combinedText = buffered.texts.join('\n');
  const wasVoiceInput = Boolean(buffered.isVoice);

  const resolved = getResolvedContactName(tenantId, jid, buffered.contactName);
  const contactName = resolved.name;

  console.log(
    `[Debounce Complete] Tenant '${tenantId}' processing from ${jid} (name: "${contactName}", voiceInput: ${wasVoiceInput}): "${combinedText.substring(0, 60)}..."`
  );

  const dispatchers = tenantDispatchers.get(tenantId);
  if (!dispatchers) {
    console.error(`[BotManager] No active socket dispatchers for tenant ${tenantId}.`);
    return;
  }

  const config = getTenantConfig(tenantId);

  const phoneOnly = jid.split('@')[0].split(':')[0].replace(/\D/g, '');
  const vip = config.vipContacts?.find((v) => {
    const vPhone = v.phone.replace(/\D/g, '');
    return vPhone === phoneOnly || phoneOnly.endsWith(vPhone) || vPhone.endsWith(phoneOnly);
  });

  // Determine whether to send voice reply:
  // - VIP Contact Rule Override:
  //   * 'text_only': explicitly suppressed from voice replies
  //   * 'voice_only': always receives voice notes
  // - Global voiceReplyMode:
  //   * 'always': all replies are spoken
  //   * 'first_two_voice': first 2 bot replies to this contact are voice notes, thereafter text
  //   * 'adaptive': replies as voice note if user spoke into mic (voice note)
  //   * 'text_only': text only
  const voiceSentCount = getVoiceSentCount(tenantId, jid);
  const contactVoiceMode = getContactVoiceMode(tenantId, jid);

  let shouldSendVoice = false;
  if (contactVoiceMode === 'text_only' || vip?.rule === 'text_only') {
    shouldSendVoice = false;
  } else if (contactVoiceMode === 'voice_only' || vip?.rule === 'voice_only') {
    shouldSendVoice = true;
  } else if (config.voiceReplyMode === 'always') {
    shouldSendVoice = true;
  } else if (config.voiceReplyMode === 'first_two_voice') {
    // Exactly the first 2 bot replies to this contact are voice notes, thereafter text
    shouldSendVoice = voiceSentCount < 2;
  } else if (config.voiceReplyMode === 'text_only') {
    shouldSendVoice = false;
  } else {
    // Default 'adaptive': speak if user spoke
    shouldSendVoice = wasVoiceInput;
  }

  // Send typing or recording indicator
  try {
    if (shouldSendVoice) {
      await dispatchers.sendPresence('recording', jid);
    } else {
      await dispatchers.sendPresence('composing', jid);
    }
  } catch (_) {}

  // Random delay for human feel
  const randomDelay = Math.floor(
    Math.random() * (config.typingDelayMaxMs - config.typingDelayMinMs + 1) + config.typingDelayMinMs
  );

  // Generate Groq AI reply (with VIP metadata and tool calling execution)
  const aiResponse = await generateAiReply(tenantId, jid, combinedText, contactName, {
    isVip: Boolean(vip) || Boolean(resolved.isVip),
    vipRule: vip?.rule,
    vipNotes: vip?.notes,
  });

  if (!aiResponse) {
    try {
      await dispatchers.sendPresence('paused', jid);
    } catch (_) {}
    return;
  }

  // If voice reply is requested, synthesize speech via Axiogen Voice Engine v2
  if (shouldSendVoice) {
    try {
      console.log(`[Voice Note Reply] Tenant '${tenantId}': Synthesizing speech with Axiogen Voice v2 (${config.voicePersona || 'am_adam'})...`);
      const audioBuffer = await synthesizeSpeech(aiResponse, {
        voice: config.voicePersona || 'am_adam',
        speed: config.voiceSpeed || 1.0,
      });

      if (audioBuffer && audioBuffer.length > 0) {
        await dispatchers.sendAudioMsg(jid, audioBuffer);
        await dispatchers.sendPresence('paused', jid);

        const newCount = incrementVoiceSentCount(tenantId, jid);

        addTenantTelemetry(tenantId, {
          id: `bot-voice-${Date.now()}`,
          tenantId,
          jid,
          senderName: config.botName || 'AI Assistant',
          fromMe: true,
          text: `🎤 [Voice Note]: "${aiResponse}"`,
          timestamp: Date.now(),
          isBotReply: true,
        });

        console.log(`[Bot Voice Reply Sent] Tenant '${tenantId}' to ${jid} (voice note ${newCount} of 2 for contact): "${aiResponse.substring(0, 60)}..."`);
        return;
      } else {
        console.warn(`[Voice Fallback] Speech synthesis returned null. Falling back to text message for ${jid}.`);
      }
    } catch (voiceErr) {
      console.error(`[Voice Error] Failed generating voice reply, falling back to text:`, voiceErr);
    }
  }

  // Standard Text Reply
  await new Promise((resolve) => setTimeout(resolve, randomDelay));

  try {
    await dispatchers.sendMsg(jid, aiResponse);
    await dispatchers.sendPresence('paused', jid);

    addTenantTelemetry(tenantId, {
      id: `bot-${Date.now()}`,
      tenantId,
      jid,
      senderName: config.botName || 'AI Assistant',
      fromMe: true,
      text: aiResponse,
      timestamp: Date.now(),
      isBotReply: true,
    });

    console.log(`[Bot Text Reply Sent] Tenant '${tenantId}' to ${jid}: "${aiResponse.substring(0, 60)}..."`);
  } catch (err) {
    console.error(`[Bot Error] Tenant '${tenantId}' failed sending message to ${jid}:`, err);
  }
}

// Initialize Autonomous Background Scheduler to dispatch due reminders
startReminderScheduler(async (tenantId: string, jid: string, text: string) => {
  const dispatchers = tenantDispatchers.get(tenantId);
  if (dispatchers) {
    try {
      await dispatchers.sendMsg(jid, text);
      addTenantTelemetry(tenantId, {
        id: `rem-fired-${Date.now()}`,
        tenantId,
        jid,
        senderName: 'Reminder Engine',
        fromMe: true,
        text,
        timestamp: Date.now(),
        isBotReply: true,
      });
      console.log(`[Reminder Dispatched] Sent to ${jid} (tenant: ${tenantId}): "${text}"`);
    } catch (err) {
      console.error(`[Reminder Dispatch Error] Failed to send to ${jid}:`, err);
    }
  } else {
    console.warn(`[Reminder Dispatch Warning] No active socket for tenant ${tenantId} to send reminder to ${jid}`);
  }
});
