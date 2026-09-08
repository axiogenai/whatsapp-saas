import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Axiogen WhatsApp SaaS | Autonomous Multi-Tenant AI Bot Engine',
  description: 'Deploy 24/7 autonomous WhatsApp bots for your business with zero-code pairing, custom AI persona, natural speech, and live inbox takeover.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
