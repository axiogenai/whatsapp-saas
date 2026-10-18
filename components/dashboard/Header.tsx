'use client';

import { Menu, RefreshCw, Radio, Zap, Shield, ChevronRight } from 'lucide-react';

interface HeaderProps {
  tab: string;
  status: { status: string; phone?: string };
  onRefresh: () => void;
  refreshing: boolean;
  onMobileMenuToggle: () => void;
  onTabChange?: (tab: string) => void;
  autoReplyEnabled?: boolean;
  onToggleAutoReply?: () => void;
}

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Command Center', subtitle: 'Live telemetry & WhatsApp copilot controls' },
  inbox: { title: 'Live Inbox', subtitle: 'Real-time conversation stream & human overrides' },
  connection: { title: 'Device & QR Pairing', subtitle: 'Secure WhatsApp Linked Devices pairing' },
  brain: { title: 'AI Brain & Voice Studio', subtitle: 'System prompt, neural voices & model parameters' },
  vip: { title: 'Audience & VIP Controls', subtitle: 'Filter allowlists, VIP routing & blocked numbers' },
  tasks: { title: 'Tasks & Lead Hub', subtitle: 'Automated follow-ups, calls & captured leads' },
  insights: { title: 'Analytics & Telemetry', subtitle: 'Message volume, response times & automation rates' },
  billing: { title: 'Plan & Quota', subtitle: 'Message limits, subscription tier & payment' },
  settings: { title: 'Settings & REST API', subtitle: 'Developer endpoints, webhooks & workspace profile' },
};

export function Header({ 
  tab, 
  status, 
  onRefresh, 
  refreshing, 
  onMobileMenuToggle, 
  onTabChange,
  autoReplyEnabled,
  onToggleAutoReply
}: HeaderProps) {
  const currentTabInfo = tabTitles[tab] || { title: 'Dashboard', subtitle: 'Manage your WhatsApp automation' };
  const isConnected = status.status === 'connected';
  const isConnecting = status.status === 'connecting' || status.status === 'qr_ready';

  return (
    <header className="sticky top-0 z-20 h-16 px-4 md:px-6 bg-[#070809]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-colors text-white/70 hover:text-white"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40 hidden sm:inline-block font-mono uppercase tracking-wider">Axiogen</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/20 hidden sm:inline-block" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white tracking-tight leading-none">
              {currentTabInfo.title}
            </h1>
            <span className="text-[11px] text-white/40 hidden lg:inline-block leading-tight mt-0.5">
              {currentTabInfo.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Optional Auto-Reply Toggle */}
        {onToggleAutoReply && (
          <button
            onClick={onToggleAutoReply}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              autoReplyEnabled
                ? 'bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/15'
                : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70'
            }`}
            title="Toggle Global Auto-Reply"
          >
            <Zap className={`w-3.5 h-3.5 ${autoReplyEnabled ? 'text-[#25D366] fill-[#25D366]' : ''}`} />
            <span>{autoReplyEnabled ? 'AI Active' : 'AI Paused'}</span>
          </button>
        )}

        {/* WhatsApp Connection Badge Button */}
        <button
          type="button"
          onClick={() => onTabChange?.('connection')}
          title="Click to view QR pairing & device status"
          className="cursor-pointer group outline-none"
        >
          {isConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 group-hover:border-emerald-500/50 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">WhatsApp Connected</span>
              {status.phone && (
                <span className="text-xs text-emerald-400/70 hidden md:inline-block font-mono">
                  {status.phone}
                </span>
              )}
            </div>
          ) : isConnecting ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 group-hover:border-amber-500/50 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-xs text-amber-400 font-medium">Pairing Required</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 group-hover:border-red-500/50 transition-colors">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs text-red-400 font-medium">Device Disconnected</span>
            </div>
          )}
        </button>

        {/* Refresh Telemetry */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-center text-white/60 hover:text-white transition-all disabled:opacity-50"
          title="Refresh Live Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#25D366]' : ''}`} />
        </button>
      </div>
    </header>
  );
}
