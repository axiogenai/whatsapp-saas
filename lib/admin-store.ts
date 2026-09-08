import fs from 'fs';
import path from 'path';

export interface AdminTenant {
  id: string;
  tenantId: string;
  businessName: string;
  name: string;
  email: string;
  plan: 'free_trial' | 'starter' | 'pro' | 'agency';
  messagesUsed: number;
  trialLimit: number;
  whatsappStatus: 'connected' | 'disconnected' | 'qr_ready';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTransaction {
  id: string;
  merchantTransactionId: string;
  tenantId: string;
  businessName?: string;
  email?: string;
  plan: 'starter' | 'pro' | 'agency';
  amount: number;
  gateway: 'phonepe' | 'razorpay';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paymentMode?: string;
  createdAt: string;
}

function getDataFilePath(filename: string): string {
  const baseDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
  if (!fs.existsSync(baseDir)) {
    try {
      fs.mkdirSync(baseDir, { recursive: true });
    } catch {}
  }
  return path.join(baseDir, filename);
}

// In-memory cache for fast response times
let tenantsCache: AdminTenant[] | null = null;
let transactionsCache: AdminTransaction[] | null = null;

const DEMO_TENANT_IDS = new Set([
  'apex-dental-clinic',
  'royal-realty-group',
  'mumbai-spice-kitchen',
  'urban-fit-studio',
]);

function filterDemoTenants(list: AdminTenant[]): AdminTenant[] {
  return (list || []).filter((t) => t && t.tenantId && !DEMO_TENANT_IDS.has(t.tenantId));
}

function filterDemoTransactions(list: AdminTransaction[]): AdminTransaction[] {
  return (list || []).filter(
    (tx) =>
      tx &&
      tx.merchantTransactionId &&
      !tx.merchantTransactionId.includes('apexdental') &&
      !tx.merchantTransactionId.includes('royalrealty') &&
      !DEMO_TENANT_IDS.has(tx.tenantId)
  );
}

export function getAdminTenants(): AdminTenant[] {
  if (tenantsCache) return filterDemoTenants(tenantsCache);
  const filePath = getDataFilePath('tenants.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      tenantsCache = filterDemoTenants(parsed || []);
      return tenantsCache;
    } catch {
      tenantsCache = [];
      return tenantsCache;
    }
  }
  tenantsCache = [];
  return tenantsCache;
}

export function saveAdminTenants(tenants: AdminTenant[]): void {
  const clean = filterDemoTenants(tenants);
  tenantsCache = clean;
  const filePath = getDataFilePath('tenants.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(clean, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write tenants file:', err);
  }
}

export function recordTenant(tenant: Partial<AdminTenant> & { tenantId: string }): AdminTenant {
  if (DEMO_TENANT_IDS.has(tenant.tenantId)) {
    throw new Error('Demo tenant ID blocked.');
  }

  const list = getAdminTenants();
  const existingIdx = list.findIndex((t) => t.tenantId === tenant.tenantId);

  if (existingIdx >= 0) {
    const updated: AdminTenant = {
      ...list[existingIdx],
      ...tenant,
      updatedAt: new Date().toISOString(),
    };
    list[existingIdx] = updated;
    saveAdminTenants(list);
    return updated;
  }

  const created: AdminTenant = {
    id: tenant.id || `usr_${Date.now()}`,
    tenantId: tenant.tenantId,
    businessName: tenant.businessName || tenant.tenantId,
    name: tenant.name || 'Workspace Owner',
    email: tenant.email || `${tenant.tenantId}@workspace.local`,
    plan: tenant.plan || 'free_trial',
    messagesUsed: tenant.messagesUsed || 0,
    trialLimit: tenant.trialLimit || 70,
    whatsappStatus: tenant.whatsappStatus || 'disconnected',
    phone: tenant.phone || '',
    createdAt: tenant.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  list.unshift(created);
  saveAdminTenants(list);
  return created;
}

export function getAdminTransactions(): AdminTransaction[] {
  if (transactionsCache) return filterDemoTransactions(transactionsCache);
  const filePath = getDataFilePath('transactions.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      transactionsCache = filterDemoTransactions(parsed || []);
      return transactionsCache;
    } catch {
      transactionsCache = [];
      return transactionsCache;
    }
  }
  transactionsCache = [];
  saveAdminTransactions(transactionsCache);
  return transactionsCache;
}

export function saveAdminTransactions(txns: AdminTransaction[]): void {
  const clean = filterDemoTransactions(txns);
  transactionsCache = clean;
  const filePath = getDataFilePath('transactions.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(clean, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write transactions file:', err);
  }
}

export function recordTransaction(
  txn: Partial<AdminTransaction> & { merchantTransactionId: string; tenantId: string }
): AdminTransaction {
  const list = getAdminTransactions();
  const existingIdx = list.findIndex((t) => t.merchantTransactionId === txn.merchantTransactionId);

  if (existingIdx >= 0) {
    const updated = { ...list[existingIdx], ...txn };
    list[existingIdx] = updated;
    saveAdminTransactions(list);
    return updated;
  }

  const created: AdminTransaction = {
    id: txn.id || `txn_${Date.now()}`,
    merchantTransactionId: txn.merchantTransactionId,
    tenantId: txn.tenantId,
    businessName: txn.businessName || txn.tenantId,
    email: txn.email,
    plan: txn.plan || 'starter',
    amount: txn.amount || 499,
    gateway: txn.gateway || 'phonepe',
    status: txn.status || 'PENDING',
    paymentMode: txn.paymentMode || 'PhonePe UPI',
    createdAt: txn.createdAt || new Date().toISOString(),
  };

  list.unshift(created);
  saveAdminTransactions(list);
  return created;
}
