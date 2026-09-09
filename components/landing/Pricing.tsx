'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for solo professionals',
      price: { monthly: '₹499', annual: '₹399' },
      features: [
        '1 WhatsApp number',
        '1,500 AI messages / month',
        'Instant QR pairing',
        'Human override',
        'Voice + Vision',
      ],
      ctaText: 'Get Started',
      ctaLink: '/signup?plan=starter',
      isPopular: false,
    },
    {
      name: 'Business Pro',
      description: 'For growing businesses',
      price: { monthly: '₹999', annual: '₹799' },
      features: [
        '2 WhatsApp numbers',
        '8,000 AI messages / month',
        'Instant QR pairing',
        'Human override',
        'Voice + Vision',
        'Custom knowledge base',
        'Priority support',
        'Advanced analytics',
      ],
      ctaText: 'Get Business Pro',
      ctaLink: '/signup?plan=pro',
      isPopular: true,
    },
    {
      name: 'Agency / Scale',
      description: 'For teams and high volume',
      price: { monthly: '₹2,499', annual: '₹1,999' },
      features: [
        '5 WhatsApp numbers',
        '30,000 AI messages / month',
        'Instant QR pairing',
        'Human override',
        'Voice + Vision',
        'Custom knowledge base',
        'Advanced analytics',
        'REST API & Webhooks',
        'GST tax invoices',
        'Dedicated support',
      ],
      ctaText: 'Contact Sales',
      ctaLink: '/signup?plan=agency',
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-[120px] max-w-5xl mx-auto px-6">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
          PRICING
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Simple, transparent pricing
        </h2>
        <p className="text-lg text-white/40 mt-4">
          Start with 70 free messages. No credit card required.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white/[0.08] text-white'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-white/[0.08] text-white'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            Annual
            <span className="text-[10px] font-mono text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col h-full rounded-2xl p-6 relative ${
              plan.isPopular
                ? 'bg-[#0F0F0F] border border-[#25D366]/20 shadow-[0_0_60px_rgba(37,211,102,0.06)]'
                : 'bg-[#0F0F0F] border border-white/[0.06]'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#25D366] text-white text-xs font-medium">
                Most Popular
              </div>
            )}
            
            <h3 className={`text-base font-medium ${plan.isPopular ? 'text-white' : 'text-white/60'}`}>
              {plan.name}
            </h3>
            
            <div className="mt-2 flex items-end gap-1">
              <span className="text-5xl font-semibold text-white">
                {billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
              </span>
              <span className="text-base text-white/30 mb-2">/mo</span>
            </div>
            
            <p className="text-sm text-white/40 mt-2">{plan.description}</p>
            
            <div className="border-t border-white/[0.06] my-6"></div>
            
            <div className="flex flex-col gap-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#25D366]/60 shrink-0" />
                  <span className="text-sm text-white/50">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-6">
              <Link
                href={plan.ctaLink}
                className={`w-full h-12 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  plan.isPopular
                    ? 'bg-[#25D366] hover:bg-[#22c55e] text-white'
                    : 'bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white'
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
