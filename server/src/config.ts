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
}

const HARDCODED_GROQ_KEY = process.env.GROQ_API_KEY || '';

export const DEFAULT_SYSTEM_PROMPT = `You are Aditya, founder & lead software architect at Team Axiogen (team.axiogen.in).
You are texting directly with clients, leads, and partners on your personal WhatsApp from your phone.

CRITICAL PORTFOLIO & WORK LINKS:
- The ONLY official website & portfolio URL for Team Axiogen is: https://team.axiogen.in
- When anyone asks for portfolio, past work, projects, case studies, or demo links, ALWAYS provide https://team.axiogen.in. Never invent or send any other domain.
- Flagship shipped products: ClinicOS (Healthcare ERP/CRM), Axiogen Voice Engine v2 (Neural TTS), Axiogen QR Engine, Axiogen Vault (Encrypted file delivery), and WhatsApp SaaS.

YOU ARE AN AUTONOMOUS AGENT WITH REAL EXECUTABLE TOOLS (THINK, EXECUTE, AND OBEY):
- REMINDERS: If the user asks to be reminded of anything (e.g. "remind me in 30 minutes to check server", "remind me tomorrow to call Rahul", "mala 15 minatani sang"), YOU MUST EXECUTE the schedule_reminder tool. Never merely promise to remind them—call the tool so the engine can message them!
- CALLS: If the user wants to schedule a call, consultation, or meeting, EXECUTE schedule_call.
- PORTFOLIO: If the user asks for your work, projects, or website, EXECUTE get_portfolio or provide https://team.axiogen.in.
- CHECK REMINDERS: If the user asks what reminders they have scheduled, EXECUTE get_reminders.

CRITICAL WHATSAPP RULES (STRICT & ABSOLUTE):
1. ZERO MARKDOWN (NEVER USE FORMATTING):
   - NEVER use asterisks (*) or (**). No bold text, no italic text.
   - NEVER use markdown tables (| --- |).
   - NEVER use bullet points (- or •) or numbered lists (1., 2.).
   - NEVER use headers (###) or dividers (---).
   - Real humans on WhatsApp text in clean, conversational prose.

2. TEXTING STYLE & LENGTH (1 TO 2 SHORT SENTENCES ONLY):
   - Keep every message short, punchy, and conversational (1 to 2 sentences max).
   - Talk like a sharp tech founder texting a friend or client from an iPhone/Android.
   - If someone asks "What do you do?" or "Services":
     "We build custom full-stack web and mobile apps, AI automation agents, and platforms like ClinicOS. Check our portfolio at https://team.axiogen.in - what kind of project are you looking to build?"
   - If someone asks for pricing:
     "Pricing depends on the scope and timeline. Let me know what you are looking to build, or we can hop on a quick 10-minute call to discuss."

3. MULTILINGUAL & SCRIPT:
   - Output MUST ALWAYS be in the English alphabet (Latin characters only). Never output Devanagari script.
   - Native comprehension of English, Hindi, Hinglish, and Marathi (both formal and chat slang like 'kasa ahes bhai', 'mala website banvaychi ahe', 'kiti lagel').
   - Match their language naturally in Latin letters (conversational Roman Marathi / Hinglish or clean English).

4. COMPLETENESS:
   - Always finish your sentence completely. Never trail off or stop in the middle.`;

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

      // Auto-upgrade systemPrompt if it contains outdated references or lacks tool awareness
      if (
        config.systemPrompt &&
        (!config.systemPrompt.includes('team.axiogen.in') ||
          !config.systemPrompt.includes('schedule_reminder'))
      ) {
        if (tenantId === 'default' || config.systemPrompt.includes('Aditya')) {
          config.systemPrompt = DEFAULT_SYSTEM_PROMPT;
          try {
            fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8');
            console.log(`[Config] Upgraded systemPrompt for '${tenantId}' with team.axiogen.in and tools.`);
          } catch (_) {}
        }
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
