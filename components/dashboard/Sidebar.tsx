'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Home, 
  QrCode,
  MessageSquare, 
  Brain, 
  Phone, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Bot,
  BookUser,
  Shield,
  Activity,
  Zap,
  Radio
} from 'lucide-react';

interface SidebarProps {
  tab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: { name: string; email: string; businessName: string; plan?: string } | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onLogout: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Command Center', icon: Home },
      { id: 'inbox', label: 'Live Inbox', icon: MessageSquare, badge: 'Live' },
      { id: 'connection', label: 'Device & QR', icon: QrCode },
    ]
  },
  {
    title: 'AI Automation',
    items: [
      { id: 'brain', label: 'AI Brain & Voice', icon: Brain },
      { id: 'vip', label: 'Audience & VIPs', icon: BookUser },
      { id: 'tasks', label: 'Tasks & Leads', icon: Phone },
    ]
  },
  {
    title: 'Platform',
    items: [
      { id: 'insights', label: 'Analytics', icon: BarChart3 },
      { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
      { id: 'settings', label: 'Settings & API', icon: Settings },
    ]
  }
];

export function Sidebar({ 
  tab, 
  onTabChange, 
  collapsed, 
  onToggleCollapse, 
  user, 
  connectionStatus, 
  onLogout 
}: SidebarProps) {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out bg-[#08090b] border-r border-white/[0.08] flex flex-col h-screen hidden md:flex shadow-2xl ${
        collapsed ? 'w-[72px]' : 'w-[256px]'
      }`}
    >
      {/* Brand & Workspace Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.06] bg-black/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366]/20 via-[#25D366]/10 to-transparent border border-[#25D366]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.15)]">
            <Bot className="w-5 h-5 text-[#25D366]" />
            <span 
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#08090b] ${
                isConnected ? 'bg-emerald-400' : isConnecting ? 'bg-amber-400 animate-ping' : 'bg-red-500'
              }`} 
            />
          </div>
          
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-wider text-white truncate">AXIOGEN</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 uppercase">
                  PRO
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/40 truncate">
                {user?.businessName || 'WhatsApp Studio'}
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-mono uppercase tracking-[0.16em] text-white/30 font-medium mb-1.5">
                {section.title}
              </h4>
            )}
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = tab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left outline-none ${
                      isActive
                        ? 'bg-gradient-to-r from-white/[0.09] to-white/[0.03] text-white border border-white/[0.1] shadow-lg shadow-black/40'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.8)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#25D366]' : 'text-white/50 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="text-xs font-medium tracking-tight truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                            isActive
                              ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30'
                              : 'bg-white/[0.06] text-white/40'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Quick Pill (Collapsed mode expander + status) */}
      {collapsed && (
        <div className="px-3 py-2 flex flex-col items-center gap-2 border-t border-white/[0.06]">
          <button
            onClick={() => onTabChange('connection')}
            title={`Status: ${connectionStatus}`}
            className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors relative"
          >
            <Radio className={`w-4 h-4 ${isConnected ? 'text-emerald-400' : 'text-white/40'}`} />
            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </button>
          
          <button
            onClick={onToggleCollapse}
            className="w-10 h-8 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Footer Profile */}
      {!collapsed && user && (
        <div className="p-3 border-t border-white/[0.06] bg-black/30">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs text-white font-semibold shrink-0 uppercase shadow-inner">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.name || 'Owner'}</div>
              <div className="text-[10px] text-white/40 font-mono truncate">{user.email || user.tenantId}</div>
            </div>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
