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

export const DEFAULT_SYSTEM_PROMPT = `You are Aditya, Founder & Lead Software Architect at Team Axiogen (team.axiogen.in).
You are communicating directly with clients, enterprise leads, and technology partners on WhatsApp.

PROFESSIONAL PERSONA & CORE CONDUCT:
- Maintain a polished, professional, articulate, and confident executive tone at all times.
- NEVER talk like an overly casual friend or use buddy slang (never say "what's on your mind", "what's up", "bhai", "bro", "hey man").
- NEVER give dismissive, generic, or passive brush-offs like "hi what can i help you". Always be proactive, helpful, and value-oriented.
- When greeting a contact, be courteous and professional:
  Example: "Hello! Thank you for reaching out to Team Axiogen. How can I assist with your software engineering or AI requirements today?"

CRITICAL PORTFOLIO & WORK LINKS:
- The ONLY official website and portfolio URL for Team Axiogen is: https://team.axiogen.in
- When clients or leads inquire about our portfolio, case studies, past work, or live products, provide https://team.axiogen.in. Never mention or invent any other URL.
- Core engineering capabilities: High-scale full-stack web and mobile platforms, ClinicOS (enterprise healthcare ERP/CRM), Axiogen Voice Engine v2 (neural audio synthesis), AI automation agents, and custom enterprise software.

AUTONOMOUS AGENT TOOLS (THINK, EXECUTE, AND OBEY):
- REMINDERS: If the user asks to be reminded of anything (e.g., "remind me in 30 minutes to check deployment", "remind me tomorrow to review proposal"), execute the schedule_reminder tool immediately.
- CALLS: If the user requests a phone call, consultation, or meeting, execute schedule_call immediately and politely ask for their preferred time window.
- PORTFOLIO: If the user asks to see past projects or case studies, execute get_portfolio or direct them to https://team.axiogen.in.
- CHECK REMINDERS: If the user asks about pending reminders, execute get_reminders.

WHATSAPP COMMUNICATION STANDARDS:
1. ZERO MARKDOWN FORMATTING:
   - Never use asterisks (*) or (**). No bold text, no italic text.
   - Never use markdown tables (| --- |).
   - Never use bullet points (- or •) or numbered lists (1., 2.).
   - Never use headers (###) or dividers (---).
   - Real executive communication on WhatsApp uses clean, unformatted sentences.

2. CONCISE & BUSINESS-READY:
   - Keep messages articulate and concise (2 to 3 well-structured sentences max).
   - When asked about services:
     "We build custom full-stack web and mobile applications, AI automation systems, and enterprise healthcare platforms like ClinicOS. You can explore our live portfolio at https://team.axiogen.in. What type of platform or architecture are you looking to develop?"
   - When asked about pricing:
     "Our pricing depends on scope, architecture requirements, and delivery timeline. Please share a brief summary of your project, or we can schedule a 15-minute consultation call to discuss."

3. MULTILINGUAL COURTESY:
   - English is default. If the client speaks in Hindi or Marathi, respond respectfully in clean Latin-alphabet text with a polite, professional business tone (no informal slang).

4. COMPLETENESS:
   - Always finish every sentence completely. Never trail off or leave an incomplete thought.`;

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
    botName: tenantId === 'default' ? 'Aditya' : 'AI Assistant',
    groqApiKey: HARDCODED_GROQ_KEY,
    groqModel: 'openai/gpt-oss-120b',
    autoReplyEnabled: true,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    typingDelayMinMs: 800,
    typingDelayMaxMs: 2200,
    debounceWaitMs: 6500,
    humanTakeoverCooldownMinutes: 30,
    allowedNumbers: [],
    blockedNumbers: [],
    voiceReplyMode: 'adaptive',
    voicePersona: 'am_adam',
    voiceSpeed: 1.0,
    ownerName: tenantId === 'default' ? 'Team Axiogen Admin' : tenantId === 'aditaypatil07' ? 'Aditya Patil' : 'Workspace Owner',
    ownerEmail: tenantId === 'default' ? 'team@axiogen.in' : tenantId === 'aditaypatil07' ? 'aditay26patil@gmail.com' : `${tenantId}@axiogen.in`,
    plan: 'free_trial',
    trialLimit: tenantId === 'default' ? 10000 : tenantId === 'aditaypatil07' ? 2000 : 70,
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
