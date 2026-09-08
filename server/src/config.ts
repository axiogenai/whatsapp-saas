import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface BotConfig {
  tenantId: string;
  businessName: string;
  botName: string;
  groqApiKey: string;
  groqModel: string;
  autoReplyEnabled: boolean;
  systemPrompt: string;
  typingDelayMinMs: number;
  typingDelayMaxMs: number;
  debounceWaitMs: number;
  humanTakeoverCooldownMinutes: number;
  allowedNumbers: string[];
  blockedNumbers: string[];
  voiceReplyMode: 'adaptive' | 'always' | 'text_only';
  voicePersona: string;
  voiceSpeed: number;
  ownerName?: string;
  ownerEmail?: string;
  plan?: 'free_trial' | 'starter' | 'pro' | 'agency';
  trialLimit?: number;
}

const HARDCODED_GROQ_KEY = process.env.GROQ_API_KEY || '';

export const DEFAULT_SYSTEM_PROMPT = `You are a helpful and polite AI assistant for this business on WhatsApp.
Respond to customer queries accurately, warmly, and helpfully.
Always communicate in plain text without markdown formatting.`;

const DATA_DIR = path.resolve(__dirname, '../data');
const TENANTS_DIR = path.join(DATA_DIR, 'tenants');
const DEFAULT_CONFIG_FILE = path.join(DATA_DIR, 'bot-config.json');

// In-memory cache of tenant configs
const tenantConfigs = new Map<string, BotConfig>();

function getTenantConfigFile(tenantId: string): string {
  if (tenantId === 'default') {
    return DEFAULT_CONFIG_FILE;
  }
  return path.join(TENANTS_DIR, `${tenantId}.json`);
}

function getDefaultConfig(tenantId: string): BotConfig {
  return {
    tenantId,
    businessName: tenantId === 'default' ? 'Team Axiogen' : 'My Business',
    botName: 'AI Assistant',
    groqApiKey: HARDCODED_GROQ_KEY,
    groqModel: 'openai/gpt-oss-120b',
    autoReplyEnabled: true,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    typingDelayMinMs: 800,
    typingDelayMaxMs: 2200,
    debounceWaitMs: 6500,
    humanTakeoverCooldownMinutes: 15,
    allowedNumbers: [],
    blockedNumbers: [],
    voiceReplyMode: 'adaptive',
    voicePersona: 'am_adam',
    voiceSpeed: 1.0,
    ownerName: tenantId === 'default' ? 'Team Axiogen Admin' : tenantId === 'aditaypatil07' ? 'Aditya Patil' : 'Workspace Owner',
    ownerEmail: tenantId === 'default' ? 'team@axiogen.in' : tenantId === 'aditaypatil07' ? 'aditay26patil@gmail.com' : `${tenantId}@axiogen.in`,
    plan: 'free_trial',
    trialLimit: tenantId === 'default' || tenantId === 'aditaypatil07' ? 100000 : 70,
  };
}

export function getTenantConfig(tenantId: string = 'default'): BotConfig {
  if (tenantConfigs.has(tenantId)) {
    return tenantConfigs.get(tenantId)!;
  }

  const file = getTenantConfigFile(tenantId);
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(raw);
      const config: BotConfig = {
        ...getDefaultConfig(tenantId),
        ...parsed,
        tenantId,
      };

      if (!config.groqApiKey || config.groqApiKey.length < 10) {
        config.groqApiKey = HARDCODED_GROQ_KEY;
      }
      if (!config.groqModel || config.groqModel.includes('llama-3.3-70b-versatile')) {
        config.groqModel = 'openai/gpt-oss-120b';
      }

      // Only assign default if systemPrompt is empty or missing
      if (!config.systemPrompt || config.systemPrompt.trim().length === 0) {
        config.systemPrompt = DEFAULT_SYSTEM_PROMPT;
        try {
          fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8');
        } catch (_) {}
      }

      tenantConfigs.set(tenantId, config);
      return config;
    }
  } catch (err) {
    console.error(`[Config] Failed to read config for tenant ${tenantId}:`, err);
  }

  const def = getDefaultConfig(tenantId);
  tenantConfigs.set(tenantId, def);
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(TENANTS_DIR)) fs.mkdirSync(TENANTS_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(def, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Config] Failed to persist default config for tenant ${tenantId}:`, err);
  }
  return def;
}

export function saveTenantConfig(tenantId: string = 'default', updates: Partial<BotConfig>): BotConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TENANTS_DIR)) {
      fs.mkdirSync(TENANTS_DIR, { recursive: true });
    }

    const current = tenantConfigs.get(tenantId) || getDefaultConfig(tenantId);
    const updated: BotConfig = {
      ...current,
      ...updates,
      tenantId,
    };

    if (!updated.groqApiKey || updated.groqApiKey.length < 10) {
      updated.groqApiKey = HARDCODED_GROQ_KEY;
    }

    const file = getTenantConfigFile(tenantId);
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8');
    tenantConfigs.set(tenantId, updated);
    console.log(`[Config] Tenant '${tenantId}' configuration persisted successfully.`);
    return updated;
  } catch (err) {
    console.error(`[Config] Failed to save config for tenant ${tenantId}:`, err);
    return tenantConfigs.get(tenantId) || getDefaultConfig(tenantId);
  }
}

// Backwards compatibility for single-tenant callers
export function getConfig(): BotConfig {
  return getTenantConfig('default');
}

export function saveConfig(updates: Partial<BotConfig>): BotConfig {
  return saveTenantConfig('default', updates);
}

// Initial boot load for default tenant
getTenantConfig('default');
