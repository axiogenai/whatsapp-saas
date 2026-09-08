import { getTenantConfig } from './config';
import { generateAiReply, appendMessage } from './groq';
import { startReminderScheduler, addReminder } from './reminderManager';
import { synthesizeSpeech } from './voiceEngine';

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
      contactsMap.set(m.jid, {
        jid: m.jid,
        senderName: m.fromMe ? m.jid.split('@')[0] : m.senderName,
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
    return false;
  }
  return true;
}

export function setTenantHumanTakeover(tenantId: string, jid: string, minutes?: number): void {
  const config = getTenantConfig(tenantId);
  const duration = (minutes ?? config.humanTakeoverCooldownMinutes) * 60 * 1000;
  const key = getKey(tenantId, jid);
  humanTakeovers.set(key, Date.now() + duration);
  console.log(
    `[Takeover] Tenant '${tenantId}': Takeover active for ${jid} for ${
      minutes ?? config.humanTakeoverCooldownMinutes
    }m.`
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

  // Automatically schedule a reminder to call back
  addReminder(
    tenantId,
    jid,
    `Follow up with ${jid.split('@')[0]} regarding missed WhatsApp ${callType} call`,
    Date.now() + 15 * 60 * 1000
  );

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

  const autoReply =
    tenantId === 'default'
      ? "Hey! Saw you called just now. I am currently in a client sprint / meeting and cannot pick up right now. What's up? Let me know here, or tell me when you are free and I can schedule a call for us."
      : `Hello! Thank you for calling ${config.businessName}. We are currently in a consultation and could not take your call. Please leave your message here or let us know a preferred time to connect.`;

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

  // STRICT FILTER: Absolutely ignore WhatsApp status broadcasts / stories and group chats
  if (
    !jid ||
    jid === 'status@broadcast' ||
    jid.endsWith('@broadcast') ||
    jid.includes('broadcast') ||
    jid.includes('status') ||
    jid.endsWith('@g.us') ||
    jid.includes('@g.us')
  ) {
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
    console.log(`[Manual Action] Tenant '${tenantId}' owner texted ${jid}. Pausing bot.`);
    setTenantHumanTakeover(tenantId, jid);
    appendMessage(tenantId, jid, 'assistant', cleanText);
    return;
  }

  // Check blocked list
  const phoneOnly = jid.split('@')[0];
  if (config.blockedNumbers.length > 0 && config.blockedNumbers.includes(phoneOnly)) {
    return;
  }

  // Check allowed numbers if whitelist active
  if (config.allowedNumbers.length > 0 && !config.allowedNumbers.includes(phoneOnly)) {
    return;
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
  const contactName = buffered.contactName;
  const wasVoiceInput = Boolean(buffered.isVoice);

  console.log(
    `[Debounce Complete] Tenant '${tenantId}' processing from ${jid} (voiceInput: ${wasVoiceInput}): "${combinedText.substring(0, 60)}..."`
  );

  const dispatchers = tenantDispatchers.get(tenantId);
  if (!dispatchers) {
    console.error(`[BotManager] No active socket dispatchers for tenant ${tenantId}.`);
    return;
  }

  const config = getTenantConfig(tenantId);

  // Determine whether to send voice reply:
  // - 'always': all replies are spoken
  // - 'adaptive': replies as voice note if user spoke into mic (voice note)
  // - 'text_only': text only
  const shouldSendVoice =
    config.voiceReplyMode === 'always' ||
    ((config.voiceReplyMode === 'adaptive' || !config.voiceReplyMode) && wasVoiceInput);

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

  // Generate Groq AI reply (with tool calling execution)
  const aiResponse = await generateAiReply(tenantId, jid, combinedText, contactName);

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

        console.log(`[Bot Voice Reply Sent] Tenant '${tenantId}' to ${jid}: "${aiResponse.substring(0, 60)}..."`);
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
