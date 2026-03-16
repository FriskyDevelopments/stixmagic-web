'use client';

import { motion } from 'framer-motion';
import type { AssetPreviewItem } from '@stixmagic/types';
import { GalleryCard } from './GalleryCard';

interface GalleryGridProps {
  assets: AssetPreviewItem[];
}

export const GalleryGrid = ({ assets }: GalleryGridProps) => (
  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    {assets.map((asset, index) => (
      <motion.div
        key={asset.id}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
      >
        <GalleryCard asset={asset} className="h-full" />
      </motion.div>
    ))}
  </section>
);
