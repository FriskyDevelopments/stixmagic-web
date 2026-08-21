import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'LORE — Make room for the unseen',
  icons: { icon: '/favicon.svg' },
  description: 'An index of interior weather: profiles, fragments, rituals, and personal creative artifacts.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-background">
          <a
            href="#main-content"
            className="absolute -top-[100px] left-6 z-50 rounded-b-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white transition-all focus-visible:top-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-20 border-b border-accent-primary/15 bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <Link href="/" className="inline-flex items-center gap-3 rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 hover:bg-white/5">
                <span className="grid h-7 w-7 place-items-center rounded-full border border-accent-violet/60 text-xs text-accent-violet" aria-hidden="true">○</span>
                <span className="bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-violet bg-clip-text text-lg font-extrabold tracking-[0.2em] text-transparent">LORE</span>
              </Link>
              <nav className="flex items-center gap-1 text-xs text-muted sm:gap-3 sm:text-sm lg:gap-5" aria-label="Primary navigation">
                <Link href="/#world" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 sm:inline-flex">World</Link>
                <Link href="/lore/archive" className="rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">Archive</Link>
                <Link href="/lore/thread" className="rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">Thread</Link>
                <Link href="/#rituals" className="hidden rounded-md px-2 py-1 transition hover:text-text focus-visible:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 sm:inline-flex">Rituals</Link>
                <Link href="/#shelf" className="rounded-lg border border-accent-primary/30 bg-accent-primary/10 px-3 py-1.5 font-semibold text-accent-cyan transition hover:border-accent-cyan/60 hover:bg-accent-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">Shelf</Link>
              </nav>
            </div>
          </header>
          <main id="main-content" className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-6">{children}</main>
          <footer className="relative z-10 border-t border-accent-primary/10 py-10 text-center">
            <p className="text-xs tracking-[0.35em] text-accent-cyan/50" aria-hidden="true">○ ── ◌ ── ✦ ── ◌ ── ○</p>
            <p className="mt-4 text-sm text-muted">An index of interior weather.</p>
            <p className="mt-2 text-xs text-muted/60">Your Shelf stays in this browser until real accounts exist.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
