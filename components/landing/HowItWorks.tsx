'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Connect Your WhatsApp',
    description: 'Scan a QR code or enter a pairing code. Your existing WhatsApp stays exactly as it is.',
  },
  {
    title: 'Train Your Assistant',
    description: 'Set your personality, tone, and rules. Choose from templates or write your own.',
  },
  {
    title: 'AI Handles Conversations',
    description: 'Your assistant replies to messages, understands voice notes, and analyzes images automatically.',
  },
  {
    title: 'Take Over Anytime',
    description: 'Send a message from your phone and AI instantly pauses. It resumes after 15 minutes of inactivity.',
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[120px]">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Up and running in under 2 minutes
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-0 mt-16">
          {/* Vertical line connecting steps */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#25D366]/30 via-white/[0.06] to-transparent pointer-events-none" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex gap-6 items-start py-8 relative"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
            >
              {/* Number circle */}
              <div className="w-10 h-10 rounded-full bg-[#0F0F0F] border border-white/[0.08] flex items-center justify-center text-sm font-mono text-white/60 relative z-10 shrink-0 shadow-sm shadow-[#050505]">
                {index + 1}
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
