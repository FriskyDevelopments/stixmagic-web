import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Stix Magic',
  description: 'Create polished sticker packs and fun chat interactions in minutes.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-background">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-accent-cyan/20 blur-3xl" />
            <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-accent-violet/25 blur-3xl" />
            <div className="absolute left-1/2 top-20 h-44 w-44 -translate-x-1/2 rounded-full bg-accent-primary/20 blur-3xl" />
          </div>
          <header className="sticky top-0 z-20 border-b border-accent-primary/15 bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="text-xl drop-shadow-[0_0_10px_rgba(0,212,255,0.6)]">🪄</span>
                <span className="bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-violet bg-clip-text text-lg font-extrabold tracking-[0.08em] text-transparent">
                  STIX MAGIC
                </span>
              </Link>
              <nav className="flex items-center gap-6 text-sm text-muted">
                <Link href="/" className="transition hover:text-text">
                  Home
                </Link>
                <Link href="/masks" className="transition hover:text-text">
                  Masks
                </Link>
                <Link href="/dashboard" className="transition hover:text-text">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
