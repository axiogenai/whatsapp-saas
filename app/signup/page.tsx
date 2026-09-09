'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, User, Building, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { setStoredUser, slugify } from '@/lib/auth';
import { TenantUser } from '@/lib/types';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tenantSlug = businessName.trim() ? slugify(businessName) : 'workspace-id';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !businessName || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isPrivileged = cleanEmail === 'aditaypatil07@gmail.com' || cleanEmail === 'aditay26patil@gmail.com';
      const initialLimit = isPrivileged ? 100000 : 70;
      const tenantId = slugify(businessName);

      const user: TenantUser = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: name.trim(),
        businessName: businessName.trim(),
        tenantId,
        createdAt: new Date().toISOString(),
        plan: isPrivileged ? 'agency' : 'free_trial',
        messagesUsed: 0,
        trialLimit: initialLimit,
      };

      // Automatically register new upcoming tenant into admin platform store
      try {
        await fetch('/api/admin/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'tenant',
            tenant: {
              id: user.id,
              tenantId: user.tenantId,
              businessName: user.businessName,
              name: user.name,
              email: user.email,
              plan: user.plan,
              messagesUsed: 0,
              trialLimit: initialLimit,
              whatsappStatus: 'disconnected',
              phone: '',
              createdAt: user.createdAt,
              updatedAt: user.createdAt,
            },
          }),
        });
      } catch (_) {}

      setStoredUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
          Create your AI workspace
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#25D366]/10 text-[#25D366]">
            <Check className="w-3.5 h-3.5" />
            70 Free Messages
          </span>
          <span className="text-xs text-white/40">No card required</span>
        </div>
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
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full h-11 pl-10 pr-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Business / Workspace Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Legal Group"
                  className="w-full h-11 pl-10 pr-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-colors"
                />
              </div>
              <p className="text-[11px] text-white/30 mt-1.5">
                Tenant identifier: <span className="font-mono text-white/50">{tenantSlug}</span>
              </p>
            </div>

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
                  placeholder="At least 6 characters"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(37,211,102,0.15)] mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace & Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-white/[0.06]">
            <span className="text-xs text-white/40">Already have a workspace? </span>
            <Link href="/login" className="text-xs font-medium text-white hover:text-[#25D366] transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
