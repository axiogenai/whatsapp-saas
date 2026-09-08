import { TenantUser } from './types';

const STORAGE_KEY = 'axiogen_wa_saas_user';

export function getStoredUser(): TenantUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: TenantUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Also store in cookie for SSR checks
  document.cookie = `wa_tenant_id=${encodeURIComponent(user.tenantId)}; path=/; max-age=2592000; SameSite=Lax`;
  document.cookie = `wa_user_email=${encodeURIComponent(user.email)}; path=/; max-age=2592000; SameSite=Lax`;
  if (user.isAdmin) {
    document.cookie = `wa_is_admin=true; path=/; max-age=2592000; SameSite=Lax`;
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = 'wa_tenant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'wa_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'wa_is_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
