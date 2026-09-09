'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bot, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <Bot className="w-5 h-5 text-white group-hover:text-[#25D366] transition-colors" />
            <span className="font-semibold text-sm tracking-wider text-white">AXIOGEN</span>
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-white/50 hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            <Link href="#faq" className="text-sm text-white/50 hover:text-white transition-colors">FAQ</Link>
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-[#25D366] hover:bg-[#22c55e] text-white h-9 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white/50 hover:text-white transition-colors p-2 -mr-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[#050505] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-white" />
                <span className="font-semibold text-sm tracking-wider text-white">AXIOGEN</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/50 hover:text-white p-2 -mr-2"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              <Link 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-white/65 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-white/65 hover:text-white transition-colors"
              >
                How it works
              </Link>
              <Link 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-white/65 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-white/65 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </div>

            <div className="p-6 border-t border-white/[0.06] flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-4 text-sm font-medium text-white hover:bg-white/[0.04] rounded-xl transition-colors border border-transparent hover:border-white/[0.08]"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white h-[52px] rounded-xl text-base font-medium flex items-center justify-center transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
