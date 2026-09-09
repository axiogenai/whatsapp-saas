'use client';

import { useState } from 'react';
import { QrCode, CheckCircle2, Copy, Check, Loader2, Smartphone, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionTabProps {
  status: {
    status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
    phone?: string;
    name?: string;
    qr?: string;
    qrCodeUrl?: string;
  };
  user: { tenantId: string } | null;
  onRestart: () => void;
  restartingSession: boolean;
  pairPhone: string;
  onPairPhoneChange: (v: string) => void;
  onRequestPairCode: () => void;
  generatingCode: boolean;
  generatedPairCode: string | null;
}

export function ConnectionTab({
  status,
  user,
  onRestart,
  restartingSession,
  pairPhone,
  onPairPhoneChange,
  onRequestPairCode,
  generatingCode,
  generatedPairCode
}: ConnectionTabProps) {
  const [showPairing, setShowPairing] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStep = () => {
    if (status.status === 'connected') return 3;
    if (status.status === 'qr_ready' || status.status === 'connecting') return 2;
    return 1;
  };

  const currentStep = getStep();

  const copyCode = () => {
    if (generatedPairCode) {
      navigator.clipboard.writeText(generatedPairCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto min-h-[calc(100vh-3.5rem)] md:min-h-0">
      <div className="flex items-center justify-center gap-0 mb-8 pt-8">
        {[
          { num: 1, label: 'Scan QR' },
          { num: 2, label: 'Connect' },
          { num: 3, label: 'AI Ready' },
        ].map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                currentStep > step.num
                  ? 'bg-[#25D366] text-white'
                  : currentStep === step.num
                  ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                  : 'bg-white/[0.04] text-white/30'
              }`}>
                {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span className={`text-[10px] sm:text-xs absolute mt-12 ${
                currentStep > step.num ? 'text-[#25D366]' : currentStep === step.num ? 'text-white' : 'text-white/30'
              }`}>
                {step.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`w-8 sm:w-16 md:w-24 h-px mx-2 ${
                currentStep > step.num ? 'bg-[#25D366]/40' : 'bg-white/[0.06]'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 md:p-8 text-center mt-12 relative overflow-hidden">
        {restartingSession && (
          <div className="absolute inset-0 z-10 bg-[#0F0F0F]/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#25D366] animate-spin mb-3" />
            <span className="text-sm text-white/60">Restarting session...</span>
          </div>
        )}

        {status.status === 'connected' ? (
          <div className="flex flex-col items-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
              </div>
            </motion.div>
            <h2 className="text-xl font-semibold text-white mb-2">WhatsApp Connected</h2>
            <p className="text-sm text-white/40 mb-1">{status.name}</p>
            <p className="text-sm text-white/40 mb-8">{status.phone}</p>
            
            <button
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : status.status === 'qr_ready' ? (
          <div className="flex flex-col items-center">
            <h2 className="text-base text-white/50 mb-6">Scan this QR code with WhatsApp</h2>
            <div className="w-56 h-56 mx-auto bg-white rounded-xl p-3 flex items-center justify-center">
              {status.qrCodeUrl || (status.qr && status.qr.startsWith('data:')) ? (
                <img src={status.qrCodeUrl || status.qr} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-16 h-16 text-black/10" />
              )}
            </div>
            <p className="text-xs text-white/30 mt-6 max-w-[200px] mx-auto leading-relaxed">
              Open WhatsApp <br />
              Settings &gt; Linked Devices &gt; Link a Device
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <Smartphone className="w-12 h-12 text-white/20 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Connect your WhatsApp</h2>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              Scan a QR code or use a pairing code to link your account to the AI assistant.
            </p>
            <div className="flex items-center gap-2 mt-8 text-white/20">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm animate-pulse">Waiting for QR code...</span>
            </div>
          </div>
        )}
      </div>

      {status.status !== 'connected' && (
        <div className="mt-6">
          <div 
            onClick={() => setShowPairing(!showPairing)}
            className="text-center"
          >
            <span className="text-sm text-white/30 cursor-pointer hover:text-white/60 transition-colors inline-flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Or connect with pairing code
            </span>
          </div>

          {showPairing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3 mt-4 max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={pairPhone}
                  onChange={(e) => onPairPhoneChange(e.target.value)}
                  className="flex-1 bg-[#0F0F0F] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#25D366]/50 transition-colors"
                />
                <button
                  onClick={onRequestPairCode}
                  disabled={generatingCode || !pairPhone}
                  className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {generatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Code'}
                </button>
              </div>

              {generatedPairCode && (
                <div className="mt-6 bg-[#0F0F0F] border border-white/[0.08] rounded-xl p-6 text-center max-w-sm mx-auto">
                  <p className="text-xs text-white/40 mb-3">Your Pairing Code</p>
                  <div className="text-3xl font-mono tracking-[0.3em] text-white mb-4">
                    {generatedPairCode}
                  </div>
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 text-xs text-[#25D366] hover:text-[#25D366]/80 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
