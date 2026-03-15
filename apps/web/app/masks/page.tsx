import { MaskCatalog, Panel } from '@stixmagic/ui';
import { masks } from '../data/masks';

const faq = [
  {
    q: 'How do masks work?',
    a: 'A mask chooses the shape of your sticker by keeping the important part of your image.'
  },
  {
    q: 'Can masks drive interactions?',
    a: 'Yes. You can pair your sticker with simple chat actions like replies or reactions.'
  },
  {
    q: 'Are custom masks supported?',
    a: 'Built-in masks are available now, and custom mask support is planned in upcoming releases.'
  }
];

export default function MasksPage() {
  return (
    <div className="space-y-6 pb-10">
      <Panel>
        <h1 className="text-3xl font-semibold text-text">Choose your sticker style</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Try each mask, preview the shape instantly, and find the look that fits your pack before publishing.
        </p>
      </Panel>

      <MaskCatalog masks={masks} />

      <Panel variant="secondary">
        <h2 className="text-xl font-semibold text-text">Coming soon</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          More creative styles are on the roadmap, including custom mask uploads and richer visual effects.
          The goal is to help every creator make stickers that feel unique and recognizable.
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
