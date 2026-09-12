'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Volume2, Mic, Globe, Radio } from 'lucide-react';
import { ALL_VOICES, VoicePersona, getVoiceById } from '@/lib/voices';

interface VoicePickerProps {
  value: string;
  onChange: (voiceId: string) => void;
  className?: string;
}

type FilterCategory = 'all' | 'kokoro' | 'english' | 'indic' | 'european' | 'other';

export function VoicePicker({ value, onChange, className = '' }: VoicePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current selected voice persona
  const selectedVoice: VoicePersona = useMemo(() => {
    return getVoiceById(value) || ALL_VOICES.find((v) => v.id === 'af_bella') || ALL_VOICES[0];
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter voices based on category and search query
  const filteredVoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return ALL_VOICES.filter((voice) => {
      // 1. Category Filter
      if (activeCategory === 'kokoro' && voice.engine !== 'kokoro') return false;
      if (activeCategory === 'english') {
        const acc = (voice.accent || '').toLowerCase();
        const nm = voice.name.toLowerCase();
        if (!acc.includes('american') && !acc.includes('british') && !acc.includes('english') && !nm.includes('english')) {
          return false;
        }
      }
      if (activeCategory === 'indic') {
        const acc = (voice.accent || '').toLowerCase();
        const nm = voice.name.toLowerCase();
        const id = voice.id.toLowerCase();
        const isIndic =
          acc.includes('hindi') ||
          acc.includes('marathi') ||
          acc.includes('telugu') ||
          acc.includes('tamil') ||
          acc.includes('bengali') ||
          acc.includes('gujarati') ||
          acc.includes('kannada') ||
          acc.includes('malayalam') ||
          acc.includes('punjabi') ||
          acc.includes('urdu') ||
          acc.includes('nepali') ||
          id.includes('hin') ||
          id.includes('mar') ||
          id.includes('tel') ||
          id.includes('tam') ||
          id.includes('ben') ||
          id.includes('guj') ||
          id.includes('kan') ||
          id.includes('mal') ||
          id.includes('pan') ||
          id.includes('urd') ||
          nm.includes('hindi') ||
          nm.includes('marathi') ||
          nm.includes('telugu') ||
          nm.includes('tamil');
        if (!isIndic) return false;
      }
      if (activeCategory === 'european') {
        const acc = (voice.accent || '').toLowerCase();
        const isEu =
          acc.includes('spanish') ||
          acc.includes('french') ||
          acc.includes('german') ||
          acc.includes('italian') ||
          acc.includes('portuguese') ||
          acc.includes('dutch') ||
          acc.includes('polish') ||
          acc.includes('russian');
        if (!isEu) return false;
      }
      if (activeCategory === 'other' && voice.engine === 'kokoro') return false;

      // 2. Search Query Filter
      if (!q) return true;

      const matchId = voice.id.toLowerCase().includes(q);
      const matchName = voice.name.toLowerCase().includes(q);
      const matchAccent = (voice.accent || '').toLowerCase().includes(q);
      const matchGender = (voice.gender || '').toLowerCase().includes(q);
      const matchStyle = (voice.style || '').toLowerCase().includes(q);
      const matchEngine = voice.engine.toLowerCase().includes(q);

      return matchId || matchName || matchAccent || matchGender || matchStyle || matchEngine;
    });
  }, [searchQuery, activeCategory]);

  // Group filtered voices: Kokoro first, then Piper / Meta
  const { kokoroVoices, otherVoices } = useMemo(() => {
    const k: VoicePersona[] = [];
    const o: VoicePersona[] = [];
    for (const v of filteredVoices) {
      if (v.engine === 'kokoro') {
        k.push(v);
      } else {
        o.push(v);
      }
    }
    return { kokoroVoices: k, otherVoices: o };
  }, [filteredVoices]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-[#0a0a0c] hover:bg-[#121215] border border-white/[0.1] hover:border-[#25D366]/40 rounded-xl px-3.5 py-2.5 text-left transition-all duration-150 group focus:outline-none focus:border-[#25D366]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/25 flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white tracking-wide truncate">
                {selectedVoice.name}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                  selectedVoice.engine === 'kokoro'
                    ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'
                    : 'bg-white/[0.08] text-white/70 border border-white/[0.1]'
                }`}
              >
                {selectedVoice.engine === 'kokoro' ? 'Kokoro Neural' : selectedVoice.engine.toUpperCase()}
              </span>
              {selectedVoice.accent && (
                <span className="text-[11px] text-white/50">
                  {selectedVoice.accent} {selectedVoice.gender ? `• ${selectedVoice.gender}` : ''}
                </span>
              )}
            </div>
            <div className="text-xs text-white/40 truncate mt-0.5">
              {selectedVoice.style ? selectedVoice.style : selectedVoice.id}
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-200 shrink-0 group-hover:text-white ${
            isOpen ? 'rotate-180 text-[#25D366]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0d0d10] border border-white/[0.12] rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 min-w-[320px] max-w-full">
          {/* Search Header */}
          <div className="p-3 border-b border-white/[0.08] bg-[#09090b]/80">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name (Nicole, Bella, Adam), language, accent..."
                className="w-full bg-[#151518] border border-white/[0.08] focus:border-[#25D366]/60 rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-transparent'
                }`}
              >
                All ({ALL_VOICES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('kokoro')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'kokoro'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-transparent'
                }`}
              >
                Kokoro Neural (54)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('english')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'english'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-transparent'
                }`}
              >
                English (US/UK)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('indic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'indic'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-transparent'
                }`}
              >
                Indian / Indic
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('european')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'european'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-transparent'
                }`}
              >
                European
              </button>
            </div>
          </div>

          {/* Voice List Scroll Area */}
          <div className="max-h-[340px] overflow-y-auto p-2 space-y-3 divide-y divide-white/[0.04]">
            {filteredVoices.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-2 text-white/30">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-white/70">No voices found</div>
                <div className="text-xs text-white/40 mt-0.5">
                  Try searching for &quot;nicole&quot;, &quot;bella&quot;, &quot;adam&quot;, or &quot;hindi&quot;
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-3 text-xs text-[#25D366] hover:underline"
                >
                  Clear search &amp; filters
                </button>
              </div>
            ) : (
              <>
                {/* Kokoro Neural Section */}
                {kokoroVoices.length > 0 && (
                  <div className="pt-1 first:pt-0">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#25D366] font-semibold flex items-center gap-1.5 mb-1">
                      <Radio className="w-3 h-3 text-[#25D366]" />
                      Kokoro Ultra-Neural ({kokoroVoices.length})
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {kokoroVoices.map((voice) => {
                        const isSelected = voice.id === value;
                        return (
                          <div
                            key={voice.id}
                            onClick={() => {
                              onChange(voice.id);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'bg-[#25D366]/15 border border-[#25D366]/40 text-white'
                                : 'hover:bg-white/[0.06] border border-transparent text-white/80 hover:text-white'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">{voice.name}</span>
                                {voice.accent && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">
                                    {voice.accent} {voice.gender || ''}
                                  </span>
                                )}
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono text-[#25D366]/80 bg-[#25D366]/10">
                                  Neural
                                </span>
                              </div>
                              <div className="text-xs text-white/40 truncate mt-0.5">
                                {voice.style || voice.id}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-black stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Other Engines Section (Piper / Meta) */}
                {otherVoices.length > 0 && (
                  <div className="pt-2">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5 mb-1">
                      <Globe className="w-3 h-3 text-white/40" />
                      Multilingual &amp; Regional Voices ({otherVoices.length})
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {otherVoices.map((voice) => {
                        const isSelected = voice.id === value;
                        return (
                          <div
                            key={voice.id}
                            onClick={() => {
                              onChange(voice.id);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'bg-[#25D366]/15 border border-[#25D366]/40 text-white'
                                : 'hover:bg-white/[0.06] border border-transparent text-white/80 hover:text-white'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">{voice.name}</span>
                                {voice.accent && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">
                                    {voice.accent} {voice.gender || ''}
                                  </span>
                                )}
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono text-white/50 bg-white/[0.06]">
                                  {voice.engine.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-xs text-white/40 truncate mt-0.5">
                                {voice.style || voice.id}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-black stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer count indicator */}
          <div className="px-3 py-2 bg-[#09090b] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
            <span>Showing {filteredVoices.length} of {ALL_VOICES.length} voices</span>
            <span>Selected: {selectedVoice.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
