'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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

/** Columns drift at different rates while scrolling so the grid reads as depth, not a flat block. */
const COLUMN_DRIFT_PX = [64, 0, -64];

const toWebm = (url: string) => url.replace(/\.gif(\?|$)/i, '.webm$1');

interface TileMediaProps {
  url: string;
  alt: string;
  sizeClass: string;
  reduceMotion: boolean | null;
}

const TileMedia = ({ url, alt, sizeClass, reduceMotion }: TileMediaProps) => {
  const [armed, setArmed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const webmUrl = toWebm(url);
  const hasWebm = webmUrl !== url && !reduceMotion;

  return (
    <div
      className={`relative overflow-hidden ${TILE_BASE} ${sizeClass}`}
      onMouseEnter={() => {
        setArmed(true);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setArmed(true);
        setHovered(true);
      }}
      onBlur={() => setHovered(false)}
    >
      <AssetPreview url={url} alt={alt} imageClassName="h-full w-full object-cover" />
      {hasWebm && armed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <AssetPreview url={webmUrl} alt="" imageClassName="h-full w-full object-cover" />
        </motion.div>
      )}
    </div>
  );
};

interface HeroAssetShowcaseProps {
  className?: string;
  /** Up to 6 assets from the pipeline manifest. Items with real previewUrls render actual images. */
  items?: AssetPreviewItem[];
}

export const HeroAssetShowcase = ({ className, items }: HeroAssetShowcaseProps) => {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'end start'] });
  const driftLeft = useTransform(scrollYProgress, [0, 1], [COLUMN_DRIFT_PX[0], reduceMotion ? 0 : -COLUMN_DRIFT_PX[0]]);
  const driftCenter = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const driftRight = useTransform(scrollYProgress, [0, 1], [COLUMN_DRIFT_PX[2], reduceMotion ? 0 : -COLUMN_DRIFT_PX[2]]);
  const columnDrift = [driftLeft, driftCenter, driftRight];

  return (
    <div ref={gridRef} className={`grid grid-cols-3 gap-3 ${className ?? ''}`} aria-hidden="true">
      {PLACEHOLDER_TILES.map((tile, index) => {
        const item = items?.[index];
        const hasPreview = item && item.previewUrl !== '';
        const delay = tile.delay;
        const sizeClass = sizeClasses[tile.size ?? 'md'];

        return (
          <motion.div key={tile.label} style={mounted && !reduceMotion ? { y: columnDrift[index % 3] } : undefined}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay }}
            >
              {hasPreview ? (
                <TileMedia url={item.previewUrl} alt={item.name} sizeClass={sizeClass} reduceMotion={reduceMotion} />
              ) : (
                <motion.div
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            `0 0 18px 2px ${tile.glowColor}`,
                            `0 0 32px 6px ${tile.glowColor}`,
                            `0 0 18px 2px ${tile.glowColor}`
                          ]
                        }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeInOut' }}
                  className={`flex items-center justify-center ${TILE_BASE} font-bold ${sizeClass}`}
                  style={{ color: tile.color }}
                >
                  <motion.span
                    animate={reduceMotion ? undefined : { opacity: [1, 0.6, 1], scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: delay + 0.3, ease: 'easeInOut' }}
                  >
                    {tile.label}
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
