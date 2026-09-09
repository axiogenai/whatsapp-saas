'use client';

import { Menu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  tab: string;
  status: { status: string; phone?: string };
  onRefresh: () => void;
  refreshing: boolean;
  onMobileMenuToggle: () => void;
}

const tabTitles: Record<string, string> = {
  overview: 'Overview',
  inbox: 'Inbox',
  brain: 'AI Brain',
  tasks: 'Tasks',
  insights: 'Insights',
  billing: 'Billing',
  settings: 'Settings',
  connection: 'Connection',
};

export function Header({ tab, status, onRefresh, refreshing, onMobileMenuToggle }: HeaderProps) {
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
        {status.status === 'connected' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Connected</span>
            {status.phone && (
              <span className="text-xs text-emerald-400/50 hidden sm:inline-block">{status.phone}</span>
            )}
          </div>
        ) : status.status === 'connecting' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 font-medium">Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-xs text-white/30 font-medium">Disconnected</span>
          </div>
        )}

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
