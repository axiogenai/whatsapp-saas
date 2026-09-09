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
  title: 'Axiogen — Your WhatsApp Replies Even When You Can\'t',
  description: 'Train an AI version of yourself that handles chats, voice notes, and images on your own WhatsApp account. Take over instantly whenever you want.',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#050505] text-zinc-100 antialiased selection:bg-emerald-900/40 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
