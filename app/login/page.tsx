'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { getStoredUser, setStoredUser, slugify } from '@/lib/auth';
import { TenantUser } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customTenant, setCustomTenant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminEmail =
    email.trim().toLowerCase() === 'aditay26patil@gmail.com' ||
    email.trim().toLowerCase() === 'aditya26patil@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin =
        cleanEmail === 'aditay26patil@gmail.com' ||
        cleanEmail === 'aditya26patil@gmail.com';

      const existingUser = getStoredUser();

      // Determine tenantId:
      // 1. Explicit custom tenant if provided
      // 2. Existing stored tenant if email matches
      // 3. If admin (Aditya), default to the primary connected session 'aditaypatil07'
      // 4. Fallback to slug of email username
      let targetTenant = customTenant.trim() ? slugify(customTenant) : '';
      if (!targetTenant && existingUser && existingUser.email === cleanEmail && existingUser.tenantId) {
        targetTenant = existingUser.tenantId;
      }
      if (!targetTenant) {
        targetTenant = isAdmin ? 'aditaypatil07' : (slugify(cleanEmail.split('@')[0]) || 'default');
      }

      const user: TenantUser = {
        id: existingUser?.id || (isAdmin ? 'admin_master' : `usr_${Date.now()}`),
        email: cleanEmail,
        name: isAdmin ? 'Aditya Patil' : existingUser?.name || cleanEmail.split('@')[0].toUpperCase(),
        businessName: isAdmin
          ? (customTenant.trim() || 'Team Axiogen')
          : customTenant.trim() || existingUser?.businessName || `${cleanEmail.split('@')[0].toUpperCase()} Bot`,
        tenantId: targetTenant,
        createdAt: existingUser?.createdAt || new Date().toISOString(),
        plan: isAdmin ? 'agency' : existingUser?.plan || 'free_trial',
        messagesUsed: existingUser?.messagesUsed || 0,
        trialLimit: isAdmin ? 100000 : (cleanEmail === 'aditaypatil07@gmail.com' ? 100000 : (existingUser?.trialLimit || 70)),
        isAdmin,
      };

      setStoredUser(user);

      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-900/40 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#25D366]/[0.05] via-[#25D366]/[0.01] to-transparent blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:border-white/[0.16] transition-colors">
            <Bot className="w-5 h-5 text-[#25D366]" />
          </div>
          <span className="font-semibold text-sm tracking-wider text-white">
            AXIOGEN
          </span>
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Sign in to your AI console
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Manage your WhatsApp assistant, personality brain, and live inbox
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                />
              </div>
              {isAdminEmail && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>👑 Super Admin recognized. Will open Platform Control Center.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Workspace Tenant Identifier (Optional)
              </label>
              <input
                type="text"
                value={customTenant}
                onChange={(e) => setCustomTenant(e.target.value)}
                placeholder="e.g. workspace-id"
                className="w-full h-11 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs font-mono text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
              />
              <p className="text-[11px] text-white/30 mt-1.5">
                Leave empty to automatically derive from your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(37,211,102,0.15)] mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{isAdminEmail ? 'Sign In as Super Admin' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-white/[0.06]">
            <span className="text-xs text-white/40">Need a workspace? </span>
            <Link href="/signup" className="text-xs font-medium text-white hover:text-[#25D366] transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
