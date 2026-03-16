'use client';

import { useMemo, useState } from 'react';
import type { MaskDefinition } from '@stixmagic/types';
import { MaskCard } from './MaskCard.js';
import { MaskHeroPreview } from './MaskHeroPreview.js';
import { Panel } from './Panel.js';

interface MaskCatalogProps {
  masks: MaskDefinition[];
}

export const MaskCatalog = ({ masks }: MaskCatalogProps) => {
  const [selectedId, setSelectedId] = useState<MaskDefinition['id']>(masks[0]?.id ?? 'default');

  const selectedMask = useMemo(
    () => masks.find((mask) => mask.id === selectedId) ?? masks[0],
    [masks, selectedId]
  );

  if (!selectedMask) {
    return null;
  }

  return (
    <section className="space-y-6">
      <MaskHeroPreview selectedMask={selectedMask} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {masks.map((mask) => (
          <MaskCard key={mask.id} mask={mask} selected={mask.id === selectedMask.id} onSelect={() => setSelectedId(mask.id)} />
        ))}
      </div>
      <Panel>
        <h3 className="text-lg font-semibold text-text">How your sticker is made</h3>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. Upload an image.</li>
          <li>2. Pick the mask shape you like most.</li>
          <li>3. The platform prepares a clean, chat-ready sticker.</li>
          <li>4. Optionally attach an interaction to make it more engaging.</li>
        </ol>
      </Panel>
    </section>
  );
};
