"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ArrowRight,
  CheckCircle2,
  Lock,
  Users,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
  Mic,
  Eye,
  Brain,
  Moon,
  Zap,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Sparkle,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  CheckCheck,
  XCircle,
} from 'lucide-react';

export default function LandingPage() {
  // Interactive Demo State
  const [demoStep, setDemoStep] = useState<number>(3); // 1: contact msg, 2: ai reply, 3: human takeover
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const simulateStep = (step: number) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setDemoStep(step);
    }, 500);
  };

  const resetDemo = () => {
    setDemoStep(1);
    setTimeout(() => simulateStep(2), 1000);
    setTimeout(() => simulateStep(3), 2400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border-b border-emerald-900/30 px-4 py-2 text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-mono text-[10px] font-semibold uppercase tracking-wider">
          New
        </span>
        <span>
          Multimodal Vision + Voice Notes Live!{' '}
          <Link href="/signup" className="underline font-semibold hover:text-emerald-400 ml-1">
            Get 70 Free Messages &rarr;
          </Link>
        </span>
      </div>

      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-8 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-zinc-100">
              AXIOGEN
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 border-l border-zinc-800 pl-2">
              WhatsApp Persona Engine
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-200 transition-colors">How It Works</a>
          <a href="#demo" className="hover:text-zinc-200 transition-colors">Live Takeover Demo</a>
          <a href="#why-different" className="hover:text-zinc-200 transition-colors">Why We&apos;re Different</a>
          <a href="#use-cases" className="hover:text-zinc-200 transition-colors">Use Cases</a>
          <a href="#trust" className="hover:text-zinc-200 transition-colors">Control &amp; Trust</a>
          <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-950"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-emerald-900/50 text-emerald-400 text-xs font-mono font-medium mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span>The WhatsApp AI that immediately steps aside when you type</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.15] max-w-3xl">
          Your WhatsApp Replies <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Even When You Can&apos;t
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Train an AI version of yourself that handles chats, voice notes, and images on your own WhatsApp account. Take over instantly whenever you want.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-3 px-4 sm:px-0">
          <Link
            href="/signup"
            className="px-7 py-3.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Watch Live Takeover Demo</span>
          </a>
        </div>

        {/* Micro-trust indicators */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> 70 Free Messages
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Connects in 60 seconds
          </span>
        </div>
      </section>

      {/* 2. DEMO SHOWCASE (THE CORE DIFFERENTIATOR: HUMAN OVERRIDE) */}
      <section id="demo" className="py-12 sm:py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>The Single Strongest Differentiator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            The AI becomes you, but immediately steps aside when you start typing.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl mx-auto">
            Most chatbots talk over you or send conflicting messages. Axiogen watches your thread—the second you text from your phone, the AI mutes itself for 15 minutes.
          </p>
        </div>

        {/* Interactive Chat Mockup Card */}
        <div className="max-w-3xl mx-auto border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl">
          {/* Header */}
          <div className="h-14 px-4 sm:px-6 bg-[#0e0e11] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0e0e11]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-100">Aditya (Your Personal WhatsApp)</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">Linked</span>
                </div>
                <span className="text-[11px] text-zinc-500">Active conversation with client</span>
              </div>
            </div>

            {/* Current State Indicator */}
            <div className="flex items-center gap-2">
              {demoStep >= 3 ? (
                <div className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>AI Paused ✓ (Human Takeover)</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AI Autopilot Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 sm:p-6 space-y-4 bg-[#09090b]/90 min-h-[320px] flex flex-col justify-center">
            {/* Step 1: Customer / Friend Inbound */}
            <div className="flex flex-col items-start max-w-[85%] sm:max-w-md">
              <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-2xl rounded-tl-sm text-xs sm:text-sm leading-relaxed shadow-sm">
                Hey bro where are you? Are we still on for the 4 PM architecture review?
              </div>
              <span className="text-[10px] font-mono text-zinc-600 mt-1 pl-1">Friend / Lead • 15:58</span>
            </div>

            {/* Step 2: AI Auto-Reply */}
            {demoStep >= 2 && (
              <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                <div className="bg-emerald-950/30 border border-emerald-800/40 text-emerald-100 px-4 py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm leading-relaxed text-left shadow-sm">
                  Hey! Aditya is currently wrapped up in a consultation sprint. He&apos;ll get back to you in about 20 mins, or let me know if it&apos;s urgent!
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-1 pr-1">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI Autopilot (Replied in your style)
                  </span>
                  <span>•</span>
                  <span>15:58</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
            )}

            {/* Event: Human Typed Manually */}
            {demoStep >= 3 && (
              <div className="my-2 py-2 px-4 rounded-xl bg-zinc-900/60 border border-dashed border-zinc-800 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aditya sent a text from his phone &rarr; Bot paused for 15 mins</span>
                </span>
                <span className="text-[10px] text-zinc-500">Auto-resumes after inactivity</span>
              </div>
            )}

            {/* Step 3: Human Message */}
            {demoStep >= 3 && (
              <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                <div className="bg-white text-zinc-950 font-medium px-4 py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm leading-relaxed text-left shadow-md">
                  Hey man, wrapping up right now! Jumping on the Google Meet link in 3 mins.
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-1 pr-1">
                  <span className="text-zinc-400 font-semibold">Aditya (Human Owner)</span>
                  <span>•</span>
                  <span>16:01</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono italic">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span>Generating next interaction...</span>
              </div>
            )}
          </div>

          {/* Interactive Demo Controller Bar */}
          <div className="p-3 sm:p-4 bg-[#0e0e11] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-mono text-[11px] hidden sm:inline">Try interaction:</span>
              <button
                onClick={() => setDemoStep(1)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  demoStep === 1 ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                1. User Texts
              </button>
              <button
                onClick={() => setDemoStep(2)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  demoStep === 2 ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                2. AI Replies
              </button>
              <button
                onClick={() => setDemoStep(3)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                  demoStep === 3 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                3. Human Overrides
              </button>
            </div>

            <button
              onClick={resetDemo}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Sequence</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. WHY WE'RE DIFFERENT SECTION */}
      <section id="why-different" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <span>Direct Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Why We&apos;re Different
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Traditional chatbots make your customers talk to a bot. Axiogen makes your WhatsApp talk like you.
          </p>
        </div>

        {/* Comparison Cards / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Other AI Chatbots */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Other AI Assistants</span>
                <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-900/50 text-red-400 text-[10px] font-mono">
                  The Old Way
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span>You message the AI</span>
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-400">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Separate chatbot link</strong>: Customers must open an external URL or distinct bot number.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Manual prompting required</strong>: You have to copy-paste prompts or instruct it repeatedly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>No takeover logic</strong>: If you reply from your phone, the bot keeps firing over you.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Generic robotic tone</strong>: Obvious markdown asterisks, emojis, and passive brush-offs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Text-only limitation</strong>: Completely ignores spoken voice notes or images.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Axiogen WhatsApp Platform */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-zinc-950 border border-emerald-800/40 flex flex-col justify-between relative shadow-xl">
            <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500 text-zinc-950 font-bold uppercase tracking-wider shadow-sm">
              Our Differentiator
            </span>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Axiogen Persona Platform</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono">
                  Autonomous
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>AI becomes YOU</span>
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Your own WhatsApp account</strong>: Contacts message you directly on your regular number.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Autonomous instant replies</strong>: Answers questions and books slots while you&apos;re busy or asleep.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Seamless Human Override</strong>: The moment you text, bot mutes for 15 mins and auto-resumes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Learns your exact style</strong>: Uses your tone, vocabulary, links, and specific business rules.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Voice &amp; Vision capable</strong>: Transcribes voice notes, sends voice replies, and sees photos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUTCOME-FOCUSED CAPABILITIES */}
      <section id="capabilities" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <span>Real-World Outcomes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Built for how people actually communicate on WhatsApp
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            No technical jargon. Just tangible superpower features that free up hours of your day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Replies Like You</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Speaks in your exact voice, tone, and personality. Never gives generic brush-offs or clumsy robotic replies.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Understands Voice Notes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transcribes incoming spoken voice notes in Hindi, English, and Marathi, and can reply back in native WhatsApp audio notes.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Understands Images &amp; Photos</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inspects incoming photos, receipts, prescriptions, and product screenshots, generating contextual responses immediately.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Remembers Conversations</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Maintains full conversational thread history so multi-part inquiries and recurring client discussions stay natural and coherent.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Works While You Sleep</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Never let a late-night inquiry or urgent lead go cold. The AI captures requirements, answers FAQs, and books calls 24/7.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-zinc-100 mb-2">Take Control Anytime</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Send a text from your phone and the AI pauses automatically for 15 minutes. Your personal voice always takes priority.
            </p>
          </div>
        </div>
      </section>

      {/* 5. USE CASES SECTION */}
      <section id="use-cases" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <span>Tailored For Your Daily Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Who is this built for?
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Save 2 to 4 hours of repetitive WhatsApp typing every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Founders */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">For Founders</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Never miss a high-ticket lead.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you are heads-down building or in meetings, your bot answers partnership questions, qualifies budgets, and books calendar invites.
              </p>
            </div>
          </div>

          {/* Agencies */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">For Agencies</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Respond while doing deep client work.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Keep client response times under 30 seconds even during intense design and dev sprints, then step in whenever personal touch is required.
              </p>
            </div>
          </div>

          {/* Doctors */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">For Doctors &amp; Clinics</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Handle appointment &amp; timing queries.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                While you are attending to patients, the bot answers clinic timings, consultation fees, location directions, and collects pre-visit details.
              </p>
            </div>
          </div>

          {/* Students / Freelancers */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">For Freelancers &amp; Students</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Manage inquiries during lectures &amp; focus.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Handle prospective gig inquiries and client revisions while attending classes or studying, without keeping clients waiting.
              </p>
            </div>
          </div>

          {/* Creators / Influencers */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between sm:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <Sparkle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">For Creators &amp; Influencers</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Handle hundreds of brand sponsorship DMs.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide your media kit, collaboration rates, and manager contact information automatically to brand sponsors while filtering out spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & CONTROL ASSURANCE SECTION */}
      <section id="trust" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peace of Mind</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            You Stay 100% In Control
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            We know what you&apos;re thinking: <em className="text-zinc-300 font-semibold">&ldquo;Will this send weird messages from my account?&rdquo;</em> Here is how we guarantee your safety and privacy:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-100 mb-1">AI Pauses When You Reply</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The instant you send a message from your phone, human takeover activates. The bot steps aside for 15 minutes and will never double-message.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-100 mb-1">AI Never Locks You Out</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Axiogen connects as a linked device via standard WhatsApp QR. You can unlink it with 1 tap directly inside WhatsApp Settings &gt; Linked Devices anytime.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-100 mb-1">Master On/Off Switch</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Toggle auto-replies on or off instantly with a single click in your dashboard. You can also whitelist or blacklist specific phone numbers.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-100 mb-1">Full Real-Time Telemetry</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every incoming message, transcribed voice note, analyzed image, and outgoing reply is streamed live to your private console with exact timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS 4-STEP PROCESS */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <span>Simple 4-Step Setup</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            From zero to live WhatsApp AI persona in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 relative">
            <span className="text-3xl font-extrabold font-mono text-zinc-700 mb-3 block">01</span>
            <h4 className="font-semibold text-sm text-zinc-100 mb-1.5">Connect WhatsApp</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan the QR code or enter an 8-digit pairing code from your phone. No Meta Cloud API hassle.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 relative">
            <span className="text-3xl font-extrabold font-mono text-zinc-700 mb-3 block">02</span>
            <h4 className="font-semibold text-sm text-zinc-100 mb-1.5">Train Your Persona</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select an instant preset or write your prompt with your business info, FAQs, tone, and rules.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 relative">
            <span className="text-3xl font-extrabold font-mono text-zinc-700 mb-3 block">03</span>
            <h4 className="font-semibold text-sm text-zinc-100 mb-1.5">AI Handles Messages</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              It replies to customer texts, transcribes incoming voice notes, and examines images automatically.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 relative border-emerald-900/60 bg-emerald-950/20">
            <span className="text-3xl font-extrabold font-mono text-emerald-500/60 mb-3 block">04</span>
            <h4 className="font-semibold text-sm text-emerald-200 mb-1.5">Take Over Anytime</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Send a text from your phone. The AI mutes instantly for 15 minutes and steps aside for you.
            </p>
          </div>
        </div>
      </section>

      {/* 8. BOLD STATEMENT BANNER (RIGHT BEFORE PRICING) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-zinc-950 via-[#0c0c0e] to-zinc-950 border-y border-zinc-800/80 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl sm:text-3xl md:text-4xl font-extrabold text-zinc-300 leading-snug">
            &ldquo;Your WhatsApp account already works 24/7.<br />
            <span className="text-zinc-500">The problem is that you don&apos;t.</span><br />
            <span className="text-emerald-400">Now it does.&rdquo;</span>
          </p>
        </div>
      </section>

      {/* 9. REVAMPED PRICING SECTION */}
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10 sm:mb-14">
          {/* Free Trial Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>70 Free Messages • No Card Required • Instant Activation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Pay via UPI, RuPay, or NetBanking. Instant GST invoices and activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Starter</span>
                <span className="text-[10px] font-mono text-zinc-500">Solo Creators</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-extrabold font-mono text-white">₹999</span>
                <span className="text-xs text-zinc-500 font-mono"> / month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 font-mono">₹33/day • Never miss a solo client inquiry</p>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Connected WhatsApp Number</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 2,500 AI Messages / month</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Human Override &amp; Auto-Resume</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Voice Note Transcription (Whisper)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multimodal Vision &amp; Photo Inspection</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Instant QR &amp; Phone Pairing</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=starter"
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-center text-zinc-200 hover:text-white transition-colors block"
            >
              Start 70-Msg Free Trial
            </Link>
          </div>

          {/* Business Pro Plan (Popular) */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative shadow-xl shadow-emerald-950/40">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500 text-zinc-950 font-bold uppercase tracking-wider">
              MOST POPULAR
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Business Pro</span>
                <span className="text-[10px] font-mono text-emerald-400/80">Founders &amp; Clinics</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-extrabold font-mono text-white">₹2,999</span>
                <span className="text-xs text-zinc-400 font-mono"> / month</span>
              </div>
              <p className="text-xs text-emerald-400/80 mb-6 font-mono">₹99/day • Complete personal &amp; business engine</p>
              <ul className="space-y-3 text-xs text-zinc-200 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>2 Connected WhatsApp Numbers</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>10,000 AI Messages / month</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Push-To-Talk Voice Note Replies (TTS)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multimodal Vision &amp; Photo Inspection</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Knowledge Base &amp; Personality Studio</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Call Scheduler &amp; Autonomous Reminders</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Priority WhatsApp &amp; UPI Support</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=pro"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs text-center transition-all shadow-md shadow-emerald-500/20 block"
            >
              Start Free Trial (Pro)
            </Link>
          </div>

          {/* Agency Plan */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Agency / Scale</span>
                <span className="text-[10px] font-mono text-zinc-500">Multi-Client</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-extrabold font-mono text-white">₹9,999</span>
                <span className="text-xs text-zinc-500 font-mono"> / month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 font-mono">Multi-tenant client infrastructure</p>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>5 Connected WhatsApp Numbers</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>50,000 AI Messages / month</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-Tenant Sub-Accounts</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Full REST API &amp; Webhook Dispatch</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom CRM / Database Integrations</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Account Manager &amp; SLA</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=agency"
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-center text-zinc-200 hover:text-white transition-colors block"
            >
              Contact Agency Team
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-3xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Got questions? We&apos;ve got answers.
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need Meta Cloud API approval or a new phone number?',
              a: 'No! Axiogen connects directly to your existing WhatsApp or WhatsApp Business account via standard QR code or 8-digit phone pairing. You are set up in under 60 seconds.',
            },
            {
              q: 'How does the human takeover work in real life?',
              a: 'The moment you send a message from your WhatsApp mobile app to any chat, the bot detects it and mutes itself for 15 minutes. It will never talk over you or send conflicting replies.',
            },
            {
              q: 'What happens if a customer sends a voice note?',
              a: 'Axiogen downloads the audio note, transcribes it using Groq Whisper, reasons through your business rules, and replies back in natural text or spoken voice notes.',
            },
            {
              q: 'Can it understand photos and screenshots?',
              a: 'Yes! With our Multimodal Vision engine, customers can send pictures of receipts, errors, prescriptions, or product photos and receive immediate contextual answers.',
            },
            {
              q: 'How does the free trial work?',
              a: 'When you sign up, you immediately receive 70 free messages to test with real contacts. No credit card or upfront payment is required.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform ${
                    faqOpen === idx ? 'transform rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {faqOpen === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 text-center bg-gradient-to-t from-emerald-950/40 via-zinc-950 to-zinc-950 border-t border-zinc-800/80">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop losing leads while you&apos;re away.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Deploy your autonomous WhatsApp persona in 60 seconds with 70 free messages.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 py-8 px-4 sm:px-8 text-xs text-zinc-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Axiogen AI. All rights reserved.</span>
          <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-400">
            <Link href="/login" className="hover:text-zinc-200">Sign In</Link>
            <Link href="/signup" className="hover:text-zinc-200">Create Account</Link>
            <a href="https://api.axiogen.in/whatsapp-saas/health" target="_blank" rel="noreferrer" className="hover:text-zinc-200">
              System Health
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
