'use client';

import { motion } from 'framer-motion';
import type { AssetPreviewItem } from '@stixmagic/types';
import { GalleryCard } from './GalleryCard';
import { Panel } from './Panel';

interface GalleryGridProps {
  assets: AssetPreviewItem[];
}

export const GalleryGrid = ({ assets }: GalleryGridProps) => {
  if (assets.length === 0) {
    return (
      <Panel variant="secondary" className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-text">No assets found</p>
        <p className="mt-2 text-sm text-muted">Try adjusting your filters or search query.</p>
      </Panel>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset, index) => (
        <motion.li
          key={asset.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
        >
          <GalleryCard asset={asset} className="h-full" />
        </motion.li>
      ))}
    </ul>
  );
};
