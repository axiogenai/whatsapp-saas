"use client";

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WhatsAppSimulator from '@/components/landing/WhatsAppSimulator';
import Features from '@/components/landing/Features';
import ProductShowcase from '@/components/landing/ProductShowcase';
import HowItWorks from '@/components/landing/HowItWorks';
import Comparison from '@/components/landing/Comparison';
import UseCases from '@/components/landing/UseCases';
import Trust from '@/components/landing/Trust';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-[#050505]">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#25D366]/[0.04] via-[#25D366]/[0.01] to-transparent blur-3xl" />
        <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-[#25D366]/[0.02] to-transparent blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <WhatsAppSimulator />
        <Features />
        <ProductShowcase />
        <HowItWorks />
        <Comparison />
        <UseCases />
        <Trust />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
