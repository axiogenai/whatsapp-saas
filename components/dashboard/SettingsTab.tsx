'use client';

import { useState } from 'react';
import { Copy, Check, LogOut, Terminal } from 'lucide-react';

interface SettingsTabProps {
  user: { name: string; email: string; businessName: string; tenantId: string } | null;
  onLogout: () => void;
}

export function SettingsTab({ user, onLogout }: SettingsTabProps) {
  const [copiedCurl1, setCopiedCurl1] = useState(false);
  const [copiedCurl2, setCopiedCurl2] = useState(false);

  const curlSend = `curl -X POST https://whatsapp-saas-jet.vercel.app/api/whatsapp/send \\
  -H "Content-Type: application/json" \\
  -d '{"tenantId": "${user?.tenantId || 'YOUR_TENANT_ID'}", "to": "919XXXXXXXXX@s.whatsapp.net", "message": "Hello!"}'`;

  const curlStatus = `curl -X GET "https://whatsapp-saas-jet.vercel.app/api/whatsapp/status?tenantId=${user?.tenantId || 'YOUR_TENANT_ID'}"`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>

      {/* Profile Section */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/30 uppercase tracking-wider">Name</span>
            <span className="text-sm text-white">{user?.name || 'Loading...'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/30 uppercase tracking-wider">Email</span>
            <span className="text-sm text-white">{user?.email || 'Loading...'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/30 uppercase tracking-wider">Business Name</span>
            <span className="text-sm text-white">{user?.businessName || 'Loading...'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/30 uppercase tracking-wider">Workspace ID</span>
            <span className="text-sm font-mono text-white/40">{user?.tenantId || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* API & Webhooks */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white">API & Webhooks</h3>
        <p className="text-xs text-white/30 mb-6">Integrate with external systems</p>

        <div className="space-y-6">
          <div>
            <div className="text-sm font-mono text-white/50 mb-2">POST /api/whatsapp/send</div>
            <div className="relative bg-[#0A0A0A] rounded-xl p-4 border border-white/[0.04]">
              <pre className="text-xs font-mono text-white/30 whitespace-pre-wrap break-all pr-8">
                {curlSend}
              </pre>
              <button
                onClick={() => copyToClipboard(curlSend, setCopiedCurl1)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                {copiedCurl1 ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4 text-white/40" />}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-mono text-white/50 mb-2">GET /api/whatsapp/status</div>
            <div className="relative bg-[#0A0A0A] rounded-xl p-4 border border-white/[0.04]">
              <pre className="text-xs font-mono text-white/30 whitespace-pre-wrap break-all pr-8">
                {curlStatus}
              </pre>
              <button
                onClick={() => copyToClipboard(curlStatus, setCopiedCurl2)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                {copiedCurl2 ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4 text-white/40" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Security</h3>
        <button
          onClick={onLogout}
          className="h-10 px-5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of All Devices
        </button>
      </div>
    </div>
  );
}
