'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Upload or create asset',
    description:
      'Start with any image. The sticker engine accepts uploads from the workspace UI or direct API input.'
  },
  {
    number: '02',
    title: 'Process with sticker engine',
    description:
      'The sticker engine applies your chosen mask, resizes to spec, and optimizes the asset for chat delivery.'
  },
  {
    number: '03',
    title: 'Attach trigger logic',
    description:
      'Define what happens when someone uses your sticker — commands, messages, webhooks, or bot reactions.'
  },
  {
    number: '04',
    title: 'Activate in chat',
    description:
      'Deploy your pack via the Telegram bot. Every sticker usage fires its attached trigger in real time.'
  }
];

export const HowItWorks = () => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Process</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">How it works</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        From raw asset to interactive chat object in four steps.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="relative rounded-2xl border border-white/10 bg-panel p-5"
        >
          <p className="text-4xl font-semibold text-accent-primary/20">{step.number}</p>
          <h3 className="mt-2 text-base font-semibold text-text">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);
