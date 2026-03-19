'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta: string;
  secondaryHref?: string;
  /** Optional content rendered in the right column on larger screens. */
  previewSlot?: ReactNode;
}

export const Hero = ({
  badge,
  title,
  subtitle,
  primaryCta,
  primaryHref = '/packs',
  secondaryCta,
  secondaryHref = '/ecosystem',
  previewSlot
}: HeroProps) => (
  <section className="relative overflow-hidden rounded-3xl border border-accent-primary/20 bg-panel px-8 py-14">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-accent-cyan/20 blur-3xl"
    />
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-accent-violet/20 blur-3xl"
    />
    <div className={`relative z-10 flex items-center gap-12 ${previewSlot ? 'lg:gap-16' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className={`${previewSlot ? 'max-w-xl lg:max-w-lg xl:max-w-xl' : 'max-w-3xl'}`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-cyan">
          <span aria-hidden>✦</span>
          {badge}
        </span>
        <h1 className="mt-5 bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-violet bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded-xl bg-gradient-to-r from-accent-primary via-accent-indigo to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_36px_rgba(168,85,247,0.55)]"
          >
            {primaryCta}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-xl border border-accent-primary/25 bg-panel-secondary px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/60 hover:text-accent-cyan"
          >
            {secondaryCta}
          </Link>
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
