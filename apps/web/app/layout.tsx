import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700']
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-mono'
});

export const metadata: Metadata = {
  title: 'STIX MΛGIC — Telegram Reaction Engine',
  icons: { icon: '/favicon.svg' },
  description: 'Turn Telegram stickers and emojis into programmable group reactions from one magical control center.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body className={inter.className}>
        <div className="relative min-h-screen bg-background">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="stix-float absolute -left-24 top-8 h-64 w-64 rounded-full bg-accent-violet/10 blur-3xl" />
            <div className="stix-float-reverse absolute right-0 top-40 h-56 w-56 rounded-full bg-accent-violet/10 blur-3xl" />
          </div>
          <a
            href="#main-content"
            className="absolute -top-[100px] left-6 z-50 rounded-b-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-background transition-all focus-visible:top-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-20 border-b border-line bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-site items-center justify-between px-5 py-4 sm:px-10">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 hover:bg-white/5"
              >
                <Image src="/favicon.svg" alt="" width={28} height={28} aria-hidden="true" />
                <span className="whitespace-nowrap text-[17px] font-bold tracking-[0.02em] text-white">
                  STIX <em className="text-accent-violet">MΛGIC</em>
                </span>
              </Link>
              <nav className="flex items-center gap-1 text-xs text-muted sm:gap-3 sm:text-sm lg:gap-6">
                <Link href="/" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 sm:inline-flex">Home</Link>
                <Link href="/ecosystem" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 lg:inline-flex">Ecosystem</Link>
                <Link href="/packs" className="rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">Packs</Link>
                <Link href="/gallery" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 md:inline-flex">Gallery</Link>
                <Link href="/generator" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 lg:inline-flex">Generator</Link>
                <Link href="/masks" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 lg:inline-flex">Masks</Link>
                <Link
                  href="/dashboard"
                  className="whitespace-nowrap rounded-lg bg-accent-primary px-2.5 py-1.5 text-xs font-bold text-background transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 sm:text-sm"
                >
                  Control center
                </Link>
              </nav>
            </div>
          </header>
          <main id="main-content" className="relative z-10 mx-auto w-full max-w-site px-5 pb-16 pt-6 sm:px-10">{children}</main>
          <footer className="relative z-10 border-t border-line py-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted" aria-hidden="true">△ ── ◯ ── ✦ ── ◯ ── △</p>
            <p className="mt-4 text-sm text-muted">
              Forged with a Frisky Paw and a daring heart.
            </p>
            <p className="mt-1 text-sm text-muted">
              Bringing the magic of{' '}
              <span className="font-bold text-white">
                STIX <em className="text-accent-violet">MΛGIC</em>
              </span>{' '}
              to life.
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.06em] text-muted/60">FriskyDevelopments</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
