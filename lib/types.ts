export interface TenantUser {
  id: string;
  email: string;
  name: string;
  businessName: string;
  tenantId: string;
  createdAt: string;
  plan?: 'free_trial' | 'starter' | 'pro' | 'agency';
  messagesUsed?: number;
  trialLimit?: number;
  isAdmin?: boolean;
}

export type VipRule = 'human_only' | 'text_only' | 'voice_only' | 'ai_allowed';
export type AudienceMode = 'all' | 'exclude_vip' | 'whitelist_only';

export interface VipContact {
  phone: string;
  name: string;
  rule: VipRule;
  notes?: string;
  addedAt?: number;
}

export interface SavedContact {
  jid: string;
  phone: string;
  name?: string;
  notify?: string;
  verifiedName?: string;
  updatedAt: number;
  aiEnabled?: boolean;
  voiceMode?: 'default' | 'text_only' | 'voice_only';
  isVip?: boolean;
  notes?: string;
}

export interface TenantBotConfig {
  tenantId: string;
  botName: string;
  ownerName?: string;
  businessName?: string;
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
  voiceReplyMode?: 'adaptive' | 'always' | 'text_only' | 'first_two_voice';
  voicePersona?: string;
  voiceSpeed?: number;
  vipModeEnabled?: boolean;
  audienceMode?: AudienceMode;
  vipContacts?: VipContact[];
  useSavedContactNames?: boolean;
  blockedNumbers?: string[];
  allowedNumbers?: string[];
}

export interface TenantSessionStatus {
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  phone?: string;
  name?: string;
  qrCodeUrl?: string;
  qr?: string;
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
