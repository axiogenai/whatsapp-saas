'use client';

import { LogOut, Shield, User, Building, Mail, Hash } from 'lucide-react';

interface SettingsTabProps {
  user: { name: string; email: string; businessName: string; tenantId: string } | null;
  onLogout: () => void;
}

export function SettingsTab({ user, onLogout }: SettingsTabProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-xs text-white/40 mt-1">Manage your account profile and session preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-[#25D366]" />
          Profile Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-white/30" />
              Full Name
            </span>
            <span className="text-sm font-medium text-white">{user?.name || 'Loading...'}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-white/30" />
              Email Address
            </span>
            <span className="text-sm font-medium text-white">{user?.email || 'Loading...'}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-white/30" />
              Business / Workspace
            </span>
            <span className="text-sm font-medium text-white">{user?.businessName || 'Loading...'}</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-white/30" />
              Workspace Identifier
            </span>
            <span className="text-sm font-mono text-white/70">{user?.tenantId || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Privacy & Guardrails */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Privacy & Security Guardrails
        </h3>
        <p className="text-xs text-white/40 mb-5 leading-relaxed">
          Your assistant runs in an isolated sandbox environment. Chats and customer voice notes are processed in real-time with zero model training retention.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <div className="text-sm text-white font-medium">Automatic Takeover Circuit</div>
              <div className="text-xs text-white/30 mt-0.5">Pauses bot replies for 15 minutes when you type on your phone</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <div className="text-sm text-white font-medium">Multi-tenant Data Isolation</div>
              <div className="text-xs text-white/30 mt-0.5">Encrypted isolated storage for voice personas and memories</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
              Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Session Security */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Sign Out</h3>
          <p className="text-xs text-white/30 mt-1">End your active dashboard session on this browser</p>
        </div>
        <button
          onClick={onLogout}
          className="h-10 px-5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Workspace
        </button>
      </div>
    </div>
  );
}
