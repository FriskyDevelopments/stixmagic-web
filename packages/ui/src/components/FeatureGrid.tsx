'use client';

import { motion } from 'framer-motion';
import { Panel } from './Panel';

export interface FeatureItem {
  title: string;
  description: string;
  tag: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
}

export const FeatureGrid = ({ items }: FeatureGridProps) => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {items.map((item, index) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Panel className="h-full">
          <p className="text-xs uppercase tracking-wider text-accent-cyan">{item.tag}</p>
          <h3 className="mt-3 bg-gradient-to-r from-accent-cyan to-accent-indigo bg-clip-text text-lg font-semibold text-transparent">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
        </Panel>
      </motion.div>
    ))}
  </section>
);
