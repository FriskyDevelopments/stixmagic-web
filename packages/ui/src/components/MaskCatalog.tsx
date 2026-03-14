'use client';

import { useMemo, useState } from 'react';
import type { MaskDefinition } from '@stixmagic/types';
import { MaskCard } from './MaskCard';
import { MaskHeroPreview } from './MaskHeroPreview';
import { Panel } from './Panel';

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
        <h3 className="text-lg font-semibold text-text">Mask pipeline</h3>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. Upload image from your workspace.</li>
          <li>2. Select mask where white keeps pixels and black removes them.</li>
          <li>3. Sticker engine resizes, optimizes, and converts the final asset.</li>
          <li>4. Trigger metadata links the sticker to interactive bot actions.</li>
        </ol>
      </Panel>
    </section>
  );
};
