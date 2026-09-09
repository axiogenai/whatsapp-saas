import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-white/30" />
          <span className="text-sm text-white/30 font-medium">Axiogen</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            Get Started
          </Link>
          <Link href="/dashboard" className="text-xs text-white/25 hover:text-white/50 transition-colors">
            Dashboard
          </Link>
        </div>

        <div className="text-xs text-white/20">
          © {new Date().getFullYear()} Axiogen AI
        </div>
      </div>
    </footer>
  );
}
