'use client';

import { Menu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  tab: string;
  status: { status: string; phone?: string };
  onRefresh: () => void;
  refreshing: boolean;
  onMobileMenuToggle: () => void;
  onTabChange?: (tab: string) => void;
}

const tabTitles: Record<string, string> = {
  overview: 'Overview',
  connection: 'Connection',
  brain: 'AI Brain',
  vip: 'Contacts & AI Control',
  tasks: 'Tasks',
  insights: 'Insights',
  billing: 'Billing',
  settings: 'Settings',
};

export function Header({ tab, status, onRefresh, refreshing, onMobileMenuToggle, onTabChange }: HeaderProps) {
  return (
    <div className="sticky top-0 z-20 h-14 px-4 md:px-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden w-9 h-9 rounded-xl hover:bg-white/[0.06] flex items-center justify-center transition-colors text-white/60 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-medium text-white">{tabTitles[tab] || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onTabChange?.('connection')}
          title="Click to view QR pairing & connection"
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          {status.status === 'connected' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Connected</span>
              {status.phone && (
                <span className="text-xs text-emerald-400/70 hidden sm:inline-block font-mono">{status.phone}</span>
              )}
            </div>
          ) : status.status === 'connecting' || status.status === 'qr_ready' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-400 font-medium">Pairing Required</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs text-white/50 font-medium">Disconnected (Pair Device)</span>
            </div>
          )}
        </button>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="w-9 h-9 rounded-xl hover:bg-white/[0.06] flex items-center justify-center transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-white/30 hover:text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}
