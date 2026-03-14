import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stix Magic',
  description: 'Sticker alchemy platform for programmable chat interactions.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen bg-background">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-accent-primary/20 blur-3xl" />
            <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-accent-violet/20 blur-3xl" />
          </div>
          <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-text">
              Stix Magic
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted">
              <Link href="/">Home</Link>
              <Link href="/masks">Masks</Link>
            </nav>
          </header>
          <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
