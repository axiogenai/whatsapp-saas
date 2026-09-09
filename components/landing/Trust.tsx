'use client';

import { motion } from 'framer-motion';
import { Zap, Smartphone, Shield, Lock } from 'lucide-react';

export default function Trust() {
  const cards = [
    {
      title: 'AI Pauses When You Reply',
      description: 'The instant you send a message, AI mutes itself for 15 minutes. No overlap, no confusion.',
      icon: <Zap className="w-5 h-5 text-white/30" />,
    },
    {
      title: 'Standard WhatsApp Pairing',
      description: 'Uses the official WhatsApp Linked Devices feature. You are never locked out of your own account.',
      icon: <Smartphone className="w-5 h-5 text-white/30" />,
    },
    {
      title: 'Master Kill Switch',
      description: 'One toggle to disable AI globally. Plus a full audit log of every message sent.',
      icon: <Shield className="w-5 h-5 text-white/30" />,
    },
    {
      title: 'Complete Data Isolation',
      description: 'Each workspace is fully isolated. Your data never trains any model.',
      icon: <Lock className="w-5 h-5 text-white/30" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-[120px] max-w-4xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          TRUST & CONTROL
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Your WhatsApp, your rules
        </h2>
        <p className="text-lg text-white/40 mt-4 max-w-2xl mx-auto">
          We built this for people who are protective of their WhatsApp. So are we.
        </p>
      </div>

      <motion.div 
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <h3 className="text-base font-semibold text-white">{card.title}</h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
