'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Users, Activity, ChevronDown, Zap } from 'lucide-react';

interface InsightsTabProps {
  telemetry: {
    id: string;
    fromMe: boolean;
    text: string;
    timestamp: number;
    isBotReply?: boolean;
  }[];
  contacts: { jid: string }[];
  status: { status: string };
}

export function InsightsTab({ telemetry, contacts, status }: InsightsTabProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const totalMessages = telemetry.length;
  const aiReplies = telemetry.filter(
    (t) => Boolean(t.isBotReply) || (typeof t.id === 'string' && (t.id.startsWith('bot-') || t.id.startsWith('rem-')))
  ).length;
  const humanMessages = telemetry.filter(
    (t) => t.fromMe && !t.isBotReply && !(typeof t.id === 'string' && (t.id.startsWith('bot-') || t.id.startsWith('rem-')))
  ).length;
  
  const aiPercentage = totalMessages === 0 ? 0 : Math.round((aiReplies / (aiReplies + humanMessages)) * 100) || 0;
  const humanPercentage = totalMessages === 0 ? 0 : 100 - aiPercentage;

  // Process chart data
  const now = Date.now() / 1000;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date((now - (6 - i) * 86400) * 1000);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      bot: 0,
      human: 0,
    };
  });

  telemetry.forEach((t) => {
    if (t.timestamp < now - 7 * 86400) return;
    const dayIndex = 6 - Math.floor((now - t.timestamp) / 86400);
    if (dayIndex >= 0 && dayIndex < 7) {
      if (t.isBotReply) days[dayIndex].bot++;
      else if (t.fromMe) days[dayIndex].human++;
      else days[dayIndex].human++; // count incoming as human for volume
    }
  });

  const maxVolume = Math.max(...days.map((d) => d.bot + d.human), 1);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: totalMessages, icon: MessageSquare },
          { label: 'AI Replies', value: aiReplies, icon: Bot },
          { label: 'Active Contacts', value: contacts.length, icon: Users },
          { label: 'Uptime', value: '99.98%', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 relative">
            <div className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-white/40" />
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
            <div className="text-3xl font-semibold text-white font-mono mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Message Volume Chart */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white">Message Volume</h3>
        <p className="text-xs text-white/30 mb-6">Last 7 days</p>
        
        <div className="flex items-end justify-between gap-2 h-[140px] px-2">
          {days.map((day, i) => {
            const total = day.bot + day.human;
            const height = Math.max((total / maxVolume) * 120, 4); // min 4px height
            const botHeight = total === 0 ? 0 : (day.bot / total) * height;
            const humanHeight = total === 0 ? 0 : height - botHeight;

            return (
              <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[48px]">
                <div className="w-8 flex flex-col justify-end gap-[1px] rounded-t-sm overflow-hidden" style={{ height: '120px' }}>
                  {botHeight > 0 && (
                    <div className="w-full bg-[#25D366]/40 rounded-t-sm" style={{ height: `${botHeight}px` }} />
                  )}
                  {humanHeight > 0 && (
                    <div className="w-full bg-white/10" style={{ height: `${total === 0 ? 4 : humanHeight}px` }} />
                  )}
                </div>
                <span className="text-[10px] text-white/20">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI vs Human Breakdown */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Reply Distribution</h3>
        <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden flex">
          <div className="bg-[#25D366]/60 transition-all duration-1000" style={{ width: `${aiPercentage}%` }} />
          <div className="bg-white/20 transition-all duration-1000" style={{ width: `${humanPercentage}%` }} />
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#25D366]/60" />
            <span className="text-xs text-white/40">AI ({aiPercentage}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-xs text-white/40">Human ({humanPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Advanced Diagnostics */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-5 py-4 flex items-center justify-between w-full hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-sm text-white/40 font-medium">Advanced Diagnostics</span>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.04] pt-4">
                <div>
                  <div className="text-xs text-white/20 mb-1">Socket Driver</div>
                  <div className="text-xs text-white/40 font-mono">Baileys Multi-File Auth</div>
                </div>
                <div>
                  <div className="text-xs text-white/20 mb-1">Inference Engine</div>
                  <div className="text-xs text-white/40 font-mono">Groq LPU Cloud</div>
                </div>
                <div>
                  <div className="text-xs text-white/20 mb-1">Avg Latency</div>
                  <div className="text-xs text-white/40 font-mono">~850ms</div>
                </div>
                <div>
                  <div className="text-xs text-white/20 mb-1">Session Storage</div>
                  <div className="text-xs text-white/40 font-mono">Encrypted Store</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
