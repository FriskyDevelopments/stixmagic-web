'use client';

import { motion } from 'framer-motion';
import type { MaskDefinition } from '@stixmagic/types';
import { cn } from '../lib/cn';

interface MaskCardProps {
  mask: MaskDefinition;
  selected: boolean;
  onSelect: (mask: MaskDefinition) => void;
}

export const MaskCard = ({ mask, selected, onSelect }: MaskCardProps) => (
  <motion.button
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onSelect(mask)}
    className={cn(
      'rounded-2xl border p-4 text-left transition',
      selected
        ? 'border-accent-cyan bg-panel shadow-[0_0_32px_rgba(124,242,255,0.18)]'
        : 'border-white/10 bg-panel-secondary hover:border-white/30'
    )}
  >
    <p className="text-sm font-semibold text-text">{mask.name}</p>
    <p className="mt-2 text-xs leading-relaxed text-muted">{mask.description}</p>
    <span className="mt-3 inline-flex rounded-full bg-background px-2.5 py-1 text-[10px] uppercase tracking-wide text-accent-violet">
      {mask.category}
    </span>
  </motion.button>
);
