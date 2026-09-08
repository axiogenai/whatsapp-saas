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

const INITIAL_TENANTS: AdminTenant[] = [
  {
    id: 'usr_init_1',
    tenantId: 'apex-dental-clinic',
    businessName: 'Apex Dental Clinic',
    name: 'Dr. Rajesh Sharma',
    email: 'contact@apexdental.in',
    plan: 'starter',
    messagesUsed: 342,
    trialLimit: 1500,
    whatsappStatus: 'connected',
    phone: '+91 98201 44521',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_init_2',
    tenantId: 'royal-realty-group',
    businessName: 'Royal Realty Group',
    name: 'Vikram Mehta',
    email: 'sales@royalrealty.com',
    plan: 'pro',
    messagesUsed: 2180,
    trialLimit: 8000,
    whatsappStatus: 'connected',
    phone: '+91 98110 99882',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_init_3',
    tenantId: 'mumbai-spice-kitchen',
    businessName: 'Mumbai Spice Kitchen',
    name: 'Ananya Verma',
    email: 'order@mumbaispice.in',
    plan: 'free_trial',
    messagesUsed: 58,
    trialLimit: 70,
    whatsappStatus: 'connected',
    phone: '+91 99203 12890',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_init_4',
    tenantId: 'urban-fit-studio',
    businessName: 'Urban Fit Studio',
    name: 'Karan Patel',
    email: 'karan@urbanfit.in',
    plan: 'free_trial',
    messagesUsed: 70,
    trialLimit: 70,
    whatsappStatus: 'disconnected',
    phone: '',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  {
    id: 'txn_init_1',
    merchantTransactionId: 'TXN_starter_apexdental_178881240192',
    tenantId: 'apex-dental-clinic',
    businessName: 'Apex Dental Clinic',
    email: 'contact@apexdental.in',
    plan: 'starter',
    amount: 499,
    gateway: 'phonepe',
    status: 'SUCCESS',
    paymentMode: 'PhonePe UPI',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'txn_init_2',
    merchantTransactionId: 'TXN_pro_royalrealty_178883910248',
    tenantId: 'royal-realty-group',
    businessName: 'Royal Realty Group',
    email: 'sales@royalrealty.com',
    plan: 'pro',
    amount: 999,
    gateway: 'phonepe',
    status: 'SUCCESS',
    paymentMode: 'Google Pay UPI',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export function getAdminTenants(): AdminTenant[] {
  if (tenantsCache) return tenantsCache;
  const filePath = getDataFilePath('tenants.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      tenantsCache = JSON.parse(content);
      return tenantsCache || [];
    } catch {
      tenantsCache = [...INITIAL_TENANTS];
      return tenantsCache;
    }
  }
  tenantsCache = [...INITIAL_TENANTS];
  saveAdminTenants(tenantsCache);
  return tenantsCache;
}

export function saveAdminTenants(tenants: AdminTenant[]): void {
  tenantsCache = tenants;
  const filePath = getDataFilePath('tenants.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(tenants, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write tenants file:', err);
  }
}

export function recordTenant(tenant: Partial<AdminTenant> & { tenantId: string }): AdminTenant {
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
  if (transactionsCache) return transactionsCache;
  const filePath = getDataFilePath('transactions.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      transactionsCache = JSON.parse(content);
      return transactionsCache || [];
    } catch {
      transactionsCache = [...INITIAL_TRANSACTIONS];
      return transactionsCache;
    }
  }
  transactionsCache = [...INITIAL_TRANSACTIONS];
  saveAdminTransactions(transactionsCache);
  return transactionsCache;
}

export function saveAdminTransactions(txns: AdminTransaction[]): void {
  transactionsCache = txns;
  const filePath = getDataFilePath('transactions.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(txns, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write transactions file:', err);
  }
}

export function recordTransaction(txn: Partial<AdminTransaction> & { merchantTransactionId: string; tenantId: string }): AdminTransaction {
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
