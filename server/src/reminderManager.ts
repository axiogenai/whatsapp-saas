import fs from 'fs';
import path from 'path';

export interface ScheduledReminder {
  id: string;
  tenantId: string;
  jid: string;
  task: string;
  dueTimestamp: number;
  createdAt: number;
  status: 'pending' | 'sent' | 'cancelled';
}

export interface ScheduledCall {
  id: string;
  tenantId: string;
  jid: string;
  clientName: string;
  clientPhone: string;
  topic: string;
  preferredTime: string;
  scheduledTimestamp: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  meetLink?: string;
  createdAt: number;
}

export interface CapturedLead {
  id: string;
  tenantId: string;
  jid: string;
  clientName: string;
  requirements: string;
  budget?: string;
  createdAt: number;
}

const DATA_DIR = path.resolve(__dirname, '../data');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');
const CALLS_FILE = path.join(DATA_DIR, 'scheduled-calls.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {}
  }
}

// In-memory caches
let remindersCache: ScheduledReminder[] | null = null;
let callsCache: ScheduledCall[] | null = null;
let leadsCache: CapturedLead[] | null = null;

// ==================== REMINDERS ====================

export function getReminders(): ScheduledReminder[] {
  if (remindersCache) return remindersCache;
  ensureDataDir();
  if (fs.existsSync(REMINDERS_FILE)) {
    try {
      const raw = fs.readFileSync(REMINDERS_FILE, 'utf-8');
      remindersCache = JSON.parse(raw);
      return remindersCache || [];
    } catch {
      remindersCache = [];
      return [];
    }
  }
  remindersCache = [];
  return [];
}

export function saveReminders(list: ScheduledReminder[]): void {
  remindersCache = list;
  ensureDataDir();
  try {
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ReminderManager] Failed to save reminders:', err);
  }
}

export function addReminder(
  tenantId: string,
  jid: string,
  task: string,
  dueTimestamp: number
): ScheduledReminder {
  const list = getReminders();
  const reminder: ScheduledReminder = {
    id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tenantId,
    jid,
    task,
    dueTimestamp,
    createdAt: Date.now(),
    status: 'pending',
  };

  list.push(reminder);
  saveReminders(list);
  const diffMins = Math.round((dueTimestamp - Date.now()) / 60000);
  console.log(`[ReminderManager] Added reminder for ${jid} (due in ${diffMins}m): "${task}"`);
  return reminder;
}

export function getPendingReminders(tenantId: string, jid?: string): ScheduledReminder[] {
  const list = getReminders();
  return list.filter(
    (r) => r.tenantId === tenantId && r.status === 'pending' && (!jid || r.jid === jid)
  );
}

export function cancelReminder(tenantId: string, reminderId: string): boolean {
  const list = getReminders();
  const item = list.find(
    (r) =>
      r.tenantId === tenantId &&
      (r.id === reminderId || r.task.toLowerCase().includes(reminderId.toLowerCase()))
  );
  if (item) {
    item.status = 'cancelled';
    saveReminders(list);
    console.log(`[ReminderManager] Cancelled reminder ${item.id}: "${item.task}"`);
    return true;
  }
  return false;
}

// ==================== SCHEDULED CALLS ====================

export function getScheduledCalls(): ScheduledCall[] {
  if (callsCache) return callsCache;
  ensureDataDir();
  if (fs.existsSync(CALLS_FILE)) {
    try {
      const raw = fs.readFileSync(CALLS_FILE, 'utf-8');
      callsCache = JSON.parse(raw);
      return callsCache || [];
    } catch {
      callsCache = [];
      return [];
    }
  }
  callsCache = [];
  return [];
}

export function saveScheduledCalls(list: ScheduledCall[]): void {
  callsCache = list;
  ensureDataDir();
  try {
    fs.writeFileSync(CALLS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ReminderManager] Failed to save scheduled calls:', err);
  }
}

export function addScheduledCall(
  tenantId: string,
  jid: string,
  clientName: string,
  clientPhone: string,
  topic: string,
  preferredTime: string
): ScheduledCall {
  const list = getScheduledCalls();
  const callRecord: ScheduledCall = {
    id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tenantId,
    jid,
    clientName: clientName || 'Client',
    clientPhone: clientPhone || jid.split('@')[0],
    topic: topic || 'Project Discussion',
    preferredTime,
    scheduledTimestamp: Date.now(),
    status: 'confirmed',
    meetLink: 'https://meet.google.com/new',
    createdAt: Date.now(),
  };

  list.push(callRecord);
  saveScheduledCalls(list);
  console.log(
    `[ReminderManager] Scheduled call with ${callRecord.clientName} (${callRecord.clientPhone}) at ${preferredTime}: "${topic}"`
  );
  return callRecord;
}

// ==================== LEADS ====================

export function getLeads(): CapturedLead[] {
  if (leadsCache) return leadsCache;
  ensureDataDir();
  if (fs.existsSync(LEADS_FILE)) {
    try {
      const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
      leadsCache = JSON.parse(raw);
      return leadsCache || [];
    } catch {
      leadsCache = [];
      return [];
    }
  }
  leadsCache = [];
  return [];
}

export function saveLead(
  tenantId: string,
  jid: string,
  clientName: string,
  requirements: string,
  budget?: string
): CapturedLead {
  if (!leadsCache) getLeads();
  const list = leadsCache || [];
  const lead: CapturedLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tenantId,
    jid,
    clientName: clientName || jid.split('@')[0],
    requirements,
    budget,
    createdAt: Date.now(),
  };
  list.push(lead);
  leadsCache = list;
  ensureDataDir();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ReminderManager] Failed to save leads:', err);
  }
  console.log(`[ReminderManager] Saved lead from ${lead.clientName}: "${requirements}"`);
  return lead;
}

// ==================== AUTONOMOUS SCHEDULER DAEMON ====================

let schedulerRunning = false;
export function startReminderScheduler(
  dispatchReminderFn: (tenantId: string, jid: string, text: string) => Promise<void>
): void {
  if (schedulerRunning) return;
  schedulerRunning = true;

  console.log('[ReminderManager] Autonomous reminder & call scheduler daemon online (15s cycle).');

  setInterval(async () => {
    const list = getReminders();
    const now = Date.now();
    let updated = false;

    for (const reminder of list) {
      if (reminder.status === 'pending' && reminder.dueTimestamp <= now) {
        reminder.status = 'sent';
        updated = true;

        console.log(
          `[Reminder Fired] Proactively messaging ${reminder.jid} (tenant: ${reminder.tenantId}): "${reminder.task}"`
        );
        try {
          const reminderMsg = `Reminder: ${reminder.task}`;
          await dispatchReminderFn(reminder.tenantId, reminder.jid, reminderMsg);
        } catch (err) {
          console.error(`[Reminder Error] Failed to send reminder to ${reminder.jid}:`, err);
        }
      }
    }

    if (updated) {
      saveReminders(list);
    }
  }, 15000); // Check every 15 seconds
}
