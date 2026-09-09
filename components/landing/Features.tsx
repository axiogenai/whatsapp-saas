'use client';

import { motion } from 'framer-motion';
import { Zap, Mic, Eye, Brain, Clock, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Instant Human Override',
    description: 'The moment you type a message, AI steps aside for 15 minutes. Take control whenever you want.',
    icon: Zap,
    span: 'md:col-span-2'
  },
  {
    title: 'Voice Understanding',
    description: 'Transcribes and responds to voice notes in Hindi, English, and Marathi.',
    icon: Mic,
    span: 'md:col-span-1'
  },
  {
    title: 'Image Analysis',
    description: 'Understands photos, screenshots, receipts, and documents sent to you.',
    icon: Eye,
    span: 'md:col-span-1'
  },
  {
    title: 'Thread Memory',
    description: 'Remembers entire conversation context across days and weeks.',
    icon: Brain,
    span: 'md:col-span-1'
  },
  {
    title: 'Always On',
    description: 'Handles messages 24/7 while you sleep, travel, or focus.',
    icon: Clock,
    span: 'md:col-span-1'
  },
  {
    title: 'Your Personality',
    description: 'Learns your tone, mannerisms, and rules. Replies like you, not a generic bot.',
    icon: Sparkles,
    span: 'md:col-span-2'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-[120px]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
            Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Everything your WhatsApp needs
          </h2>
          <p className="text-lg text-white/40 mt-4 leading-relaxed">
            An AI that doesn't just reply — it thinks, listens, sees, and knows when to step aside.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                className={`${feature.span} bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 shrink-0">
                  <Icon className="w-5 h-5 text-[#25D366]/70 group-hover:text-[#25D366] transition-colors" />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-lg font-semibold text-white mt-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/40 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
