import fs from 'fs';
import path from 'path';
import { getTenantConfig, saveTenantConfig, VipContact } from './config';

export interface SavedContact {
  jid: string;
  phone: string;
  realPhone?: string; // Real phone number when JID/phone is a 15-digit WhatsApp LID
  name?: string; // Exact saved name and title (e.g. "Monali ma'am", "Dr. Sharma")
  notify?: string; // WhatsApp public push name
  verifiedName?: string;
  updatedAt: number;
  aiEnabled?: boolean; // true = AI replies, false = Human Only (AI NEVER replies)
  voiceMode?: 'default' | 'text_only' | 'voice_only'; // text_only = NEVER send voice notes
  isVip?: boolean;
  notes?: string;
}

const DATA_DIR = path.resolve(__dirname, '../data');
const CONTACTS_DIR = path.join(DATA_DIR, 'contacts');
const AUTH_ROOT = path.resolve(__dirname, '../auth_info_baileys');
const TENANTS_AUTH_DIR = path.join(AUTH_ROOT, 'tenants');

// In-memory cache: tenantId -> Map<phone, SavedContact>
const tenantContactsCache = new Map<string, Map<string, SavedContact>>();
const debounceSaveTimers = new Map<string, NodeJS.Timeout>();

function getContactsFilePath(tenantId: string): string {
  return path.join(CONTACTS_DIR, `${tenantId}.json`);
}

function getTenantAuthDir(tenantId: string): string {
  if (tenantId === 'default') return AUTH_ROOT;
  return path.join(TENANTS_AUTH_DIR, tenantId);
}

export function normalizePhone(raw: string): string {
  if (!raw) return '';
  return raw.split('@')[0].split(':')[0].replace(/\D/g, '');
}

/**
 * Helper to identify WhatsApp broadcast viewer encryption artifacts
 * (e.g. 14-16 digit internal IDs with no name, no pushName, no VIP status, and no notes)
 */
export function isOrphanBroadcastArtifact(c: Partial<SavedContact>): boolean {
  if (c.name && c.name.trim().length > 0 && c.name.trim() !== '-') return false;
  if (c.notify && c.notify.trim().length > 0) return false;
  if (c.isVip) return false;
  if (c.notes && c.notes.trim().length > 0) return false;
  if (c.realPhone && c.realPhone.trim().length > 0) return false;
  // If it's a genuine E.164 phone number (7-12 digits, e.g. 919876543210), keep it
  const phone = c.phone || '';
  if (phone.length >= 7 && phone.length <= 12) return false;
  // Any 13+ digit entry without a saved name, push name, VIP, or real phone is a broadcast artifact
  return true;
}

/**
 * Auto-import past conversations and sessions stored in Baileys auth directory
 */
export function importSessionsFromDisk(tenantId: string): number {
  const authDir = getTenantAuthDir(tenantId);
  let importedCount = 0;

  try {
    if (!fs.existsSync(authDir)) return 0;
    const files = fs.readdirSync(authDir);
    const map = loadTenantContacts(tenantId);
    const idSet = new Set<string>();

    for (const f of files) {
      // ONLY import actual WhatsApp session files (exclude broadcast status viewer keys)
      const sessionMatch = f.match(/^session-(\d+)\./);
      if (sessionMatch) {
        idSet.add(sessionMatch[1]);
        continue;
      }
    }

    for (const id of idSet) {
      if (!id || id.length < 5) continue;
      const phone = normalizePhone(id);
      if (!phone) continue;

      if (!map.has(phone)) {
        const jid = id.length > 13 ? `${id}@lid` : `${id}@s.whatsapp.net`;
        const newContact: SavedContact = {
          jid,
          phone,
          updatedAt: Date.now(),
          aiEnabled: true,
          voiceMode: 'default',
        };
        // NOTE: Do NOT apply isOrphanBroadcastArtifact filter here!
        // A session-*.json file is definitive proof of a real 1:1 conversation.
        // The orphan filter only applies when loading from persisted JSON.

        map.set(phone, newContact);
        importedCount++;
      }
    }

    // Also import any contacts declared in BotConfig.vipContacts
    try {
      const config = getTenantConfig(tenantId);
      if (config.vipContacts && Array.isArray(config.vipContacts)) {
        for (const vip of config.vipContacts) {
          const p = normalizePhone(vip.phone);
          if (!p) continue;
          const existing = map.get(p);
          if (existing) {
            if (!existing.name && vip.name) existing.name = vip.name;
            if (existing.isVip === undefined) existing.isVip = true;
            if (vip.rule === 'human_only') existing.aiEnabled = false;
            if (vip.rule === 'text_only') existing.voiceMode = 'text_only';
            if (vip.rule === 'voice_only') existing.voiceMode = 'voice_only';
            if (vip.notes && !existing.notes) existing.notes = vip.notes;
          } else {
            map.set(p, {
              jid: `${p}@s.whatsapp.net`,
              phone: p,
              name: vip.name,
              aiEnabled: vip.rule !== 'human_only',
              voiceMode: vip.rule === 'text_only' ? 'text_only' : vip.rule === 'voice_only' ? 'voice_only' : 'default',
              isVip: true,
              notes: vip.notes,
              updatedAt: vip.addedAt || Date.now(),
            });
            importedCount++;
          }
        }
      }
    } catch (_) {}

    if (importedCount > 0) {
      console.log(`[ContactStore] Tenant '${tenantId}': Imported ${importedCount} contacts from disk sessions & VIPs.`);
      scheduleSaveToDisk(tenantId);
    }
  } catch (err) {
    console.error(`[ContactStore] Failed to import sessions for tenant ${tenantId}:`, err);
  }

  return importedCount;
}

export function loadTenantContacts(tenantId: string): Map<string, SavedContact> {
  if (tenantContactsCache.has(tenantId)) {
    return tenantContactsCache.get(tenantId)!;
  }

  const map = new Map<string, SavedContact>();
  const filePath = getContactsFilePath(tenantId);

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const list: SavedContact[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && item.phone) {
            // Filter out any legacy orphan broadcast artifacts stored previously
            if (isOrphanBroadcastArtifact(item)) continue;

            // Default aiEnabled to true if not specified
            if (item.aiEnabled === undefined) item.aiEnabled = true;
            if (!item.voiceMode) item.voiceMode = 'default';
            map.set(item.phone, item);
          }
        }
      }
    }
  } catch (err) {
    console.error(`[ContactStore] Failed to load contacts for tenant ${tenantId}:`, err);
  }

  tenantContactsCache.set(tenantId, map);

  // Auto-scan disk sessions to ensure all existing WhatsApp conversations are populated
  setTimeout(() => importSessionsFromDisk(tenantId), 100);

  return map;
}

function scheduleSaveToDisk(tenantId: string): void {
  const existingTimer = debounceSaveTimers.get(tenantId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    debounceSaveTimers.delete(tenantId);
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (!fs.existsSync(CONTACTS_DIR)) fs.mkdirSync(CONTACTS_DIR, { recursive: true });

      const map = tenantContactsCache.get(tenantId);
      if (!map) return;

      const list = Array.from(map.values());
      const filePath = getContactsFilePath(tenantId);
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
      console.log(`[ContactStore] Tenant '${tenantId}': Persisted ${list.length} contacts to disk.`);
    } catch (err) {
      console.error(`[ContactStore] Failed to persist contacts for tenant ${tenantId}:`, err);
    }
  }, 1500);

  debounceSaveTimers.set(tenantId, timer);
}

/**
 * Sync contacts from Baileys events (messaging-history.set, contacts.upsert, contacts.update)
 */
export function upsertTenantContacts(tenantId: string, contacts: any[]): void {
  if (!Array.isArray(contacts) || contacts.length === 0) return;

  const map = loadTenantContacts(tenantId);
  let updatedCount = 0;

  for (const c of contacts) {
    if (!c || !c.id) continue;
    const jid = c.id;

    if (
      jid.endsWith('@g.us') ||
      jid.endsWith('@newsletter') ||
      jid.endsWith('@broadcast') ||
      jid.startsWith('status@') ||
      jid.startsWith('0@')
    ) {
      continue;
    }

    const phone = normalizePhone(jid);
    if (!phone) continue;

    const existing: SavedContact = map.get(phone) || {
      jid: jid.includes('@') ? jid : `${phone}@s.whatsapp.net`,
      phone,
      updatedAt: Date.now(),
      aiEnabled: true,
      voiceMode: 'default',
    };

    let modified = false;

    // Baileys 'name' field is the saved address-book contact name/title!
    if (c.name && typeof c.name === 'string' && c.name.trim().length > 0) {
      if (existing.name !== c.name.trim()) {
        existing.name = c.name.trim();
        modified = true;
      }
    }

    // Baileys 'notify' is sender's public WhatsApp pushName
    if (c.notify && typeof c.notify === 'string' && c.notify.trim().length > 0) {
      if (existing.notify !== c.notify.trim()) {
        existing.notify = c.notify.trim();
        modified = true;
      }
    }

    if (c.verifiedName && typeof c.verifiedName === 'string' && c.verifiedName.trim().length > 0) {
      if (existing.verifiedName !== c.verifiedName.trim()) {
        existing.verifiedName = c.verifiedName.trim();
        modified = true;
      }
    }

    if (modified || !map.has(phone)) {
      existing.updatedAt = Date.now();
      map.set(phone, existing);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    console.log(`[ContactStore] Tenant '${tenantId}': Synced ${updatedCount} contacts from WhatsApp.`);
    scheduleSaveToDisk(tenantId);
  }
}

/**
 * Sync contacts from Baileys chat events (messaging-history.set, chats.upsert, chats.set)
 */
export function upsertTenantChats(tenantId: string, chats: any[]): void {
  if (!Array.isArray(chats) || chats.length === 0) return;

  const map = loadTenantContacts(tenantId);
  let updatedCount = 0;

  for (const chat of chats) {
    if (!chat || !chat.id) continue;
    const jid = chat.id;

    if (
      jid.endsWith('@g.us') ||
      jid.endsWith('@newsletter') ||
      jid.endsWith('@broadcast') ||
      jid.startsWith('status@')
    ) {
      continue;
    }

    const phone = normalizePhone(jid);
    if (!phone) continue;

    const existing: SavedContact = map.get(phone) || {
      jid: jid.includes('@') ? jid : `${phone}@s.whatsapp.net`,
      phone,
      updatedAt: Date.now(),
      aiEnabled: true,
      voiceMode: 'default',
    };

    let modified = false;
    if (chat.name && typeof chat.name === 'string' && chat.name.trim().length > 0) {
      if (!existing.name) {
        existing.name = chat.name.trim();
        modified = true;
      }
    }

    if (modified || !map.has(phone)) {
      existing.updatedAt = Date.now();
      map.set(phone, existing);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    console.log(`[ContactStore] Tenant '${tenantId}': Synced ${updatedCount} chats from WhatsApp.`);
    scheduleSaveToDisk(tenantId);
  }
}

/**
 * Update contact AI controls, name/title, and voice settings
 */
export function updateContactControl(
  tenantId: string,
  phoneOrJid: string,
  updates: Partial<SavedContact>
): SavedContact {
  const phone = normalizePhone(phoneOrJid);
  const map = loadTenantContacts(tenantId);

  const existing: SavedContact = map.get(phone) || {
    jid: phoneOrJid.includes('@') ? phoneOrJid : `${phone}@s.whatsapp.net`,
    phone,
    updatedAt: Date.now(),
    aiEnabled: true,
    voiceMode: 'default',
  };

  if (updates.name !== undefined) existing.name = updates.name.trim() || undefined;
  if (updates.realPhone !== undefined) existing.realPhone = updates.realPhone.trim() || undefined;
  if (updates.aiEnabled !== undefined) existing.aiEnabled = Boolean(updates.aiEnabled);
  if (updates.voiceMode !== undefined) existing.voiceMode = updates.voiceMode;
  if (updates.isVip !== undefined) {
    existing.isVip = Boolean(updates.isVip);
    // CRITICAL: VIP contacts must NEVER receive AI replies. Mute AI immediately when marked VIP.
    if (existing.isVip) {
      existing.aiEnabled = false;
    }
  }
  if (updates.notes !== undefined) existing.notes = updates.notes;

  existing.updatedAt = Date.now();
  map.set(phone, existing);

  // Also sync with BotConfig.vipContacts if isVip or human_only
  try {
    const config = getTenantConfig(tenantId);
    let vipList = [...(config.vipContacts || [])];
    const cleanPhone = phone;

    const existingVipIdx = vipList.findIndex((v) => normalizePhone(v.phone) === cleanPhone);

    if (existing.isVip || existing.aiEnabled === false) {
      const entry: VipContact = {
        phone: cleanPhone,
        name: existing.name || existing.notify || `+${cleanPhone}`,
        rule: 'human_only', // VIP is always human-only!
        notes: existing.notes,
        addedAt: Date.now(),
      };

      if (existingVipIdx >= 0) {
        vipList[existingVipIdx] = entry;
      } else {
        vipList.push(entry);
      }
    } else if (existingVipIdx >= 0 && !existing.isVip) {
      vipList.splice(existingVipIdx, 1);
    }

    saveTenantConfig(tenantId, { vipContacts: vipList });
  } catch (err) {
    console.error(`[ContactStore] Failed syncing VIP list for ${tenantId}:`, err);
  }

  scheduleSaveToDisk(tenantId);
  return existing;
}

/**
 * Check if AI reply is authorized for this contact
 * (Returns FALSE if contact is in VIP list or AI is disabled)
 */
export function isAiEnabledForContact(tenantId: string, jid: string): boolean {
  const phone = normalizePhone(jid);
  const map = loadTenantContacts(tenantId);
  const contact = map.get(phone);

  // VIP contacts MUST NEVER receive AI replies
  if (contact && (contact.isVip || contact.aiEnabled === false)) {
    return false;
  }

  const config = getTenantConfig(tenantId);
  const vip = config.vipContacts?.find((v) => {
    const vPhone = normalizePhone(v.phone);
    return vPhone === phone || phone.endsWith(vPhone) || vPhone.endsWith(phone);
  });
  if (vip) {
    return false;
  }

  return true;
}

/**
 * Get contact voice note delivery mode
 */
export function getContactVoiceMode(tenantId: string, jid: string): 'default' | 'text_only' | 'voice_only' {
  const phone = normalizePhone(jid);
  const map = loadTenantContacts(tenantId);
  const contact = map.get(phone);

  if (contact?.voiceMode && contact.voiceMode !== 'default') {
    return contact.voiceMode;
  }

  const config = getTenantConfig(tenantId);
  const vip = config.vipContacts?.find((v) => normalizePhone(v.phone) === phone);
  if (vip?.rule === 'text_only') return 'text_only';
  if (vip?.rule === 'voice_only') return 'voice_only';

  return 'default';
}

/**
 * Resolves the best human-readable name & title for a contact
 */
export function getResolvedContactName(
  tenantId: string,
  jid: string,
  incomingPushName?: string
): { name: string; isSavedName: boolean; isVip: boolean } {
  const phone = normalizePhone(jid);
  const map = loadTenantContacts(tenantId);
  const saved = map.get(phone);

  // 1. Check custom saved name in contactStore (highest priority)
  if (saved && saved.name && saved.name.trim().length > 0) {
    return { name: saved.name.trim(), isSavedName: true, isVip: Boolean(saved.isVip) };
  }

  // 2. Check VIP Contacts in BotConfig
  const config = getTenantConfig(tenantId);
  if (config.vipContacts && Array.isArray(config.vipContacts)) {
    const vip = config.vipContacts.find((v) => {
      const vPhone = normalizePhone(v.phone);
      return vPhone === phone || phone.endsWith(vPhone) || vPhone.endsWith(phone);
    });

    if (vip && vip.name && vip.name.trim().length > 0) {
      return { name: vip.name.trim(), isSavedName: true, isVip: true };
    }
  }

  // 3. Check WhatsApp verified name
  if (saved && saved.verifiedName && saved.verifiedName.trim().length > 0) {
    return { name: saved.verifiedName.trim(), isSavedName: true, isVip: false };
  }

  // 4. Check WhatsApp pushName
  if (saved && saved.notify && saved.notify.trim().length > 0) {
    return { name: saved.notify.trim(), isSavedName: false, isVip: false };
  }

  // 5. Fallback to event pushName if provided
  if (incomingPushName && incomingPushName.trim().length > 0) {
    return { name: incomingPushName.trim(), isSavedName: false, isVip: false };
  }

  // 6. Check real phone if known
  if (saved && saved.realPhone && saved.realPhone.trim().length > 0) {
    return { name: `+${saved.realPhone.trim()}`, isSavedName: false, isVip: false };
  }

  // 7. If genuine E.164 phone number (7-12 digits)
  if (phone.length >= 7 && phone.length <= 12) {
    return { name: `+${phone}`, isSavedName: false, isVip: false };
  }

  // 8. If LID without name
  return { name: 'WhatsApp Contact', isSavedName: false, isVip: false };
}

/**
 * Returns all contacts known for this tenant
 */
export function getAllTenantSavedContacts(tenantId: string): SavedContact[] {
  const map = loadTenantContacts(tenantId);
  const config = getTenantConfig(tenantId);
  const vipPhones = new Set((config.vipContacts || []).map((v) => normalizePhone(v.phone)));

  const list = Array.from(map.values())
    .filter((c) => !isOrphanBroadcastArtifact(c))
    .map((c) => {
    const isVip = vipPhones.has(c.phone) || Boolean(c.isVip);
    const vip = (config.vipContacts || []).find((v) => normalizePhone(v.phone) === c.phone);
    let aiEnabled = c.aiEnabled !== false;
    let voiceMode: 'default' | 'text_only' | 'voice_only' = c.voiceMode || 'default';

    if (vip) {
      if (vip.rule === 'human_only') aiEnabled = false;
      if (vip.rule === 'text_only') voiceMode = 'text_only';
      if (vip.rule === 'voice_only') voiceMode = 'voice_only';
    }

    return {
      ...c,
      isVip,
      aiEnabled,
      voiceMode,
      name: c.name || vip?.name || undefined,
      notes: c.notes || vip?.notes || undefined,
    };
  });

  return list.sort((a, b) => {
    // VIPs first, then contacts with names, then recent
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    if (a.name && !b.name) return -1;
    if (!a.name && b.name) return 1;
    return b.updatedAt - a.updatedAt;
  });
}

/**
 * Manually update or override a contact name
 */
export function setManualContactName(
  tenantId: string,
  phone: string,
  name: string
): SavedContact {
  return updateContactControl(tenantId, phone, { name });
}
