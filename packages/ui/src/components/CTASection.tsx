'use client';

import { motion } from 'framer-motion';

export const CTASection = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.45 }}
    className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-10 text-center"
  >
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 rounded-full bg-accent-primary/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-56 rounded-full bg-accent-violet/15 blur-3xl" />
    </div>
    <div className="relative z-10">
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Follow the build</p>
      <h2 className="mt-4 text-3xl font-semibold text-text">Stix Magic is being built in the open.</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Star the repository, watch for updates, and get involved as the platform grows from foundation into a
        full sticker interaction system.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://github.com/PupFr/stixmagic-web"
          className="rounded-xl bg-accent-primary px-5 py-3 text-sm font-semibold text-text transition hover:opacity-90"
        >
          View on GitHub
        </a>
        <a
          href="/masks"
          className="rounded-xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/50"
        >
          Explore Masks
        </a>
      </div>
    </div>
  </motion.section>
);
