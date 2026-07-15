'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { MaskDefinition } from '@stixmagic/types';
import { cn } from '../lib/cn';

interface MaskCardProps extends Omit<React.ComponentPropsWithoutRef<typeof motion.button>, 'onSelect'> {
  mask: MaskDefinition;
  selected: boolean;
  onSelect: (mask: MaskDefinition) => void;
}

export const MaskCard = forwardRef<HTMLButtonElement, MaskCardProps>(
  ({ mask, selected, onSelect, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(mask)}
      role="radio"
      aria-checked={selected}
      className={cn(
        'rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50',
      selected
          ? 'border-accent-cyan bg-panel shadow-[0_0_32px_rgba(124,242,255,0.18)]'
          : 'border-white/10 bg-panel-secondary hover:border-white/30',
        className
      )}
      {...props}
    >
      <p className="text-sm font-semibold text-text">{mask.name}</p>
    <p className="mt-2 text-xs leading-relaxed text-muted">{mask.description}</p>
    <span className="mt-3 inline-flex rounded-full bg-background px-2.5 py-1 text-[10px] uppercase tracking-wide text-accent-violet">
        <span className="sr-only">Category: </span>
        {mask.category}
      </span>
    </motion.button>
  )
);

MaskCard.displayName = 'MaskCard';
