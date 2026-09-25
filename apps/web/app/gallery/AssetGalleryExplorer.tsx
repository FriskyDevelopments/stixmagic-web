'use client';

import { useMemo, useState, useRef } from 'react';
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
  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered = useMemo(() => assets.filter((asset) => {
    if (active === 'animated') return asset.tags.includes('animated');
    if (active === 'overlay') return asset.tags.includes('overlay');
    if (active === 'letters') return asset.packId === 'motion-alphabet-v1';
    return true;
  }), [active, assets]);
  const selected = filters.find((filter) => filter.id === active) ?? filters[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const nextIndex = getRovingRadioGroupNextIndex(e.key, index, filters.length);
    if (nextIndex === null) return;

    e.preventDefault();
    if (nextIndex === index) return;

    setActive(filters[nextIndex].id);
    filterRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Asset filters">
          {filters.map((filter, index) => {
            const isSelected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                ref={(el) => {
                  filterRefs.current[index] = el;
                }}
                onClick={() => setActive(filter.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 ${isSelected ? 'bg-accent-primary text-text' : 'bg-panel-secondary text-muted hover:text-text'}`}
              >
                {filter.label}
              </button>
            );
          })}
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
