'use client';

import { useMemo, useRef, useState } from 'react';
import type { ProductPack } from '@stixmagic/types';
import { PackGrid } from '@stixmagic/ui';

const filters = [
  { id: 'all', label: 'All Packs', description: 'Every currently shipped STIXMΛGIC pack with real previews and truthful asset counts.' },
  { id: 'motion', label: 'Motion', description: 'Animated alphabet, waveform, cloud, and reaction packs built around seamless motion.' },
  { id: 'signals', label: 'Signals & Neon', description: 'Neon arrows, flashes, and the complete A–Z Motion Alphabet.' },
  { id: 'overlays', label: 'Overlays', description: 'Transparent WebM overlays ready for OBS, Streamlabs, and production scene layers.' }
] as const;
type FilterId = (typeof filters)[number]['id'];

export function PackCatalogExplorer({ packs }: { packs: ProductPack[] }) {
  const [active, setActive] = useState<FilterId>('all');
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const filtered = useMemo(() => packs.filter((pack) => {
    if (active === 'motion') return ['motion-alphabet', 'dj-pack', 'cloud-pack', 'emoji-set'].includes(pack.category);
    if (active === 'signals') return ['motion-alphabet', 'neon-signals'].includes(pack.category);
    if (active === 'overlays') return pack.category === 'overlay-starter';
    return true;
  }), [active, packs]);
  const selected = filters.find((filter) => filter.id === active) ?? filters[0];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-orientation="horizontal"
          aria-label="Pack filters"
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            const isNext = e.key === 'ArrowRight' || e.key === 'ArrowDown';
            const isPrev = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
            const isFirst = e.key === 'Home';
            const isLast = e.key === 'End';
            if (!isNext && !isPrev && !isFirst && !isLast) return;
            e.preventDefault();

            // Derive currentIndex from focused element if available (handles diverging focus/active states), fallback to active
            const focusedFilterId = Array.from(buttonRefs.current.entries()).find(([, el]) => el === document.activeElement)?.[0];
            let currentIndex = filters.findIndex(f => f.id === (focusedFilterId ?? active));

            let nextIndex = 0;
            if (isFirst) {
              nextIndex = 0;
            } else if (isLast) {
              nextIndex = filters.length - 1;
            } else if (currentIndex !== -1) {
               nextIndex = isNext
                ? (currentIndex + 1) % filters.length
                : (currentIndex - 1 + filters.length) % filters.length;
            } else {
               nextIndex = isNext ? 0 : filters.length - 1;
            }

            const nextFilter = filters[nextIndex];
            if (nextFilter) {
              setActive(nextFilter.id);
              buttonRefs.current.get(nextFilter.id)?.focus();
            }
          }}
        >
          {filters.map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                ref={(el) => {
                  if (el) buttonRefs.current.set(filter.id, el);
                  else buttonRefs.current.delete(filter.id);
                }}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(filter.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-accent-primary text-text' : 'bg-panel-secondary text-muted hover:text-text'}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{selected.description}</p>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-accent-cyan">{filtered.length} {filtered.length === 1 ? 'pack' : 'packs'}</span>
        </div>
      </div>
      <PackGrid packs={filtered} />
    </section>
  );
}
