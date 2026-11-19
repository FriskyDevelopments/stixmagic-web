'use client';

import { type ReactNode, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Stinger-timed hero choreography (brand book §12):
 * - A diagonal slice wipes in over ~550ms and covers the viewport.
 * - The ✦ mark breathes at full cover, then the window opens and exits.
 * - Total sequence: 1.4s at the stinger's locked timing.
 * With prefers-reduced-motion the stinger never mounts and every
 * entrance becomes an instant colour/opacity change.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
/** Content lands as the stinger passes its 550ms transition point. */
const REVEAL_DELAY = 0.55;

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: REVEAL_DELAY + delay, ease: EASE }
});

interface CinematicHeroProps {
  primaryCta: string;
  primaryHref: Route;
  secondaryCta: string;
  secondaryHref: Route;
}

export const StingerIntro = () => (
  <div className="stx-stinger" aria-hidden="true">
    <div className="stx-stinger-panel" />
    <div className="stx-stinger-slice" />
    <span className="stx-stinger-star">✦</span>
  </div>
);

export const CinematicHero = ({ primaryCta, primaryHref, secondaryCta, secondaryHref }: CinematicHeroProps) => {
  const reduceMotion = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduceMotion || !fieldRef.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      // Brand §11.7: the hero gradient follows the cursor, capped at a 4% shift.
      fieldRef.current.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width - 0.5) * 100}%`);
      fieldRef.current.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height - 0.5) * 100}%`);
    },
    [reduceMotion]
  );

  return (
    <section
      onPointerMove={onPointerMove}
      className="relative -mx-5 -mt-6 overflow-hidden px-5 pb-20 pt-16 sm:-mx-10 sm:px-10 sm:pt-24"
    >
      <div ref={fieldRef} className="stx-hero-field" aria-hidden="true">
        <div className="stx-hero-grid" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-site items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]">
        <div>
          <motion.p {...enter(0)} className="stx-eyebrow">
            Telegram reaction engine · living layer
          </motion.p>

          <motion.h1 {...enter(0.12)} className="stx-display mt-6">
            Make every sticker
            <br />
            <em>come alive ✦</em>
          </motion.h1>

          <motion.p {...enter(0.24)} className="stx-lede mt-6 max-w-xl">
            Connect a Telegram group, map any sticker or emoji to a magical response,
            and run the whole reaction loop from one calm control center.
          </motion.p>

          <motion.div {...enter(0.36)} className="mt-9 flex flex-wrap gap-3">
            <Link href={primaryHref} className="stx-cta">
              {primaryCta}
            </Link>
            <Link href={secondaryHref} className="stx-cta-quiet">
              {secondaryCta}
            </Link>
          </motion.div>

          <motion.p {...enter(0.46)} className="mt-9 font-mono text-[13px] tracking-[0.02em] text-muted/80" lang="es">
            Elige un estilo y la magia sucede ✦
          </motion.p>

          <motion.div {...enter(0.56)} className="mt-10 flex gap-10">
            <p className="stx-stat">
              Stinger
              <strong>1.4 s</strong>
            </p>
            <p className="stx-stat">
              Cut point
              <strong>550 ms</strong>
            </p>
            <p className="stx-stat">
              Frame budget
              <strong>84 @ 60</strong>
            </p>
          </motion.div>
        </div>

        <ReactionLoopStage />
      </div>
    </section>
  );
};

const LOOP_STEPS: Array<{ tile: string; label: string; detail: string; accent?: string }> = [
  { tile: '◯', label: 'Trigger', detail: 'A sticker or emoji lands in chat' },
  { tile: '△', label: 'Rule', detail: 'Your mapping picks the response' },
  { tile: '✦', label: 'Magic', detail: 'The loop answers in kind', accent: '#9d7dff' }
];

const STATES: Array<{ name: string; color: string; live?: boolean }> = [
  { name: 'Ambient', color: '#9d7dff', live: true },
  { name: 'Calm', color: '#7cf2ff' },
  { name: 'Hype', color: '#ff7fdc' },
  { name: 'Meeting', color: '#4d86ff' }
];

const ReactionLoopStage = (): ReactNode => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: REVEAL_DELAY + 0.3, ease: EASE }}
      className="stx-glass p-6 sm:p-7"
      aria-label="The reaction loop"
    >
      <div className="flex items-center justify-between">
        <p className="stx-eyebrow">The loop</p>
        <span className={`stx-glow-breathe text-xl ${reduceMotion ? '' : ''}`} aria-hidden="true" style={{ color: 'var(--stx-violet)', textShadow: '0 0 24px rgba(157,125,255,.8)' }}>
          ✦
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {LOOP_STEPS.map((step, index) => (
          <div key={step.label}>
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: REVEAL_DELAY + 0.5 + index * 0.26, ease: EASE }}
              className="stx-loop-step stx-glow-card"
            >
              <span className="stx-loop-tile" aria-hidden="true">{step.tile}</span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-text">{step.label}</span>
                <span className="block truncate text-[13px] text-muted">{step.detail}</span>
              </span>
              {step.accent && (
                <span className="ml-auto font-mono text-xs uppercase tracking-[0.06em]" style={{ color: step.accent }}>
                  live
                </span>
              )}
            </motion.div>
            {index < LOOP_STEPS.length - 1 && (
              <div className="stx-loop-arrow pl-8 leading-none" aria-hidden="true">↓</div>
            )}
          </div>
        ))}
      </div>

      <div className="stx-wand-seam mt-6" aria-hidden="true" />

      <div className="stx-states mt-5" aria-label="Living layer states">
        {STATES.map((state) => (
          <span key={state.name} className={`stx-state ${state.live ? 'is-live' : ''}`}>
            <span className="stx-state-dot" style={{ color: state.color }} aria-hidden="true" />
            {state.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
