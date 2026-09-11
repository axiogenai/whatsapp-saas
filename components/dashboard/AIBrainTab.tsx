'use client';

import { 
  Briefcase, 
  Headphones, 
  Stethoscope, 
  Building2, 
  Coffee, 
  Settings2, 
  Play, 
  Square, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TenantBotConfig } from '@/lib/types';

interface AIBrainTabProps {
  config: TenantBotConfig;
  onConfigChange: (updates: Partial<TenantBotConfig>) => void;
  onSave: () => void;
  saving: boolean;
  loading?: boolean;
  user: { name: string; businessName: string } | null;
  onPreviewVoice: () => void;
  isPlayingAudio: boolean;
  loadingAudioPreview: boolean;
}

const templates = [
  { id: 'founder', label: 'Founder', icon: Briefcase },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'realestate', label: 'Real Estate', icon: Building2 },
  { id: 'hospitality', label: 'Hospitality', icon: Coffee },
  { id: 'custom', label: 'Custom', icon: Settings2 },
];

const voiceModes: {
  id: NonNullable<TenantBotConfig['voiceReplyMode']>;
  label: string;
  desc: string;
  badge?: string;
}[] = [
  { id: 'first_two_voice', label: 'First Two Voice', desc: 'First 2 replies as voice, then text', badge: 'Recommended' },
  { id: 'always', label: 'Always Voice', desc: 'Every reply as voice note' },
  { id: 'adaptive', label: 'Adaptive', desc: 'Voice when they send voice' },
  { id: 'text_only', label: 'Text Only', desc: 'Never send voice' },
];

export function AIBrainTab({
  config,
  onConfigChange,
  onSave,
  saving,
  loading = false,
  onPreviewVoice,
  isPlayingAudio,
  loadingAudioPreview
}: AIBrainTabProps) {
  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-white/40">
        <Loader2 className="w-8 h-8 animate-spin text-[#25D366] mb-3" />
        <p className="text-sm font-medium text-white/70">Loading AI Brain configuration...</p>
        <p className="text-xs text-white/30 mt-1">Retrieving persistent prompt, voice settings, and parameters</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 pb-24 md:pb-6">
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Auto-Reply</h3>
          <p className="text-xs text-white/30">Allow AI to respond to incoming messages automatically</p>
        </div>
        <button
          onClick={() => onConfigChange({ autoReplyEnabled: !config.autoReplyEnabled })}
          className={`relative w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
            config.autoReplyEnabled ? 'bg-[#25D366]' : 'bg-white/[0.08]'
          }`}
        >
          <motion.div
            layout
            className="w-5 h-5 rounded-full bg-white shadow"
            animate={{
              x: config.autoReplyEnabled ? 20 : 0
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </section>

      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-1">Personality & Prompt</h2>
        <p className="text-xs text-white/30 mb-5">Define how your AI assistant communicates</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`px-3 py-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                t.id === 'custom' // Mock active state for visual
                  ? 'bg-[#25D366]/10 border-[#25D366]/30 text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.12]'
              }`}
            >
              <t.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-[10px] sm:text-xs font-medium">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">System Prompt</label>
            <textarea
              rows={8}
              value={config.systemPrompt}
              onChange={(e) => onConfigChange({ systemPrompt: e.target.value })}
              className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-4 text-sm text-white/80 outline-none focus:border-[#25D366]/50 transition-colors resize-none font-sans"
              placeholder="You are a helpful AI assistant..."
            />
            <div className="text-[11px] text-white/20 mt-1 text-right">
              {config.systemPrompt?.length || 0} characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Assistant Name</label>
              <input
                type="text"
                value={config.botName || ''}
                onChange={(e) => onConfigChange({ botName: e.target.value })}
                className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors"
                placeholder="e.g. Sarah"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">AI Model</label>
              <select
                value={config.groqModel || 'openai/gpt-oss-120b'}
                onChange={(e) => onConfigChange({ groqModel: e.target.value })}
                className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors appearance-none"
              >
                <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Recommended)</option>
                <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-1">Voice Settings</h2>
        <p className="text-xs text-white/30 mb-5">Control how your AI sounds on voice notes</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {voiceModes.map((mode) => {
            const isSelected = config.voiceReplyMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => onConfigChange({ voiceReplyMode: mode.id })}
                className={`px-3 py-3 rounded-xl border text-left cursor-pointer transition-all relative ${
                  isSelected
                    ? 'bg-[#25D366]/10 border-[#25D366]/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {mode.badge && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#25D366] text-[#050505] text-[9px] font-bold rounded uppercase tracking-wider">
                    {mode.badge}
                  </span>
                )}
                <div className="text-xs font-medium text-white mb-0.5">{mode.label}</div>
                <div className="text-[10px] text-white/40">{mode.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Voice Persona</label>
            <div className="flex gap-2">
              <select
                value={config.voicePersona || 'af_bella'}
                onChange={(e) => onConfigChange({ voicePersona: e.target.value })}
                className="flex-1 bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors appearance-none"
              >
                <option value="am_adam">Adam - Tech Founder</option>
                <option value="af_bella">Bella - Warm Support</option>
                <option value="af_sarah">Sarah - Professional</option>
                <option value="bf_emma">Emma - British</option>
                <option value="bm_george">George - British</option>
              </select>
              <button
                onClick={onPreviewVoice}
                disabled={loadingAudioPreview}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] rounded-xl text-white transition-colors flex items-center justify-center min-w-[44px]"
                title="Preview Voice"
              >
                {loadingAudioPreview ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                ) : isPlayingAudio ? (
                  <Square className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                ) : (
                  <Play className="w-4 h-4 text-white/70 fill-white/70" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-medium text-white/50 mb-1.5">
              <span>Speed</span>
              <span className="text-white/80 font-mono">{config.voiceSpeed || 1.0}x</span>
            </label>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.1"
              value={config.voiceSpeed || 1.0}
              onChange={(e) => onConfigChange({ voiceSpeed: parseFloat(e.target.value) })}
              className="w-full accent-[#25D366] h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>0.8x</span>
              <span>1.0x</span>
              <span>1.3x</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4">Behavior Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Human Takeover Cooldown</label>
            <select
              value={config.humanTakeoverCooldownMinutes || 15}
              onChange={(e) => onConfigChange({ humanTakeoverCooldownMinutes: parseInt(e.target.value) })}
              className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors appearance-none"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Typing Speed</label>
            <select
              value={config.typingDelayMinMs === 500 ? 'fast' : config.typingDelayMinMs === 1500 ? 'slow' : 'natural'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'fast') onConfigChange({ typingDelayMinMs: 500, typingDelayMaxMs: 1000 });
                else if (val === 'slow') onConfigChange({ typingDelayMinMs: 1500, typingDelayMaxMs: 3500 });
                else onConfigChange({ typingDelayMinMs: 800, typingDelayMaxMs: 2200 });
              }}
              className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors appearance-none"
            >
              <option value="fast">Fast (0.5s - 1s)</option>
              <option value="natural">Natural (0.8s - 2.2s)</option>
              <option value="slow">Slow (1.5s - 3.5s)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Read Delay</label>
            <select
              value={config.debounceWaitMs || 5000}
              onChange={(e) => onConfigChange({ debounceWaitMs: parseInt(e.target.value) })}
              className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors appearance-none"
            >
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
              <option value={7000}>7 seconds</option>
              <option value={10000}>10 seconds</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end mt-6 sticky md:relative bottom-4 md:bottom-0 z-10 pt-4 md:pt-0 bg-[#050505] md:bg-transparent">
        <button
          onClick={onSave}
          disabled={saving || loading}
          className="bg-[#25D366] hover:bg-[#22c55e] text-[#050505] h-11 px-6 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-[#25D366]/20 w-full md:w-auto justify-center"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
