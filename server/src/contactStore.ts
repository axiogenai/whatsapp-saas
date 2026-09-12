import fs from 'fs';
import path from 'path';
import { getTenantConfig } from './config';

export interface SavedContact {
  jid: string;
  phone: string;
  name?: string; // Saved name in phone address book (e.g., "Monali Maam")
  notify?: string; // WhatsApp push name configured by user
  verifiedName?: string;
  updatedAt: number;
}

const DATA_DIR = path.resolve(__dirname, '../data');
const CONTACTS_DIR = path.join(DATA_DIR, 'contacts');

// In-memory cache: tenantId -> Map<phone, SavedContact>
const tenantContactsCache = new Map<string, Map<string, SavedContact>>();
const debounceSaveTimers = new Map<string, NodeJS.Timeout>();

function getContactsFilePath(tenantId: string): string {
  return path.join(CONTACTS_DIR, `${tenantId}.json`);
}

function loadTenantContacts(tenantId: string): Map<string, SavedContact> {
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
            map.set(item.phone, item);
          }
        }
      }
    }
  } catch (err) {
    console.error(`[ContactStore] Failed to load contacts for tenant ${tenantId}:`, err);
  }

  tenantContactsCache.set(tenantId, map);
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
  }, 2000);

  debounceSaveTimers.set(tenantId, timer);
}

export function normalizePhone(raw: string): string {
  return raw.split('@')[0].split(':')[0].replace(/\D/g, '');
}

/**
 * Sync and upsert contacts received from Baileys socket events
 */
export function upsertTenantContacts(tenantId: string, contacts: any[]): void {
  if (!Array.isArray(contacts) || contacts.length === 0) return;

  const map = loadTenantContacts(tenantId);
  let updatedCount = 0;

  for (const c of contacts) {
    if (!c || !c.id) continue;
    const jid = c.id;

    // Filter out groups, newsletters, broadcasts
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
    };

    let modified = false;

    // Baileys 'name' field is the saved address-book contact name!
    if (c.name && typeof c.name === 'string' && c.name.trim().length > 0) {
      if (existing.name !== c.name.trim()) {
        existing.name = c.name.trim();
        modified = true;
      }
    }

    // Baileys 'notify' is the sender's public WhatsApp pushName
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
    console.log(`[ContactStore] Tenant '${tenantId}': Updated ${updatedCount} contacts in address book.`);
    scheduleSaveToDisk(tenantId);
  }
}

/**
 * Resolves the best human-readable name for a contact following hierarchy:
 * 1. Configured VIP custom name
 * 2. Saved phonebook address book name (c.name)
 * 3. Verified business name (c.verifiedName)
 * 4. WhatsApp pushName (c.notify)
 * 5. Incoming pushName passed with the event
 * 6. Fallback phone number
 */
export function getResolvedContactName(
  tenantId: string,
  jid: string,
  incomingPushName?: string
): { name: string; isSavedName: boolean; isVip: boolean } {
  const phone = normalizePhone(jid);
  const config = getTenantConfig(tenantId);

  // 1. Check VIP Contacts in BotConfig
  if (config.vipContacts && Array.isArray(config.vipContacts)) {
    const vip = config.vipContacts.find((v) => {
      const vPhone = normalizePhone(v.phone);
      return vPhone === phone || phone.endsWith(vPhone) || vPhone.endsWith(phone);
    });

    if (vip && vip.name && vip.name.trim().length > 0) {
      return { name: vip.name.trim(), isSavedName: true, isVip: true };
    }
  }

  // 2. Check Synced Phonebook Store
  const map = loadTenantContacts(tenantId);
  const saved = map.get(phone);

  if (saved) {
    if (saved.name && saved.name.trim().length > 0) {
      return { name: saved.name.trim(), isSavedName: true, isVip: false };
    }
    if (saved.verifiedName && saved.verifiedName.trim().length > 0) {
      return { name: saved.verifiedName.trim(), isSavedName: true, isVip: false };
    }
    if (saved.notify && saved.notify.trim().length > 0) {
      return { name: saved.notify.trim(), isSavedName: false, isVip: false };
    }
  }

  // 3. Fallback to event pushName if provided
  if (incomingPushName && incomingPushName.trim().length > 0) {
    return { name: incomingPushName.trim(), isSavedName: false, isVip: false };
  }

  // 4. Default to formatted phone
  return { name: `+${phone}`, isSavedName: false, isVip: false };
}

/**
 * Returns all contacts known for this tenant
 */
export function getAllTenantSavedContacts(tenantId: string): SavedContact[] {
  const map = loadTenantContacts(tenantId);
  return Array.from(map.values()).sort((a, b) => {
    // Sort contacts with saved names first
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
  const cleanPhone = normalizePhone(phone);
  const map = loadTenantContacts(tenantId);

  const existing: SavedContact = map.get(cleanPhone) || {
    jid: `${cleanPhone}@s.whatsapp.net`,
    phone: cleanPhone,
    updatedAt: Date.now(),
  };

  existing.name = name.trim();
  existing.updatedAt = Date.now();
  map.set(cleanPhone, existing);

  scheduleSaveToDisk(tenantId);
  return existing;
}
