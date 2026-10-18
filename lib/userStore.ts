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

// Safe filesystem location for Vercel/Serverless (/tmp is the only writable directory)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production');
const DATA_DIR = isServerless ? '/tmp/axiogen-data' : path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const ADMIN_EMAILS = new Set([
  'aditaypatil07@gmail.com',
  'aditay26patil@gmail.com',
  'aditya26patil@gmail.com',
  'adityapatil07@gmail.com',
]);

const MASTER_ADMIN_PASSCODE = process.env.ADMIN_SECRET_KEY || 'axiogen_admin_2026';

// In-memory user cache so auth never fails even on read-only serverless filesystems
let memoryUsers: StoredUser[] = [];

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Non-fatal in read-only serverless environments
  }
}

function loadUsers(): StoredUser[] {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed;
        return memoryUsers;
      }
    }
  } catch (err) {
    // Fall back to in-memory store
  }
  return memoryUsers;
}

function saveUsers(users: StoredUser[]): void {
  memoryUsers = users;
  try {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    // In-memory copy remains valid
  }
}

export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const { hash: computedHash } = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  } catch (_) {
    return false;
  }
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
  try {
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

    return { success: true, user: toSafeUser(newUser) };
  } catch (err: any) {
    console.error('[UserStore] registerUser error:', err);
    return { success: false, error: err.message || 'Registration failed.' };
  }
}

export function authenticateUser(
  email: string,
  password: string
): { success: boolean; user?: SafeUser; error?: string } {
  try {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const isAdmin = ADMIN_EMAILS.has(cleanEmail);
    const user = getUserByEmail(cleanEmail);

    // If user not in database:
    // If it's a known Super Admin email, bootstrap immediately with full agency plan!
    if (!user) {
      if (isAdmin) {
        if (password.length >= 6) {
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
    // Also check if admin master passcode or admin known password was used
    const isMasterOverride = (user.isAdmin || isAdmin) && (password === MASTER_ADMIN_PASSCODE || password === 'adi.patil#1');
    const passwordValid = isMasterOverride || (user.passwordHash && user.salt && verifyPassword(password, user.passwordHash, user.salt));

    if (!passwordValid) {
      return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    return { success: true, user: toSafeUser(user) };
  } catch (err: any) {
    console.error('[UserStore] authenticateUser error:', err);
    // Even if storage fails, never lock out admin!
    const cleanEmail = email.trim().toLowerCase();
    if (ADMIN_EMAILS.has(cleanEmail) && password.length >= 6) {
      return {
        success: true,
        user: {
          id: 'usr_admin_fallback',
          email: cleanEmail,
          name: 'Aditya Patil',
          businessName: 'Team Axiogen',
          tenantId: 'aditaypatil07',
          plan: 'agency',
          trialLimit: 100000,
          isAdmin: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    return { success: false, error: 'Authentication service temporarily unavailable. Please try again.' };
  }
}

// Ensure Super Admin exists on boot
export function initUserStore(): void {
  try {
    const users = loadUsers();
    for (const adminEmail of ADMIN_EMAILS) {
      const exists = users.some((u) => u.email.toLowerCase() === adminEmail);
      if (!exists) {
        const { hash, salt } = hashPassword(MASTER_ADMIN_PASSCODE);
        const now = new Date().toISOString();
        const adminUser: StoredUser = {
          id: `admin_${adminEmail.split('@')[0]}`,
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
  } catch (_) {}
}
