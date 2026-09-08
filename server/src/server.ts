import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { getTenantConfig, saveTenantConfig } from './config';
import {
  initTenantBaileys,
  getTenantState,
  ensureTenantSession,
  requestTenantPairingCode,
  sendTenantManualMessage,
  logoutTenant,
  bootExistingSessions,
} from './sessionManager';
import {
  getTenantTelemetry,
  getTenantContacts,
  clearTenantHumanTakeover,
  isTenantTakeoverActive,
  getTenantTakeoverRemainingMs,
} from './botManager';
import { clearChatHistory } from './groq';
import {
  getPendingReminders,
  getScheduledCalls,
  getLeads,
  addReminder,
  cancelReminder,
  addScheduledCall,
} from './reminderManager';
import { synthesizeSpeechWav } from './voiceEngine';

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'axiogen-whatsapp-saas',
    timestamp: new Date().toISOString(),
  });
});

// Helper to get tenant ID from params, query, or x-tenant-id header
function getTenantId(req: Request): string {
  const params = req.params as Record<string, string | undefined>;
  return (
    params?.tenantId ||
    (req.query.tenantId as string) ||
    (req.headers['x-tenant-id'] as string) ||
    'default'
  );
}

// 1. Get Tenant WhatsApp Session Status
app.get(['/api/status', '/api/tenant/:tenantId/status'], async (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const state = await ensureTenantSession(tenantId);
  const config = getTenantConfig(tenantId);

  res.json({
    status: state.status,
    phone: state.connectedPhone,
    name: state.connectedName,
    qrCodeUrl: state.qrCodeDataUrl,
    pairingCode: state.pairingCode,
    lastConnectedAt: state.lastConnectedAt,
    lastError: state.lastError,
    botConfig: {
      autoReplyEnabled: config.autoReplyEnabled,
      groqModel: config.groqModel,
      hasGroqApiKey: Boolean(config.groqApiKey && config.groqApiKey.length > 5),
      maskedGroqApiKey: config.groqApiKey
        ? `${config.groqApiKey.slice(0, 7)}...${config.groqApiKey.slice(-4)}`
        : '',
      typingDelayMinMs: config.typingDelayMinMs,
      typingDelayMaxMs: config.typingDelayMaxMs,
      humanTakeoverCooldownMinutes: config.humanTakeoverCooldownMinutes,
      debounceWaitMs: config.debounceWaitMs,
      portfolioUrl: 'https://team.axiogen.in',
      voiceReplyMode: config.voiceReplyMode || 'adaptive',
      voicePersona: config.voicePersona || 'am_adam',
      voiceSpeed: config.voiceSpeed || 1.0,
    },
  });
});

// 2. Request 8-Digit Pairing Code for Tenant
app.post(['/api/pair-code', '/api/tenant/:tenantId/pair'], async (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const phone = req.body.phoneNumber || req.body.phone;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required (phone or phoneNumber)' });
  }

  try {
    const code = await requestTenantPairingCode(tenantId, phone);
    res.json({ success: true, pairingCode: code, code, phoneNumber: phone });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate pairing code' });
  }
});

// 2b. Force re-initialize / reset QR for Tenant
app.post(['/api/init', '/api/tenant/:tenantId/init'], async (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  try {
    await initTenantBaileys(tenantId, true);
    res.json({ success: true, message: `Session reset and restarted for tenant '${tenantId}'` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initialize session' });
  }
});

// 3. Get Tenant Bot Configuration
app.get(['/api/config', '/api/tenant/:tenantId/config'], (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const cfg = getTenantConfig(tenantId);

  res.json({
    ...cfg,
    groqApiKeyMasked: cfg.groqApiKey
      ? `${cfg.groqApiKey.slice(0, 7)}...${cfg.groqApiKey.slice(-4)}`
      : '',
    hasApiKey: Boolean(cfg.groqApiKey && cfg.groqApiKey.length > 5),
    officialPortfolioUrl: 'https://team.axiogen.in',
  });
});

// 4. Update Tenant Bot Configuration (Hot Reload)
app.post(['/api/config', '/api/tenant/:tenantId/config'], (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const updates = req.body;

  if (updates.groqApiKey && updates.groqApiKey.includes('...')) {
    delete updates.groqApiKey;
  }

  const updated = saveTenantConfig(tenantId, updates);
  res.json({ success: true, config: updated });
});

// 5. Tenant Manual Message Dispatch
app.post(['/api/send', '/api/tenant/:tenantId/send'], async (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const phone = req.body.jid || req.body.phone || req.body.phoneNumber || req.body.number;
  const text = req.body.text || req.body.message;

  if (!phone || !text) {
    return res.status(400).json({ error: 'Recipient phone and message text are required' });
  }

  try {
    await sendTenantManualMessage(tenantId, phone, text);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to send message' });
  }
});

// 6. Get Tenant Telemetry & Contacts
app.get(['/api/chats', '/api/tenant/:tenantId/chats'], (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const telemetry = getTenantTelemetry(tenantId);
  const contacts = getTenantContacts(tenantId);
  res.json({ telemetry, contacts });
});

// 7. Human Takeover Release for Tenant
app.post(['/api/takeover', '/api/tenant/:tenantId/takeover'], (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  const { jid, action } = req.body;

  if (!jid) {
    return res.status(400).json({ error: 'JID is required' });
  }

  if (action === 'resume') {
    clearTenantHumanTakeover(tenantId, jid);
    return res.json({ success: true, isHumanTakeover: false });
  }

  res.json({
    success: true,
    isHumanTakeover: isTenantTakeoverActive(tenantId, jid),
    remainingMs: getTenantTakeoverRemainingMs(tenantId, jid),
  });
});

// 8. Logout Tenant WhatsApp Session
app.post(['/api/logout', '/api/tenant/:tenantId/logout'], async (req: Request, res: Response) => {
  const tenantId = getTenantId(req);
  try {
    await logoutTenant(tenantId);
    clearChatHistory(tenantId);
    res.json({ success: true, message: `Tenant '${tenantId}' WhatsApp unlinked.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to logout' });
  }
});

// 9. Autonomous Reminders, Scheduled Calls, and Leads
app.get(
  ['/api/reminders', '/api/tenant/:tenantId/reminders'],
  (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const reminders = getPendingReminders(tenantId);
    const calls = getScheduledCalls().filter((c) => c.tenantId === tenantId);
    const leads = getLeads().filter((l) => l.tenantId === tenantId);

    res.json({
      success: true,
      reminders,
      calls,
      leads,
    });
  }
);

app.post(
  ['/api/reminders', '/api/tenant/:tenantId/reminders'],
  (req: Request, res: Response) => {
    const tenantId = getTenantId(req);
    const { action, jid, task, delayMinutes, reminderId, clientName, clientPhone, topic, preferredTime } =
      req.body;

    if (action === 'cancel' && reminderId) {
      const ok = cancelReminder(tenantId, reminderId);
      return res.json({ success: ok, message: ok ? 'Reminder cancelled' : 'Reminder not found' });
    }

    if (action === 'schedule_call') {
      const call = addScheduledCall(
        tenantId,
        jid || 'client@s.whatsapp.net',
        clientName || 'Client',
        clientPhone || '',
        topic || 'Meeting',
        preferredTime || 'Soon'
      );
      return res.json({ success: true, call });
    }

    if (task && jid) {
      const dueTimestamp = Date.now() + (Number(delayMinutes) || 10) * 60 * 1000;
      const rem = addReminder(tenantId, jid, task, dueTimestamp);
      return res.json({ success: true, reminder: rem });
    }

    res.status(400).json({ error: 'Invalid parameters for reminder creation' });
  }
);

// 10. Axiogen Voice Engine v2 - Live Audio Preview
app.post(['/api/tts/preview', '/api/tenant/:tenantId/tts/preview'], async (req: Request, res: Response) => {
  const { text, voice, speed } = req.body;
  const sampleText = text || 'Welcome to Team Axiogen. I am your autonomous WhatsApp assistant.';

  try {
    const wavBuffer = await synthesizeSpeechWav(sampleText, {
      voice: voice || 'am_adam',
      speed: Number(speed) || 1.0,
    });

    if (!wavBuffer || wavBuffer.length === 0) {
      return res.status(500).json({ error: 'Speech synthesis returned empty audio' });
    }

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', wavBuffer.length);
    res.setHeader('Cache-Control', 'no-store');
    res.send(wavBuffer);
  } catch (err: any) {
    console.error('[TTS Preview] Error:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize speech preview' });
  }
});

// 11. Super Admin: List All Real Tenants Dynamically
app.get('/api/admin/tenants', async (req: Request, res: Response) => {
  try {
    const adminKey = (req.headers['x-admin-key'] as string) || (req.query.key as string);
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const dataDir = path.resolve(__dirname, '../data');
    const tenantsDir = path.join(dataDir, 'tenants');
    const defaultConfigFile = path.join(dataDir, 'bot-config.json');
    const tenantIds = new Set<string>();

    if (fs.existsSync(defaultConfigFile)) {
      tenantIds.add('default');
    }

    if (fs.existsSync(tenantsDir)) {
      const files = fs.readdirSync(tenantsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          tenantIds.add(file.replace('.json', ''));
        }
      }
    }

    const authDir = path.resolve(__dirname, '../auth_info_baileys/tenants');
    if (fs.existsSync(authDir)) {
      const authSubdirs = fs.readdirSync(authDir);
      for (const dir of authSubdirs) {
        if (!dir.startsWith('.')) {
          tenantIds.add(dir);
        }
      }
    }

    const tenantList = [];

    for (const tid of tenantIds) {
      const config = getTenantConfig(tid);
      const state = getTenantState(tid);
      const telemetry = getTenantTelemetry(tid);
      const contacts = getTenantContacts(tid);

      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      const filePath = tid === 'default' ? defaultConfigFile : path.join(tenantsDir, `${tid}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath);
          createdAt = stats.birthtime.toISOString();
          updatedAt = stats.mtime.toISOString();
        } catch {}
      }

      const connectedPhone = state.connectedPhone || (config.allowedNumbers && config.allowedNumbers[0]) || '';
      const phoneDisplay = connectedPhone
        ? (connectedPhone.startsWith('+') ? connectedPhone : `+${connectedPhone}`)
        : (tid === 'aditaypatil07' ? '+918010127704' : tid === 'default' ? '+917030807704' : '');

      const isConnected = state.status === 'connected' || Boolean(state.connectedPhone);

      tenantList.push({
        id: `usr_${tid}`,
        tenantId: tid,
        businessName: config.businessName || (tid === 'default' ? 'Team Axiogen (Admin)' : 'Team Axiogen (Primary)'),
        name: config.ownerName || config.botName || (tid === 'default' ? 'Aditya Patil (Admin)' : 'Aditya Patil'),
        email: config.ownerEmail || 'aditay26patil@gmail.com',
        plan: config.plan || 'free_trial',
        messagesUsed: telemetry.length,
        trialLimit: config.trialLimit || 100000,
        whatsappStatus: isConnected ? 'connected' : (state.status || 'disconnected'),
        phone: phoneDisplay,
        contactsCount: contacts.length,
        createdAt,
        updatedAt,
      });
    }

    res.json({ success: true, tenants: tenantList });
  } catch (err: any) {
    console.error('[Admin Tenants API] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Super Admin: Sync / Register Tenant
app.post('/api/admin/sync', (req: Request, res: Response) => {
  try {
    const { tenant } = req.body;
    if (!tenant || !tenant.tenantId) {
      return res.status(400).json({ success: false, error: 'Missing tenant or tenantId' });
    }

    const tid = tenant.tenantId;
    const current = getTenantConfig(tid);
    const updated = saveTenantConfig(tid, {
      businessName: tenant.businessName || current.businessName,
      ownerName: tenant.name || current.ownerName,
      ownerEmail: tenant.email || current.ownerEmail,
      plan: tenant.plan || current.plan || 'free_trial',
      trialLimit: tenant.trialLimit || current.trialLimit || 70,
    });

    res.json({ success: true, tenant: updated });
  } catch (err: any) {
    console.error('[Admin Sync API] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Super Admin: Update Tenant Configuration
app.post('/api/admin/tenant/update', (req: Request, res: Response) => {
  try {
    const adminKey = (req.headers['x-admin-key'] as string) || (req.body.adminKey as string);
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { tenantId, plan, trialLimit, businessName, botName } = req.body;
    if (!tenantId) return res.status(400).json({ success: false, error: 'tenantId is required' });

    const updates: any = {};
    if (plan) updates.plan = plan;
    if (trialLimit !== undefined) updates.trialLimit = trialLimit;
    if (businessName) updates.businessName = businessName;
    if (botName) updates.botName = botName;

    const updated = saveTenantConfig(tenantId, updates);
    res.json({ success: true, tenant: updated });
  } catch (err: any) {
    console.error('[Admin Tenant Update API] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server and boot existing sessions
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================================');
  console.log('  AXIOGEN WHATSAPP SAAS ENGINE ONLINE');
  console.log(`  Port: ${PORT}`);
  console.log(`  Health: http://0.0.0.0:${PORT}/health`);
  console.log('=================================================');

  bootExistingSessions().catch((err) => {
    console.error('[Baileys] Error during initial session boot:', err);
  });
});
