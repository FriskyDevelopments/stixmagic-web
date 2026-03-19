import { GeneratorScaffold, Panel } from '@stixmagic/ui';
import type { GeneratorStep } from '@stixmagic/ui';

const steps: GeneratorStep[] = [
  {
    id: 'choose-text',
    label: 'Choose Text',
    description:
      'Enter the text, letters, or characters you want to animate. Supports single letters, words, and short phrases depending on the selected style.'
  },
  {
    id: 'choose-style',
    label: 'Choose Style',
    description:
      'Select from available MagicStix style presets — neon, motion, minimal, retro, and more. Each style maps to a motion preset in the pipeline.',
    comingSoon: true
  },
  {
    id: 'preview-output',
    label: 'Preview Output',
    description:
      'See a live preview of your animated output before exporting. Preview loads from the pipeline renderer.',
    comingSoon: true
  },
  {
    id: 'export-options',
    label: 'Export Options',
    description: 'Choose your export format — GIF, WebM, WebP, or PNG — and download your generated asset pack.',
    comingSoon: true
  }
];

export default function GeneratorPage() {
  return (
    <div className="space-y-8 pb-10">
      <Panel>
        <span className="inline-flex rounded-full border border-white/10 bg-panel-secondary px-4 py-1 text-xs font-medium text-accent-violet">
          Coming Soon
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">Generator UI.</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          The MagicStix generator frontend is being scaffolded here. When the bot pipeline exposes a generation API,
          this UI will connect to it and let you create custom animated assets in the browser.
        </p>
      </Panel>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Generator steps</h2>
        <GeneratorScaffold steps={steps} />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">Step 1 ready</p>
          <h3 className="mt-2 text-base font-semibold text-text">Text input</h3>
          <p className="mt-2 text-sm text-muted">
            Text input and character validation is ready. Connects to the pipeline character renderer.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">Planned</p>
          <h3 className="mt-2 text-base font-semibold text-text">Style selector</h3>
          <p className="mt-2 text-sm text-muted">
            Style presets will load from the pipeline manifest as motion preset configs become available.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">Planned</p>
          <h3 className="mt-2 text-base font-semibold text-text">Export flow</h3>
          <p className="mt-2 text-sm text-muted">
            Export options will reflect supported formats per pack type once the pipeline API boundary is finalized.
          </p>
        </Panel>
      </section>

      <Panel variant="secondary">
        <h2 className="text-xl font-semibold text-text">Pipeline integration boundary</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The generator UI will consume a generation API exposed by the MagicStix bot pipeline. No asset generation
          logic lives in this repository. This page is the scaffolded frontend waiting for that API boundary to be
          established.
        </p>
      </Panel>
    </div>
  );
}
