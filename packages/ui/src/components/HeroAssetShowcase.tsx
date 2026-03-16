'use client';

import { motion } from 'framer-motion';

/**
 * Animated preview showcase for the home page hero.
 *
 * Displays a grid of animated letter / symbol tiles representing the kinds of
 * assets the MagicStix pipeline produces (animated GIFs, neon letters, stickers).
 * Each tile uses Framer Motion loops to simulate looping animation so the hero
 * feels live even before real pipeline GIFs are available.
 *
 * When pipeline preview URLs are wired up, swap the tile content for actual
 * <img> or <video> elements using the AssetPreview component.
 */

interface ShowcaseTile {
  label: string;
  color: string;
  glowColor: string;
  delay: number;
  size?: 'sm' | 'md' | 'lg';
}

const tiles: ShowcaseTile[] = [
  { label: 'A', color: '#4d86ff', glowColor: 'rgba(77,134,255,0.45)', delay: 0, size: 'lg' },
  { label: 'B', color: '#7cf2ff', glowColor: 'rgba(124,242,255,0.45)', delay: 0.15, size: 'md' },
  { label: '✦', color: '#9d7dff', glowColor: 'rgba(157,125,255,0.45)', delay: 0.3, size: 'md' },
  { label: 'Z', color: '#4d86ff', glowColor: 'rgba(77,134,255,0.35)', delay: 0.1, size: 'md' },
  { label: '♪', color: '#7cf2ff', glowColor: 'rgba(124,242,255,0.35)', delay: 0.25, size: 'lg' },
  { label: '↗', color: '#9d7dff', glowColor: 'rgba(157,125,255,0.4)', delay: 0.4, size: 'sm' }
];

const sizeClasses: Record<NonNullable<ShowcaseTile['size']>, string> = {
  sm: 'h-16 w-16 text-2xl',
  md: 'h-20 w-20 text-3xl',
  lg: 'h-24 w-24 text-4xl'
};

interface HeroAssetShowcaseProps {
  className?: string;
}

export const HeroAssetShowcase = ({ className }: HeroAssetShowcaseProps) => (
  <div className={`grid grid-cols-3 gap-3 ${className ?? ''}`} aria-hidden="true">
    {tiles.map((tile) => (
      <motion.div
        key={tile.label}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: tile.delay }}
      >
        <motion.div
          animate={{
            boxShadow: [
              `0 0 18px 2px ${tile.glowColor}`,
              `0 0 32px 6px ${tile.glowColor}`,
              `0 0 18px 2px ${tile.glowColor}`
            ]
          }}
          transition={{ duration: 2.2, repeat: Infinity, delay: tile.delay, ease: 'easeInOut' }}
          className={`flex items-center justify-center rounded-2xl border border-white/10 bg-panel-secondary font-bold ${sizeClasses[tile.size ?? 'md']}`}
          style={{ color: tile.color }}
        >
          <motion.span
            animate={{ opacity: [1, 0.6, 1], scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: tile.delay + 0.3, ease: 'easeInOut' }}
          >
            {tile.label}
          </motion.span>
        </motion.div>
      </motion.div>
    ))}
  </div>
);
