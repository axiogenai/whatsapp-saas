'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  QrCode,
  ShieldCheck,
  Zap,
  MessageSquare,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Users,
  Terminal,
  Cpu,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm tracking-wide text-zinc-100">
              AXIOGEN
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 border-l border-zinc-800 pl-2">
              WhatsApp Engine
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-200 transition-colors">Capabilities</a>
          <a href="#architecture" className="hover:text-zinc-200 transition-colors">Architecture</a>
          <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/login"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-sm whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline-block" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 md:pt-20 pb-12 sm:pb-16 px-4 sm:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] sm:text-xs font-mono font-medium mb-4 sm:mb-6 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="whitespace-nowrap"><span className="hidden sm:inline">Autonomous </span>Multi-Tenant WhatsApp Gateway</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight sm:leading-tight max-w-3xl px-1">
          Production-grade WhatsApp AI agents for businesses
        </h1>

        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed px-2">
          Deploy dedicated WhatsApp support bots with instant QR pairing, custom business instructions, sub-second Groq inference, and zero markdown formatting errors.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Create Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <span>Sign In to Console</span>
          </Link>
        </div>

        {/* Live Interactive UI Preview Mockup */}
        <div className="mt-8 sm:mt-14 w-full max-w-3xl border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 shadow-2xl text-left">
          <div className="h-9 sm:h-10 px-3 sm:px-4 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-500 ml-1 truncate">whatsapp-socket // active session</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-emerald-400 shrink-0 ml-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Online • macOS</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 bg-[#0c0c0e]">
            {/* Customer Message */}
            <div className="flex flex-col items-start">
              <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl rounded-tl-sm text-xs max-w-[88%] sm:max-w-md leading-relaxed">
                Hello, do you have any appointments available this Friday afternoon?
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 mt-1">Customer • +1 (555) 019-2834 • 14:32</span>
            </div>

            {/* AI Agent Response */}
            <div className="flex flex-col items-end">
              <div className="bg-zinc-800 text-zinc-100 border border-zinc-700/60 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl rounded-tr-sm text-xs max-w-[88%] sm:max-w-md leading-relaxed text-left">
                Hello! Yes, we have openings available this Friday at 2:30 PM and 4:15 PM. Would you like me to reserve one of those for you?
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 mt-1 flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
                <span className="text-emerald-400">AI Auto-Reply</span>
                <span>•</span>
                <span>Groq LPU 840ms</span>
                <span>•</span>
                <span>Zero asterisks</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-8 max-w-5xl mx-auto border-t border-zinc-800/80">
        <div className="text-left mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Built for reliable customer operations
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            No convoluted Meta Cloud API approval process, no phone number re-routing, and no downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">macOS Socket Pairing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pair your WhatsApp using an instant QR scan or an 8-digit phone code. Uses Baileys multi-file auth emulating a native macOS Desktop socket.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">Sub-Second Groq LPU</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Powered by Groq inference hardware with OpenAI GPT-OSS 120B and Llama 3.3. Roundtrip responses complete in under 1 second.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">Tenant Session Vault</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every tenant operates in an isolated storage directory with separate encryption keys, chat state, and business prompt configurations.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">Natural Speech Filter</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatic regex cleaning strips away bold markdown asterisks (*), hashtags, and markdown tables so the customer receives pure human text.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">Live Human Takeover</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Jump into any customer thread instantly. The AI pauses automatically when human staff intervenes, preventing conflicting messages.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100 mb-1.5">REST API Proxy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full suite of REST proxy endpoints under /api/whatsapp/ for programmatic dispatch, webhook integration, and analytics export.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-8 max-w-5xl mx-auto border-t border-zinc-800/80">
        <div className="text-left mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 mb-3">
            <span>🇮🇳 India Pricing • Instant UPI &amp; GST Invoicing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Simple, affordable plans for Indian businesses
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            No expensive USD conversions or foreign transaction fees. Pay via UPI, RuPay, or NetBanking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Starter</span>
              <div className="mt-3 mb-1">
                <span className="text-2xl font-bold font-mono text-zinc-100">₹499</span>
                <span className="text-xs text-zinc-500"> / month</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-4 font-mono">₹16/day • Perfect for solo shops &amp; clinics</p>
              <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1 WhatsApp Number</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1,500 AI Messages/mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instant QR &amp; Phone Pairing</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Human Takeover Console</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instant UPI Activation</li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-center text-zinc-200 transition-colors block"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-5 sm:p-6 flex flex-col justify-between relative shadow-lg">
            <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              POPULAR
            </span>
            <div>
              <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Business Pro</span>
              <div className="mt-3 mb-1">
                <span className="text-2xl font-bold font-mono text-zinc-100">₹999</span>
                <span className="text-xs text-zinc-500"> / month</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-4 font-mono">₹33/day • For growing businesses</p>
              <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 2 WhatsApp Numbers</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 8,000 AI Messages/mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom Knowledge Base &amp; FAQ</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Sub-Second Groq LPU Speed</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> WhatsApp &amp; UPI Support</li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs text-center transition-all shadow-sm block"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Agency / Scale</span>
              <div className="mt-3 mb-1">
                <span className="text-2xl font-bold font-mono text-zinc-100">₹2,499</span>
                <span className="text-xs text-zinc-500"> / month</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-4 font-mono">₹83/day • Multi-client agencies</p>
              <ul className="space-y-2 text-xs text-zinc-400 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 5 WhatsApp Numbers</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 30,000 AI Messages/mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full REST API &amp; Webhooks</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> GST Tax Invoice Reports</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Dedicated Account Manager</li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-center text-zinc-200 transition-colors block"
            >
              Start Agency Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Axiogen AI Platform. All rights reserved.</span>
          <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-400">
            <Link href="/login" className="hover:text-zinc-200">Sign In</Link>
            <Link href="/signup" className="hover:text-zinc-200">Create Account</Link>
            <a href="https://api.axiogen.in/whatsapp-saas/health" target="_blank" rel="noreferrer" className="hover:text-zinc-200">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
