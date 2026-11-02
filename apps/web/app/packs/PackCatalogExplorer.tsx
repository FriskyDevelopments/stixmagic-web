'use client';

import { useMemo, useState, useRef } from 'react';
import type { ProductPack } from '@stixmagic/types';
import { PackGrid, getRovingRadioGroupNextIndex } from '@stixmagic/ui';

const filters = [
  { id: 'all', label: 'All Packs', description: 'Every currently shipped STIXMΛGIC pack with real previews and truthful asset counts.' },
  { id: 'motion', label: 'Motion', description: 'Animated alphabet, waveform, cloud, and reaction packs built around seamless motion.' },
  { id: 'signals', label: 'Signals & Neon', description: 'Neon arrows, flashes, and the complete A–Z Motion Alphabet.' },
  { id: 'overlays', label: 'Overlays', description: 'Transparent WebM overlays ready for OBS, Streamlabs, and production scene layers.' }
] as const;
type FilterId = (typeof filters)[number]['id'];

export function PackCatalogExplorer({ packs }: { packs: ProductPack[] }) {
  const [active, setActive] = useState<FilterId>('all');
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const currentIndex = filters.findIndex(f => f.id === active);
    const nextIndex = getRovingRadioGroupNextIndex(e.key, currentIndex, filters.length);

    if (nextIndex !== null) {
      e.preventDefault();
      const nextFilter = filters[nextIndex];
      setActive(nextFilter.id);

      const buttons = groupRef.current?.querySelectorAll('button[role="radio"]');
      if (buttons && buttons[nextIndex]) {
        (buttons[nextIndex] as HTMLButtonElement).focus();
      }
    }
  };

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
          ref={groupRef}
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Pack filters"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active === filter.id}
              tabIndex={active === filter.id ? 0 : -1}
              onClick={() => setActive(filter.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 ${active === filter.id ? 'bg-accent-primary text-text' : 'bg-panel-secondary text-muted hover:text-text'}`}
            >
              {filter.label}
            </button>
          ))}
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
