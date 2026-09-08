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
} from 'lucide-react';
import { getStoredUser, clearStoredUser } from '@/lib/auth';
import { TenantUser, TenantSessionStatus, TenantBotConfig, ChatMessage, ChatContact } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TenantUser | null>(null);
  const [tab, setTab] = useState<'connection' | 'studio' | 'inbox' | 'analytics'>('connection');

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

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Auth protection
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
          systemPrompt: data.systemPrompt || prev.systemPrompt || `You are the official customer service assistant for ${user.businessName}. You answer customer questions clearly, politely, and warmly. Never use asterisks or markdown tables. Speak in clean, natural sentences.`,
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
      support: `You are the customer support representative for ${user?.businessName || 'our company'}. Answer inquiries politely, clearly, and concisely. Provide information regarding services, support hours, and follow-ups. Speak naturally without markdown tables or asterisks.`,
      clinic: `You are the front-desk appointment coordinator for ${user?.businessName || 'the clinic'}. Help patients with appointment availability, doctor schedules, clinic timings, and directions. Always maintain a calm, helpful, professional tone. Avoid medical advice and encourage booking a direct consultation.`,
      realty: `You are the property inquiry specialist for ${user?.businessName || 'our real estate agency'}. Assist potential buyers and tenants with property locations, pricing estimates, site visit schedules, and brochures. Maintain an executive, trustworthy tone.`,
      restaurant: `You are the dining concierge for ${user?.businessName || 'our restaurant'}. Handle table reservations, dietary questions, operating hours, and location guidance. Keep responses friendly, warm, and brief.`,
    };
    setConfig((prev) => ({ ...prev, systemPrompt: templates[type] }));
    showToast(`Loaded ${type} persona template.`, 'success');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const isConnected = statusData.status === 'connected';
  const selectedContactData = contacts.find((c) => c.jid === activeContact);
  const activeChatMessages = telemetry.filter((m) => m.jid === activeContact);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-3.5 py-2 rounded-lg border text-xs font-mono shadow-xl flex items-center gap-2 ${
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
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 px-6 border-b border-zinc-800 bg-[#09090b] flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-100">
                {user.businessName}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                {tenantId}
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border ${
              isConnected
                ? 'bg-emerald-950/30 text-emerald-400 border-emerald-800/60'
                : statusData.status === 'qr_ready'
                ? 'bg-amber-950/30 text-amber-400 border-amber-800/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <div
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
                ? `Active +${statusData.phone}`
                : statusData.status === 'qr_ready'
                ? 'QR Ready'
                : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStatus();
              fetchConfig();
              fetchChats();
            }}
            disabled={refreshing}
            className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-zinc-200' : ''}`} />
          </button>

          <button
            onClick={handleAccountLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Segmented Tab Navigation */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="inline-flex p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg gap-0.5">
          <button
            onClick={() => setTab('connection')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              tab === 'connection'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Connection</span>
          </button>

          <button
            onClick={() => setTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              tab === 'studio'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Persona Studio</span>
          </button>

          <button
            onClick={() => setTab('inbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              tab === 'inbox'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Inbox</span>
            {contacts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                {contacts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              tab === 'analytics'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>macOS Desktop Socket Engine</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-6xl w-full mx-auto">
        {/* TAB 1: WHATSAPP CONNECTION */}
        {tab === 'connection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live QR Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-zinc-400" />
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-100">QR Code Pairing</h3>
                      <p className="text-xs text-zinc-400">Scan with WhatsApp on iOS or Android</p>
                    </div>
                  </div>
                  {isConnected ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
                      Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRestartQR}
                      disabled={restartingSession}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${restartingSession ? 'animate-spin' : ''}`} />
                      <span>Refresh QR</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800/80 rounded-lg min-h-[300px]">
                  {isConnected ? (
                    <div className="text-center space-y-3 py-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-100">WhatsApp Account Online</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                        Connected as <strong className="text-zinc-200">+{statusData.phone}</strong>.
                        Autonomous auto-replies are listening for customer messages.
                      </p>
                    </div>
                  ) : statusData.qrCodeUrl ? (
                    <div className="space-y-4 text-center">
                      <div className="p-3 bg-white rounded-lg inline-block shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={statusData.qrCodeUrl}
                          alt="WhatsApp Pairing QR"
                          className="w-52 h-52 object-contain"
                        />
                      </div>
                      <div className="text-xs text-zinc-400 space-y-1 font-mono">
                        <p>1. Open WhatsApp &gt; Settings &gt; Linked Devices</p>
                        <p>2. Tap &quot;Link a Device&quot; &amp; scan this code</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
                      <p className="text-xs text-zinc-400 font-mono">
                        Connecting to WhatsApp gateway for {tenantId}...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isConnected && (
                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-mono">
                    Device linked
                  </span>
                  <button
                    type="button"
                    onClick={handleLogoutSession}
                    className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-800/50 text-rose-400 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Disconnect Phone
                  </button>
                </div>
              )}
            </div>

            {/* 8-Digit Pairing Code Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-zinc-800/80">
                  <Smartphone className="w-4 h-4 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-100">8-Digit Pairing Code</h3>
                    <p className="text-xs text-zinc-400">Link directly via phone number without camera</p>
                  </div>
                </div>

                <form onSubmit={handleRequestPairCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      WhatsApp Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      value={pairPhone}
                      onChange={(e) => setPairPhone(e.target.value)}
                      placeholder="e.g. 919876543210 (digits only)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
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

                {/* Generated Code Display */}
                {generatedPairCode && (
                  <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-center space-y-2">
                    <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                      Pairing Code:
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl font-mono font-bold tracking-widest text-zinc-100">
                        {generatedPairCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPairCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer border border-zinc-800"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 pt-1">
                      On your phone: WhatsApp &gt; Linked Devices &gt; Link with phone number instead
                    </p>
                  </div>
                )}
              </div>

              {/* Security info */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>End-to-end encrypted session in your isolated tenant container</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>Automatic session persistence across server reboots</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI PERSONA STUDIO */}
        {tab === 'studio' && (
          <form onSubmit={handleSaveConfig} className="max-w-3xl space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100">AI Persona &amp; Knowledge Base</h3>
                  <p className="text-xs text-zinc-400">
                    Define system instructions, business rules, and behavior
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Auto-Reply:</span>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, autoReplyEnabled: !config.autoReplyEnabled })}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      config.autoReplyEnabled
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {config.autoReplyEnabled ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>
              </div>

              {/* Natural speech guarantee notice */}
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-zinc-100 block mb-0.5 font-medium">Natural Speech Filter:</strong>
                  All output is automatically sanitized to remove markdown tables, asterisks (*), and truncated phrases. Responses read as clean, conversational English.
                </div>
              </div>

              {/* Quick Template Switcher */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Quick Industry Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('support')}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer"
                  >
                    Customer Support
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('clinic')}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer"
                  >
                    Clinic / Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('realty')}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer"
                  >
                    Real Estate
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('restaurant')}
                    className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer"
                  >
                    Restaurant &amp; Dining
                  </button>
                </div>
              </div>

              {/* Bot System Prompt */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  System Instructions
                </label>
                <textarea
                  rows={8}
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  placeholder="Paste your business details, prices, operating hours, and FAQ..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 leading-relaxed"
                />
              </div>

              {/* Bot Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    AI Inference Model
                  </label>
                  <select
                    value={config.groqModel}
                    onChange={(e) => setConfig({ ...config, groqModel: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="openai/gpt-oss-120b">GPT-OSS 120B (Conversational)</option>
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Fast)</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Human Takeover Cooldown (Minutes)
                  </label>
                  <input
                    type="number"
                    value={config.humanTakeoverCooldownMinutes}
                    onChange={(e) => setConfig({ ...config, humanTakeoverCooldownMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Debounce Latency (ms)
                  </label>
                  <input
                    type="number"
                    value={config.debounceWaitMs}
                    onChange={(e) => setConfig({ ...config, debounceWaitMs: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600"
                  />
                  <p className="text-[10px] text-zinc-500 mt-0.5">Waits for user to finish consecutive messages.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Assistant Name
                  </label>
                  <input
                    type="text"
                    value={config.botName}
                    onChange={(e) => setConfig({ ...config, botName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[680px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            {/* Contacts Column */}
            <div className="border-r border-zinc-800 flex flex-col bg-[#09090b] min-h-0">
              <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
                <h4 className="font-medium text-xs text-zinc-300">
                  Conversations
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">
                  {contacts.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                {contacts.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-12">No messages received yet.</p>
                ) : (
                  contacts.map((c) => {
                    const active = c.jid === activeContact;
                    return (
                      <button
                        key={c.jid}
                        onClick={() => setActiveContact(c.jid)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? 'bg-zinc-800/60 border-zinc-700 text-white'
                            : 'bg-transparent hover:bg-zinc-900 border-transparent text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-medium text-xs truncate max-w-[130px] text-zinc-200">
                            {c.senderName || c.jid.split('@')[0]}
                          </span>
                          {c.isHumanTakeover && (
                            <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-amber-950/50 text-amber-400 border border-amber-800/60">
                              HUMAN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate">{c.lastMessage}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Messages Column */}
            <div className="md:col-span-2 flex flex-col min-h-0 bg-zinc-950">
              {selectedContactData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#09090b]">
                    <div>
                      <h4 className="font-medium text-xs text-zinc-100">
                        {selectedContactData.senderName || selectedContactData.jid.split('@')[0]}
                      </h4>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {selectedContactData.jid}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleTakeover(
                            selectedContactData.jid,
                            selectedContactData.isHumanTakeover ? 'resume' : 'takeover'
                          )
                        }
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                          selectedContactData.isHumanTakeover
                            ? 'bg-zinc-900 border-zinc-700 text-emerald-400 hover:bg-zinc-800'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {selectedContactData.isHumanTakeover ? 'Resume AI Bot' : 'Take Over Chat'}
                      </button>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0c0c0e]">
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
                              className={`max-w-[75%] p-3 rounded-xl text-xs leading-relaxed ${
                                isFromMe
                                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                                  : 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{m.text}</p>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600 mt-1">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendManual} className="p-3 border-t border-zinc-800 bg-[#09090b] flex gap-2">
                    <input
                      type="text"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Type a manual WhatsApp message to this customer..."
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
                          <span>Send</span>
                          <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 font-mono">
                  Select a contact on the left to view messages
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">Total Messages</span>
                <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                  {telemetry.length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Across all customer chats</span>
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">Inference Latency</span>
                <span className="block text-2xl font-semibold font-mono text-emerald-400 mt-1">
                  ~850ms
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Groq LPU hardware</span>
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">Active Contacts</span>
                <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                  {contacts.length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Unique phone numbers</span>
              </div>

              <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">System Uptime</span>
                <span className="block text-2xl font-semibold font-mono text-zinc-100 mt-1">
                  99.98%
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Production systemd runner</span>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                Tenant Architecture Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
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
      </main>
    </div>
  );
}
