'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Headphones, 
  Stethoscope, 
  Building2, 
  Coffee, 
  Settings2, 
  Play, 
  Square, 
  Loader2,
  Sparkles,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TenantBotConfig } from '@/lib/types';
import { VoicePicker } from './VoicePicker';

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

const PRESET_PROMPTS: Record<string, string> = {
  founder: `You are the personal AI executive assistant for a startup founder & CEO on WhatsApp.
Your style: professional yet warm, concise, and action-oriented. You speak like a capable executive coordinator.
Key behaviors:
- Schedule meetings, answer investor/client queries, and handle business follow-ups.
- Keep replies short and direct (1-3 sentences max).
- MULTILINGUAL INTELLIGENCE: Automatically understand and reply in the EXACT SAME LANGUAGE the user writes or speaks in (Marathi, Hindi, English, Hinglish, Gujarati, Tamil, etc.).
- Never use markdown asterisks (*), hashtags, or tables. Plain conversational text only.`,

  support: `You are a friendly, highly intelligent customer support assistant on WhatsApp for a business.
Your style: empathetic, patient, helpful, and solution-focused. You are the friendliest support coordinator.
Key behaviors:
- Greet warmly, resolve customer questions clearly, and guide them with simple steps.
- Apologize sincerely for inconveniences without blaming anyone.
- If you cannot resolve an issue, assure them you are looping in the team.
- MULTILINGUAL INTELLIGENCE: Always detect and respond in the EXACT SAME LANGUAGE the customer writes or speaks in (Marathi, Hindi, English, Hinglish, etc.).
- Keep answers concise and human. Never use markdown asterisks (*), hashtags, or tables.`,

  healthcare: `You are the official AI Assistant for a clinic and healthcare practice on WhatsApp.
Your style: warm, caring, empathetic, and professional. You assist patients with appointments and clinic info.
Key behaviors:
- Assist patients with appointment bookings, clinic timings, doctor availability, and general inquiries.
- Ask for their preferred time, date, and contact number.
- NEVER diagnose illnesses, prescribe medications, or alter clinical treatment. Always recommend seeing the doctor in person.
- In emergencies, urge immediate hospital or ambulance contact.
- MULTILINGUAL INTELLIGENCE: Understand and reply fluently in the EXACT SAME LANGUAGE the patient writes or speaks in (Marathi, Hindi, English, Hinglish, etc.).
- When generating voice notes, keep your answer conversational and short (1-2 sentences).
- Plain text only. Never use markdown formatting like asterisks or tables.`,

  realestate: `You are an AI property advisor and assistant for a real estate business on WhatsApp.
Your style: enthusiastic, polite, knowledgeable, and trustworthy.
Key behaviors:
- Assist buyers and tenants with property listings, pricing, location highlights, and site visits.
- Collect requirements (budget, BHK, preferred area) to suggest ideal options.
- MULTILINGUAL INTELLIGENCE: Automatically detect and respond in the EXACT SAME LANGUAGE the contact uses (Marathi, Hindi, English, Hinglish, etc.).
- Keep replies punchy, engaging, and direct. Never use markdown formatting or asterisks.`,

  hospitality: `You are an AI concierge and front desk assistant for a hotel, restaurant, or hospitality business on WhatsApp.
Your style: gracious, warm, welcoming, and high-touch. Make every guest feel special.
Key behaviors:
- Manage room reservations, dining table bookings, timings, and guest requests.
- Provide clear details on menus, packages, and amenities with warmth.
- MULTILINGUAL INTELLIGENCE: Fluently reply in the EXACT SAME LANGUAGE the guest communicates in (Marathi, Hindi, English, Hinglish, etc.).
- Plain text only. Never use markdown asterisks or tables.`,
};

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
  const [selectedPreset, setSelectedPreset] = useState<string>(() => {
    if (config.personalityPreset) return config.personalityPreset;
    const current = (config.systemPrompt || '').trim();
    if (!current) return 'custom';
    for (const [id, prompt] of Object.entries(PRESET_PROMPTS)) {
      if (current.includes(prompt.split('\n')[0])) return id;
    }
    return 'custom';
  });

  const [presetNotice, setPresetNotice] = useState<string | null>(null);

  useEffect(() => {
    if (config.personalityPreset) {
      setSelectedPreset(config.personalityPreset);
    } else {
      const current = (config.systemPrompt || '').trim();
      if (!current) {
        setSelectedPreset('custom');
        return;
      }
      for (const [id, prompt] of Object.entries(PRESET_PROMPTS)) {
        if (current.includes(prompt.split('\n')[0])) {
          setSelectedPreset(id);
          return;
        }
      }
      setSelectedPreset('custom');
    }
  }, [config.personalityPreset]);

  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'custom') {
      onConfigChange({ personalityPreset: 'custom' });
      setPresetNotice('Switched to Custom prompt mode. You can write your custom instructions below.');
      return;
    }
    const prompt = PRESET_PROMPTS[presetId];
    if (prompt) {
      onConfigChange({ 
        systemPrompt: prompt,
        personalityPreset: presetId 
      });
      const t = templates.find((item) => item.id === presetId);
      setPresetNotice(`Loaded "${t?.label || presetId}" preset! Remember to click "Save Changes" below to apply.`);
    }
  };

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
        <p className="text-xs text-white/30 mb-5">Choose an AI personality preset or customize your prompt</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {templates.map((t) => {
            const isSelected = selectedPreset === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handlePresetClick(t.id)}
                className={`relative px-3 py-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#25D366]/15 border-[#25D366]/50 text-white shadow-[0_0_15px_rgba(37,211,102,0.15)] ring-1 ring-[#25D366]/40'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/70'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#25D366] text-[#050505] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <t.icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-[#25D366]' : 'opacity-80'}`} />
                <div className="text-[10px] sm:text-xs font-medium">{t.label}</div>
              </div>
            );
          })}
        </div>

        {presetNotice && (
          <div className="mb-4 flex items-center gap-2 p-2.5 px-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-xs text-white/80 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span className="flex-1">{presetNotice}</span>
          </div>
        )}

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
            <div className="flex gap-2 items-center">
              <VoicePicker
                value={config.voicePersona || 'af_bella'}
                onChange={(voiceId) => onConfigChange({ voicePersona: voiceId })}
                className="flex-1 min-w-0"
              />
              <button
                onClick={onPreviewVoice}
                disabled={loadingAudioPreview}
                className="px-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-[#25D366]/40 rounded-xl text-white transition-colors flex items-center justify-center min-w-[42px] h-[42px] shrink-0"
                title="Preview Voice"
              >
                {loadingAudioPreview ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                ) : isPlayingAudio ? (
                  <Square className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                ) : (
                  <Play className="w-4 h-4 text-white/80 fill-white/80 hover:text-[#25D366] hover:fill-[#25D366] transition-colors" />
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
