'use client';

import { motion } from 'framer-motion';
import type { AssetPreviewItem } from '@stixmagic/types';
import { AssetPreview } from './AssetPreview';

/**
 * Animated preview showcase for the home page hero.
 *
 * Accepts up to 6 `AssetPreviewItem` entries from the pipeline manifest.
 * - Items with a real `previewUrl` render an `AssetPreview` image tile.
 * - Items with an empty `previewUrl` (pending pipeline output) render the
 *   animated letter/symbol placeholder tile instead.
 * - If `items` is omitted entirely, all 6 slots show placeholder tiles.
 *
 * As soon as the pipeline manifest starts producing preview URLs, real
 * assets appear here automatically without any further code change.
 */

interface PlaceholderTile {
  label: string;
  color: string;
  glowColor: string;
  delay: number;
  size?: 'sm' | 'md' | 'lg';
}

const PLACEHOLDER_TILES: PlaceholderTile[] = [
  { label: 'A', color: '#4d86ff', glowColor: 'rgba(77,134,255,0.45)', delay: 0, size: 'lg' },
  { label: 'B', color: '#7cf2ff', glowColor: 'rgba(124,242,255,0.45)', delay: 0.15, size: 'md' },
  { label: '✦', color: '#9d7dff', glowColor: 'rgba(157,125,255,0.45)', delay: 0.3, size: 'md' },
  { label: 'Z', color: '#4d86ff', glowColor: 'rgba(77,134,255,0.35)', delay: 0.1, size: 'md' },
  { label: '♪', color: '#7cf2ff', glowColor: 'rgba(124,242,255,0.35)', delay: 0.25, size: 'lg' },
  { label: '↗', color: '#9d7dff', glowColor: 'rgba(157,125,255,0.4)', delay: 0.4, size: 'sm' }
];

const sizeClasses: Record<NonNullable<PlaceholderTile['size']>, string> = {
  sm: 'h-16 w-16 text-2xl',
  md: 'h-20 w-20 text-3xl',
  lg: 'h-24 w-24 text-4xl'
};

const TILE_BASE = 'rounded-2xl border border-white/10 bg-panel-secondary';

interface HeroAssetShowcaseProps {
  className?: string;
  /** Up to 6 assets from the pipeline manifest. Items with real previewUrls render actual images. */
  items?: AssetPreviewItem[];
}

export const HeroAssetShowcase = ({ className, items }: HeroAssetShowcaseProps) => (
  <div className={`grid grid-cols-3 gap-3 ${className ?? ''}`} aria-hidden="true">
    {PLACEHOLDER_TILES.map((tile, index) => {
      const item = items?.[index];
      const hasPreview = item && item.previewUrl !== '';
      const delay = tile.delay;

      return (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay }}
        >
          {hasPreview ? (
            <div
              className={`overflow-hidden ${TILE_BASE} ${sizeClasses[tile.size ?? 'md']}`}
            >
              <AssetPreview url={item.previewUrl} alt={item.name} imageClassName="h-full w-full object-cover" />
            </div>
          ) : (
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 18px 2px ${tile.glowColor}`,
                  `0 0 32px 6px ${tile.glowColor}`,
                  `0 0 18px 2px ${tile.glowColor}`
                ]
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeInOut' }}
              className={`flex items-center justify-center ${TILE_BASE} font-bold ${sizeClasses[tile.size ?? 'md']}`}
              style={{ color: tile.color }}
            >
              <motion.span
                animate={{ opacity: [1, 0.6, 1], scale: [1, 1.12, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: delay + 0.3, ease: 'easeInOut' }}
              >
                {tile.label}
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      );
    })}
  </div>
);
