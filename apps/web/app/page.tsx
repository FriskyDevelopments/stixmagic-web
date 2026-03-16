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
    tag: 'Create',
    title: 'Build sticker packs in minutes',
    description:
      'Pick your images, choose a mask style, and publish a clean pack without a complex setup.'
  },
  {
    tag: 'Share',
    title: 'Made for Telegram communities',
    description:
      'Your stickers are ready for real chat moments, reactions, and group conversations.'
  },
  {
    tag: 'Quality',
    title: 'Consistent look on every sticker',
    description:
      'Automatic processing helps your stickers feel polished, readable, and on-brand.'
  },
  {
    tag: 'Interact',
    title: 'Turn stickers into actions',
    description:
      'Connect each sticker to simple outcomes like replies, reactions, or automations.'
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
      'Start small, then expand your sticker experience as your audience grows.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10">
      <Hero
        badge="For creators and communities"
        title="Make stickers people actually want to use."
        subtitle="Create beautiful sticker packs fast and add lightweight interactions that make chats more fun."
        primaryCta="Explore Masks"
        primaryHref="/masks"
        secondaryCta="See How It Works"
        secondaryHref="#how-it-works"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">What is Stix Magic?</p>
          <h2 className="mt-3 text-xl font-semibold text-text">A faster way to ship better stickers.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Stix Magic helps you turn simple images into polished sticker packs with personality. Build once,
            publish quickly, and keep your audience engaged with playful interactions.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">Why creators like it</p>
          <h2 className="mt-3 text-xl font-semibold text-text">Powerful without the complexity.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            You get quality output, simple workflows, and room to grow. Advanced capabilities stay behind the
            scenes so the day-to-day experience stays clean.
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
