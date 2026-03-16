import {
  ArchitectureOverview,
  CTASection,
  FeatureGrid,
  Hero,
  HowItWorks,
  Panel,
  Roadmap
} from '@stixmagic/ui';

const features = [
  {
    tag: 'Transmute',
    title: 'Images into symbols',
    description:
      'Feed any image into the alchemy engine and watch it emerge as a refined symbol with personality.'
  },
  {
    tag: 'Shape',
    title: 'Symbols into stickers',
    description:
      'Pick a mask style, preview the shape, and forge your symbol into a polished, chat-ready sticker.'
  },
  {
    tag: 'Quality',
    title: 'Consistent look on every sticker',
    description:
      'Automatic processing ensures your stickers feel polished, readable, and on-brand every time.'
  },
  {
    tag: 'Enchant',
    title: 'Stickers into magic in chat',
    description:
      'Connect each sticker to replies, reactions, or automations that make conversations feel alive.'
  },
  {
    tag: 'Style',
    title: 'Mask styles for every vibe',
    description:
      'From classic to expressive shapes, preview and pick the look that fits your pack.'
  },
  {
    tag: 'Scale',
    title: 'Grow from a single pack',
    description:
      'Start with one pack, then expand your sticker alchemy as your community grows.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10">
      <Hero
        badge="Sticker Λlchemy Lab"
        title="Transform images into magic in chat."
        subtitle="Enter the creative workshop where images become symbols, symbols become stickers, and stickers become magic in every conversation."
        primaryCta="Explore Masks"
        primaryHref="/masks"
        secondaryCta="Enter the PØRTAL"
        secondaryHref="#how-it-works"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">What is STIX MΛGIC?</p>
          <h2 className="mt-3 text-xl font-semibold text-text">A Sticker Λlchemy Lab.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            STIX MΛGIC transforms simple images into polished sticker packs with personality. A modern
            alchemy laboratory — playful and intriguing, where every image enters as raw material and
            emerges as something memorable.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">Why creators choose it</p>
          <h2 className="mt-3 text-xl font-semibold text-text">Elegant magic without the complexity.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            You get refined output, clean workflows, and room to grow. The advanced alchemy stays behind
            the scenes so the day-to-day experience remains elegant and focused.
          </p>
        </Panel>
      </section>

      <FeatureGrid items={features} />

      <ArchitectureOverview />

      <HowItWorks />

      <Roadmap />

      <CTASection />
    </div>
  );
}
