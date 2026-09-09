'use client';

import { useState } from 'react';
import { Check, Loader2, CreditCard } from 'lucide-react';

interface BillingTabProps {
  activePlan: 'free_trial' | 'starter' | 'pro' | 'agency';
  messagesUsed: number;
  trialLimit: number;
  user: { tenantId: string; email: string } | null;
  onInitiatePayment: (plan: 'starter' | 'pro' | 'agency') => void;
  initiatingPlan: string | null;
}

export function BillingTab({
  activePlan,
  messagesUsed,
  trialLimit,
  user,
  onInitiatePayment,
  initiatingPlan,
}: BillingTabProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getLimit = () => {
    switch (activePlan) {
      case 'free_trial': return 70;
      case 'starter': return 1500;
      case 'pro': return 8000;
      case 'agency': return 30000;
      default: return 70;
    }
  };

  const getDisplayName = (plan: string) => {
    switch (plan) {
      case 'free_trial': return 'Free Trial';
      case 'starter': return 'Starter';
      case 'pro': return 'Business Pro';
      case 'agency': return 'Agency';
      default: return 'Free Trial';
    }
  };

  const limit = getLimit();
  const usagePercentage = Math.min((messagesUsed / limit) * 100, 100);
  
  let progressColor = 'bg-[#25D366]';
  if (usagePercentage > 80 && usagePercentage <= 95) progressColor = 'bg-amber-400';
  if (usagePercentage > 95) progressColor = 'bg-red-400';

  const planOrder = { free_trial: 0, starter: 1, pro: 2, agency: 3 };
  const currentLevel = planOrder[activePlan];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Current Plan Card */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wider">Current Plan</div>
          <div className="flex items-center gap-3 mt-1">
            <div className="text-xl font-semibold text-white">
              {getDisplayName(activePlan)}
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs font-medium">
              Active
            </span>
          </div>
        </div>
        <div className="text-right">
          {activePlan === 'free_trial' ? (
            <div className="text-3xl font-semibold text-white">Free</div>
          ) : (
            <div>
              <span className="text-3xl font-semibold text-white font-mono">
                ${activePlan === 'starter' ? '49' : activePlan === 'pro' ? '99' : '249'}
              </span>
              <span className="text-base text-white/30">/mo</span>
            </div>
          )}
        </div>
      </div>

      {/* Usage Meter */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <div className="text-sm font-medium text-white mb-3">Message Usage</div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-2">
          <span>{messagesUsed} used</span>
          <span>{limit} limit</span>
        </div>
      </div>

      {/* Upgrade Section */}
      {currentLevel < 3 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Upgrade Your Plan</h3>
            <div className="flex items-center bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  billingCycle === 'monthly' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  billingCycle === 'annual' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Starter */}
            {currentLevel < 1 && (
              <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
                <div className="text-sm font-medium text-white/60 mb-2">Starter</div>
                <div className="mb-4">
                  <span className="text-2xl font-semibold text-white font-mono">
                    ${billingCycle === 'monthly' ? '49' : '39'}
                  </span>
                  <span className="text-sm text-white/30">/mo</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {['1,500 messages/mo', 'Basic AI training', 'Standard support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/40">
                      <Check className="w-3.5 h-3.5 text-[#25D366]" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onInitiatePayment('starter')}
                  disabled={initiatingPlan !== null}
                  className="w-full h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {initiatingPlan === 'starter' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade to Starter'}
                </button>
              </div>
            )}

            {/* Pro */}
            {currentLevel < 2 && (
              <div className="bg-[#0F0F0F] border border-[#25D366]/20 rounded-2xl p-5 flex flex-col relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#25D366] text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Popular
                </div>
                <div className="text-sm font-medium text-white/60 mb-2 mt-1">Business Pro</div>
                <div className="mb-4">
                  <span className="text-2xl font-semibold text-white font-mono">
                    ${billingCycle === 'monthly' ? '99' : '79'}
                  </span>
                  <span className="text-sm text-white/30">/mo</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {['8,000 messages/mo', 'Advanced custom AI', 'Priority support', 'Human handover'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/40">
                      <Check className="w-3.5 h-3.5 text-[#25D366]" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onInitiatePayment('pro')}
                  disabled={initiatingPlan !== null}
                  className="w-full h-10 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {initiatingPlan === 'pro' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade to Pro'}
                </button>
              </div>
            )}

            {/* Agency */}
            {currentLevel < 3 && (
              <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
                <div className="text-sm font-medium text-white/60 mb-2">Agency</div>
                <div className="mb-4">
                  <span className="text-2xl font-semibold text-white font-mono">
                    ${billingCycle === 'monthly' ? '249' : '199'}
                  </span>
                  <span className="text-sm text-white/30">/mo</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {['30,000 messages/mo', 'White-labeling', 'Dedicated account manager', 'API access'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/40">
                      <Check className="w-3.5 h-3.5 text-[#25D366]" /> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onInitiatePayment('agency')}
                  disabled={initiatingPlan !== null}
                  className="w-full h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {initiatingPlan === 'agency' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade to Agency'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
