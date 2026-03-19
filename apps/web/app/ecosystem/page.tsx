import { FeatureGrid, Panel, Tabs } from '@stixmagic/ui';

const components = [
  {
    tag: 'Stickers',
    title: 'Static & animated stickers',
    description: 'Chat-ready stickers in WebP and GIF formats. Built from source images or generated from text styles.'
  },
  {
    tag: 'Motion Alphabet',
    title: 'Animated letter sets',
    description:
      'A–Z character animations with looping motion presets. Drop into overlays, banners, or sticker packs.'
  },
  {
    tag: 'Symbols & Signals',
    title: 'Neon symbols and signals',
    description: 'Animated neon arrows, icons, and signal indicators for live production and streaming.'
  },
  {
    tag: 'Overlays',
    title: 'Transparent WebM overlays',
    description: 'OBS and Streamlabs-ready overlay assets with transparent backgrounds for live stream scenes.'
  },
  {
    tag: 'Packs',
    title: 'Curated asset packs',
    description: 'Themed collections of related assets bundled with metadata and format variants for easy download.'
  },
  {
    tag: 'Pipeline',
    title: 'Bot-driven generation',
    description: 'All assets are produced by the MagicStix bot pipeline — this site presents, previews, and serves them.'
  }
];

const repoTabs = [
  {
    id: 'bot',
    label: 'Bot Repo',
    content:
      'The stixmagic-bot repository is the source asset generation engine. It runs the animation pipeline, manages motion presets, exports GIFs and WebMs, generates packs, and produces metadata manifests. It does not have a public UI.'
  },
  {
    id: 'web',
    label: 'Web Repo',
    content:
      'This stixmagic-web repository is the presentation and interaction layer. It displays the catalog, previews assets, scaffolds the generator UI, and will handle the storefront and downloads flow. It consumes outputs from the bot pipeline.'
  },
  {
    id: 'integration',
    label: 'Integration',
    content:
      'The web repo is designed to consume metadata JSON, generated preview assets, and pack manifests produced by the bot pipeline. No asset generation logic lives here — only presentation, preview, and future generator frontend.'
  }
];

export default function EcosystemPage() {
  return (
    <div className="space-y-8 pb-10">
      <Panel>
        <span className="inline-flex rounded-full border border-white/10 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-cyan">
          Ecosystem Overview
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          The MagicStix ecosystem.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          MagicStix is a modular visual system with a clean split between asset generation and presentation. The bot
          pipeline creates everything. This site shows, previews, and serves it.
        </p>
      </Panel>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold text-text">Asset generation repo</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The <span className="font-mono text-accent-cyan">stixmagic-bot</span> repository is the production engine.
            It handles all asset creation, animation export, pack generation, and metadata production.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {[
              'Source image and text ingestion',
              'Animation and motion preset rendering',
              'GIF, WebM, WebP, and PNG export',
              'Pack generation and manifest output',
              'Metadata JSON for web consumption'
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-accent-primary">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel variant="secondary">
          <h2 className="text-xl font-semibold text-text">Presentation repo (this site)</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The <span className="font-mono text-accent-violet">stixmagic-web</span> repository is the public frontend.
            It consumes pipeline outputs and provides the catalog, previews, generator UI, and storefront.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {[
              'Landing page and product positioning',
              'Pack catalog and asset gallery',
              'Animated preview player',
              'Generator UI frontend (scaffolded)',
              'Storefront and download flow (planned)'
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-accent-violet">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-text">What the ecosystem produces</h2>
        <FeatureGrid items={components} />
      </div>

      <Tabs items={repoTabs} />

      <Panel variant="secondary">
        <h2 className="text-xl font-semibold text-text">Future extensions</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          As the pipeline matures, this site will support live custom text preview, style selector, motion alphabet
          browser, live mockup generator, and account / download library — all powered by the MagicStix bot pipeline as
          a backend API.
        </p>
      </Panel>
    </div>
  );
}
