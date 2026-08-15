'use client';

import { motion } from 'framer-motion';
import type { AssetPreviewItem } from '@stixmagic/types';
import { cn } from '../lib/cn';
import { AssetPreview } from './AssetPreview';

interface GalleryCardProps {
  asset: AssetPreviewItem;
  className?: string;
}

export const GalleryCard = ({ asset, className }: GalleryCardProps) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.012 }}
    className={cn(
      'group rounded-[1.75rem] border border-white/10 bg-panel overflow-hidden shadow-[0_0_0_1px_rgba(124,242,255,0.04),0_24px_80px_rgba(5,6,11,0.45)] transition-transform duration-500',
      className
    )}
  >
    <div className="relative h-56 w-full overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(124,92,255,.22),transparent_48%),linear-gradient(145deg,#090a18,#05060b)]">
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[.12] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:24px_24px]" />
      <AssetPreview url={asset.previewUrl} alt={asset.name} imageClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.18em] text-white backdrop-blur-md"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan shadow-[0_0_8px_currentColor]" />Live loop</span>
      {asset.formats.includes('gif') && (
        <span className="absolute left-2 top-2 rounded bg-accent-primary/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-text">
          <span className="sr-only">Format: </span>
          GIF
        </span>
      )}
      {asset.formats.includes('webm') && (
        <span className="absolute bottom-2 left-2 rounded bg-accent-cyan/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-background">
          <span className="sr-only">Format: </span>
          WebM
        </span>
      )}
    </div>
    <div className="p-5">
      <p className="text-sm font-semibold text-text">{asset.name}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{asset.description}</p>
      <ul aria-label="Tags" className="mt-2 flex flex-wrap gap-1">
        {asset.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);
