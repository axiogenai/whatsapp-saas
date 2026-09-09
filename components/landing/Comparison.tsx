'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const comparisonData = [
  {
    label: 'Where it runs',
    generic: 'Separate widget or app',
    axiogen: 'Your own WhatsApp'
  },
  {
    label: 'Human override',
    generic: 'Manual toggle needed',
    axiogen: 'Automatic when you type'
  },
  {
    label: 'Voice notes',
    generic: 'Not supported',
    axiogen: 'Full transcription + reply'
  },
  {
    label: 'Image understanding',
    generic: 'Text only',
    axiogen: 'Vision analysis built in'
  },
  {
    label: 'Conversation memory',
    generic: 'Resets each session',
    axiogen: 'Persistent thread context'
  },
  {
    label: 'Setup time',
    generic: '30+ minutes, API keys',
    axiogen: 'Under 60 seconds'
  }
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-[120px]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
            Why Us
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Not another chatbot
          </h2>
          <p className="text-lg text-white/40 mt-4 max-w-2xl mx-auto leading-relaxed">
            Other tools give you a separate bot widget. We make AI become you on your own WhatsApp.
          </p>
        </div>

        {/* Comparison Table */}
        <motion.div 
          className="mt-12 bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Row */}
          <div className="grid grid-cols-3 border-b border-white/[0.04]">
            <div className="py-4 px-6"></div>
            <div className="py-4 px-6 text-sm font-medium text-white/30">
              Generic Chatbots
            </div>
            <div className="py-4 px-6 text-sm font-semibold text-[#25D366] bg-[#25D366]/[0.04]">
              Your AI Persona
            </div>
          </div>

          {/* Data Rows */}
          {comparisonData.map((row, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-3 ${index !== 0 ? 'border-t border-white/[0.04]' : ''}`}
            >
              <div className="py-4 px-6 flex items-center">
                <span className="text-sm text-white/60">{row.label}</span>
              </div>
              <div className="py-4 px-6 flex items-center gap-2">
                <X className="w-4 h-4 text-red-500/50 shrink-0" />
                <span className="text-sm text-white/30">{row.generic}</span>
              </div>
              <div className="py-4 px-6 flex items-center gap-2 bg-[#25D366]/[0.02]">
                <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="text-sm text-[#25D366]/80">{row.axiogen}</span>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
