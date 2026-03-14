import { FeatureGrid, Hero, Panel, Tabs } from '@stixmagic/ui';

const features = [
  {
    tag: 'Web App',
    title: 'Pack builder UI',
    description: 'Create sticker packs, preview masks, and orchestrate triggers in one workflow.'
  },
  {
    tag: 'Bot Platform',
    title: 'Chat-native execution',
    description: 'Telegram-first bot integration detects sticker usage and resolves actions in real-time.'
  },
  {
    tag: 'Sticker Engine',
    title: 'Asset optimization pipeline',
    description: 'Transforms uploads into production-ready sticker assets with metadata and mask state.'
  },
  {
    tag: 'Trigger Engine',
    title: 'Programmable interactions',
    description: 'Maps sticker events into responses, commands, automations, and external integrations.'
  }
];

const statusTabs = [
  {
    id: 'vision',
    label: 'Vision',
    content:
      'Stix Magic turns stickers into interactive interface objects where every sticker can launch behavior in chat.'
  },
  {
    id: 'platform',
    label: 'Platform',
    content:
      'The architecture is built for Telegram today with clean contracts for Discord, Slack, and future channels.'
  },
  {
    id: 'development',
    label: 'Development Status',
    content:
      'Monorepo foundations are scaffolded with web, bot, API, sticker processing, and trigger services ready for iteration.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-8 pb-10">
      <Hero
        badge="Interactive Sticker Platform"
        title="Stix Magic makes stickers programmable."
        subtitle="Build sticker packs that trigger chat actions, automations, and live interactions across messaging platforms."
        primaryCta="Launch Product UI"
        secondaryCta="Read Architecture"
      />

      <FeatureGrid items={features} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold text-text">Vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Stix Magic introduces sticker alchemy: image assets transformed into executable chat objects with composable
            trigger logic.
          </p>
        </Panel>
        <Panel variant="secondary">
          <h2 className="text-xl font-semibold text-text">Development Focus</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Current priorities include robust sticker processing, trigger observability, and a premium product interface.
          </p>
        </Panel>
      </section>

      <Tabs items={statusTabs} />
    </div>
  );
}
