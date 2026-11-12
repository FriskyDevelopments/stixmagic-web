'use client';

import { useMemo, useState } from 'react';
import type { AssetPreviewItem } from '@stixmagic/types';
import { GalleryGrid, getRovingRadioGroupNextIndex } from '@stixmagic/ui';

const filters = [
  { id: 'all', label: 'All Assets', description: 'Every STIXMΛGIC preview across packs and categories.' },
  { id: 'animated', label: 'Animated', description: 'Looping GIF and WebM motion assets for stickers, reactions, and live production.' },
  { id: 'overlay', label: 'Overlays', description: 'Transparent WebM overlays optimized for OBS and Streamlabs.' },
  { id: 'letters', label: 'Letters', description: 'Motion Alphabet assets — animated A–Z character renders with neon and motion style variants.' }
] as const;

type FilterId = (typeof filters)[number]['id'];

export function AssetGalleryExplorer({ assets }: { assets: AssetPreviewItem[] }) {
  const [active, setActive] = useState<FilterId>('all');
  const filtered = useMemo(() => assets.filter((asset) => {
    if (active === 'animated') return asset.tags.includes('animated');
    if (active === 'overlay') return asset.tags.includes('overlay');
    if (active === 'letters') return asset.packId === 'motion-alphabet-v1';
    return true;
  }), [active, assets]);
  const selected = filters.find((filter) => filter.id === active) ?? filters[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = filters.findIndex((f) => f.id === active);
    const nextIndex = getRovingRadioGroupNextIndex(e.key, currentIndex, filters.length);
    if (nextIndex === null) return;

    e.preventDefault();
    const nextValue = filters[nextIndex].id;
    setActive(nextValue);

    const group = e.currentTarget;
    setTimeout(() => {
      const radios = Array.from(group.querySelectorAll('[role="radio"]')) as HTMLElement[];
      radios[nextIndex]?.focus();
    }, 0);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Asset filters" onKeyDown={handleKeyDown}>
          {filters.map((filter, i) => (
            <button key={filter.id} type="button" role="radio" aria-checked={active === filter.id} tabIndex={active === filter.id || (!active && i === 0) ? 0 : -1} onClick={() => setActive(filter.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 ${active === filter.id ? 'bg-accent-primary text-text' : 'bg-panel-secondary text-muted hover:text-text'}`}>
              {filter.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{selected.description}</p>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-accent-cyan">{filtered.length} assets</span>
        </div>
      </div>
      <GalleryGrid assets={filtered} />
    </section>
  );
}
