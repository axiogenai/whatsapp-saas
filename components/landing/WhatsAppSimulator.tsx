'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCheck, Play, RotateCcw, Mic, Eye, Phone, Video, User, ChevronLeft } from 'lucide-react';

export default function WhatsAppSimulator() {
  const [step, setStep] = useState(0);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    if (step === 0) {
      timeoutRefs.current.push(setTimeout(() => setStep(1), 800));
    } else if (step === 1) {
      timeoutRefs.current.push(setTimeout(() => setStep(2), 2000));
    } else if (step === 2) {
      timeoutRefs.current.push(setTimeout(() => setStep(3), 3500));
    } else if (step === 3) {
      timeoutRefs.current.push(setTimeout(() => setStep(4), 4500));
    }

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [step]);

  const handleReplay = () => {
    setStep(0);
  };

  return (
    <section id="demo" className="py-[120px] max-w-4xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          INTERACTIVE DEMO
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          See it in action
        </h2>
        <p className="text-lg text-white/40 mt-4">
          Watch how AI handles a conversation — and instantly steps aside when you reply.
        </p>
      </div>

      <div className="mt-12 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto">
        {/* WhatsApp header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <ChevronLeft className="w-5 h-5 text-white/50" />
          <div className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center">
            <span className="text-xs font-medium text-[#25D366]">RM</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">Rohan Mehta</h3>
            <p className="text-[10px] text-[#25D366]/60">online</p>
          </div>
          <div className="flex gap-4">
            <Video className="w-5 h-5 text-white/30" />
            <Phone className="w-5 h-5 text-white/30" />
          </div>
        </div>

        {/* Status bar */}
        <div className="border-b border-white/[0.05]">
          {step < 3 ? (
            <div className="bg-[#25D366]/10 px-3 py-1.5 flex items-center justify-center gap-1">
              <Bot className="w-3 h-3 text-[#25D366]/70" />
              <span className="text-[10px] font-mono text-[#25D366]/70">AI Autopilot</span>
            </div>
          ) : (
            <div className="bg-amber-500/10 px-3 py-1.5 flex items-center justify-center">
              <span className="text-[10px] font-mono text-amber-400/70">AI Muted — Human Override Active</span>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="bg-[#0b141a] px-4 py-6 min-h-[320px] flex flex-col gap-3 overflow-hidden">
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#202c33] rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] self-start"
              >
                <p className="text-sm text-[#e9edef]">
                  Hey, are you free for a quick call about the project timeline?
                </p>
                <p className="text-[10px] text-white/20 text-right mt-1">10:42 AM</p>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] self-end"
              >
                <p className="text-sm text-[#e9edef]">
                  <span className="inline text-[9px] font-mono text-[#25D366]/50 mr-1">AI</span>
                  Hi Rohan! He's currently in a focused session. He'll be available after 1:30 PM — would that work for a quick call?
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-white/20">10:42 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mx-auto px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20"
              >
                <p className="text-[10px] font-mono text-amber-400/70">
                  You replied — AI paused for 15 min
                </p>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#005c4b] rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] self-end"
              >
                <p className="text-sm text-[#e9edef]">
                  <span className="inline text-[9px] font-mono text-white/30 mr-1">You</span>
                  Hey Rohan, free now! Let me call you in 5.
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-white/20">10:43 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {step >= 4 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex items-center justify-center"
        >
          <button 
            onClick={handleReplay}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <RotateCcw className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            <span className="text-sm text-white/40 group-hover:text-white transition-colors">Replay demo</span>
          </button>
        </motion.div>
      )}
    </section>
  );
}
