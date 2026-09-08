export interface TenantUser {
  id: string;
  email: string;
  name: string;
  businessName: string;
  tenantId: string;
  createdAt: string;
}

export interface TenantBotConfig {
  tenantId: string;
  botName: string;
  autoReplyEnabled: boolean;
  groqModel: string;
  systemPrompt: string;
  welcomeMessage: string;
  typingDelayMinMs: number;
  typingDelayMaxMs: number;
  debounceWaitMs: number;
  humanTakeoverCooldownMinutes: number;
  hasGroqApiKey?: boolean;
  maskedGroqApiKey?: string;
}

export interface TenantSessionStatus {
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  phone?: string;
  name?: string;
  qrCodeUrl?: string;
  pairingCode?: string;
  lastConnectedAt?: string;
  lastError?: string;
  botConfig?: Partial<TenantBotConfig>;
}

export interface ChatMessage {
  id: string;
  jid: string;
  senderName: string;
  fromMe: boolean;
  text: string;
  timestamp: number;
  isBotReply?: boolean;
}

export interface ChatContact {
  jid: string;
  senderName: string;
  lastMessage: string;
  lastTimestamp: number;
  isHumanTakeover: boolean;
  takeoverRemainingMs: number;
}
