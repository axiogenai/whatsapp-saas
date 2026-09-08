'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
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
      // Derive tenant from custom tenant input or email prefix
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
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:bg-purple-500/20 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Bot className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white font-mono">
            AXIOGEN<span className="text-purple-400">.WA</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign in to your WhatsApp Bot
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Manage your autonomous customer service AI, live pairing & telemetry
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="������������"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Workspace / Tenant ID (Optional)
              </label>
              <input
                type="text"
                value={customTenant}
                onChange={(e) => setCustomTenant(e.target.value)}
                placeholder="e.g. clinic-sharma, demo-store"
                className="w-full px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm font-mono text-purple-300 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entering Workspace...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <p className="text-[11px] text-zinc-500 font-mono text-center mb-3">
              One-Click Quick Workspaces:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Demo Store AI', 'demo-store')}
                className="px-3 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-[11px] font-mono text-zinc-300 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>demo-store</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Clinicos Health', 'clinic-alpha')}
                className="px-3 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-[11px] font-mono text-zinc-300 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>clinic-alpha</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Don&apos;t have a workspace?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
