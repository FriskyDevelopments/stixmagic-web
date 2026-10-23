'use client';

import { useMemo, useState, useRef, KeyboardEvent } from 'react';
import type { AssetPreviewItem } from '@stixmagic/types';
import { GalleryGrid } from '@stixmagic/ui';

const filters = [
  { id: 'all', label: 'All Assets', description: 'Every STIXMΛGIC preview across packs and categories.' },
  { id: 'animated', label: 'Animated', description: 'Looping GIF and WebM motion assets for stickers, reactions, and live production.' },
  { id: 'overlay', label: 'Overlays', description: 'Transparent WebM overlays optimized for OBS and Streamlabs.' },
  { id: 'letters', label: 'Letters', description: 'Motion Alphabet assets — animated A–Z character renders with neon and motion style variants.' }
] as const;

type FilterId = (typeof filters)[number]['id'];


export function AssetGalleryExplorer({ assets }: { assets: AssetPreviewItem[] }) {
  const [active, setActive] = useState<FilterId>('all');
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    let nextIndex: number | null = null;
    const count = filters.length;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + count) % count;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      setActive(filters[nextIndex].id);
      buttonRefs.current[nextIndex]?.focus();
    }
  };
  const filtered = useMemo(() => assets.filter((asset) => {
    if (active === 'animated') return asset.tags.includes('animated');
    if (active === 'overlay') return asset.tags.includes('overlay');
    if (active === 'letters') return asset.packId === 'motion-alphabet-v1';
    return true;
  }), [active, assets]);
  const selected = filters.find((filter) => filter.id === active) ?? filters[0];
  const activeIndex = filters.findIndex(f => f.id === active);
  const effectiveActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Asset filters" aria-orientation="horizontal">
          {filters.map((filter, index) => {
            const isSelected = active === filter.id;
            return (
              <button
                key={filter.id}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={index === effectiveActiveIndex ? 0 : -1}
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
