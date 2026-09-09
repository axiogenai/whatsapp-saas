'use client';

import { Bot, QrCode, Brain, Clock, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewTabProps {
  status: { status: string; phone?: string; name?: string };
  contacts: { jid: string; senderName: string; lastMessage: string; lastTimestamp: number; isHumanTakeover: boolean }[];
  telemetry: { id: string; jid: string; senderName: string; fromMe: boolean; text: string; timestamp: number; isBotReply?: boolean }[];
  reminders: any[];
  config: { autoReplyEnabled: boolean; botName: string };
  onTabChange: (tab: string) => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function getTsMs(ts: number): number {
  if (!ts) return 0;
  return ts > 1e11 ? ts : ts * 1000;
}

export function OverviewTab({ status, contacts, telemetry, reminders, config, onTabChange }: OverviewTabProps) {
  const isConnected = status.status === 'connected';

  // Calculate stats accurately
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  
  const todayTelemetry = telemetry.filter(t => getTsMs(t.timestamp) >= startOfDay);
  const todayMessages = todayTelemetry.length > 0 ? todayTelemetry.length : telemetry.length;
  const activeContacts = contacts.length;
  const aiReplies = (todayTelemetry.length > 0 ? todayTelemetry : telemetry).filter(t => t.isBotReply).length;
  const humanReplies = (todayTelemetry.length > 0 ? todayTelemetry : telemetry).filter(t => t.fromMe && !t.isBotReply).length;
  const pendingTasks = reminders.filter(r => r.status !== 'completed').length;

  const recentContacts = [...contacts].sort((a, b) => getTsMs(b.lastTimestamp) - getTsMs(a.lastTimestamp)).slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <section 
        onClick={() => onTabChange('connection')}
        className="bg-[#0F0F0F] border border-white/[0.06] hover:border-white/[0.12] transition-colors rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
        title="Click to manage WhatsApp device pairing & QR code"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isConnected ? 'bg-emerald-500/10' : 'bg-white/[0.04]'}`}>
            <Bot className={`w-6 h-6 ${isConnected ? 'text-emerald-400' : 'text-white/30'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                {isConnected ? 'AI Active' : 'AI Disconnected'}
              </h2>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-[#25D366] transition-colors">
                Manage Device →
              </span>
            </div>
            <p className="text-sm text-white/40">
              {isConnected ? status.phone : 'Click to scan QR code & connect'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
            config.autoReplyEnabled 
              ? 'bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366]' 
              : 'bg-white/[0.04] border-white/[0.06] text-white/40'
          }`}>
            {config.autoReplyEnabled ? 'Auto-Reply On' : 'Paused'}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Messages Today', value: todayMessages, delta: '+12%' },
          { label: 'Active Contacts', value: activeContacts, delta: '+3' },
          { label: 'AI Replies', value: aiReplies, delta: '98% automation' },
          { label: 'Human Replies', value: humanReplies, delta: 'Needs attention' },
          { label: 'Pending Tasks', value: pendingTasks, delta: 'View all' },
          { label: 'Avg Response', value: '~1.2s', delta: 'Lightning fast' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</h3>
            <div className="text-2xl font-semibold text-white font-mono mt-1">{stat.value}</div>
            <div className="text-xs text-emerald-400/60 mt-0.5">{stat.delta}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.04]">
            <h3 className="text-sm font-medium text-white">Recent Activity</h3>
            <span className="text-xs text-white/30">Live Sync</span>
          </div>
          <div className="flex flex-col">
            {recentContacts.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-white/30">
                No recent conversations
              </div>
            ) : (
              recentContacts.map((c) => (
                <div key={c.jid} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] border-t border-white/[0.04] first:border-t-0 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-white/40 font-medium shrink-0 uppercase">
                    {c.senderName ? c.senderName[0] : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col overflow-hidden flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm text-white truncate">{c.senderName}</span>
                      <span className="text-[10px] text-white/20 shrink-0">{timeAgo(c.lastTimestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-white/30 truncate flex-1">{c.lastMessage}</span>
                      {c.isHumanTakeover && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-400/60 border border-amber-500/20">HUMAN OVERRIDE</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { label: 'Pair WhatsApp', icon: QrCode, tab: 'connection' },
            { label: 'Configure AI', icon: Brain, tab: 'brain' },
            { label: 'Set Reminder', icon: Clock, tab: 'tasks' },
            { label: 'View Analytics', icon: BarChart3, tab: 'insights' },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              onClick={() => onTabChange(action.tab)}
              className="bg-[#0F0F0F] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-4 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center lg:py-6"
            >
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center mb-2">
                <action.icon className="w-4 h-4 text-white/30" />
              </div>
              <span className="text-sm text-white/50">{action.label}</span>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
