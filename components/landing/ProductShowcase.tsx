'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'Dashboard' | 'AI Studio' | 'Inbox' | 'Tasks' | 'Analytics';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

  const tabs: { id: Tab; label: string; descriptionTitle: string; description: string }[] = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      descriptionTitle: 'Your AI command center',
      description: 'See everything at a glance — messages, contacts, activity, and quick actions.',
    },
    {
      id: 'AI Studio',
      label: 'AI Studio',
      descriptionTitle: 'Train your assistant',
      description: 'Set personality templates, voice settings, and custom prompts.',
    },
    {
      id: 'Inbox',
      label: 'Inbox',
      descriptionTitle: 'Live conversations',
      description: 'Monitor chats in real-time with human takeover controls.',
    },
    {
      id: 'Tasks',
      label: 'Tasks',
      descriptionTitle: 'Automated actions',
      description: 'Reminders, follow-ups, and scheduled calls managed by AI.',
    },
    {
      id: 'Analytics',
      label: 'Analytics',
      descriptionTitle: 'Performance insights',
      description: 'Track messages handled, response times, and conversation volume.',
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="py-[120px] max-w-6xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          PRODUCT
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Built for your daily workflow
        </h2>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm px-4 py-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-[#25D366]'
                : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top bar */}
          <div className="h-10 bg-[#161616] border-b border-white/[0.06] flex items-center px-4 gap-2 relative">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-60"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/20 font-mono">
              app.axiogen.com/{activeTab.toLowerCase().replace(' ', '-')}
            </div>
          </div>
          
          {/* Content area */}
          <div className="aspect-video bg-[#0b0b0b] flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-white/10 text-sm font-medium tracking-widest uppercase"
              >
                {activeTab} Preview
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 text-center h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-base font-semibold text-white">
                {activeTabData?.descriptionTitle}
              </h3>
              <p className="text-sm text-white/50 mt-1 max-w-lg mx-auto">
                {activeTabData?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
