'use client';

import { motion } from 'framer-motion';

const phases = [
  {
    phase: 'Foundation',
    status: 'complete',
    items: ['Monorepo scaffolding', 'Package boundaries', 'Type definitions', 'CI configuration']
  },
  {
    phase: 'Platform Core',
    status: 'active',
    items: [
      'Sticker processing pipeline',
      'Pack management API',
      'Mask system',
      'Web UI foundation'
    ]
  },
  {
    phase: 'Interaction Engine',
    status: 'upcoming',
    items: [
      'Trigger definition system',
      'Bot runtime integration',
      'Real-time event processing',
      'Observability layer'
    ]
  },
  {
    phase: 'Expansion',
    status: 'future',
    items: [
      'Multi-platform support',
      'Advanced mask compositing',
      'Programmable behaviors',
      'Developer SDK'
    ]
  }
];

const statusStyles: Record<string, string> = {
  complete: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10',
  active: 'text-accent-primary border-accent-primary/30 bg-accent-primary/10',
  upcoming: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10',
  future: 'text-muted border-white/10 bg-white/5'
};

const statusLabels: Record<string, string> = {
  complete: 'Complete',
  active: 'In progress',
  upcoming: 'Upcoming',
  future: 'Future'
};

export const Roadmap = () => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Development</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">Roadmap</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Stix Magic is being built incrementally. Here is where things stand.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {phases.map((phase, i) => (
        <motion.div
          key={phase.phase}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="rounded-2xl border border-white/10 bg-panel p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-text">{phase.phase}</h3>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide ${statusStyles[phase.status]}`}
            >
              {statusLabels[phase.status]}
            </span>
          </div>
          <ul className="mt-3 space-y-1">
            {phase.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-muted">
                <span className="mt-px text-accent-cyan">·</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </section>
);
