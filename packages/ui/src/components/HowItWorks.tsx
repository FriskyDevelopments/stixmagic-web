'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '△',
    title: 'Feed your image',
    description: 'Start with any image — photo, illustration, or artwork — and bring it into the alchemy lab.'
  },
  {
    number: '◯',
    title: 'Choose a mask style',
    description: 'Select the shape that transforms your image into a refined symbol with the right vibe.'
  },
  {
    number: '✦',
    title: 'Add an enchantment',
    description: 'Optionally connect your sticker to a reply, reaction, or automation for living magic in chat.'
  },
  {
    number: '🪄',
    title: 'Release into the world',
    description: 'Publish to chat and watch your community wield stickers that feel alive and distinctly yours.'
  }
];

export const HowItWorks = () => (
  <section id="how-it-works" className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wider text-accent-cyan">The Λlchemy</p>
      <h2 className="mt-2 text-2xl font-semibold text-text">How the transformation works</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Four steps from raw image to living magic in chat.
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
          <p className="text-3xl text-accent-primary/40">{step.number}</p>
          <h3 className="mt-2 text-base font-semibold text-text">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);
