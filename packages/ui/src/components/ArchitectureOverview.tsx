'use client';

import { motion } from 'framer-motion';
import { Panel } from './Panel';

const groups = [
  {
    label: 'Applications',
    accent: 'text-accent-primary',
    items: [
      { name: 'apps/web', description: 'Next.js web interface and pack builder UI' },
      { name: 'apps/bot', description: 'Telegram bot runtime and chat integration' }
    ]
  },
  {
    label: 'Services',
    accent: 'text-accent-cyan',
    items: [
      { name: 'services/api', description: 'Packs, stickers, and triggers REST API' },
      { name: 'services/sticker-engine', description: 'Asset processing and mask pipeline' },
      { name: 'services/trigger-engine', description: 'Sticker action execution runtime' }
    ]
  },
  {
    label: 'Packages',
    accent: 'text-accent-violet',
    items: [
      { name: 'packages/ui', description: 'Shared React component library' },
      { name: 'packages/config', description: 'Shared ESLint, TS and tooling config' },
      { name: 'packages/types', description: 'Shared TypeScript type definitions' }
    ]
  }
];

export const ArchitectureOverview = () => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">System Architecture</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">Built for extensibility</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Stix Magic is organized as a monorepo with clear service boundaries. Each layer owns its domain
        and exposes clean contracts to the rest of the system.
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
                  <p className="font-mono text-xs font-medium text-accent-cyan">{item.name}</p>
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
