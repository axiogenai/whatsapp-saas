import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  businessName: string;
  tenantId: string;
  passwordHash: string;
  salt: string;
  plan: 'free_trial' | 'starter' | 'pro' | 'agency';
  trialLimit: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<StoredUser, 'passwordHash' | 'salt'>;

const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const ADMIN_EMAILS = new Set([
  'aditay26patil@gmail.com',
  'aditya26patil@gmail.com',
]);

const MASTER_ADMIN_PASSCODE = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsers(): StoredUser[] {
  ensureDataDir();
  if (fs.existsSync(USERS_FILE)) {
    try {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      console.error('[UserStore] Error loading users:', err);
    }
  }
  return [];
}

function saveUsers(users: StoredUser[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[UserStore] Error saving users:', err);
  }
}

export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
}

export function toSafeUser(user: StoredUser): SafeUser {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

export function getUserByEmail(email: string): StoredUser | null {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export function getUserById(id: string): StoredUser | null {
  const users = loadUsers();
  return users.find((u) => u.id === id) || null;
}

export function getAllUsers(): SafeUser[] {
  return loadUsers().map(toSafeUser);
}

export function registerUser(params: {
  email: string;
  password: string;
  name: string;
  businessName: string;
  tenantId?: string;
  plan?: 'free_trial' | 'starter' | 'pro' | 'agency';
  trialLimit?: number;
}): { success: boolean; user?: SafeUser; error?: string } {
  const cleanEmail = params.email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  if (!params.password || params.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const existing = getUserByEmail(cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const isAdmin = ADMIN_EMAILS.has(cleanEmail);
  const now = new Date().toISOString();
  const { hash, salt } = hashPassword(params.password);

  const derivedTenant = params.tenantId?.trim()
    ? params.tenantId.trim()
    : isAdmin
    ? 'aditaypatil07'
    : cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || `usr-${Date.now()}`;

  const newUser: StoredUser = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    name: params.name?.trim() || cleanEmail.split('@')[0],
    businessName: params.businessName?.trim() || (isAdmin ? 'Team Axiogen' : 'My Business'),
    tenantId: derivedTenant,
    passwordHash: hash,
    salt,
    plan: isAdmin ? 'agency' : params.plan || 'free_trial',
    trialLimit: isAdmin ? 100000 : params.trialLimit || 70,
    isAdmin,
    createdAt: now,
    updatedAt: now,
  };

  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);

  console.log(`[UserStore] Registered new user: ${cleanEmail} (tenant: ${derivedTenant}, admin: ${isAdmin})`);
  return { success: true, user: toSafeUser(newUser) };
}

export function authenticateUser(
  email: string,
  password: string
): { success: boolean; user?: SafeUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const user = getUserByEmail(cleanEmail);

  // If user not in database:
  // If it's the Super Admin email, allow first-time bootstrap or verification against MASTER_ADMIN_PASSCODE
  if (!user) {
    const isAdmin = ADMIN_EMAILS.has(cleanEmail);
    if (isAdmin) {
      if (password === MASTER_ADMIN_PASSCODE || password.length >= 6) {
        console.log(`[UserStore] Bootstrapping Super Admin account for ${cleanEmail}...`);
        const reg = registerUser({
          email: cleanEmail,
          password,
          name: 'Aditya Patil',
          businessName: 'Team Axiogen',
          tenantId: 'aditaypatil07',
          plan: 'agency',
          trialLimit: 100000,
        });
        return reg;
      }
    }
    return { success: false, error: 'No account found with this email. Please sign up first.' };
  }

  // User exists - check password against hash
  // Also check if admin master passcode was used as override
  const isMasterOverride = user.isAdmin && password === MASTER_ADMIN_PASSCODE;
  const passwordValid = isMasterOverride || verifyPassword(password, user.passwordHash, user.salt);

  if (!passwordValid) {
    return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
  }

  return { success: true, user: toSafeUser(user) };
}

// Ensure Super Admin exists on boot
export function initUserStore(): void {
  const users = loadUsers();
  for (const adminEmail of ADMIN_EMAILS) {
    const exists = users.some((u) => u.email.toLowerCase() === adminEmail);
    if (!exists) {
      console.log(`[UserStore] Initializing default Super Admin user for ${adminEmail}...`);
      const { hash, salt } = hashPassword(MASTER_ADMIN_PASSCODE);
      const now = new Date().toISOString();
      const adminUser: StoredUser = {
        id: 'admin_master',
        email: adminEmail,
        name: 'Aditya Patil',
        businessName: 'Team Axiogen',
        tenantId: 'aditaypatil07',
        passwordHash: hash,
        salt,
        plan: 'agency',
        trialLimit: 100000,
        isAdmin: true,
        createdAt: now,
        updatedAt: now,
      };
      users.push(adminUser);
      saveUsers(users);
    }
  }
}
