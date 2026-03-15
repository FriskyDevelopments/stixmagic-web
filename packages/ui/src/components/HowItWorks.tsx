'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Pick your image',
    description: 'Start with any image you want to turn into a sticker.'
  },
  {
    number: '02',
    title: 'Choose a mask style',
    description: 'Select the shape that best matches your style, brand, or community vibe.'
  },
  {
    number: '03',
    title: 'Add a simple interaction',
    description: 'Optionally connect a sticker to a reply, reaction, or automation.'
  },
  {
    number: '04',
    title: 'Share and watch it spread',
    description: 'Publish to chat and let your community use stickers that feel alive.'
  }
];

export const HowItWorks = () => (
  <section id="how-it-works" className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Simple flow</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">How it works</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Go from idea to shareable sticker pack in four easy steps.
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
