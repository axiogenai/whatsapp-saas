'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ConnectionTab } from '@/components/dashboard/ConnectionTab';
import { AIBrainTab } from '@/components/dashboard/AIBrainTab';
import { TasksTab } from '@/components/dashboard/TasksTab';
import { InsightsTab } from '@/components/dashboard/InsightsTab';
import { BillingTab } from '@/components/dashboard/BillingTab';
import { SettingsTab } from '@/components/dashboard/SettingsTab';
import { VipAudienceTab } from '@/components/dashboard/VipAudienceTab';
import { getStoredUser, setStoredUser, clearStoredUser } from '@/lib/auth';
import { TenantUser, TenantBotConfig, TenantSessionStatus, ChatMessage, ChatContact } from '@/lib/types';
import { CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

const DEFAULT_CONFIG: TenantBotConfig = {
  tenantId: 'default',
  botName: 'AI Assistant',
  autoReplyEnabled: true,
  groqModel: 'openai/gpt-oss-120b',
  systemPrompt: '',
  welcomeMessage: 'Hello! How can I help you today?',
  typingDelayMinMs: 800,
  typingDelayMaxMs: 2200,
  debounceWaitMs: 3000,
  humanTakeoverCooldownMinutes: 15,
  voiceReplyMode: 'adaptive',
  voicePersona: 'en-IN-NeerjaNeural',
  voiceSpeed: 1.0,
  vipModeEnabled: true,
  audienceMode: 'all',
  vipContacts: [],
  useSavedContactNames: true,
  blockedNumbers: [],
  allowedNumbers: [],
  defaultLanguage: 'auto',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TenantUser | null>(null);
  const [tab, setTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Status & Connection
  const [statusData, setStatusData] = useState<TenantSessionStatus>({ status: 'disconnected' });
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [restartingSession, setRestartingSession] = useState<boolean>(false);

  // Pairing Code State
  const [pairPhone, setPairPhone] = useState<string>('');
  const [generatedPairCode, setGeneratedPairCode] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState<boolean>(false);

  // Config State
  const [config, setConfig] = useState<TenantBotConfig>(DEFAULT_CONFIG);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [loadingAudioPreview, setLoadingAudioPreview] = useState<boolean>(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Inbox & Chat State
  const [telemetry, setTelemetry] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [sendingManual, setSendingManual] = useState<boolean>(false);

  // Reminders & Tasks State
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [scheduledCallsList, setScheduledCallsList] = useState<any[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [loadingReminders, setLoadingReminders] = useState<boolean>(false);
  const [creatingReminder, setCreatingReminder] = useState<boolean>(false);

  // Billing
  const [initiatingPlan, setInitiatingPlan] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Check URL query parameters for active tab and payment results
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const targetTab = params.get('tab');
    if (targetTab) {
      setTab(targetTab === 'subscription' ? 'billing' : targetTab);
    }
    const payment = params.get('payment');
    if (payment === 'success') {
      const paidPlan = params.get('plan') || 'Pro';
      showToast(`Payment successful! Your ${paidPlan.toUpperCase()} plan is now active.`, 'success');
      window.history.replaceState({}, '', window.location.pathname + (targetTab ? `?tab=${targetTab === 'subscription' ? 'billing' : targetTab}` : ''));
    } else if (payment === 'failed') {
      const reason = params.get('reason') || 'Transaction failed or was declined.';
      showToast(`Payment failed: ${reason}`, 'error');
    }
  }, [showToast]);

  // 1. Initial auth check
  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(stored);
  }, [router]);

  const tenantId = user?.tenantId || 'default';

  // 2. Fetch Session Status
  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/whatsapp/status?tenantId=${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const data: TenantSessionStatus = await res.json();
        setStatusData(data);
      }
    } catch (e) {
      console.error('Failed to fetch status', e);
    } finally {
      setLoadingStatus(false);
    }
  }, [user, tenantId]);

  // 3. Fetch Bot Config (Runs once on mount / tenant change or explicit user refresh)
  const fetchConfig = useCallback(async () => {
    if (!user) return;
    setLoadingConfig(true);
    try {
      const res = await fetch(`/api/whatsapp/config?tenantId=${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const data: TenantBotConfig = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.error('Failed to fetch config', e);
    } finally {
      setLoadingConfig(false);
    }
  }, [user, tenantId]);

  // 4. Fetch Inbox Chats
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/whatsapp/chats?tenantId=${encodeURIComponent(tenantId)}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      if (res.ok) {
        const data = await res.json();
        const rawTelemetry = (data.telemetry || data.chats || []).filter(
          (m: any) =>
            m.jid &&
            m.jid !== 'status@broadcast' &&
            !m.jid.includes('broadcast') &&
            !m.jid.includes('status') &&
            !m.jid.endsWith('@g.us')
        );
        const rawContacts = (data.contacts || []).filter(
          (c: any) =>
            c.jid &&
            c.jid !== 'status@broadcast' &&
            !c.jid.includes('broadcast') &&
            !c.jid.includes('status') &&
            !c.jid.endsWith('@g.us')
        );
        setTelemetry(rawTelemetry);
        setContacts(rawContacts);
        if (!activeContact && rawContacts.length > 0) {
          setActiveContact(rawContacts[0].jid);
        }
      }
    } catch (e) {
      console.error('Failed to fetch chats', e);
    }
  }, [user, tenantId, activeContact]);

  // 5. Fetch Reminders & Tasks
  const fetchReminders = useCallback(async () => {
    if (!user) return;
    setLoadingReminders(true);
    try {
      const res = await fetch(`/api/whatsapp/reminders?tenantId=${encodeURIComponent(tenantId)}`, {
        headers: { 'x-tenant-id': tenantId },
      });
      if (res.ok) {
        const data = await res.json();
        setRemindersList(Array.isArray(data.reminders) ? data.reminders : []);
        setScheduledCallsList(Array.isArray(data.calls) ? data.calls : (Array.isArray(data.scheduledCalls) ? data.scheduledCalls : []));
        setLeadsList(Array.isArray(data.leads) ? data.leads : []);
      }
    } catch (e) {
      console.error('Failed to fetch reminders', e);
    } finally {
      setLoadingReminders(false);
    }
  }, [user, tenantId]);

  // Dedicated config load: runs on mount when user is ready or tenantId changes
  useEffect(() => {
    if (user) {
      fetchConfig();
    }
  }, [user?.tenantId, fetchConfig]);

  // Periodic polling for status, messages, and reminders ONLY (never polling config!)
  useEffect(() => {
    if (!user) return;
    fetchStatus();
    fetchChats();
    fetchReminders();

    // Auto-import all WhatsApp contacts immediately upon login
    fetch(`/api/whatsapp/contacts/sync?tenantId=${encodeURIComponent(tenantId)}`, {
      method: 'POST',
      headers: { 'x-tenant-id': tenantId },
    }).catch(() => {});

    const statusTimer = setInterval(fetchStatus, 3500);
    const chatsTimer = setInterval(() => {
      fetchChats();
    }, 3500);
    const remindersTimer = setInterval(() => {
      fetchReminders();
    }, 5000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(chatsTimer);
      clearInterval(remindersTimer);
    };
  }, [user, fetchStatus, fetchChats, fetchReminders]);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStatus(), fetchConfig(), fetchChats(), fetchReminders()]);
    setRefreshing(false);
    showToast('Dashboard data refreshed');
  };

  // Handle Restart / Logout Session
  const handleRestart = async () => {
    if (!confirm('Are you sure you want to unlink or restart the WhatsApp session?')) return;
    setRestartingSession(true);
    try {
      const res = await fetch('/api/whatsapp/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });
      if (res.ok) {
        showToast('WhatsApp session unlinked');
        setStatusData({ status: 'disconnected' });
        setGeneratedPairCode(null);
        await fetchStatus();
      } else {
        showToast('Failed to unlink session', 'error');
      }
    } catch {
      showToast('Network error while resetting session', 'error');
    } finally {
      setRestartingSession(false);
    }
  };

  // Handle Explicit Force Fresh QR Generation
  const handleForceNewQr = async () => {
    setRestartingSession(true);
    setStatusData({ status: 'connecting', qrCodeUrl: '' });
    showToast('Requesting fresh WhatsApp QR code...', 'success');
    try {
      await fetch('/api/whatsapp/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
        body: JSON.stringify({ tenantId, force: true }),
      });
      
      // Fast polling cycle to pick up the new QR in real-time
      for (let i = 0; i < 6; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        await fetchStatus();
      }
    } catch {
      showToast('QR generation request failed. Check server status.', 'error');
    } finally {
      setRestartingSession(false);
    }
  };

  // Handle Pairing Code Request
  const handleRequestPairCode = async () => {
    if (!pairPhone || pairPhone.trim().length < 8) {
      showToast('Please enter a valid phone number with country code', 'error');
      return;
    }
    setGeneratingCode(true);
    setGeneratedPairCode(null);
    try {
      const res = await fetch('/api/whatsapp/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, phone: pairPhone.trim() }),
      });
      const data = await res.json();
      if (data.success && data.code) {
        setGeneratedPairCode(data.code);
        showToast('8-digit pairing code generated!');
      } else {
        showToast(data.error || 'Failed to generate pairing code', 'error');
      }
    } catch {
      showToast('Error requesting pairing code', 'error');
    } finally {
      setGeneratingCode(false);
    }
  };

  // Handle Save Config
  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, tenantId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
        showToast('AI Brain settings saved successfully');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch {
      showToast('Network error saving settings', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  // Handle Preview Voice
  const handlePreviewVoice = async () => {
    if (isPlayingAudio && audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    setLoadingAudioPreview(true);
    try {
      const voiceId = config.voicePersona || 'mr-IN-AarohiNeural';
      const NATIVE_PREVIEWS: Record<string, string> = {
        // Real Human Neural Voices (Ultra-Realistic)
        'mr-IN-AarohiNeural': 'नमस्कार! मी आपल्या क्लिनिकची सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकते?',
        'mr-IN-ManoharNeural': 'नमस्कार! मी डॉक्टर यांचा सहाय्यक बोलत आहे. सांगा, मी आपली काय सेवा करू शकतो?',
        'hi-IN-SwaraNeural': 'नमस्ते! मैं आपकी असिस्टेंट बात कर रही हूँ। बताइए, आज मैं आपकी क्या सहायता करूँ?',
        'hi-IN-MadhurNeural': 'नमस्ते! मैं आपका पर्सनल असिस्टेंट हूँ। बताइए, आज क्या काम है?',
        'en-IN-NeerjaNeural': 'Hello! I am your AI assistant. How may I help you today?',
        'en-IN-PrabhatNeural': 'Hello there! I am your AI executive assistant. How can I assist you today?',
        // Meta & Regional Voices
        'meta:hin': 'नमस्ते! मैं आपका एआई असिस्टेंट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?',
        'meta:mar': 'नमस्कार! मी तुमचा एआय असिस्टंट आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
        'meta:tam': 'வணக்கம்! நான் உங்கள் AI குரல் உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
        'meta:tel': 'నమస్కారం! నేను మీ AI వాయిస్ అసిస్టెంట్‌ని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
        'meta:guj': 'નમસ્તે! હું તમારો AI વૉઇસ સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
        'meta:ben': 'নমস্কার! আমি আপনার এআই ভয়েস সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        'meta:kan': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಧ್ವನಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        'meta:mal': 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI വോയ്‌സ് അസിസ്റ്റന്റാണ്. ಇಂದು ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?',
        'meta:pan': 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
        'meta:urd': 'السلام علیکم! میں آپ کا اے آئی وائس اسسٹنٹ ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟',
        'meta:spa': '¡Hola! Soy tu asistente de voz con inteligencia artificial. ¿En qué te puedo ayudar hoy?',
        'meta:fra': 'Bonjour! Je suis votre assistant vocal IA. Comment puis-je vous aider aujourd\'hui?',
        'meta:deu': 'Hallo! Ich bin Ihr KI-Sprachassistent. Wie kann ich Ihnen heute helfen?',
        'meta:ita': 'Ciao! Sono il tuo assistente vocale IA. Come posso aiutarti oggi?',
        'meta:por': 'Olá! Eu sou o seu assistente de voz com IA. Como posso ajudar você hoje?',
        'meta:ara': 'مرحبًا! أنا مساعدك الصوتي الذكي. كيف يمكنني مساعدتك اليوم؟',
        'meta:rus': 'Здравствуйте! Я ваш голосовой ИИ-помощник. Чем я могу помочь вам сегодня?',
        'meta:jpn': 'こんにちは！私はあなたのAI音声アシスタントです。本日はどのようなご用件でしょうか？',
        'meta:kor': '안녕하세요! 저는 당신의 AI 음성 비서입니다. 오늘 어떤 도움이 필요하신가요?',
        'meta:zho': '你好！我是你的人工智能语音助手。今天有什么我可以帮你的吗？',
      };

      let greeting = NATIVE_PREVIEWS[voiceId];
      if (!greeting) {
        if (voiceId.includes('mar') || voiceId.startsWith('mr-')) {
          greeting = 'नमस्कार! मी आपल्या क्लिनिकची सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकते?';
        } else if (voiceId.includes('hin') || voiceId.startsWith('hi-')) {
          greeting = 'नमस्ते! मैं आपका एआई असिस्टेंट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?';
        } else {
          greeting = `Hello, this is ${config.botName || user?.businessName || 'your AI assistant'}. How may I help you today?`;
        }
      }
      const res = await fetch('/api/whatsapp/preview-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: greeting,
          voice: voiceId,
          speed: config.voiceSpeed || 1.0,
        }),
      });

      if (!res.ok) {
        throw new Error('TTS Preview Failed');
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false);
        showToast('Audio playback error', 'error');
        URL.revokeObjectURL(audioUrl);
      };

      setAudioPlayer(audio);
      await audio.play();
      setIsPlayingAudio(true);
    } catch (err: any) {
      console.error('Audio preview error:', err);
      showToast('Voice preview failed', 'error');
    } finally {
      setLoadingAudioPreview(false);
    }
  };

  // Handle Send Manual Message in Inbox
  const handleSendMessage = async (text: string) => {
    if (!activeContact || !text.trim()) return;
    setSendingManual(true);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          to: activeContact,
          message: text.trim(),
        }),
      });
      if (res.ok) {
        showToast('Message sent');
        fetchChats();
      } else {
        showToast('Failed to dispatch message', 'error');
      }
    } catch {
      showToast('Error sending message', 'error');
    } finally {
      setSendingManual(false);
    }
  };

  // Handle Human Takeover Toggle
  const handleTakeover = async (jid: string, action: 'pause' | 'resume') => {
    try {
      const res = await fetch('/api/whatsapp/takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          jid,
          action,
        }),
      });
      if (res.ok) {
        showToast(action === 'pause' ? 'Human takeover active for 15 mins' : 'AI Assistant resumed');
        fetchChats();
      } else {
        showToast('Takeover update failed', 'error');
      }
    } catch {
      showToast('Network error during takeover', 'error');
    }
  };

  // Handle Create Reminder
  const handleCreateReminder = async (task: string, phone: string, delayMinutes: number) => {
    if (!task.trim()) {
      showToast('Please specify a reminder task', 'error');
      return;
    }
    setCreatingReminder(true);
    try {
      const res = await fetch('/api/whatsapp/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          action: 'create',
          task: task.trim(),
          recipientPhone: phone.trim() || undefined,
          delayMinutes,
        }),
      });
      if (res.ok) {
        showToast('Reminder scheduled successfully');
        fetchReminders();
      } else {
        showToast('Failed to schedule reminder', 'error');
      }
    } catch {
      showToast('Error scheduling reminder', 'error');
    } finally {
      setCreatingReminder(false);
    }
  };

  // Handle Cancel Reminder
  const handleCancelReminder = async (id: string) => {
    try {
      const res = await fetch('/api/whatsapp/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          action: 'cancel',
          reminderId: id,
        }),
      });
      if (res.ok) {
        showToast('Reminder cancelled');
        fetchReminders();
      } else {
        showToast('Failed to cancel reminder', 'error');
      }
    } catch {
      showToast('Error cancelling reminder', 'error');
    }
  };

  // Handle Payment Initiation
  const handleInitiatePayment = async (plan: 'starter' | 'pro' | 'agency') => {
    setInitiatingPlan(plan);
    try {
      const res = await fetch('/api/billing/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          tenantId,
          email: user?.email,
          customerName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        showToast(data.error || 'Payment initiation failed', 'error');
        setInitiatingPlan(null);
      }
    } catch {
      showToast('Network error while initiating payment', 'error');
      setInitiatingPlan(null);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearStoredUser();
    router.push('/login');
  };

  // Map session status for Sidebar indicator
  const sidebarConnectionStatus: 'connected' | 'connecting' | 'disconnected' =
    statusData.status === 'connected'
      ? 'connected'
      : statusData.status === 'connecting' || statusData.status === 'qr_ready'
      ? 'connecting'
      : 'disconnected';

  // Free trial limits & usage - STRICTLY count AI messages (AI text replies + AI voice notes)
  const isOwner = user?.email?.toLowerCase().includes('aditay') || user?.email?.toLowerCase().includes('aditya');
  const trialLimit = user?.trialLimit && user.trialLimit > 70 ? user.trialLimit : (isOwner ? 100000 : (user?.trialLimit || 70));
  const aiMessagesCount = telemetry.filter(
    (m) => Boolean(m.isBotReply) || (typeof m.id === 'string' && (m.id.startsWith('bot-') || m.id.startsWith('rem-')))
  ).length;
  const messagesUsed = aiMessagesCount;
  const trialExhausted = (user?.plan === 'free_trial' || !user?.plan) && messagesUsed >= trialLimit;

  // Sync updated AI count to localStorage
  useEffect(() => {
    if (user && user.messagesUsed !== messagesUsed) {
      setStoredUser({ ...user, messagesUsed });
    }
  }, [user, messagesUsed]);

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#161616] border border-white/[0.08] shadow-2xl text-sm animate-in fade-in slide-in-from-top-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-white/90">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/30 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar
        tab={tab}
        onTabChange={setTab}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        user={user}
        connectionStatus={sidebarConnectionStatus}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-out ${
          isSidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-[240px]'
        }`}
      >
        {/* Top Header */}
        <Header
          tab={tab}
          status={{ status: statusData.status, phone: statusData.phone }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onMobileMenuToggle={() => setIsMobileNavOpen((prev) => !prev)}
          onTabChange={setTab}
        />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {tab === 'overview' && (
            <OverviewTab
              status={statusData}
              contacts={contacts}
              telemetry={telemetry}
              reminders={remindersList}
              config={config}
              onTabChange={setTab}
            />
          )}

          {tab === 'connection' && (
            <ConnectionTab
              status={statusData}
              user={user}
              onRestart={handleRestart}
              onForceNewQr={handleForceNewQr}
              restartingSession={restartingSession}
              pairPhone={pairPhone}
              onPairPhoneChange={setPairPhone}
              onRequestPairCode={handleRequestPairCode}
              generatingCode={generatingCode}
              generatedPairCode={generatedPairCode}
            />
          )}

          {tab === 'brain' && (
            <AIBrainTab
              config={config}
              loading={loadingConfig}
              onConfigChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              onSave={handleSaveConfig}
              saving={savingConfig}
              user={user}
              onPreviewVoice={handlePreviewVoice}
              isPlayingAudio={isPlayingAudio}
              loadingAudioPreview={loadingAudioPreview}
            />
          )}

          {tab === 'vip' && (
            <VipAudienceTab
              config={config}
              onConfigChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              onSave={handleSaveConfig}
              saving={savingConfig}
              tenantId={tenantId}
            />
          )}

          {tab === 'tasks' && (
            <TasksTab
              reminders={remindersList}
              scheduledCalls={scheduledCallsList}
              leads={leadsList}
              loading={loadingReminders}
              onCreateReminder={handleCreateReminder}
              onCancelReminder={handleCancelReminder}
              creating={creatingReminder}
            />
          )}

          {tab === 'insights' && (
            <InsightsTab
              telemetry={telemetry}
              contacts={contacts}
              status={statusData}
            />
          )}

          {tab === 'billing' && (
            <BillingTab
              activePlan={user?.plan || 'free_trial'}
              messagesUsed={messagesUsed}
              trialLimit={trialLimit}
              user={user}
              onInitiatePayment={handleInitiatePayment}
              initiatingPlan={initiatingPlan}
            />
          )}

          {tab === 'settings' && (
            <SettingsTab
              user={user}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav tab={tab} onTabChange={setTab} />
    </div>
  );
}
