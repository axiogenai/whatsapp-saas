import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Axiogen WhatsApp Platform | Autonomous B2B WhatsApp AI Engine',
  description: 'Deploy 24/7 autonomous WhatsApp AI agents for your business with zero-code pairing, custom persona studio, natural conversational speech, and real-time inbox takeover.',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-zinc-800 selection:text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
