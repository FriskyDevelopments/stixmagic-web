'use client';

import { motion } from 'framer-motion';
import type { ProductPack } from '@stixmagic/types';
import { PACK_CATEGORY_LABELS } from '@stixmagic/types';
import { cn } from '../lib/cn';

interface PackCardProps {
  pack: ProductPack;
  className?: string;
}

export const PackCard = ({ pack, className }: PackCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={cn(
      'rounded-2xl border border-white/10 bg-panel overflow-hidden shadow-[0_0_0_1px_rgba(124,242,255,0.04),0_24px_80px_rgba(5,6,11,0.45)] transition-transform duration-300',
      className
    )}
  >
    <div className="relative h-40 w-full bg-panel-secondary flex items-center justify-center">
      {pack.previewUrl ? (
        <img src={pack.previewUrl} alt={pack.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-xl bg-accent-primary/20 flex items-center justify-center">
            <span className="text-2xl text-accent-primary">✦</span>
          </div>
        </div>
      )}
      {pack.featured && (
        <span className="absolute right-3 top-3 rounded-full bg-accent-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text">
          Featured
        </span>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-text">{pack.name}</h3>
        <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[10px] uppercase tracking-wide text-accent-violet">
          {PACK_CATEGORY_LABELS[pack.category]}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{pack.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {pack.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted">{pack.assetCount} assets</span>
        <div className="flex gap-1">
          {pack.formats.map((fmt) => (
            <span key={fmt} className="rounded bg-panel-secondary px-1.5 py-0.5 text-[10px] font-mono text-accent-cyan">
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);
