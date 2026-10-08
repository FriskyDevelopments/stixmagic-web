'use client';

import { useMemo, useState } from 'react';
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
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pack filters">
          {filters.map((filter) => <button key={filter.id} type="button" role="tab" aria-selected={active === filter.id} onClick={() => setActive(filter.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${active === filter.id ? 'bg-accent-primary text-text' : 'bg-panel-secondary text-muted hover:text-text'}`}>{filter.label}</button>)}
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
