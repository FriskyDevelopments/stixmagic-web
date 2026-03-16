'use client';

import { motion } from 'framer-motion';

const pulseTransition = {
  duration: 2.6,
  repeat: Infinity,
  ease: 'easeInOut' as const
};

export const ComingSoonLanding = () => (
  <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden rounded-3xl border border-accent-primary/20 bg-panel px-6 py-14 text-center">
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-cyan/20 blur-3xl"
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.08, 0.95] }}
        transition={pulseTransition}
      />
      <motion.div
        className="absolute right-10 top-8 h-44 w-44 rounded-full bg-accent-violet/20 blur-3xl"
        animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.9, 1.1, 0.9] }}
        transition={{ ...pulseTransition, delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-8 left-8 h-40 w-40 rounded-full bg-accent-primary/20 blur-3xl"
        animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.9, 1.06, 0.9] }}
        transition={{ ...pulseTransition, delay: 0.6 }}
      />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative z-10 mx-auto max-w-2xl"
    >
      <p className="inline-flex items-center rounded-full border border-accent-cyan/30 bg-panel-secondary px-4 py-1 text-xs uppercase tracking-[0.18em] text-accent-cyan">
        Main site update
      </p>
      <h1 className="mt-6 bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-violet bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
        Coming Soon
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        Stix Magic is preparing a focused launch experience for the main domain. Full rollout is in progress.
      </p>

      <div className="mt-8 flex items-center justify-center gap-2">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-2.5 w-2.5 rounded-full bg-accent-cyan"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://preview.stixmagic.com"
          className="rounded-xl bg-gradient-to-r from-accent-primary via-accent-indigo to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] transition hover:translate-y-[-1px]"
        >
          Open Preview
        </a>
        <a
          href="https://github.com/FriskyDevelopments/stixmagic-web"
          className="rounded-xl border border-accent-primary/25 bg-panel-secondary px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/60 hover:text-accent-cyan"
        >
          Follow Updates
        </a>
      </div>
    </motion.div>
  </section>
);
