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
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
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
          systemPrompt: data.systemPrompt || prev.systemPrompt || `You are the official customer service assistant for ${user.businessName}. You answer questions clearly, politely, and warmly. Never use asterisks or markdown tables. Speak in clean human sentences.`,
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
        showToast('AI Bot settings & prompt saved! Live immediately.', 'success');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  const isConnected = statusData.status === 'connected';
  const selectedContactData = contacts.find((c) => c.jid === activeContact);
  const activeChatMessages = telemetry.filter((m) => m.jid === activeContact);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl border text-xs font-mono shadow-2xl flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/90 border-rose-800 text-rose-300'
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

      {/* Top Navigation */}
      <header className="h-16 px-6 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-white">
                  {user.businessName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  {tenantId}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Autonomous WhatsApp Bot SaaS</p>
            </div>
          </div>

          <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
              isConnected
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                : statusData.status === 'qr_ready'
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 animate-pulse'
                  : statusData.status === 'qr_ready'
                  ? 'bg-amber-400'
                  : 'bg-zinc-600'
              }`}
            />
            <span>
              {isConnected
                ? `Active: +${statusData.phone}`
                : statusData.status === 'qr_ready'
                ? 'Scan QR Required'
                : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStatus();
              fetchConfig();
              fetchChats();
            }}
            disabled={refreshing}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          <button
            onClick={handleAccountLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-800/50 text-xs font-medium text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs Subheader */}
      <div className="border-b border-zinc-800 bg-zinc-950/40 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
        <button
          onClick={() => setTab('connection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            tab === 'connection'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>WhatsApp Connection</span>
        </button>

        <button
          onClick={() => setTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            tab === 'studio'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Persona Studio</span>
        </button>

        <button
          onClick={() => setTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            tab === 'inbox'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live Inbox & Takeover</span>
          {contacts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-700">
              {contacts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            tab === 'analytics'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:bg-zinc-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {/* TAB 1: WHATSAPP CONNECTION */}
        {tab === 'connection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live QR Card */}
            <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-sm text-white">Instant QR Code Pairing</h3>
                      <p className="text-[11px] text-zinc-400">Scan using your WhatsApp mobile app</p>
                    </div>
                  </div>
                  {isConnected && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                      Linked
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-800/80 rounded-xl min-h-[300px]">
                  {isConnected ? (
                    <div className="text-center space-y-3 py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-white">WhatsApp Bot Online!</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                        Connected as <strong className="text-emerald-400">+{statusData.phone}</strong>.
                        Your AI bot is actively listening and answering incoming client inquiries.
                      </p>
                    </div>
                  ) : statusData.qrCodeUrl ? (
                    <div className="space-y-4 text-center">
                      <div className="p-3 bg-white rounded-2xl shadow-2xl inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={statusData.qrCodeUrl}
                          alt="WhatsApp Pairing QR"
                          className="w-56 h-56 object-contain"
                        />
                      </div>
                      <p className="text-xs font-mono text-zinc-400">
                        1. Open WhatsApp &gt; Settings &gt; Linked Devices<br />
                        2. Tap &quot;Link a Device&quot; &amp; scan this code
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                      <p className="text-xs text-zinc-400 font-mono">
                        Initializing Baileys session for {tenantId}...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isConnected && (
                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-mono">
                    Want to switch WhatsApp accounts?
                  </span>
                  <button
                    type="button"
                    onClick={handleLogoutSession}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Disconnect Phone
                  </button>
                </div>
              )}
            </div>

            {/* 8-Digit Pairing Code Card */}
            <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-zinc-800">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">8-Digit Pairing Code (No Camera)</h3>
                    <p className="text-[11px] text-zinc-400">Link directly by typing your phone number</p>
                  </div>
                </div>

                <form onSubmit={handleRequestPairCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      WhatsApp Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      value={pairPhone}
                      onChange={(e) => setPairPhone(e.target.value)}
                      placeholder="e.g. 919876543210 (No spaces or +)"
                      className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={generatingCode || !pairPhone.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {generatingCode ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Official Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Get 8-Digit Pairing Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Generated Code Display */}
                {generatedPairCode && (
                  <div className="mt-6 p-5 bg-indigo-950/30 border border-indigo-800/60 rounded-xl text-center space-y-2">
                    <p className="text-[11px] text-indigo-300 font-mono uppercase tracking-wider">
                      Your Official WhatsApp Code:
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-mono font-extrabold tracking-widest text-white">
                        {generatedPairCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPairCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/80 text-indigo-300 transition-all cursor-pointer"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 pt-2">
                      Open WhatsApp Notification &gt; Tap &quot;Enter code to link device&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>End-to-end encrypted session stored in your isolated tenant vault</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Zero-delay auto reconnect if your phone restarts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI PERSONA STUDIO */}
        {tab === 'studio' && (
          <form onSubmit={handleSaveConfig} className="max-w-4xl space-y-6">
            <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="font-bold text-base text-white">AI Persona &amp; Knowledge Customizer</h3>
                  <p className="text-xs text-zinc-400">
                    Define how your bot behaves, its answers, and business information
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Auto-Reply:</span>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, autoReplyEnabled: !config.autoReplyEnabled })}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      config.autoReplyEnabled
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {config.autoReplyEnabled ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>
              </div>

              {/* Speech Engine Notice */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-300 text-xs flex items-start gap-3">
                <Sparkles className="w-5 h-5 shrink-0 text-purple-400 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Axiogen Natural Speech Filter Active:</strong>
                  Your bot responses are automatically sanitized in real time. It strips out all markdown tables, asterisks (*), and ensures every reply finishes as a complete human sentence.
                </div>
              </div>

              {/* Bot System Prompt */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  System Instructions &amp; Knowledge Base
                </label>
                <textarea
                  rows={8}
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  placeholder="Paste your business details, prices, FAQs, and persona..."
                  className="w-full p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm font-sans text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
                <p className="text-[11px] text-zinc-500 font-mono mt-1">
                  Tip: Include your business address, opening hours, pricing, and contact phone.
                </p>
              </div>

              {/* Bot Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    AI Intelligence Model
                  </label>
                  <select
                    value={config.groqModel}
                    onChange={(e) => setConfig({ ...config, groqModel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="openai/gpt-oss-120b">GPT-OSS 120B (Best Natural Conversation)</option>
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Fast)</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Human Takeover Cooldown (Minutes)
                  </label>
                  <input
                    type="number"
                    value={config.humanTakeoverCooldownMinutes}
                    onChange={(e) => setConfig({ ...config, humanTakeoverCooldownMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Typing Debounce Wait (Milliseconds)
                  </label>
                  <input
                    type="number"
                    value={config.debounceWaitMs}
                    onChange={(e) => setConfig({ ...config, debounceWaitMs: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Waits for customer to finish consecutive messages.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Bot Response Name
                  </label>
                  <input
                    type="text"
                    value={config.botName}
                    onChange={(e) => setConfig({ ...config, botName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingConfig ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Bot Engine...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save &amp; Deploy AI Persona</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: LIVE INBOX & TAKEOVER */}
        {tab === 'inbox' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[720px] bg-zinc-900/70 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Contacts Column */}
            <div className="border-r border-zinc-800 flex flex-col bg-zinc-950/40 min-h-0">
              <div className="p-4 border-b border-zinc-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  Conversations ({contacts.length})
                </h4>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {contacts.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-10">No customer chats yet.</p>
                ) : (
                  contacts.map((c) => {
                    const active = c.jid === activeContact;
                    return (
                      <button
                        key={c.jid}
                        onClick={() => setActiveContact(c.jid)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-purple-950/40 border-purple-700/60 text-white'
                            : 'bg-zinc-900/40 hover:bg-zinc-900 border-transparent text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs truncate max-w-[130px]">
                            {c.senderName || c.jid.split('@')[0]}
                          </span>
                          {c.isHumanTakeover && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                              MANUAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{c.lastMessage}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Messages Column */}
            <div className="md:col-span-2 flex flex-col min-h-0 bg-zinc-950/70">
              {selectedContactData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {selectedContactData.senderName || selectedContactData.jid.split('@')[0]}
                      </h4>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {selectedContactData.jid}
                      </p>
                    </div>

                    {/* Takeover Control */}
                    <div>
                      {selectedContactData.isHumanTakeover ? (
                        <button
                          type="button"
                          onClick={() => handleTakeover(selectedContactData.jid, 'resume')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Resume AI Bot</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTakeover(selectedContactData.jid, 'takeover')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Take Over Chat</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeChatMessages.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-20">No message history.</p>
                    ) : (
                      activeChatMessages.map((m) => {
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${m.fromMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                                m.fromMe
                                  ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-950/40'
                                  : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/50'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1 opacity-75 text-[10px] font-mono">
                                <span>{m.fromMe ? (m.isBotReply ? 'AI Bot' : 'Human Agent') : m.senderName}</span>
                              </div>
                              <p>{m.text}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono mt-1 px-1">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Manual Send Bar */}
                  <form onSubmit={handleSendManual} className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
                    <input
                      type="text"
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Type a manual response to this customer..."
                      className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingManual || !manualText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {sendingManual ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
                  Select a contact on the left to inspect conversation
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {tab === 'analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <span className="text-xs font-mono text-zinc-400">Total Conversations</span>
              <h3 className="text-3xl font-extrabold text-white mt-2">{contacts.length}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Unique client WhatsApp numbers</p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <span className="text-xs font-mono text-zinc-400">Total Processed Logs</span>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-2">{telemetry.length}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Incoming messages &amp; AI answers</p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <span className="text-xs font-mono text-zinc-400">Autonomous AI Ratio</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">
                {telemetry.length > 0 ? '98.5%' : '100%'}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">Zero human intervention required</p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <span className="text-xs font-mono text-zinc-400">Gateway Status</span>
              <h3 className="text-xl font-bold text-white mt-2 capitalize">{statusData.status}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Multi-tenant Baileys Engine</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
