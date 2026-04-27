'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export const CTASection = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.45 }}
    className="relative overflow-hidden rounded-3xl border border-accent-primary/20 bg-panel p-10 text-center"
  >
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 rounded-full bg-accent-primary/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-56 rounded-full bg-accent-violet/15 blur-3xl" />
    </div>
    <div className="relative z-10">
      <p className="text-xs uppercase tracking-widest text-accent-cyan/70">✦ ───────── ✦</p>
      <p className="mt-4 text-xs uppercase tracking-wider text-accent-cyan">Enter the PØRTAL</p>
      <h2 className="mt-4 text-3xl font-semibold text-text">Ready to begin your sticker alchemy?</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Explore mask styles, shape your visual identity, and transform everyday chat into something
        your community will remember.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/masks"
          className="rounded-xl bg-gradient-to-r from-accent-primary via-accent-indigo to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_36px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
        >
          Explore Masks
        </Link>
        <a
          href="https://github.com/FriskyDevelopments/stixmagic-web"
          className="rounded-xl border border-accent-primary/25 bg-panel-secondary px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/60 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
        >
          Follow the Build
        </a>
      </div>
      <p className="mt-10 text-xs text-accent-cyan/50 tracking-widest">△ ── ◯ ── ✦ ── ◯ ── △</p>
    </div>
  </motion.section>
);
