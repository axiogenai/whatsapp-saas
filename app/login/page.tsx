'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { setStoredUser, slugify } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customTenant, setCustomTenant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const derivedTenant = customTenant.trim()
        ? slugify(customTenant)
        : slugify(email.split('@')[0]) || 'default';

      const user = {
        id: `usr_${Date.now()}`,
        email: email.trim(),
        name: email.split('@')[0].toUpperCase(),
        businessName: customTenant.trim() || `${email.split('@')[0].toUpperCase()} Bot`,
        tenantId: derivedTenant,
        createdAt: new Date().toISOString(),
      };

      setStoredUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoName: string, demoTenant: string) => {
    const user = {
      id: `usr_${demoTenant}`,
      email: `${demoTenant}@axiogen.in`,
      name: demoName,
      businessName: demoName,
      tenantId: demoTenant,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-zinc-800 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-zinc-100">
            AXIOGEN <span className="text-zinc-500 font-normal">WhatsApp</span>
          </span>
        </Link>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
          Sign in to your bot console
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Manage your WhatsApp pairing, AI persona studio, and live inbox
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl py-6 px-6 sm:px-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/60 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Workspace Tenant Identifier (Optional)
              </label>
              <input
                type="text"
                value={customTenant}
                onChange={(e) => setCustomTenant(e.target.value)}
                placeholder="e.g. apex-clinic or xyz"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Leave empty to automatically derive from your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-zinc-800/80">
            <span className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2.5">
              1-Click Demo Workspaces
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Apex Dental Clinic', 'apex-dental')}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors cursor-pointer"
              >
                <span className="block text-xs font-medium text-zinc-200">Apex Dental</span>
                <span className="text-[10px] font-mono text-zinc-500">apex-dental</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Summit Real Estate', 'summit-realty')}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left transition-colors cursor-pointer"
              >
                <span className="block text-xs font-medium text-zinc-200">Summit Realty</span>
                <span className="text-[10px] font-mono text-zinc-500">summit-realty</span>
              </button>
            </div>
          </div>

          <div className="pt-3 text-center">
            <span className="text-xs text-zinc-500">Need a workspace? </span>
            <Link href="/signup" className="text-xs font-medium text-zinc-300 hover:text-white">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
