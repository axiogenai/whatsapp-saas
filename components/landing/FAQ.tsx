'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 'meta-api',
    title: 'Does this need Meta API approval?',
    content: 'No. We use the official WhatsApp Linked Devices feature — the same mechanism you use to connect WhatsApp Web. No Meta Business API, no approval process, no phone number porting.',
  },
  {
    id: 'takeover',
    title: 'What happens when I reply manually?',
    content: 'The AI instantly pauses for 15 minutes. You take full control of the conversation. After 15 minutes of inactivity, AI resumes automatically. You can also toggle it manually from the dashboard.',
  },
  {
    id: 'voice',
    title: 'How does voice note handling work?',
    content: 'When someone sends you a voice note, the AI transcribes it using Whisper and responds contextually. It understands Hindi, English, Hinglish, and Marathi. If your voice reply mode is enabled, it can even respond back as a voice note.',
  },
  {
    id: 'vision',
    title: 'Can it understand images?',
    content: 'Yes. The AI analyzes photos, screenshots, receipts, documents, and any image sent to your WhatsApp. It uses multimodal vision models to understand and respond to visual content.',
  },
  {
    id: 'trial',
    title: 'What is included in the free trial?',
    content: 'You get 70 free AI messages with full access to all features — voice notes, image analysis, human override, custom prompts, and the live inbox. No credit card required. Setup takes under 60 seconds.',
  },
  {
    id: 'security',
    title: 'Is my data safe?',
    content: 'Each workspace is completely isolated. Your conversations never leave your tenant space. We do not use your data to train any models. You can disconnect your WhatsApp and delete your workspace at any time.',
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="py-[120px] max-w-3xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          FAQ
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Common questions
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="text-base font-medium text-white">{faq.title}</span>
              <ChevronDown 
                className={`w-5 h-5 text-white/30 transition-transform duration-200 ${
                  openFaq === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-6 pt-0 text-sm text-white/50 leading-relaxed">
                    {faq.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
