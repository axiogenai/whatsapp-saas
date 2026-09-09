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
  Bot 
} from 'lucide-react';

interface SidebarProps {
  tab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: { name: string; email: string; businessName: string } | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onLogout: () => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'connection', label: 'Connection', icon: QrCode },
  { id: 'inbox', label: 'Inbox', icon: MessageSquare },
  { id: 'brain', label: 'AI Brain', icon: Brain },
  { id: 'tasks', label: 'Tasks', icon: Phone },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
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
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-[#25D366]';
      case 'connecting': return 'bg-amber-400';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-white/[0.2]';
    }
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-30 transition-all duration-200 ease-out bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col h-screen hidden md:flex ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
      <div className="p-4 flex items-center gap-3">
        <Bot className="w-7 h-7 text-[#25D366] shrink-0" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider text-white">AXIOGEN</span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          </div>
        )}
      </div>

      <nav className="flex-1 py-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = tab === item.id;
          const Icon = item.icon;
          
          return (
            <div
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer relative ${
                isActive 
                  ? 'bg-white/[0.06] text-white' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-0.5 h-5 bg-[#25D366] rounded-full" />
              )}
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </div>
          );
        })}
        
        <div className="mt-auto pt-2">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center mx-2 px-3 py-2 rounded-xl text-white/20 hover:text-white/40 hover:bg-white/[0.03] transition-colors w-[calc(100%-16px)]"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {!collapsed && user && (
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-white/50 font-medium shrink-0 uppercase">
              {user.name ? user.name[0] : '?'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm text-white truncate">{user.name}</span>
              <span className="text-[11px] text-white/30 truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-2 flex items-center gap-2 text-xs text-white/25 hover:text-red-400 cursor-pointer transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
