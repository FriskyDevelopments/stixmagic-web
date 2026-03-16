'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  /** Optional content rendered in the right column on larger screens. */
  previewSlot?: ReactNode;
}

export const Hero = ({ badge, title, subtitle, primaryCta, secondaryCta, previewSlot }: HeroProps) => (
  <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel px-8 py-14">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-accent-primary/20 blur-3xl"
    />
    <div className={`relative z-10 flex items-center gap-12 ${previewSlot ? 'lg:gap-16' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className={`${previewSlot ? 'max-w-xl lg:max-w-lg xl:max-w-xl' : 'max-w-3xl'}`}
      >
        <span className="inline-flex rounded-full border border-white/10 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-cyan">
          {badge}
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-xl bg-accent-primary px-5 py-3 text-sm font-semibold text-text transition hover:opacity-90">
            {primaryCta}
          </button>
          <button className="rounded-xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/50">
            {secondaryCta}
          </button>
        </div>
      </motion.div>

      {previewSlot && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="hidden shrink-0 lg:block"
          aria-hidden="true"
        >
          {previewSlot}
        </motion.div>
      )}
    </div>
  </section>
);

