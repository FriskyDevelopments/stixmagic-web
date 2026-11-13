'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref?: Route;
  secondaryCta: string;
  secondaryHref?: Route;
  /** Optional content rendered in the right column on larger screens. */
  previewSlot?: ReactNode;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const Hero = ({
  badge,
  title,
  subtitle,
  primaryCta,
  primaryHref = '/packs',
  secondaryCta,
  secondaryHref = '/ecosystem',
  previewSlot
}: HeroProps) => {
  const reduceMotion = useReducedMotion();
  // Framer serializes motion values into the SSR style attribute but not into the
  // first client render, so parallax styles must wait until after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -72]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduceMotion ? 1 : 0.25]);
  const previewY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 96]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Entry props stay identical on server and client; MotionConfig below is what
  // strips transform animation for reduced-motion users, without a hydration mismatch.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE_OUT }
  });

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} className="relative overflow-hidden rounded-3xl border border-accent-primary/20 bg-panel px-8 py-14">
      <motion.div
        aria-hidden="true"
        style={mounted ? { opacity: orbOpacity } : undefined}
        className="pointer-events-none absolute inset-0"
      >
        <span className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-accent-cyan/20 blur-3xl" />
        <span className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-accent-violet/20 blur-3xl" />
      </motion.div>

      <div className={`relative z-10 flex items-center gap-12 ${previewSlot ? 'lg:gap-16' : ''}`}>
        <motion.div
          style={mounted && !reduceMotion ? { y: copyY, opacity: copyOpacity } : undefined}
          className={`${previewSlot ? 'max-w-xl lg:max-w-lg xl:max-w-xl' : 'max-w-3xl'}`}
        >
          <motion.span {...enter(0.05)} className="inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-cyan">
            <span aria-hidden>✦</span>
            {badge}
          </motion.span>

          <span className="mt-5 block overflow-hidden pb-[0.14em] mb-[-0.14em]">
            <motion.h1
              initial={{ y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE_OUT }}
              className="bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-violet bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"
            >
              {title}
            </motion.h1>
          </span>

          <motion.p {...enter(0.42)} className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </motion.p>

          <motion.div {...enter(0.54)} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="rounded-xl bg-gradient-to-r from-accent-primary via-accent-indigo to-accent-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_36px_rgba(168,85,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
            >
              {primaryCta}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-xl border border-accent-primary/25 bg-panel-secondary px-5 py-3 text-sm font-semibold text-text transition hover:border-accent-cyan/60 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
            >
              {secondaryCta}
            </Link>
          </motion.div>
        </motion.div>

        {previewSlot && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
            style={mounted && !reduceMotion ? { y: previewY } : undefined}
            className="hidden shrink-0 lg:block"
            aria-hidden="true"
          >
            {previewSlot}
          </motion.div>
        )}
      </div>
      </section>
    </MotionConfig>
  );
};
