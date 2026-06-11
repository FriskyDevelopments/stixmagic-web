'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ProductPack } from '@stixmagic/types';
import { PackCard } from './PackCard';
import { Panel } from './Panel';

interface PackGridProps {
  packs: ProductPack[];
}

export const PackGrid = ({ packs }: PackGridProps) => {
  if (packs.length === 0) {
    return (
      <Panel variant="secondary" className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-text">No packs found</p>
        <p className="mt-2 text-sm text-muted">Try adjusting your filters or search query.</p>
      </Panel>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packs.map((pack, index) => (
        <motion.li
          key={pack.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link
            href={{ pathname: '/packs/[id]', query: { id: pack.id } }}
            className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
          >
            <PackCard pack={pack} className="h-full" />
          </Link>
        </motion.li>
      ))}
    </ul>
  );
};
