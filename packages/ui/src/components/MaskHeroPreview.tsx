'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { MaskDefinition } from '@stixmagic/types';

type MaskPathRecord = Record<MaskDefinition['id'], string>;

const maskPaths: MaskPathRecord = {
  default: 'M 12 12 H 116 V 116 H 12 Z',
  circle: 'M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 Z',
  square: 'M 18 18 H 110 V 110 H 18 Z',
  oval: 'M 64 16 C 95 16 120 37.5 120 64 C 120 90.5 95 112 64 112 C 33 112 8 90.5 8 64 C 8 37.5 33 16 64 16 Z',
  diamond: 'M 64 10 L 118 64 L 64 118 L 10 64 Z',
  star: 'M64 10 L77 46 L115 46 L83 68 L95 106 L64 82 L33 106 L45 68 L13 46 L51 46 Z',
  heart: 'M64 112 C42 90 14 71 14 43 C14 26 27 14 43 14 C53 14 61 20 64 28 C67 20 75 14 85 14 C101 14 114 26 114 43 C114 71 86 90 64 112 Z'
};

interface MaskHeroPreviewProps {
  selectedMask: MaskDefinition;
}

export const MaskHeroPreview = ({ selectedMask }: MaskHeroPreviewProps) => {
  const reduceMotion = useReducedMotion();
  const isSpecial = selectedMask.id === 'star';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-8">
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-violet/20"
        animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <div className="relative grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="relative mx-auto flex h-52 w-52 items-center justify-center" aria-hidden="true">
          <motion.div
            className="absolute inset-4 rounded-full bg-accent-cyan/20 blur-2xl"
            animate={reduceMotion ? undefined : { scale: [0.8, 1.15, 0.8], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: isSpecial ? 2.2 : 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.svg
            key={selectedMask.id}
            viewBox="0 0 128 128"
            className="relative h-44 w-44 text-accent-primary drop-shadow-[0_0_22px_rgba(124,242,255,0.55)]"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0.72, rotate: -12 }}
            animate={reduceMotion
              ? { opacity: 1, scale: 1, rotate: 0 }
              : isSpecial
                ? { opacity: 1, scale: [0.9, 1.08, 0.96, 1.05, 0.9], rotate: [0, 8, -6, 4, 0], y: [0, -8, 3, -4, 0] }
                : { opacity: 1, scale: [0.96, 1.03, 0.96], rotate: [0, 2, 0], y: [0, -4, 0] }}
            transition={reduceMotion ? { duration: 0.25 } : { duration: isSpecial ? 4.8 : 3.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d={maskPaths[selectedMask.id]} />
          </motion.svg>
          {isSpecial ? (
            <motion.span
              className="absolute right-1 top-2 text-2xl text-accent-cyan"
              animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2], scale: [0.7, 1.25, 0.7], rotate: [0, 35, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">
            {isSpecial ? 'Special Moving Mask' : 'Selected Mask'}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-text">{selectedMask.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{selectedMask.description}</p>
          {isSpecial ? (
            <p className="mt-4 inline-flex rounded-full border border-accent-violet/30 bg-accent-violet/10 px-3 py-1 text-xs font-medium text-accent-violet">
              Living motion · glow pulse · Telegram-ready silhouette
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
