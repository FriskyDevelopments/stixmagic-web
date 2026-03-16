'use client';

import { motion } from 'framer-motion';
import type { AssetPreviewItem } from '@stixmagic/types';
import { cn } from '../lib/cn';

interface GalleryCardProps {
  asset: AssetPreviewItem;
  className?: string;
}

export const GalleryCard = ({ asset, className }: GalleryCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={cn(
      'rounded-2xl border border-white/10 bg-panel overflow-hidden shadow-[0_0_0_1px_rgba(124,242,255,0.04),0_24px_80px_rgba(5,6,11,0.45)] transition-transform duration-300',
      className
    )}
  >
    <div className="relative h-32 w-full bg-panel-secondary flex items-center justify-center">
      {asset.previewUrl ? (
        <img src={asset.previewUrl} alt={asset.name} className="h-full w-full object-contain p-3" />
      ) : (
        <span className="text-3xl">✦</span>
      )}
      {asset.formats.includes('gif') && (
        <span className="absolute left-2 top-2 rounded bg-accent-primary/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-text">
          GIF
        </span>
      )}
      {asset.formats.includes('webm') && (
        <span className="absolute left-2 bottom-2 rounded bg-accent-cyan/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-background">
          WebM
        </span>
      )}
    </div>
    <div className="p-4">
      <p className="text-sm font-semibold text-text">{asset.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{asset.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {asset.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);
