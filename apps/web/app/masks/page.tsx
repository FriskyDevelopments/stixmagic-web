import { MaskCatalog, Panel } from '@stixmagic/ui';
import { masks } from '../data/masks';

const faq = [
  {
    q: 'How do masks work?',
    a: 'Masks preserve white regions and remove black regions before optimization and sticker conversion.'
  },
  {
    q: 'Can masks drive interactions?',
    a: 'Yes. Mask selection becomes metadata, and metadata can influence downstream trigger behavior.'
  },
  {
    q: 'Are custom masks supported?',
    a: 'The starter architecture includes built-in masks and supports extension with uploaded overlays.'
  }
];

export default function MasksPage() {
  return (
    <div className="space-y-6 pb-10">
      <Panel>
        <h1 className="text-3xl font-semibold text-text">Mask Catalog</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Explore built-in mask definitions used in the sticker pipeline. Selecting a mask updates the preview state,
          metadata context, and conversion behavior for sticker output.
        </p>
      </Panel>

      <MaskCatalog masks={masks} />

      <Panel variant="secondary">
        <h2 className="text-xl font-semibold text-text">Coming soon</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Advanced mask compositing, animated transformations, and programmable behaviors are planned for future
          releases. Custom mask uploads, blend modes, and trigger-aware processing will unlock a new tier of
          sticker expressiveness across platforms.
        </p>
      </Panel>

      <Panel variant="secondary">
        <h2 className="text-xl font-semibold text-text">FAQ</h2>
        <div className="mt-4 space-y-4">
          {faq.map((item) => (
            <div key={item.q}>
              <p className="text-sm font-medium text-text">{item.q}</p>
              <p className="mt-1 text-sm text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
