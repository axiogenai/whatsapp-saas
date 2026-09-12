'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Volume2, Mic, Globe, Radio } from 'lucide-react';
import { ALL_VOICES, VoicePersona, getVoiceById } from '@/lib/voices';

interface VoicePickerProps {
  value: string;
  onChange: (voiceId: string) => void;
  className?: string;
}

type FilterCategory = 'all' | 'kokoro' | 'english' | 'indic' | 'european';

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
      setTimeout(() => searchInputRef.current?.focus(), 40);
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
      {/* Sleek Slim Trigger Box (Matches standard 42px input height) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[42px] flex items-center justify-between gap-2.5 bg-[#050505] hover:bg-[#0c0c0e] border border-white/[0.08] hover:border-white/[0.18] rounded-xl px-3.5 text-left transition-colors group focus:outline-none focus:border-[#25D366]/50"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Volume2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
            <span className="text-sm font-medium text-white truncate">
              {selectedVoice.name}
            </span>
            <span className="text-xs text-white/40 truncate">
              ({selectedVoice.accent || 'General'} {selectedVoice.gender || ''}{selectedVoice.style ? ` • ${selectedVoice.style}` : ''})
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-150 shrink-0 group-hover:text-white ${
            isOpen ? 'rotate-180 text-[#25D366]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0c0c0e] border border-white/[0.12] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden min-w-[320px] max-w-full">
          {/* Compact Search Header */}
          <div className="p-2.5 border-b border-white/[0.08] bg-[#070709]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search voice (e.g. Nicole, Adam, Hindi)..."
                className="w-full h-8 bg-[#141416] border border-white/[0.08] focus:border-[#25D366]/50 rounded-lg pl-8 pr-7 text-xs text-white placeholder-white/30 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/40 hover:text-white border border-transparent'
                }`}
              >
                All ({ALL_VOICES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('kokoro')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'kokoro'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/40 hover:text-white border border-transparent'
                }`}
              >
                Kokoro (54)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('english')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'english'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/40 hover:text-white border border-transparent'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('indic')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'indic'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/40 hover:text-white border border-transparent'
                }`}
              >
                Indic
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('european')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === 'european'
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                    : 'bg-white/[0.04] text-white/40 hover:text-white border border-transparent'
                }`}
              >
                European
              </button>
            </div>
          </div>

          {/* Voice List Scroll Area (Compact rows) */}
          <div className="max-h-[280px] overflow-y-auto p-1.5 space-y-2 divide-y divide-white/[0.04]">
            {filteredVoices.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-xs font-medium text-white/60">No voices found</div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-1.5 text-[11px] text-[#25D366] hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {/* Kokoro Neural Section */}
                {kokoroVoices.length > 0 && (
                  <div className="pt-0.5">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#25D366] font-medium flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 text-[#25D366]" />
                      Kokoro Neural ({kokoroVoices.length})
                    </div>
                    <div className="space-y-0.5">
                      {kokoroVoices.map((voice) => {
                        const isSelected = voice.id === value;
                        return (
                          <div
                            key={voice.id}
                            onClick={() => {
                              onChange(voice.id);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#25D366]/15 border border-[#25D366]/30 text-white'
                                : 'hover:bg-white/[0.05] border border-transparent text-white/70 hover:text-white'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-medium text-xs text-white">{voice.name}</span>
                                {voice.accent && (
                                  <span className="text-[10px] text-white/40">
                                    {voice.accent} {voice.gender || ''}
                                  </span>
                                )}
                                <span className="text-[10px] text-white/30 truncate">
                                  {voice.style || voice.id}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#25D366] stroke-[2.5] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Multilingual / Regional Section */}
                {otherVoices.length > 0 && (
                  <div className="pt-1.5">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5 text-white/40" />
                      Multilingual &amp; Regional ({otherVoices.length})
                    </div>
                    <div className="space-y-0.5">
                      {otherVoices.map((voice) => {
                        const isSelected = voice.id === value;
                        return (
                          <div
                            key={voice.id}
                            onClick={() => {
                              onChange(voice.id);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#25D366]/15 border border-[#25D366]/30 text-white'
                                : 'hover:bg-white/[0.05] border border-transparent text-white/70 hover:text-white'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-medium text-xs text-white">{voice.name}</span>
                                {voice.accent && (
                                  <span className="text-[10px] text-white/40">
                                    {voice.accent} {voice.gender || ''}
                                  </span>
                                )}
                                <span className="text-[10px] text-white/30 truncate">
                                  {voice.style || voice.id}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#25D366] stroke-[2.5] shrink-0" />
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

          {/* Minimal footer */}
          <div className="px-3 py-1.5 bg-[#070709] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/30">
            <span>{filteredVoices.length} voices</span>
            <span className="truncate max-w-[160px]">Selected: {selectedVoice.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
