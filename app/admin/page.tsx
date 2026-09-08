'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  CreditCard,
  IndianRupee,
  Smartphone,
  MessageSquare,
  Activity,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  Check,
  Power,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  X,
  Loader2,
} from 'lucide-react';
import { getStoredUser, setStoredUser, clearStoredUser } from '@/lib/auth';
import { TenantUser } from '@/lib/types';
import { AdminTenant, AdminTransaction } from '@/lib/admin-store';

const DEFAULT_ADMIN_KEY = 'axiogen_admin_2026';

export default function AdminPage() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data State
  const [kpis, setKpis] = useState({
    totalTenants: 0,
    paidSubscribers: 0,
    mrr: 0,
    totalRevenue: 0,
    connectedNumbers: 0,
    totalAiMessages: 0,
  });
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [loadingData, setLoadingData] = useState(false);

  // Filter & Search
  const [activeTab, setActiveTab] = useState<'tenants' | 'transactions' | 'infrastructure'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free_trial' | 'starter' | 'pro' | 'agency'>('all');

  // Tenant Modification Modal
  const [selectedTenant, setSelectedTenant] = useState<AdminTenant | null>(null);
  const [editPlan, setEditPlan] = useState<'free_trial' | 'starter' | 'pro' | 'agency'>('free_trial');
  const [savingChanges, setSavingChanges] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Check if currently logged in user is admin
  useEffect(() => {
    const user = getStoredUser();
    const cleanEmail = (user?.email || '').toLowerCase().trim();
    const isAdmin =
      user?.isAdmin === true ||
      cleanEmail === 'aditay26patil@gmail.com' ||
      cleanEmail === 'aditya26patil@gmail.com' ||
      (typeof document !== 'undefined' && document.cookie.includes('wa_is_admin=true'));

    if (isAdmin) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // 2. Fetch Admin Data
  const fetchAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/admin/overview?key=${DEFAULT_ADMIN_KEY}`, {
        headers: { 'x-admin-key': DEFAULT_ADMIN_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setTenants(data.tenants || []);
        setTransactions(data.transactions || []);
        setSystemInfo(data.system || {});
      }
    } catch {
      showToast('Failed to refresh admin data.', 'error');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated, fetchAdminData]);

  // Master Passcode Login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_ADMIN_KEY || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      document.cookie = 'wa_is_admin=true; path=/; max-age=2592000; SameSite=Lax';
      showToast('Super Admin access granted.', 'success');
    } else {
      setAuthError('Incorrect admin master passcode.');
    }
  };

  // Quick Action: Update Tenant Plan
  const handleUpdateTenantPlan = async (tenantId: string, newPlan: 'free_trial' | 'starter' | 'pro' | 'agency') => {
    setSavingChanges(true);
    try {
      const res = await fetch('/api/admin/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': DEFAULT_ADMIN_KEY,
        },
        body: JSON.stringify({ tenantId, plan: newPlan }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Tenant plan updated to ${newPlan.toUpperCase()}`, 'success');
        setSelectedTenant(null);
        fetchAdminData();
      } else {
        showToast(data.error || 'Failed to update plan.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error updating tenant.', 'error');
    } finally {
      setSavingChanges(false);
    }
  };

  // Quick Action: Add Bonus Trial Messages
  const handleAddTrialCredits = async (tenantId: string, credits: number) => {
    try {
      const res = await fetch('/api/admin/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': DEFAULT_ADMIN_KEY,
        },
        body: JSON.stringify({ tenantId, addCredits: credits }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Added +${credits} free trial messages to workspace!`, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to add credits.', 'error');
    }
  };

  // Quick Action: Reset Trial Usage
  const handleResetUsage = async (tenantId: string) => {
    try {
      const res = await fetch('/api/admin/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': DEFAULT_ADMIN_KEY,
        },
        body: JSON.stringify({ tenantId, resetQuota: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Usage quota reset to 0/70', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to reset quota.', 'error');
    }
  };

  // Quick Action: Impersonate / Open Workspace Dashboard
  const handleImpersonateTenant = (t: AdminTenant) => {
    const impersonated: TenantUser = {
      id: t.id,
      email: t.email,
      name: t.name,
      businessName: t.businessName,
      tenantId: t.tenantId,
      createdAt: t.createdAt,
      plan: t.plan,
      messagesUsed: t.messagesUsed,
      trialLimit: t.trialLimit,
      isAdmin: true,
    };
    setStoredUser(impersonated);
    router.push('/dashboard');
  };

  // Verify Single Transaction with PhonePe Bank
  const handleVerifyBankTxn = async (txnId: string) => {
    showToast(`Checking status with PhonePe...`, 'success');
    try {
      const res = await fetch(`/api/billing/status?txn=${encodeURIComponent(txnId)}`);
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        showToast(`Transaction ${txnId} verified as COMPLETED by PhonePe!`, 'success');
        fetchAdminData();
      } else if (data.status === 'PENDING') {
        showToast(`Transaction ${txnId} is PENDING bank confirmation.`, 'error');
      } else {
        showToast(`Transaction state: ${data.status || 'FAILED'}`, 'error');
      }
    } catch {
      showToast('Status check timed out.', 'error');
    }
  };

  // Filtered Tenants List
  const filteredTenants = tenants.filter((t) => {
    const matchesPlan = planFilter === 'all' || t.plan === planFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.businessName.toLowerCase().includes(q) ||
      t.tenantId.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      (t.phone && t.phone.includes(q));
    return matchesPlan && matchesSearch;
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  // PASSCODE UNLOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg shadow-amber-950/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Super Admin Control Center</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Platform Owner Portal for Axiogen WhatsApp SaaS
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            {authError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                  Enter Master Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-600 font-mono tracking-wider"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Unlock Super Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800/80 text-center space-y-2">
              <p className="text-[11px] text-zinc-500">
                Or sign in directly using your admin account:
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                <span>Log in as aditay26patil@gmail.com</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUPER ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-150">
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium shadow-xl flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/90 border-rose-800 text-rose-300'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Top Super Admin Navbar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/90 flex items-center justify-center text-amber-400 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-100 tracking-wide">
                AXIOGEN <span className="text-amber-400">SUPER ADMIN</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950/80 border border-amber-800 text-amber-300">
                OWNER
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              Signed in as aditay26patil@gmail.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={fetchAdminData}
            disabled={loadingData}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Workspace View</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </Link>

          <button
            onClick={() => {
              clearStoredUser();
              router.push('/login');
            }}
            className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* KPI OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Total Tenants</span>
              <Users className="w-4 h-4 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.totalTenants}</span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Registered workspaces</span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Monthly MRR</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400">₹{kpis.mrr.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Recurring revenue</span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Paid Subscribers</span>
              <CreditCard className="w-4 h-4 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.paidSubscribers}</span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
              {kpis.totalTenants > 0 ? `${Math.round((kpis.paidSubscribers / kpis.totalTenants) * 100)}% conversion` : '0%'}
            </span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Total Collected</span>
              <Activity className="w-4 h-4 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-zinc-100">₹{kpis.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">PhonePe UPI captured</span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Active WhatsApp</span>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400">{kpis.connectedNumbers}</span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Live Baileys sockets</span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">AI Messages</span>
              <MessageSquare className="w-4 h-4 text-zinc-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-zinc-100">{kpis.totalAiMessages}</span>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Groq LPU inferences</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'tenants'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Workspaces &amp; Tenants ({tenants.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              PhonePe UPI Transactions ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('infrastructure')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'infrastructure'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Engine &amp; Gateways
            </button>
          </div>
        </div>

        {/* TAB 1: WORKSPACES & TENANTS TABLE */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by business name, tenant ID, or email..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                <span className="text-zinc-500 text-[11px] mr-1">Plan:</span>
                {(['all', 'free_trial', 'starter', 'pro', 'agency'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlanFilter(p)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors uppercase ${
                      planFilter === p
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                      <th className="p-3">Workspace &amp; Owner</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Messages Quota</th>
                      <th className="p-3">WhatsApp Bot</th>
                      <th className="p-3">Registered</th>
                      <th className="p-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-sans">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 text-xs">
                          No tenants match your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((t) => {
                        const isTrial = t.plan === 'free_trial';
                        const isExhausted = isTrial && t.messagesUsed >= (t.trialLimit || 70);
                        return (
                          <tr key={t.tenantId} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3">
                              <div className="font-medium text-zinc-200">{t.businessName}</div>
                              <div className="text-[11px] text-zinc-500">{t.email}</div>
                              <div className="text-[10px] font-mono text-zinc-600">ID: {t.tenantId}</div>
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                  t.plan === 'starter'
                                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                                    : t.plan === 'pro'
                                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400 font-semibold'
                                    : t.plan === 'agency'
                                    ? 'bg-purple-950/80 border-purple-800 text-purple-300 font-semibold'
                                    : isExhausted
                                    ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                                    : 'bg-amber-950/80 border-amber-800 text-amber-300'
                                }`}
                              >
                                {t.plan === 'starter' && 'STARTER (₹499)'}
                                {t.plan === 'pro' && 'BUSINESS PRO (₹999)'}
                                {t.plan === 'agency' && 'AGENCY (₹2,499)'}
                                {t.plan === 'free_trial' && (isExhausted ? 'TRIAL EXHAUSTED' : 'FREE TRIAL (70)')}
                              </span>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className={isExhausted ? 'text-rose-400 font-bold' : 'text-zinc-200'}>
                                  {t.messagesUsed} / {t.trialLimit || 70}
                                </span>
                              </div>
                              <div className="w-28 bg-zinc-900 rounded-full h-1 mt-1 overflow-hidden">
                                <div
                                  className={`h-1 rounded-full ${isExhausted ? 'bg-rose-500' : 'bg-emerald-400'}`}
                                  style={{
                                    width: `${Math.min(100, Math.max(5, (t.messagesUsed / (t.trialLimit || 70)) * 100))}%`,
                                  }}
                                />
                              </div>
                            </td>

                            <td className="p-3">
                              {t.whatsappStatus === 'connected' ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                  <span className="font-mono text-[11px]">{t.phone || 'Connected'}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                  <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
                                  <span className="font-mono text-[11px]">Offline</span>
                                </div>
                              )}
                            </td>

                            <td className="p-3 text-[11px] font-mono text-zinc-500">
                              {new Date(t.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedTenant(t);
                                    setEditPlan(t.plan);
                                  }}
                                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white"
                                  title="Change Plan"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleAddTrialCredits(t.tenantId, 50)}
                                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 hover:text-amber-300 text-[10px] font-mono"
                                  title="Add +50 AI Messages"
                                >
                                  +50 AI
                                </button>

                                <button
                                  onClick={() => handleResetUsage(t.tenantId)}
                                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                                  title="Reset Quota Usage to 0"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleImpersonateTenant(t)}
                                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 hover:text-emerald-300"
                                  title="Open Workspace Dashboard"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PHONEPE UPI TRANSACTIONS TABLE */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                      <th className="p-3">Merchant Transaction ID</th>
                      <th className="p-3">Workspace</th>
                      <th className="p-3">Plan &amp; Amount</th>
                      <th className="p-3">Gateway &amp; Channel</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 text-right">Bank Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-sans">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-500 text-xs">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="p-3 font-mono text-zinc-300 text-[11px]">
                            {tx.merchantTransactionId}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-zinc-200">{tx.businessName || tx.tenantId}</div>
                            <div className="text-[11px] text-zinc-500">{tx.email || 'N/A'}</div>
                          </td>
                          <td className="p-3 font-mono">
                            <span className="font-bold text-zinc-100 text-sm">₹{tx.amount}</span>
                            <span className="text-[11px] text-zinc-500 block uppercase">{tx.plan}</span>
                          </td>
                          <td className="p-3 text-zinc-400 text-[11px] font-mono">
                            <span className="text-zinc-200 block">{tx.paymentMode || 'PhonePe UPI'}</span>
                            <span className="text-[10px] text-zinc-500">Gateway: {tx.gateway.toUpperCase()}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                tx.status === 'SUCCESS'
                                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400 font-semibold'
                                  : tx.status === 'PENDING'
                                  ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                                  : 'bg-rose-950/80 border-rose-800 text-rose-400'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-zinc-500">
                            {new Date(tx.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleVerifyBankTxn(tx.merchantTransactionId)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-mono inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INFRASTRUCTURE & ENGINE MONITOR */}
        {activeTab === 'infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                  Axiogen WhatsApp Gateway Service
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Centralized Baileys multi-tenant daemon operating on Ubuntu cloud instance with automatic restart and sub-second socket dispatch.
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Service Endpoint:</span>
                  <span className="text-zinc-300">https://api.axiogen.in/whatsapp-saas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Internal Port:</span>
                  <span className="text-zinc-300">3002 (Reverse Proxied by Nginx)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Active Tenant Sockets:</span>
                  <span className="text-emerald-400 font-bold">{kpis.connectedNumbers} online</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                  Payment Gateway Settings
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300">
                  {systemInfo.phonePeEnv === 'production' ? 'LIVE PRODUCTION' : 'UAT SANDBOX'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Handles UPI autopay, QR scanning, and server-to-server signature checks.
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Active Provider:</span>
                  <span className="text-emerald-400 uppercase font-semibold">{systemInfo.gatewayProvider || 'PHONEPE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Razorpay Adapter:</span>
                  <span className="text-zinc-400">Ready (Awaiting KYC Keys)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Default Signup Trial:</span>
                  <span className="text-zinc-200 font-bold">70 AI Messages</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PLAN EDIT MODAL */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Manage Tenant Plan</h3>
                <p className="text-[11px] text-zinc-400">{selectedTenant.businessName} ({selectedTenant.tenantId})</p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-zinc-300 font-medium">Select Plan to Assign:</label>
              {(
                [
                  { id: 'free_trial', name: 'Free Trial', desc: '70 AI Messages Quota' },
                  { id: 'starter', name: 'Starter Plan (₹499)', desc: '1,500 Messages • 1 WhatsApp Number' },
                  { id: 'pro', name: 'Business Pro (₹999)', desc: '8,000 Messages • 2 Numbers' },
                  { id: 'agency', name: 'Agency / Scale (₹2,499)', desc: '30,000 Messages • 5 Numbers' },
                ] as const
              ).map((p) => (
                <label
                  key={p.id}
                  onClick={() => setEditPlan(p.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    editPlan === p.id
                      ? 'bg-zinc-800/80 border-amber-500/80 text-zinc-100'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    checked={editPlan === p.id}
                    onChange={() => setEditPlan(p.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-xs block text-zinc-200">{p.name}</span>
                    <span className="text-[11px] text-zinc-500 font-sans">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleUpdateTenantPlan(selectedTenant.tenantId, editPlan)}
                disabled={savingChanges}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {savingChanges ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Apply Plan Changes</span>
              </button>
              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
