'use client';

import { motion } from 'framer-motion';
import type { ProductPack } from '@stixmagic/types';
import { PackCard } from './PackCard';

interface PackGridProps {
  packs: ProductPack[];
}

export const PackGrid = ({ packs }: PackGridProps) => (
  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {packs.map((pack, index) => (
      <motion.div
        key={pack.id}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <PackCard pack={pack} className="h-full" />
      </motion.div>
    ))}
  </section>
);
