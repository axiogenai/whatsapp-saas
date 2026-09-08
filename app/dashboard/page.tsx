'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  QrCode,
  Smartphone,
  Cpu,
  Sliders,
  MessageSquare,
  BarChart3,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  Send,
  User,
  Power,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Settings2,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  IndianRupee,
  CreditCard,
  Search,
  Download,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { getStoredUser, clearStoredUser } from '@/lib/auth';
import { TenantUser, TenantSessionStatus, TenantBotConfig, ChatMessage, ChatContact } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TenantUser | null>(null);
  
  // Navigation & Layout
  const [tab, setTab] = useState<'connection' | 'studio' | 'inbox' | 'subscription' | 'analytics' | 'docs'>('connection');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isContactsCollapsed, setIsContactsCollapsed] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  // Status & Telemetry
  const [statusData, setStatusData] = useState<TenantSessionStatus>({ status: 'disconnected' });
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restartingSession, setRestartingSession] = useState(false);

  // Pairing code state
  const [pairPhone, setPairPhone] = useState('');
  const [generatedPairCode, setGeneratedPairCode] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Bot Config Studio
  const [config, setConfig] = useState<TenantBotConfig>({
    tenantId: 'default',
    botName: 'AI Support Assistant',
    autoReplyEnabled: true,
    groqModel: 'openai/gpt-oss-120b',
    systemPrompt: '',
    welcomeMessage: 'Hello! How can I help you today?',
    typingDelayMinMs: 800,
    typingDelayMaxMs: 2200,
    debounceWaitMs: 3000,
    humanTakeoverCooldownMinutes: 30,
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Inbox & Chats
  const [telemetry, setTelemetry] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [sendingManual, setSendingManual] = useState(false);
  const [mobileChatView, setMobileChatView] = useState<'contacts' | 'messages'>('contacts');

  // Subscription State (INR)
  const [activePlan, setActivePlan] = useState<'starter' | 'pro' | 'agency'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Auth check
  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.push('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const tenantId = user?.tenantId || 'default';

  // 2. Fetch Status
  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/whatsapp/status?tenantId=${encodeURIComponent(tenantId)}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
      }
    } catch {
      // offline
    } finally {
      setLoadingStatus(false);
      setRefreshing(false);
    }
  }, [user, tenantId]);

  // 3. Fetch Config
  const fetchConfig = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/whatsapp/config?tenantId=${encodeURIComponent(tenantId)}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({
          ...prev,
          ...data,
          systemPrompt:
            data.systemPrompt ||
            prev.systemPrompt ||
            `You are the official customer service assistant for ${user.businessName}. You answer customer questions clearly, politely, and warmly. Never use asterisks or markdown tables. Speak in clean, natural sentences.`,
        }));
      }
    } catch {}
  }, [user, tenantId]);

  // 4. Fetch Chats
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/whatsapp/chats?tenantId=${encodeURIComponent(tenantId)}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry || []);
        setContacts(data.contacts || []);
        if (!activeContact && data.contacts?.length > 0) {
          setActiveContact(data.contacts[0].jid);
        }
      }
    } catch {}
  }, [user, tenantId, activeContact]);

  useEffect(() => {
    if (!user) return;
    fetchStatus();
    fetchConfig();
    fetchChats();

    const timer = setInterval(() => {
      fetchStatus();
      if (tab === 'inbox') fetchChats();
    }, 3500);

    return () => clearInterval(timer);
  }, [user, fetchStatus, fetchConfig, fetchChats, tab]);

  // Force restart / refresh QR
  const handleRestartQR = async () => {
    setRestartingSession(true);
    try {
      const res = await fetch('/api/whatsapp/logout', {
        method: 'POST',
        headers: { 'x-tenant-id': tenantId },
        body: JSON.stringify({ tenantId }),
      });
      if (res.ok) {
        showToast('Refreshing WhatsApp session...', 'success');
        setTimeout(() => fetchStatus(), 1500);
      } else {
        showToast('Failed to reset session.', 'error');
      }
    } catch {
      showToast('Error resetting session.', 'error');
    } finally {
      setRestartingSession(false);
    }
  };

  // Actions
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showToast('Bot instructions updated and live.', 'success');
      } else {
        showToast('Failed to save settings.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving settings.', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleRequestPairCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairPhone.trim()) return;

    setGeneratingCode(true);
    setGeneratedPairCode(null);
    try {
      const res = await fetch('/api/whatsapp/pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({
          tenantId,
          phone: pairPhone.trim(),
        }),
      });

      const data = await res.json();
      const code = data.pairingCode || data.code;
      if (res.ok && code) {
        setGeneratedPairCode(code);
        showToast('Pairing code generated. Enter in WhatsApp.', 'success');
      } else {
        showToast(data.error || 'Pairing code generation failed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to request code.', 'error');
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleLogoutSession = async () => {
    if (!confirm('Unlink this WhatsApp number from your workspace?')) return;
    try {
      await fetch('/api/whatsapp/logout', {
        method: 'POST',
        headers: { 'x-tenant-id': tenantId },
        body: JSON.stringify({ tenantId }),
      });
      fetchStatus();
      showToast('WhatsApp session unlinked.', 'success');
    } catch {
      showToast('Logout failed.', 'error');
    }
  };

  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContact || !manualText.trim()) return;

    setSendingManual(true);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({
          tenantId,
          phone: activeContact,
          text: manualText.trim(),
        }),
      });

      if (res.ok) {
        setManualText('');
        fetchChats();
        showToast('Message delivered.', 'success');
      } else {
        showToast('Failed to deliver message.', 'error');
      }
    } catch {
      showToast('Send error.', 'error');
    } finally {
      setSendingManual(false);
    }
  };

  const handleTakeover = async (jid: string, action: 'resume' | 'takeover') => {
    try {
      await fetch('/api/whatsapp/takeover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({ tenantId, jid, action }),
      });
      fetchChats();
      showToast(action === 'resume' ? 'Bot auto-reply resumed.' : 'Chat taken over. Bot paused.', 'success');
    } catch {}
  };

  const handleAccountLogout = () => {
    clearStoredUser();
    router.push('/login');
  };

  const applyTemplate = (type: 'support' | 'clinic' | 'realty' | 'restaurant') => {
    const templates = {
      support: `You are the customer support representative for ${user?.businessName || 'our business'}. Answer inquiries politely, clearly, and concisely. Provide information regarding services, support hours, and follow-ups. Speak naturally without markdown tables or asterisks.`,
      clinic: `You are the front-desk appointment coordinator for ${user?.businessName || 'our business'}. Help clients with appointment availability, schedules, timings, and directions. Always maintain a calm, helpful, professional tone. Avoid medical advice and encourage booking a direct consultation.`,
      realty: `You are the property inquiry specialist for ${user?.businessName || 'our business'}. Assist potential buyers and tenants with property locations, pricing estimates, site visit schedules, and brochures. Maintain an executive, trustworthy tone.`,
      restaurant: `You are the dining concierge for ${user?.businessName || 'our business'}. Handle table reservations, dietary questions, operating hours, and location guidance. Keep responses friendly, warm, and brief.`,
    };
    setConfig((prev) => ({ ...prev, systemPrompt: templates[type] }));
    showToast(`Loaded ${type} persona template.`, 'success');
  };

  const handleSwitchPlan = (newPlan: 'starter' | 'pro' | 'agency') => {
    setActivePlan(newPlan);
    const planNames = {
      starter: 'Starter Plan (₹499/mo)',
      pro: 'Business Pro (₹999/mo)',
      agency: 'Agency / Scale (₹2,499/mo)',
    };
    showToast(`Switched to ${planNames[newPlan]}. Instant UPI activation active.`, 'success');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const isConnected = statusData.status === 'connected';
  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.senderName && c.senderName.toLowerCase().includes(q)) ||
      c.jid.toLowerCase().includes(q) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });
  const selectedContactData = contacts.find((c) => c.jid === activeContact);
  const activeChatMessages = telemetry.filter((m) => m.jid === activeContact);

  const navItems = [
    { id: 'connection', label: 'Connection', icon: QrCode, badge: isConnected ? 'Live' : null },
    { id: 'studio', label: 'AI Studio', icon: Cpu, badge: null },
    { id: 'inbox', label: 'Live Inbox', icon: MessageSquare, badge: contacts.length > 0 ? `${contacts.length}` : null },
    { id: 'subscription', label: 'Subscription', icon: IndianRupee, badge: 'INR' },
    { id: 'analytics', label: 'Analytics & Ops', icon: BarChart3, badge: null },
    { id: 'docs', label: 'API & Webhooks', icon: Terminal, badge: null },
  ] as const;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-zinc-800 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-3.5 py-2 rounded-lg border text-xs font-mono shadow-2xl flex items-center gap-2 max-w-[90vw] animate-in fade-in slide-in-from-top-2 duration-150 ${
            toast.type === 'success'
              ? 'bg-zinc-900 border-zinc-700 text-emerald-400'
              : 'bg-zinc-900 border-rose-800 text-rose-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="truncate">{toast.msg}</span>
        </div>
      )}

      {/* MOBILE DRAWER BACKDROP */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c0c0e] border-r border-zinc-800 p-4 flex flex-col justify-between transition-transform duration-200 ease-out md:hidden ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs text-zinc-100 truncate max-w-[140px]">
                  {user.businessName}
                </h3>
                <p className="text-[10px] font-mono text-zinc-500 truncate">{tenantId}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <div className="min-w-0 text-[11px] font-mono text-zinc-400 truncate">
              {isConnected ? `Active +${statusData.phone}` : 'Socket Offline'}
            </div>
          </div>

          <button
            onClick={handleAccountLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-zinc-800 bg-[#0c0c0e] shrink-0 sticky top-0 h-screen transition-all duration-200 ease-in-out z-20 ${
          isSidebarCollapsed ? 'w-18' : 'w-60'
        }`}
      >
        <div>
          {/* Workspace & Collapse Header */}
          <div className="h-14 px-3 border-b border-zinc-800 flex items-center justify-between">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-zinc-100 truncate max-w-[125px]">
                    {user.businessName}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 block truncate">
                    {tenantId}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSidebarCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between px-3 py-2'
                  } ${
                    active
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                        item.id === 'subscription'
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-zinc-800 space-y-2">
          {/* Socket Status Badge */}
          {!isSidebarCollapsed ? (
            <div
              className={`p-2 rounded-lg border text-[11px] font-mono flex items-center justify-between ${
                isConnected
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400'
                  : statusData.status === 'qr_ready'
                  ? 'bg-amber-950/20 border-amber-900/50 text-amber-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isConnected
                      ? 'bg-emerald-400 animate-pulse'
                      : statusData.status === 'qr_ready'
                      ? 'bg-amber-400'
                      : 'bg-zinc-600'
                  }`}
                />
                <span className="truncate">
                  {isConnected
                    ? `+${statusData.phone}`
                    : statusData.status === 'qr_ready'
                    ? 'Scan QR'
                    : 'Offline'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected
                    ? 'bg-emerald-400 animate-pulse'
                    : statusData.status === 'qr_ready'
                    ? 'bg-amber-400'
                    : 'bg-zinc-600'
                }`}
                title={isConnected ? `Active: +${statusData.phone}` : 'Offline'}
              />
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleAccountLogout}
            title={isSidebarCollapsed ? 'Log Out' : undefined}
            className={`w-full flex items-center rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top App Header */}
        <header className="h-14 px-3 sm:px-6 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-xs flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              title="Open Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-xs sm:text-sm text-zinc-100 capitalize">
                {tab === 'connection' && 'WhatsApp Pairing & Gateway'}
                {tab === 'studio' && 'Agent Studio & Prompt Engine'}
                {tab === 'inbox' && 'Live Inbox & Human Takeover'}
                {tab === 'subscription' && 'Subscription & INR Invoicing'}
                {tab === 'analytics' && 'Operational Telemetry'}
                {tab === 'docs' && 'API Integration & Webhooks'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Connection badge for header */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${
                isConnected
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/60'
                  : statusData.status === 'qr_ready'
                  ? 'bg-amber-950/30 text-amber-400 border-amber-800/60'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected
                    ? 'bg-emerald-400 animate-pulse'
                    : statusData.status === 'qr_ready'
                    ? 'bg-amber-400'
                    : 'bg-zinc-600'
                }`}
              />
              <span>
                {isConnected
                  ? `Active • +${statusData.phone}`
                  : statusData.status === 'qr_ready'
                  ? 'QR Ready'
                  : 'Disconnected'}
              </span>
            </div>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchStatus();
                fetchConfig();
                fetchChats();
              }}
              disabled={refreshing}
              className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-zinc-200' : ''}`} />
            </button>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <main className="flex-1 p-3 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: CONNECTION */}
          {tab === 'connection' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Pairing Card */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-zinc-300" />
                      <h3 className="font-semibold text-sm text-zinc-100">macOS Socket QR Scan</h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">Method 1</span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    Open WhatsApp on your phone &rarr; Settings &rarr; Linked Devices &rarr; Link a Device. Scan the code below.
                  </p>

                  <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800/80 rounded-xl min-h-[260px]">
                    {isConnected ? (
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-center mx-auto text-emerald-400">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-sm text-zinc-100">WhatsApp Connected</h4>
                        <p className="text-xs font-mono text-emerald-400">+{statusData.phone}</p>
                        <p className="text-[11px] text-zinc-500">Active macOS Desktop socket session</p>
                      </div>
                    ) : (statusData.qr || statusData.qrCodeUrl) ? (
                      <div className="space-y-3 text-center">
                        <div className="p-3 bg-white rounded-lg inline-block shadow-lg">
                          <img
                            src={statusData.qr || statusData.qrCodeUrl}
                            alt="WhatsApp Pairing QR"
                            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                          />
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 animate-pulse">
                          Awaiting QR scan... refreshes automatically
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mx-auto" />
                        <p className="text-xs text-zinc-400">Generating pairing session...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={handleRestartQR}
                    disabled={restartingSession}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${restartingSession ? 'animate-spin' : ''}`} />
                    <span>Reset QR Session</span>
                  </button>

                  {isConnected && (
                    <button
                      onClick={handleLogoutSession}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/80 text-xs font-medium text-rose-400 transition-colors cursor-pointer"
                    >
                      Unlink Device
                    </button>
                  )}
                </div>
              </div>

              {/* 8-Digit Phone Pairing Code */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-zinc-300" />
                      <h3 className="font-semibold text-sm text-zinc-100">8-Digit Pairing Code</h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">Method 2</span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    Prefer not to scan a QR code? Request an 8-character verification code to pair directly inside WhatsApp.
                  </p>

                  <form onSubmit={handleRequestPairCode} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        WhatsApp Phone Number (with Country Code)
                      </label>
                      <input
                        type="text"
                        value={pairPhone}
                        onChange={(e) => setPairPhone(e.target.value)}
                        placeholder="Country code + phone (e.g. 15550192834)"
                        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={generatingCode || !pairPhone.trim()}
                      className="w-full py-2.5 px-4 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingCode ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Get 8-Digit Pairing Code</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {generatedPairCode && (
                    <div className="mt-5 p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-center space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        Enter this code on your phone
                      </span>
                      <div className="text-2xl font-mono font-bold tracking-widest text-emerald-400">
                        {generatedPairCode}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPairCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-5 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Encrypted peer-to-peer Baileys socket connection</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI STUDIO */}
          {tab === 'studio' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-100">Agent Persona &amp; Behavior</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Tune how your autonomous WhatsApp bot converses with your clientele
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Auto-Reply:</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, autoReplyEnabled: !config.autoReplyEnabled })}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                        config.autoReplyEnabled
                          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {config.autoReplyEnabled ? 'ENABLED' : 'PAUSED'}
                    </button>
                  </div>
                </div>

                {/* Templates Picker */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Industry Preset Templates (1-Click Load)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => applyTemplate('support')}
                      className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Customer Support
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('clinic')}
                      className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Healthcare / Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('realty')}
                      className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Real Estate Agency
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('restaurant')}
                      className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-left text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Restaurant / Dining
                    </button>
                  </div>
                </div>

                {/* Prompt Textarea */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    System Instructions / Knowledge Base
                  </label>
                  <textarea
                    rows={7}
                    value={config.systemPrompt}
                    onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                    placeholder="Paste your business details, prices, operating hours, and FAQ..."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Rule: The agent automatically filters out bold asterisks and markdown tables so messages appear 100% human.
                  </p>
                </div>

                {/* Model & Name Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Inference Engine (Groq LPU)
                    </label>
                    <select
                      value={config.groqModel}
                      onChange={(e) => setConfig({ ...config, groqModel: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 cursor-pointer"
                    >
                      <option value="openai/gpt-oss-120b">GPT-OSS 120B (Groq LPU - Recommended)</option>
                      <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                      <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Ultra-Fast)</option>
                      <option value="mixtral-8x7b-32768">Mixtral 8x7B 32k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Bot Display Persona Name
                    </label>
                    <input
                      type="text"
                      value={config.botName}
                      onChange={(e) => setConfig({ ...config, botName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingConfig ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: LIVE INBOX & TAKEOVER */}
          {tab === 'inbox' && (
            <div className="flex h-[620px] sm:h-[680px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative">
              {/* CONTACTS LIST COLUMN (Collapsible on desktop, master-detail on mobile) */}
              <div
                className={`border-r border-zinc-800 flex-col bg-[#09090b] min-h-0 transition-all duration-200 ease-in-out shrink-0 ${
                  mobileChatView === 'messages' ? 'hidden md:flex' : 'flex'
                } ${isContactsCollapsed ? 'w-12' : 'w-full md:w-72 lg:w-80'}`}
              >
                {/* Contacts Header */}
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                  {!isContactsCollapsed ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-medium text-xs text-zinc-200">Conversations</h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {contacts.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsContactsCollapsed(true)}
                        className="hidden md:block p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        title="Collapse Conversations"
                      >
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsContactsCollapsed(false)}
                      className="mx-auto p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      title="Expand Conversations"
                    >
                      <PanelLeftOpen className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Contacts Search Bar */}
                {!isContactsCollapsed && (
                  <div className="p-2 border-b border-zinc-800/80">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        placeholder="Search phone or name..."
                        className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-900/60 border border-zinc-800 rounded-md text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>
                )}

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                  {filteredContacts.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-12">
                      {!isContactsCollapsed ? 'No messages received yet.' : '...'}
                    </p>
                  ) : (
                    filteredContacts.map((c) => {
                      const active = c.jid === activeContact;
                      return (
                        <button
                          key={c.jid}
                          onClick={() => {
                            setActiveContact(c.jid);
                            setMobileChatView('messages');
                          }}
                          title={isContactsCollapsed ? c.senderName || c.jid : undefined}
                          className={`w-full text-left rounded-lg border transition-colors cursor-pointer ${
                            isContactsCollapsed ? 'p-2 flex justify-center' : 'p-2.5'
                          } ${
                            active
                              ? 'bg-zinc-800/80 border-zinc-700 text-white'
                              : 'bg-transparent hover:bg-zinc-900 border-transparent text-zinc-400'
                          }`}
                        >
                          {!isContactsCollapsed ? (
                            <>
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-medium text-xs truncate max-w-[130px] text-zinc-200">
                                  {c.senderName || c.jid.split('@')[0]}
                                </span>
                                {c.isHumanTakeover && (
                                  <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-amber-950/60 text-amber-400 border border-amber-800/80">
                                    HUMAN
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate">{c.lastMessage}</p>
                            </>
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* CHAT MESSAGES THREAD */}
              <div
                className={`flex-1 flex-col min-h-0 bg-zinc-950 ${
                  mobileChatView === 'contacts' ? 'hidden md:flex' : 'flex'
                }`}
              >
                {selectedContactData ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 sm:p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#09090b]">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => setMobileChatView('contacts')}
                          className="md:hidden p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shrink-0"
                          title="Back to conversations"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <h4 className="font-medium text-xs text-zinc-100 truncate">
                            {selectedContactData.senderName || selectedContactData.jid.split('@')[0]}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 truncate">
                            {selectedContactData.jid}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleTakeover(
                              selectedContactData.jid,
                              selectedContactData.isHumanTakeover ? 'resume' : 'takeover'
                            )
                          }
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border whitespace-nowrap ${
                            selectedContactData.isHumanTakeover
                              ? 'bg-zinc-900 border-zinc-700 text-emerald-400 hover:bg-zinc-800'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {selectedContactData.isHumanTakeover ? 'Resume Bot' : 'Take Over'}
                        </button>
                      </div>
                    </div>

                    {/* Message Thread */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#0c0c0e]">
                      {activeChatMessages.length === 0 ? (
                        <p className="text-xs text-zinc-500 text-center py-8 font-mono">
                          No message history for this contact.
                        </p>
                      ) : (
                        activeChatMessages.map((m, idx) => {
                          const isFromMe = m.fromMe;
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${isFromMe ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[75%] p-2.5 sm:p-3 rounded-xl text-xs leading-relaxed ${
                                  isFromMe
                                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-xs border border-zinc-700/60'
                                    : 'bg-zinc-900 text-zinc-200 rounded-tl-xs border border-zinc-800'
                                }`}
                              >
                                {m.text}
                              </div>
                              <span className="text-[9px] font-mono text-zinc-600 mt-1">
                                {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Response Chips */}
                    <div className="px-3 py-1.5 bg-[#09090b] border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">Quick reply:</span>
                      <button
                        type="button"
                        onClick={() => setManualText('👋 Hello! How may we assist you today?')}
                        className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 shrink-0 whitespace-nowrap"
                      >
                        👋 Greeting
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualText('📅 We have appointment slots open this week. Would you like to reserve one?')}
                        className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 shrink-0 whitespace-nowrap"
                      >
                        📅 Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualText('⏳ Our staff member will review your query and call you back shortly.')}
                        className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 shrink-0 whitespace-nowrap"
                      >
                        ⏳ Follow-up
                      </button>
                    </div>

                    {/* Manual Send Input Form */}
                    <form
                      onSubmit={handleSendManual}
                      className="p-3 border-t border-zinc-800 bg-[#09090b] flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Type a manual WhatsApp reply..."
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                      />
                      <button
                        type="submit"
                        disabled={sendingManual || !manualText.trim()}
                        className="px-3.5 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {sendingManual ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span className="hidden xs:inline">Send</span>
                            <Send className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 font-mono p-4 text-center">
                    Select a conversation on the left to view messages
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTION & INR BILLING */}
          {tab === 'subscription' && (
            <div className="space-y-6">
              {/* Active Plan Overview Card */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                        ACTIVE SUBSCRIPTION
                      </span>
                      <span className="text-xs font-mono text-zinc-400">🇮🇳 Billed in INR (UPI / Cards)</span>
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-100">
                      {activePlan === 'starter' && 'Starter Plan — ₹499 / mo'}
                      {activePlan === 'pro' && 'Business Pro — ₹999 / mo'}
                      {activePlan === 'agency' && 'Agency / Scale — ₹2,499 / mo'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Next auto-renewal on 1st of next month • Includes GST Input Tax Credit
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">Billing:</span>
                    <button
                      onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white"
                    >
                      {billingCycle === 'monthly' ? 'Monthly' : 'Annual (15% Off)'}
                    </button>
                  </div>
                </div>

                {/* Usage Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                    <span className="text-xs text-zinc-400 font-medium">WhatsApp Messages Used</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-lg font-bold font-mono text-zinc-100">
                        {telemetry.length} / {activePlan === 'starter' ? '1,500' : activePlan === 'pro' ? '8,000' : '30,000'}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {Math.min(100, Math.round((telemetry.length / (activePlan === 'starter' ? 1500 : activePlan === 'pro' ? 8000 : 30000)) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full"
                        style={{
                          width: `${Math.max(4, Math.min(100, (telemetry.length / (activePlan === 'starter' ? 1500 : activePlan === 'pro' ? 8000 : 30000)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                    <span className="text-xs text-zinc-400 font-medium">WhatsApp Numbers Active</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-lg font-bold font-mono text-zinc-100">
                        {isConnected ? '1' : '0'} / {activePlan === 'starter' ? '1' : activePlan === 'pro' ? '2' : '5'}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {isConnected ? 'Connected' : 'Ready to pair'}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-1.5 rounded-full"
                        style={{ width: isConnected ? '50%' : '0%' }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                    <span className="text-xs text-zinc-400 font-medium">Groq LPU Inference Speed</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-lg font-bold font-mono text-emerald-400">~840ms</span>
                      <span className="text-[11px] font-mono text-zinc-500">Sub-second</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">
                      Zero wait time for your customers on WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Switcher Grid (Affordable Indian Pricing) */}
              <div>
                <h4 className="font-semibold text-sm text-zinc-200 mb-3">Available India Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Starter Tier */}
                  <div
                    className={`rounded-xl p-5 border flex flex-col justify-between transition-colors ${
                      activePlan === 'starter'
                        ? 'bg-zinc-900/80 border-zinc-600'
                        : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Starter</span>
                        {activePlan === 'starter' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-2xl font-bold font-mono text-zinc-100">₹499</span>
                        <span className="text-xs text-zinc-500"> / month</span>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">₹16/day • Solo shops &amp; clinics</p>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1 WhatsApp Number</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1,500 AI Messages/mo</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant QR &amp; Phone Code</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Human Takeover Console</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSwitchPlan('starter')}
                      disabled={activePlan === 'starter'}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        activePlan === 'starter'
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                          : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {activePlan === 'starter' ? 'Active Plan' : 'Switch to Starter'}
                    </button>
                  </div>

                  {/* Business Pro Tier */}
                  <div
                    className={`rounded-xl p-5 border flex flex-col justify-between transition-colors relative shadow-lg ${
                      activePlan === 'pro'
                        ? 'bg-zinc-900/90 border-zinc-600'
                        : 'bg-zinc-900/40 border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/90 border border-emerald-800/90 text-emerald-400">
                      POPULAR
                    </span>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Business Pro</span>
                        {activePlan === 'pro' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-2xl font-bold font-mono text-zinc-100">₹999</span>
                        <span className="text-xs text-zinc-500"> / month</span>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">₹33/day • For growing operations</p>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 2 WhatsApp Numbers</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 8,000 AI Messages/mo</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom Knowledge Base &amp; FAQ</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sub-Second Groq LPU Speed</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Priority WhatsApp &amp; UPI Support</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSwitchPlan('pro')}
                      disabled={activePlan === 'pro'}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        activePlan === 'pro'
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                          : 'bg-white hover:bg-zinc-200 text-zinc-950 font-medium'
                      }`}
                    >
                      {activePlan === 'pro' ? 'Active Plan' : 'Switch to Pro'}
                    </button>
                  </div>

                  {/* Agency / Scale Tier */}
                  <div
                    className={`rounded-xl p-5 border flex flex-col justify-between transition-colors ${
                      activePlan === 'agency'
                        ? 'bg-zinc-900/80 border-zinc-600'
                        : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Agency / Scale</span>
                        {activePlan === 'agency' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-2xl font-bold font-mono text-zinc-100">₹2,499</span>
                        <span className="text-xs text-zinc-500"> / month</span>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">₹83/day • Multi-client agencies</p>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 5 WhatsApp Numbers</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 30,000 AI Messages/mo</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Full REST API &amp; Webhooks</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> GST Tax Invoice Reports</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Account Manager</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSwitchPlan('agency')}
                      disabled={activePlan === 'agency'}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        activePlan === 'agency'
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                          : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {activePlan === 'agency' ? 'Active Plan' : 'Upgrade to Agency'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Supported Payment Channels & Invoices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2.5">
                  <h5 className="font-semibold text-xs text-zinc-300">Indian Payment Channels</h5>
                  <p className="text-xs text-zinc-400">
                    Auto-debit and on-demand payment via Google Pay, PhonePe, Paytm, BHIM UPI, NetBanking, and RuPay/Visa/Mastercard.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                    <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">UPI Autopay</span>
                    <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">RuPay Cards</span>
                    <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">NetBanking</span>
                    <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">GST Input Credit</span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2.5">
                  <h5 className="font-semibold text-xs text-zinc-300">Recent Tax Invoices</h5>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                      <div>
                        <span className="text-zinc-200 block">INV-2026-0891</span>
                        <span className="text-[10px] text-zinc-500">01 Sep 2026 • ₹999</span>
                      </div>
                      <button
                        onClick={() => showToast('Downloading invoice INV-2026-0891.pdf...', 'success')}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                      <div>
                        <span className="text-zinc-200 block">INV-2026-0542</span>
                        <span className="text-[10px] text-zinc-500">01 Aug 2026 • ₹999</span>
                      </div>
                      <button
                        onClick={() => showToast('Downloading invoice INV-2026-0542.pdf...', 'success')}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & OPS */}
          {tab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Total Messages</span>
                  <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                    {telemetry.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block truncate">Across all chats</span>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Inference Latency</span>
                  <span className="block text-2xl font-semibold font-mono text-emerald-400 mt-1">
                    ~850ms
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block truncate">Groq LPU speed</span>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">Active Contacts</span>
                  <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                    {contacts.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block truncate">Unique clients</span>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-400 font-medium">System Uptime</span>
                  <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                    99.98%
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5 block truncate">Linux Systemd service</span>
                </div>
              </div>

              {/* Architecture Specifications */}
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                  Tenant Architecture Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono text-zinc-400">
                  <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg">
                    <span className="text-zinc-500 block mb-1">Socket Driver:</span>
                    <span className="text-zinc-200">Baileys Multi-File Auth (macOS Desktop)</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg">
                    <span className="text-zinc-500 block mb-1">LLM Inference:</span>
                    <span className="text-zinc-200">{config.groqModel} via Groq LPU</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg">
                    <span className="text-zinc-500 block mb-1">Session Vault:</span>
                    <span className="text-zinc-200">Isolated directory /tenants/{tenantId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: API & WEBHOOKS */}
          {tab === 'docs' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-100">Tenant REST API Proxy</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Dispatch programmatic WhatsApp messages and inspect session status from your external backend
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400">
                    Tenant: {tenantId}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-mono text-zinc-300 block mb-1.5">
                      1. Dispatch Outbound Message (`POST /api/whatsapp/send`)
                    </span>
                    <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto relative">
                      <pre className="text-[11px] leading-relaxed">
{`curl -X POST https://whatsapp-saas-jet.vercel.app/api/whatsapp/send \\
  -H "Content-Type: application/json" \\
  -H "x-tenant-id: ${tenantId}" \\
  -d '{
    "tenantId": "${tenantId}",
    "phone": "919876543210",
    "text": "Your appointment has been confirmed for Friday at 3:00 PM."
  }'`}
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `curl -X POST https://whatsapp-saas-jet.vercel.app/api/whatsapp/send -H "Content-Type: application/json" -H "x-tenant-id: ${tenantId}" -d '{"tenantId": "${tenantId}", "phone": "919876543210", "text": "Hello world"}'`
                          );
                          showToast('cURL copied to clipboard', 'success');
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Copy cURL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-zinc-300 block mb-1.5">
                      2. Query Session Status (`GET /api/whatsapp/status`)
                    </span>
                    <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto relative">
                      <pre className="text-[11px] leading-relaxed">
{`curl -X GET "https://whatsapp-saas-jet.vercel.app/api/whatsapp/status?tenantId=${tenantId}" \\
  -H "x-tenant-id: ${tenantId}"`}
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `curl -X GET "https://whatsapp-saas-jet.vercel.app/api/whatsapp/status?tenantId=${tenantId}" -H "x-tenant-id: ${tenantId}"`
                          );
                          showToast('cURL copied to clipboard', 'success');
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="Copy cURL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
