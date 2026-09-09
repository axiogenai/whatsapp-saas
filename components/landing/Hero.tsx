'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Check } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
        
        {/* Left Column */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
            <span className="text-xs text-white/50">Personal AI Assistant for WhatsApp</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-white leading-[1.08] mt-6">
            Your WhatsApp Replies Even When You Can't
          </h1>

          <p className="text-lg text-white/50 mt-6 max-w-xl leading-relaxed">
            Train an AI version of yourself that handles chats, voice notes, and images on your own WhatsApp account. Take over instantly whenever you want.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Link 
              href="/signup" 
              className="bg-[#25D366] hover:bg-[#22c55e] text-white h-[52px] px-7 rounded-xl text-base font-medium flex items-center gap-2 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#how-it-works" 
              className="bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white h-[52px] px-7 rounded-xl text-base flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-white/[0.4] text-white/[0.4]" />
              How it works
            </a>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              'No card required',
              '60-second setup',
              '70 free messages'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="text-xs text-white/40">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (Hidden on mobile) */}
        <motion.div 
          className="hidden lg:block lg:col-span-2 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glass Preview Card */}
          <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-4 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
            {/* Top Bar */}
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              <span className="text-xs font-medium text-emerald-400">AI Active</span>
              <span className="text-xs text-white/30 ml-auto">WhatsApp Connected</span>
            </div>

            {/* Conversation List */}
            <div className="flex flex-col mt-2">
              {[
                { name: 'Rohan M.', lastMsg: 'Thanks, that works perfectly!', time: '2m', unread: true },
                { name: 'Priya K.', lastMsg: 'Can we schedule a call?', time: '8m', unread: true },
                { name: 'Amit S.', lastMsg: 'Sent a voice note', time: '15m', unread: false },
              ].map((conv, i) => (
                <div key={i} className="flex items-center gap-3 py-3 group cursor-default">
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-medium text-white/40 shrink-0">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${conv.unread ? 'text-white font-medium' : 'text-white/65'}`}>
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-white/20 ml-2 shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread ? 'text-white/60' : 'text-white/40'}`}>
                      {conv.lastMsg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#25D366]/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        </motion.div>
        
      </div>
    </section>
  );
}
