'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
  MessageSquare,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-1/4 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <header className="h-20 px-6 sm:px-12 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Bot className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-white font-mono">
            AXIOGEN<span className="text-purple-400">.WA</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#guarantees" className="hover:text-white transition-colors">Speech Guarantee</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 sm:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono font-medium mb-8 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Gen Autonomous WhatsApp Multi-Tenant SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl">
          Deploy Your 24/7 Autonomous WhatsApp AI Agent in{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            30 Seconds
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Every client gets their own dedicated login, live QR code pairing, custom AI persona studio, and real-time inbox co-pilot. Zero markdown tables, zero asterisks, 100% natural conversational English &amp; local dialects.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-bold text-white shadow-xl shadow-purple-900/40 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Create Your Free Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Explore Live Demo Workspace</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-zinc-900">
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-center">
            <span className="block text-base font-extrabold text-white">0 Asterisks</span>
            <span className="text-[11px] text-zinc-500">Natural Human Text</span>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-center">
            <span className="block text-base font-extrabold text-purple-400">&lt; 1.2s</span>
            <span className="text-[11px] text-zinc-500">Groq Ultra Latency</span>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-center">
            <span className="block text-base font-extrabold text-indigo-400">100% Isolated</span>
            <span className="text-[11px] text-zinc-500">Multi-Tenant Vault</span>
          </div>
          <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-center">
            <span className="block text-base font-extrabold text-emerald-400">1-Click Takeover</span>
            <span className="text-[11px] text-zinc-500">Human Co-Pilot</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Everything Businesses Need to Automate WhatsApp
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Engineered for doctors, real estate agencies, salons, restaurants, and digital service agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Zero-Code WhatsApp Link</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scan your QR code directly or enter an 8-digit phone pairing code. No Meta Cloud API setup, no monthly platform verification fees, and no phone re-routing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] font-mono text-purple-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Baileys Socket Core</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">AI Persona &amp; Knowledge Studio</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide your services, pricing, business hours, and tone. Select between Groq GPT-OSS 120B and Llama 3.3 70B for instant, razor-sharp responses.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] font-mono text-indigo-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hot-Reload Updates</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Live Inbox &amp; Human Co-Pilot</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch conversations unfold live. When you reply manually or hit &quot;Take Over Chat&quot;, the AI bot automatically steps back for 30 minutes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto Presence &amp; Debounce</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent border-t border-zinc-900 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to give your business an AI WhatsApp bot?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Sign up now, scan your WhatsApp QR code, and experience completely autonomous customer support.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 transition-all cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-12 border-t border-zinc-900 bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-400">Axiogen WhatsApp Multi-Tenant SaaS Engine</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Axiogen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
