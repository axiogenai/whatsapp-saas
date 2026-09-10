'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Zap,
  Mic,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  CheckCheck,
  Calendar,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Eye,
  Check,
} from 'lucide-react';

type Tab = 'Dashboard' | 'AI Studio' | 'Live Activity' | 'Tasks' | 'Analytics';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

  const tabs: { id: Tab; label: string; descriptionTitle: string; description: string }[] = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      descriptionTitle: 'Your AI command center',
      description: 'See everything at a glance — messages, contacts, activity, and quick actions.',
    },
    {
      id: 'AI Studio',
      label: 'AI Studio',
      descriptionTitle: 'Train your assistant',
      description: 'Set personality templates, voice settings, and custom prompts.',
    },
    {
      id: 'Live Activity',
      label: 'Live Activity',
      descriptionTitle: 'Audit real-time replies',
      description: 'Stream incoming WhatsApp events, voice note transcriptions, and human takeover moments.',
    },
    {
      id: 'Tasks',
      label: 'Tasks',
      descriptionTitle: 'Automated actions',
      description: 'Reminders, follow-ups, and scheduled calls managed by AI.',
    },
    {
      id: 'Analytics',
      label: 'Analytics',
      descriptionTitle: 'Performance insights',
      description: 'Track messages handled, response times, and conversation volume.',
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="py-[120px] max-w-6xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          PRODUCT
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Built for your daily workflow
        </h2>
      </div>

      {/* Tab Selectors */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm px-4 py-2 transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-[#25D366] font-medium'
                : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* macOS Window Container */}
      <div className="mt-8">
        <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
          {/* Top window frame bar */}
          <div className="h-10 bg-[#141414] border-b border-white/[0.06] flex items-center px-4 gap-2 relative select-none">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-70"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-70"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/30 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              app.axiogen.com/{activeTab.toLowerCase().replace(' ', '-')}
            </div>
          </div>

          {/* Interactive Screen Mockup Area */}
          <div className="bg-[#0b0c0e] min-h-[440px] sm:min-h-[480px] p-4 sm:p-6 overflow-hidden relative text-left select-none">
            <AnimatePresence mode="wait">
              {/* 1. DASHBOARD TAB */}
              {activeTab === 'Dashboard' && (
                <motion.div
                  key="Dashboard"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Workspace status bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">Aditya Patil</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] font-mono border border-[#25D366]/20">
                            Autopilot Active
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">+91 ••••• ••704 • Personal WhatsApp Linked</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">Takeover Buffer:</span>
                      <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                        15 mins
                      </span>
                    </div>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total AI Replies', val: '14,820', change: '+18.4%', changeColor: 'text-emerald-400' },
                      { label: 'Autopilot Ratio', val: '94.6%', change: 'Uninterrupted', changeColor: 'text-[#25D366]' },
                      { label: 'Voice Notes Handled', val: '1,280', change: 'Whisper AI', changeColor: 'text-sky-400' },
                      { label: 'Median Latency', val: '1.12s', change: 'Edge LLM', changeColor: 'text-amber-400' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#121318] border border-white/[0.06] rounded-xl p-3 sm:p-3.5">
                        <p className="text-[11px] text-white/40">{stat.label}</p>
                        <p className="text-lg sm:text-xl font-bold text-white mt-1">{stat.val}</p>
                        <p className={`text-[10px] font-mono mt-1 ${stat.changeColor}`}>{stat.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Split Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Recent Chats Feed */}
                    <div className="md:col-span-3 bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                        <span className="text-xs font-semibold text-white/80">Live WhatsApp Conversations</span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Streaming
                        </span>
                      </div>
                      {[
                        {
                          name: 'Aditya P.',
                          text: 'Hey, can you confirm the project deliverable schedule?',
                          reply: 'Deliverables scheduled for Friday 2:00 PM.',
                          time: 'Just now',
                          badge: 'Voice Transcribed',
                        },
                        {
                          name: 'Priya K.',
                          text: 'Can we schedule a call tomorrow afternoon?',
                          reply: 'He will be available after 1:30 PM — slot confirmed.',
                          time: '4m ago',
                          badge: 'Autopilot',
                        },
                        {
                          name: 'Amit S.',
                          text: 'Thanks! The invoice payment was initiated.',
                          reply: 'Receipt acknowledged. Sending over confirmation note.',
                          time: '14m ago',
                          badge: 'Vision Invoice',
                        },
                      ].map((chat, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white">{chat.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">
                                {chat.badge}
                              </span>
                              <span className="text-[10px] text-white/30">{chat.time}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-white/50 truncate">Incoming: {chat.text}</p>
                          <p className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1 mt-0.5">
                            <CheckCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            AI: {chat.reply}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Quick Settings & Controls */}
                    <div className="md:col-span-2 bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 flex flex-col justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-white/80 block pb-2 border-b border-white/[0.05]">
                          Autopilot Engine
                        </span>
                        <div className="space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-white">Master Kill Switch</p>
                              <p className="text-[10px] text-white/40">Instant global override</p>
                            </div>
                            <div className="w-8 h-4 rounded-full bg-[#25D366] relative flex items-center px-0.5 cursor-pointer">
                              <div className="w-3 h-3 rounded-full bg-black ml-auto"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-white">Voice Note AI</p>
                              <p className="text-[10px] text-white/40">Whisper multilingual</p>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                              ON
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-white">Image OCR & Vision</p>
                              <p className="text-[10px] text-white/40">Invoices & receipts</p>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                              ON
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-snug">
                        ⚡ Human takeover triggered automatically when you reply from WhatsApp app.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. AI STUDIO TAB */}
              {activeTab === 'AI Studio' && (
                <motion.div
                  key="AI Studio"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Persona & Tone Training</h4>
                      <p className="text-xs text-white/40 mt-0.5">Customize how AI represents you on WhatsApp</p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                      Model: Llama 3.3 70B
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prompt Box */}
                    <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#25D366]">system_prompt.md</span>
                        <span className="text-[10px] text-white/30">Synced</span>
                      </div>
                      <div className="font-mono text-[11px] text-white/70 bg-[#090a0d] p-3 rounded-lg border border-white/[0.04] space-y-1.5 leading-relaxed overflow-hidden">
                        <p className="text-[#25D366]"># Role & Personality</p>
                        <p>You are Aditya&apos;s executive AI assistant on his personal WhatsApp.</p>
                        <p className="text-white/40 mt-1"># Rules & Behavioral Limits</p>
                        <p>1. Reply concisely in 1-2 sentences. Avoid generic filler.</p>
                        <p>2. If someone asks for meeting slots, offer times after 1:30 PM.</p>
                        <p>3. If Aditya sends a message himself, mute for 15 minutes.</p>
                        <p>4. Transcribe incoming voice notes in Hindi, English, Marathi.</p>
                      </div>
                    </div>

                    {/* Controls & Simulator */}
                    <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 flex flex-col justify-between gap-3">
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-white/80 block pb-2 border-b border-white/[0.05]">
                          Language & Audio Rules
                        </span>
                        <div>
                          <p className="text-xs text-white/50 mb-1.5">Primary Languages</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['English (US/UK)', 'Hinglish (India)', 'Hindi', 'Marathi'].map((lang) => (
                              <span key={lang} className="text-[10px] px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white/80 font-mono">
                                ✓ {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1.5">Response Style</p>
                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                            <span className="p-1.5 rounded bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]">Concise</span>
                            <span className="p-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/60">Executive</span>
                            <span className="p-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/60">Technical</span>
                          </div>
                        </div>
                      </div>

                      {/* Playground Preview */}
                      <div className="p-2.5 rounded-lg bg-[#090a0d] border border-white/[0.05]">
                        <p className="text-[10px] text-white/30 uppercase font-mono mb-1">Live Simulator Test</p>
                        <p className="text-xs text-white/60">User: &ldquo;Are you free for lunch tomorrow?&rdquo;</p>
                        <p className="text-xs text-[#25D366] font-medium mt-1">
                          AI: &ldquo;Aditya is in meetings until 1:30 PM. Would 2:00 PM work for you?&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. LIVE ACTIVITY TAB */}
              {activeTab === 'Live Activity' && (
                <motion.div
                  key="Live Activity"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
                      <h4 className="text-sm font-semibold text-white">Real-Time Event Audit Stream</h4>
                    </div>
                    <span className="text-[11px] font-mono text-white/40">Audit ID: #WA-88492</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        time: '10:44:12 AM',
                        type: 'VOICE TRANSCRIPTION',
                        color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
                        desc: 'Incoming voice note from Aditya P. (0:14)',
                        detail: 'Transcribed: "Hey, please send the quotation for mobile app development."',
                        action: '⚡ AI responded in 1.1s with PDF overview & pricing link',
                      },
                      {
                        time: '10:38:00 AM',
                        type: 'HUMAN TAKE OVER',
                        color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                        desc: 'Aditya typed manually from WhatsApp iPhone app',
                        detail: 'Instant override initiated: AI muted for 15 minutes on chat thread #9842',
                        action: '⏸️ Auto-pilot paused seamlessly — zero AI message collision',
                      },
                      {
                        time: '10:22:15 AM',
                        type: 'MULTIMODAL OCR',
                        color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                        desc: 'Screenshot received from Client',
                        detail: 'Vision engine identified Payment Transfer Receipt (Ref: UPI/48291)',
                        action: '✓ Payment acknowledged & marked in CRM tasks',
                      },
                      {
                        time: '10:05:00 AM',
                        type: 'HEARTBEAT SYNC',
                        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                        desc: 'WhatsApp Linked Devices ping check',
                        detail: 'Socket connection: 100% healthy, latency: 14ms',
                        action: '🟢 Ready for incoming messages',
                      },
                    ].map((evt, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#121318] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${evt.color}`}>
                              {evt.type}
                            </span>
                            <span className="text-xs font-semibold text-white">{evt.desc}</span>
                          </div>
                          <p className="text-[11px] text-white/50">{evt.detail}</p>
                          <p className="text-[11px] text-white/80 font-medium">{evt.action}</p>
                        </div>
                        <span className="text-[10px] font-mono text-white/30 shrink-0 self-start sm:self-center">
                          {evt.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 4. TASKS TAB */}
              {activeTab === 'Tasks' && (
                <motion.div
                  key="Tasks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Automated Actions & Follow-ups</h4>
                      <p className="text-xs text-white/40 mt-0.5">Tasks scheduled and executed by your WhatsApp AI</p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                      4 Active Tasks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: 'Follow up with Priya regarding contract review',
                        due: 'Tomorrow, 10:00 AM IST',
                        status: 'Scheduled',
                        type: 'Auto WhatsApp Ping',
                        badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                      },
                      {
                        title: 'Send invoice #1042 payment gateway link',
                        due: 'Executed at 10:24 AM',
                        status: 'Completed',
                        type: 'Instant Action',
                        badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                      },
                      {
                        title: 'Schedule technical discovery call with Amit',
                        due: 'Calendar slot reserved',
                        status: 'Synced',
                        type: 'Google Calendar API',
                        badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
                      },
                      {
                        title: 'Extract new client contacts to Supabase CRM',
                        due: 'Real-time database sync',
                        status: 'Active',
                        type: 'CRM Extraction',
                        badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                      },
                    ].map((task, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-[#121318] border border-white/[0.06] flex flex-col justify-between gap-2.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${task.badgeColor}`}>
                              {task.status}
                            </span>
                            <span className="text-[10px] text-white/30 font-mono">{task.type}</span>
                          </div>
                          <p className="text-xs font-semibold text-white leading-snug">{task.title}</p>
                        </div>
                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-white/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white/30" />
                            {task.due}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 5. ANALYTICS TAB */}
              {activeTab === 'Analytics' && (
                <motion.div
                  key="Analytics"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Conversation Analytics & Efficiency</h4>
                      <p className="text-xs text-white/40 mt-0.5">Live metrics across personal WhatsApp chats</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">48.2 Hours Saved This Month</span>
                  </div>

                  {/* Visual Chart & Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Weekly Bar Chart */}
                    <div className="md:col-span-2 bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/80">Message Volume (Last 7 Days)</span>
                        <span className="text-[10px] font-mono text-[#25D366]">+22.4% vs last week</span>
                      </div>
                      <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                        {[
                          { day: 'Mon', height: '65%', count: '2.1k' },
                          { day: 'Tue', height: '82%', count: '2.8k' },
                          { day: 'Wed', height: '94%', count: '3.4k' },
                          { day: 'Thu', height: '78%', count: '2.6k' },
                          { day: 'Fri', height: '100%', count: '3.9k' },
                          { day: 'Sat', height: '52%', count: '1.8k' },
                          { day: 'Sun', height: '40%', count: '1.2k' },
                        ].map((col, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                            <span className="text-[9px] font-mono text-white/40 group-hover:text-white transition-colors">
                              {col.count}
                            </span>
                            <div
                              style={{ height: col.height }}
                              className="w-full rounded-t-md bg-[#25D366]/40 group-hover:bg-[#25D366] transition-all duration-300"
                            ></div>
                            <span className="text-[10px] font-mono text-white/40">{col.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-[#121318] border border-white/[0.06] rounded-xl p-3.5 flex flex-col justify-between">
                      <span className="text-xs font-semibold text-white/80 pb-2 border-b border-white/[0.05]">
                        Message Channels
                      </span>
                      <div className="space-y-2.5 my-2">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-white/60">Text Chats</span>
                            <span className="text-white font-mono">68%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full bg-[#25D366] w-[68%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-white/60">Voice Notes (Whisper)</span>
                            <span className="text-white font-mono">23%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full bg-sky-400 w-[23%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-white/60">Images & Invoices</span>
                            <span className="text-white font-mono">9%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                            <div className="h-full bg-purple-400 w-[9%]"></div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/[0.04] text-[10px] text-white/40 flex justify-between">
                        <span>Speed: 1.12s avg</span>
                        <span className="text-emerald-400">99.4% Accuracy</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tab Description Footnote */}
        <div className="mt-6 text-center h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-base font-semibold text-white">
                {activeTabData?.descriptionTitle}
              </h3>
              <p className="text-sm text-white/50 mt-1 max-w-lg mx-auto">
                {activeTabData?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
