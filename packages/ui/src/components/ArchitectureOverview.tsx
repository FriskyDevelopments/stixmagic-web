'use client';

import { motion } from 'framer-motion';
import { Panel } from './Panel';

const groups = [
  {
    label: 'Create',
    accent: 'text-accent-primary',
    items: [
      { name: 'Fast pack setup', description: 'Build and preview sticker packs without a steep learning curve.' },
      { name: 'Flexible mask styles', description: 'Choose from ready-to-use looks that match different communities.' }
    ]
  },
  {
    label: 'Engage',
    accent: 'text-accent-cyan',
    items: [
      { name: 'Chat-ready output', description: 'Stickers are optimized so they look sharp where people use them.' },
      { name: 'Interactive moments', description: 'Stickers can trigger playful responses that feel alive in chat.' },
      { name: 'Telegram-first experience', description: 'Built for real group conversations from day one.' }
    ]
  },
  {
    label: 'Grow',
    accent: 'text-accent-violet',
    items: [
      { name: 'Consistent quality', description: 'Use one workflow as your sticker catalog expands.' },
      { name: 'Automation-ready', description: 'Add richer behaviors over time without rebuilding everything.' },
      { name: 'Future platform support', description: 'Designed to extend to more chat surfaces as you scale.' }
    ]
  }
];

export const ArchitectureOverview = () => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Why it works</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">Built to feel simple for creators</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The platform handles the heavy lifting in the background, so your focus stays on creating great
        sticker experiences.
      </p>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      {groups.map((group, gi) => (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.3, delay: gi * 0.07 }}
        >
          <Panel variant="secondary" className="h-full">
            <p className={`text-xs uppercase tracking-wider ${group.accent}`}>{group.label}</p>
            <div className="mt-3 space-y-2">
              {group.items.map((item) => (
                <div key={item.name} className="rounded-lg border border-white/5 bg-background p-3">
                  <p className="text-xs font-medium text-accent-cyan">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>
      ))}
    </div>
  </section>
);
