"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ArrowRight,
  Check,
  Play,
  RotateCcw,
  Shield,
  Clock,
  Mic,
  Eye,
  Brain,
  Zap,
  Briefcase,
  Building2,
  Stethoscope,
  GraduationCap,
  Sparkles,
  MessageSquare,
  ChevronDown,
  CheckCheck,
  Smartphone,
  Activity,
  Calendar,
  Phone,
  Video,
  Image as ImageIcon
} from 'lucide-react';

export default function LandingPage() {
  // Interactive Simulator State
  const [activeScenario, setActiveScenario] = useState<'takeover' | 'voice' | 'vision'>('takeover');
  const [takeoverStep, setTakeoverStep] = useState<number>(3); // 1: contact, 2: ai reply, 3: human override
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glow (inspired by portfolio-redesign) */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-gradient-to-b from-emerald-500/[0.05] via-emerald-500/[0.01] to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-[1800px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-emerald-500/[0.03] to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-[3600px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-emerald-500/[0.04] to-transparent rounded-full blur-3xl" />

      {/* Top Banner (Seamless, no hard border lines) */}
      <div className="px-4 py-2.5 text-center text-xs text-zinc-400 flex items-center justify-center gap-2 bg-zinc-950/40 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 font-mono text-[10px] uppercase tracking-wider font-semibold border border-zinc-800">
          New
        </span>
        <span>
          Multimodal Vision &amp; Voice Note Engine is live.
        </span>
        <Link href="/signup" className="text-white underline font-medium hover:text-zinc-200 ml-1 inline-flex items-center gap-0.5">
          Get 70 Free Messages &rarr;
        </Link>
      </div>

      {/* Floating Glass Navigation Bar (No full-width border line) */}
      <header className="h-16 px-4 sm:px-8 bg-[#09090b]/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-white">
              AXIOGEN
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 pl-2">
              WhatsApp Persona Engine
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#demo" className="hover:text-white transition-colors">Takeover Demo</a>
          <a href="#comparison" className="hover:text-white transition-colors">Why We&apos;re Different</a>
          <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Workflows</a>
          <a href="#trust" className="hover:text-white transition-colors">Security &amp; Control</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 text-center max-w-4xl mx-auto flex flex-col items-center relative">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-medium mb-6 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>The WhatsApp Assistant That Steps Aside When You Type</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.15] sm:leading-[1.12] max-w-3xl">
          Your WhatsApp replies <br className="hidden sm:inline" />
          even when you can&apos;t.
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Train an AI version of yourself that handles chats, voice notes, and images on your own WhatsApp account. Take over instantly whenever you want.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Start Free Trial (70 Messages)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="px-5 py-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-zinc-400" />
            <span>Watch 60s Demo</span>
          </a>
        </div>

        {/* Micro-Trust Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> No card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> 60-second QR setup
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> 15-minute auto-mute
          </span>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE WHATSAPP SIMULATOR (Seamlessly integrated into page flow) */}
      <section id="demo" className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Interactive Demonstration</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            The AI becomes you. But it never speaks over you.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Traditional bots conflict with manual replies. Axiogen continuously monitors your outbound thread. The second you text from your phone, the engine mutes for 15 minutes.
          </p>
        </div>

        {/* Simulator Device Card */}
        <div className="max-w-3xl mx-auto border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#0b141a] shadow-2xl">
          {/* Top WhatsApp App Header */}
          <div className="h-14 px-4 sm:px-5 bg-[#1f2c34] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-white font-medium text-xs">
                  RL
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1f2c34]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-medium text-zinc-100">Rohan Mehta (Client Lead)</span>
                </div>
                <span className="text-[11px] text-zinc-400">online</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-zinc-400">
              <Video className="w-4 h-4 hover:text-zinc-200 cursor-pointer hidden sm:block" />
              <Phone className="w-4 h-4 hover:text-zinc-200 cursor-pointer hidden sm:block" />
              {/* Telemetry Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111b21] border border-zinc-700/60 text-[11px] font-mono">
                {activeScenario === 'takeover' && takeoverStep >= 3 ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="text-amber-300">AI Muted (14:52)</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-300">AI Autopilot</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Scenario Tab Selector */}
          <div className="bg-[#111b21] px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-zinc-500 text-[11px] font-mono shrink-0 mr-1">Scenario:</span>
            <button
              onClick={() => { setActiveScenario('takeover'); setTakeoverStep(3); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                activeScenario === 'takeover'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. Human Takeover (Auto-Mute)
            </button>
            <button
              onClick={() => setActiveScenario('voice')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                activeScenario === 'voice'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Voice Note Transcription
            </button>
            <button
              onClick={() => setActiveScenario('vision')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                activeScenario === 'vision'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Photo &amp; Document Vision
            </button>
          </div>

          {/* Chat Canvas Body */}
          <div className="p-4 sm:p-6 space-y-4 min-h-[330px] flex flex-col justify-center bg-[#0b141a]">
            {activeScenario === 'takeover' && (
              <>
                {/* Contact Message */}
                <div className="flex flex-col items-start max-w-[85%] sm:max-w-md">
                  <div className="bg-[#202c33] text-[#e9edef] px-3.5 py-2.5 rounded-lg rounded-tl-none text-xs sm:text-sm leading-relaxed shadow-sm">
                    Hey Aditya, are you free for a quick 10-minute call regarding the retainer contract?
                    <div className="text-[10px] text-zinc-400 text-right mt-1">11:42 AM</div>
                  </div>
                </div>

                {/* AI Automated Reply */}
                {takeoverStep >= 2 && (
                  <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                    <div className="bg-[#005c4b] text-[#e9edef] px-3.5 py-2.5 rounded-lg rounded-tr-none text-xs sm:text-sm leading-relaxed text-left shadow-sm">
                      Hey Rohan! Aditya is currently in a client deployment sprint until 1:00 PM. I can lock in a 15-minute Google Meet for you at 1:30 PM or 3:00 PM today. Would either work?
                      <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-300 mt-1">
                        <span className="text-emerald-300 font-mono text-[9px] uppercase tracking-wider">AI Persona</span>
                        <span>• 11:42 AM</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Human Takeover Event Marker */}
                {takeoverStep >= 3 && (
                  <div className="my-2 py-1.5 px-3 rounded-lg bg-[#111b21] border border-zinc-800 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-amber-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Aditya replied manually from phone &rarr; Bot muted for 15 mins</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Auto-resumes on inactivity</span>
                  </div>
                )}

                {/* Manual Human Message */}
                {takeoverStep >= 3 && (
                  <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                    <div className="bg-[#005c4b] text-[#e9edef] px-3.5 py-2.5 rounded-lg rounded-tr-none text-xs sm:text-sm leading-relaxed text-left shadow-sm border border-emerald-500/30">
                      Hey Rohan, jumping in from my phone! 1:30 PM works great. Sending over the calendar invite now.
                      <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-300 mt-1">
                        <span className="text-white font-medium text-[10px]">Aditya (Human)</span>
                        <span>• 11:45 AM</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeScenario === 'voice' && (
              <>
                {/* Contact Sends Voice Note */}
                <div className="flex flex-col items-start max-w-[85%] sm:max-w-md">
                  <div className="bg-[#202c33] text-[#e9edef] p-3 rounded-lg rounded-tl-none w-72 text-xs leading-relaxed shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1 bg-zinc-600 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-2/3"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                          <span>0:18</span>
                          <span>Voice Note</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#111b21] p-2 rounded border border-zinc-700/50 text-[11px] text-zinc-300 font-mono">
                      <span className="text-zinc-500">Whisper Transcript:</span> &ldquo;Hey Aditya, could you confirm if the API supports webhook retries on 500 errors?&rdquo;
                    </div>
                    <div className="text-[10px] text-zinc-400 text-right mt-1">2:14 PM</div>
                  </div>
                </div>

                {/* AI Replies Contextually */}
                <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                  <div className="bg-[#005c4b] text-[#e9edef] px-3.5 py-2.5 rounded-lg rounded-tr-none text-xs sm:text-sm leading-relaxed text-left shadow-sm">
                    Yes Rohan, our webhook dispatcher performs exponential backoff retries (3 attempts: 1m, 5m, 15m) on any HTTP 5xx code before flagging a delivery failure.
                    <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-300 mt-1">
                      <span className="text-emerald-300 font-mono text-[9px] uppercase tracking-wider">AI Persona</span>
                      <span>• 2:14 PM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeScenario === 'vision' && (
              <>
                {/* Contact Sends an Image */}
                <div className="flex flex-col items-start max-w-[85%] sm:max-w-md">
                  <div className="bg-[#202c33] text-[#e9edef] p-2 rounded-lg rounded-tl-none text-xs leading-relaxed shadow-sm">
                    <div className="w-64 h-32 bg-[#111b21] rounded border border-zinc-700 flex flex-col items-center justify-center gap-1.5 text-zinc-400 mb-2">
                      <ImageIcon className="w-6 h-6 text-zinc-500" />
                      <span className="text-[11px] font-mono">architecture-diagram.png</span>
                      <span className="text-[10px] text-zinc-500">Multimodal Vision Active</span>
                    </div>
                    <p className="px-1 text-xs">Can your engine sit between our FastAPI server and MinIO storage here?</p>
                    <div className="text-[10px] text-zinc-400 text-right mt-1">4:05 PM</div>
                  </div>
                </div>

                {/* AI Inspects Image & Answers Contextually */}
                <div className="flex flex-col items-end self-end max-w-[85%] sm:max-w-md">
                  <div className="bg-[#005c4b] text-[#e9edef] px-3.5 py-2.5 rounded-lg rounded-tr-none text-xs sm:text-sm leading-relaxed text-left shadow-sm">
                    Inspected the diagram. Yes, you can route the signed S3 URLs through Axiogen Vault on port 8001 directly before MinIO to handle zero-exposure credential verification.
                    <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-300 mt-1">
                      <span className="text-emerald-300 font-mono text-[9px] uppercase tracking-wider">AI Persona (Vision)</span>
                      <span>• 4:05 PM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Simulator Action Controls */}
          {activeScenario === 'takeover' && (
            <div className="p-3 bg-[#1f2c34] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-[11px] font-mono">Sequence:</span>
                <button
                  onClick={() => setTakeoverStep(1)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    takeoverStep === 1 ? 'bg-zinc-800 text-white' : 'bg-[#111b21] text-zinc-400 hover:text-white'
                  }`}
                >
                  1. Contact Inbound
                </button>
                <button
                  onClick={() => setTakeoverStep(2)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    takeoverStep === 2 ? 'bg-zinc-800 text-white' : 'bg-[#111b21] text-zinc-400 hover:text-white'
                  }`}
                >
                  2. AI Replies
                </button>
                <button
                  onClick={() => setTakeoverStep(3)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    takeoverStep === 3 ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60' : 'bg-[#111b21] text-zinc-400 hover:text-white'
                  }`}
                >
                  3. Human Takeover
                </button>
              </div>

              <button
                onClick={() => {
                  setTakeoverStep(1);
                  setTimeout(() => setTakeoverStep(2), 700);
                  setTimeout(() => setTakeoverStep(3), 1600);
                }}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: ARCHITECTURAL COMPARISON (Seamless continuous page flow) */}
      <section id="comparison" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Why We&apos;re Different</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Built different from traditional chatbots
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Traditional AI chatbots make customers talk to a bot on an external website. Axiogen transforms your real WhatsApp account into an autonomous extension of yourself.
          </p>
        </div>

        {/* Comparison Matrix Card */}
        <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-950/60 backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-900/40 text-zinc-400 font-mono text-xs">
                  <th className="py-4 px-5 font-medium">Capability</th>
                  <th className="py-4 px-5 font-medium">Generic AI Chatbots</th>
                  <th className="py-4 px-5 font-medium text-emerald-400 bg-emerald-950/20">
                    Axiogen WhatsApp Persona
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Where it operates</td>
                  <td className="py-4 px-5 text-zinc-400">External website widget or dedicated bot phone number</td>
                  <td className="py-4 px-5 text-zinc-200 font-medium bg-emerald-950/10">
                    Your real personal or business WhatsApp number (Multi-Device)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Human Collision Handling</td>
                  <td className="py-4 px-5 text-zinc-400">No takeover logic. The bot continues typing over the human owner</td>
                  <td className="py-4 px-5 text-emerald-300 font-medium bg-emerald-950/10">
                    Instant Human Takeover. Mutes AI for 15 mins on any manual send
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Voice Note Processing</td>
                  <td className="py-4 px-5 text-zinc-400">Audio notes ignored or return generic error</td>
                  <td className="py-4 px-5 text-zinc-200 font-medium bg-emerald-950/10">
                    Whisper v3 transcribes Hindi, English &amp; Marathi; sends voice replies
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Multimodal Vision</td>
                  <td className="py-4 px-5 text-zinc-400">Text-only interface</td>
                  <td className="py-4 px-5 text-zinc-200 font-medium bg-emerald-950/10">
                    Inspects receipts, prescriptions, error screenshots &amp; photos
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Tone &amp; Persona</td>
                  <td className="py-4 px-5 text-zinc-400">Generic ChatGPT assistant tone with robotic markdown asterisks</td>
                  <td className="py-4 px-5 text-zinc-200 font-medium bg-emerald-950/10">
                    Custom-tuned to your vocabulary, writing cadence, links &amp; policies
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-5 font-medium text-zinc-200">Setup Friction</td>
                  <td className="py-4 px-5 text-zinc-400">Weeks of Meta Business Manager paperwork, credit cards &amp; approvals</td>
                  <td className="py-4 px-5 text-zinc-200 font-medium bg-emerald-950/10">
                    60-second QR or 8-digit pairing. Zero Meta developer accounts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: CAPABILITIES BENTO (Seamless flow) */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Engineered for how people actually communicate
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Tangible outcomes that protect your reputation, eliminate repetitive messaging, and capture high-intent leads.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bento 1: Large Takeover Feature (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                15-Minute Human Override Protocol
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                The engine detects manual outbound messages originating from your phone. The second you send a text, the bot engages a 15-minute quiet debounce window. If no further manual text occurs for 15 minutes, autonomous mode silently re-engages.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900/80 flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Zero duplicate messages
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Instant mute
              </span>
            </div>
          </div>

          {/* Bento 2: Multimodal Engine (Span 1) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Voice &amp; Vision Native
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Processes incoming voice notes using Whisper across English, Hindi, and Marathi. Vision inspects diagrams, prescriptions, and receipts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900/80 text-xs font-mono text-zinc-500">
              <span>Supports audio PTT &amp; images</span>
            </div>
          </div>

          {/* Bento 3: Memory & Context (Span 1) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Thread Context Memory
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Retains context across multi-turn inquiries. Remembers client requirements, past agreements, and schedules without repeating itself.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900/80 text-xs font-mono text-zinc-500">
              <span>Multi-turn retention</span>
            </div>
          </div>

          {/* Bento 4: 24/7 Booking & Autonomous Reminders (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-5">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Autonomous Call Scheduling &amp; Task Reminders
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                Equipped with function-calling tools. Can book consultation slots with Meet links, set autonomous reminders for you or clients, and qualify lead budgets while you sleep.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-900/80 flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Google Meet booking
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Lead qualification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AUDIENCE WORKFLOWS */}
      <section id="use-cases" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Target Workflows</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Who relies on Axiogen every day?
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Save 2 to 4 hours of repetitive WhatsApp typing every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1.5">Founders &amp; Executives</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Keep investor and enterprise lead response times under 30 seconds while you are heads-down in sprint reviews or strategy meetings.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1.5">Agencies &amp; Consultancies</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide instant answers to retainer clients regarding project deliverables and timelines without breaking engineers&apos; flow state.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1.5">Doctors &amp; Clinics</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatically resolve OPD hours, consultation fees, clinic location pins, and preliminary intake while attending to patients.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1.5">Freelancers &amp; Creators</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automate rate card sharing, project qualification, and sponsorship media kit inquiries while filtering out low-budget spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTROL & TRUST ASSURANCE */}
      <section id="trust" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Guaranteed Peace of Mind</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            You stay 100% in control
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            We know what you&apos;re thinking: <em className="text-zinc-300 font-semibold">&ldquo;Will this send weird messages from my account?&rdquo;</em> Here is how we guarantee your safety and privacy:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex gap-4 items-start backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-1">AI Pauses When You Reply</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you reply to any contact from your phone, the engine silences AI generation for 15 minutes. It will never double-message or conflict.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex gap-4 items-start backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-1">Standard WhatsApp Linked Device</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Operates strictly as an authorized WhatsApp Linked Device. You can unlink session access with a single tap in your phone settings anytime.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex gap-4 items-start backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-1">Master Switch &amp; Live Telemetry</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every inbound query and outbound response is logged live in your dashboard. A global master toggle allows instant 1-click pausing.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex gap-4 items-start backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white mb-1">Strict Isolation &amp; Zero Training</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your messages and persona prompt are encrypted in isolated tenant storage. LLM inference runs via zero-retention enterprise endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PROPOSITION BANNER (Fluid, atmospheric transition) */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 text-center relative">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl sm:text-3xl md:text-4xl font-semibold text-zinc-200 tracking-tight leading-snug">
            &ldquo;Your WhatsApp account already works 24/7.<br />
            <span className="text-zinc-500">The problem is that you don&apos;t.</span><br />
            <span className="text-emerald-400">Now it does.&rdquo;</span>
          </p>
        </div>
      </section>

      {/* SECTION 8: PRICING MATRIX */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto w-full relative">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Pricing Plans</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>70 Free Messages on Signup • No Credit Card Required</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Simple, Flat-Rate Pricing
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Includes GST tax invoices, instant UPI/RuPay activation, and automatic multi-device session restoration.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium backdrop-blur-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/60">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Starter</span>
                <span className="text-[10px] font-mono text-zinc-500">Solo Operators</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-semibold text-white">
                  {billingCycle === 'monthly' ? '₹999' : '₹799'}
                </span>
                <span className="text-xs text-zinc-500 font-mono"> / month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 font-mono">
                {billingCycle === 'annual' ? 'Billed ₹9,588 annually' : '₹33/day • Solo founders & freelancers'}
              </p>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 1 Connected WhatsApp Number</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 2,500 AI Messages / month</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 15-Minute Human Override Circuit</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Voice Note Transcription (Whisper)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Multimodal Vision &amp; Photo Inspection</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Standard QR &amp; Phone Pairing</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=starter"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-center text-zinc-200 hover:text-white transition-colors block cursor-pointer"
            >
              Start Free Trial (70 Msgs)
            </Link>
          </div>

          {/* Business Pro Plan (Most Popular) */}
          <div className="bg-zinc-950/90 border-2 border-emerald-600/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative shadow-xl backdrop-blur-sm">
            <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-600 text-white font-semibold uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Business Pro</span>
                <span className="text-[10px] font-mono text-zinc-400">Founders &amp; Clinics</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-semibold text-white">
                  {billingCycle === 'monthly' ? '₹2,999' : '₹2,399'}
                </span>
                <span className="text-xs text-zinc-400 font-mono"> / month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 font-mono">
                {billingCycle === 'annual' ? 'Billed ₹28,788 annually' : '₹99/day • Complete business presence'}
              </p>
              <ul className="space-y-3 text-xs text-zinc-200 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>2 Connected WhatsApp Numbers</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>10,000 AI Messages / month</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Push-To-Talk Voice Note Synthesis (TTS)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Multimodal Vision &amp; Photo Inspection</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom Knowledge Base &amp; Personality Studio</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Google Meet Booking &amp; Task Reminders</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Priority WhatsApp &amp; UPI Support</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=pro"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition-colors block shadow-sm cursor-pointer"
            >
              Start Free Trial (Pro)
            </Link>
          </div>

          {/* Agency Plan */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Agency / Scale</span>
                <span className="text-[10px] font-mono text-zinc-500">Multi-Client</span>
              </div>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-semibold text-white">
                  {billingCycle === 'monthly' ? '₹9,999' : '₹7,999'}
                </span>
                <span className="text-xs text-zinc-500 font-mono"> / month</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 font-mono">
                {billingCycle === 'annual' ? 'Billed ₹95,988 annually' : 'Multi-client agency infrastructure'}
              </p>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>5 Connected WhatsApp Numbers</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> <strong>50,000 AI Messages / month</strong></li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Multi-Tenant Sub-Accounts</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Full REST API &amp; Webhook Dispatch</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom CRM / DB Integrations</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Account Manager &amp; SLA</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=agency"
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-center text-zinc-200 hover:text-white transition-colors block cursor-pointer"
            >
              Contact Agency Team
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-3xl mx-auto w-full relative">
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need Meta Cloud API approval or a separate phone number?',
              a: 'No. Axiogen uses the official WhatsApp Multi-Device protocol via QR code or 8-digit phone pairing. You keep your existing personal or business phone number without Meta business verification or message template fees.',
            },
            {
              q: 'How does the human takeover work when I text someone?',
              a: 'The moment an outbound message is dispatched from your phone to any chat, the engine recognizes your owner JID and immediately activates a 15-minute quiet debounce window. The AI will not generate any replies in that chat until 15 minutes of complete inactivity elapse.',
            },
            {
              q: 'How does the engine handle incoming voice notes?',
              a: 'Audio notes are extracted via Baileys and transcribed using Groq Whisper v3 across English, Hindi, and Marathi. The persona reasons over the text and answers either in concise text or authentic WhatsApp PTT voice notes.',
            },
            {
              q: 'Can the AI inspect photos, invoices, and documents?',
              a: 'Yes. Inbound image messages are processed through our vision reasoning pipeline, allowing your persona to extract details from receipts, diagrams, prescriptions, and screenshots.',
            },
            {
              q: 'How does the free trial work?',
              a: 'New signups receive 70 free AI messages immediately upon pairing their WhatsApp. No credit card or upfront payment is required.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-zinc-800/80 rounded-xl bg-zinc-950/60 overflow-hidden backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-zinc-200 hover:text-white cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform ${
                    openFaq === idx ? 'transform rotate-180 text-emerald-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/80 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 text-center relative">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 mb-5 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Stop losing leads while you&apos;re heads-down.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
            Deploy your autonomous WhatsApp persona in under 60 seconds with 70 complimentary messages.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Get Started with 70 Free Messages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER (Seamless, no hard top line) */}
      <footer className="py-12 px-4 sm:px-8 text-xs text-zinc-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Axiogen AI. All rights reserved.</span>
          <div className="flex flex-wrap justify-center items-center gap-5 text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
            <a href="https://team.axiogen.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Team Axiogen
            </a>
            <a href="https://api.axiogen.in/whatsapp-saas/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              System Health
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
