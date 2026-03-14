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
    tag: 'Web App',
    title: 'Pack builder UI',
    description:
      'Create sticker packs, preview masks, and orchestrate triggers in one unified workflow.'
  },
  {
    tag: 'Bot Platform',
    title: 'Chat-native execution',
    description:
      'Telegram-first bot integration detects sticker usage and resolves actions in real time.'
  },
  {
    tag: 'Sticker Engine',
    title: 'Asset optimization pipeline',
    description:
      'Transforms uploads into production-ready sticker assets with metadata and mask state.'
  },
  {
    tag: 'Trigger Engine',
    title: 'Programmable interactions',
    description:
      'Maps sticker events into responses, commands, automations, and external integrations.'
  },
  {
    tag: 'Masks',
    title: 'Processing pipeline',
    description:
      'Composable mask shapes define how sticker assets are cropped, framed, and exported.'
  },
  {
    tag: 'Platform',
    title: 'Cross-platform future',
    description:
      'Clean service contracts ensure Stix Magic can extend beyond Telegram to any messaging platform.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10">
      <Hero
        badge="Interactive Sticker Platform"
        title="Stix Magic makes stickers programmable."
        subtitle="Build sticker packs that trigger chat actions, automations, and live interactions across messaging platforms."
        primaryCta="Launch Product UI"
        secondaryCta="Read Architecture"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">What is Stix Magic?</p>
          <h2 className="mt-3 text-xl font-semibold text-text">Sticker alchemy for chat.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Stix Magic is a sticker alchemy platform where sticker assets become programmable interaction
            objects in chat. Every pack you build carries logic. Every sticker you send can trigger something
            real.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">Architecture</p>
          <h2 className="mt-3 text-xl font-semibold text-text">Built for the long run.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A clean monorepo of apps, services, and shared packages. Sticker processing, trigger resolution,
            and bot runtime are independent services with clear contracts — ready to scale.
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
