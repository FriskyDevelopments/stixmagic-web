'use client';

import { useMemo, useState, useRef } from 'react';
import type { MaskDefinition } from '@stixmagic/types';
import { MaskCard } from './MaskCard';
import { MaskHeroPreview } from './MaskHeroPreview';
import { Panel } from './Panel';

interface MaskCatalogProps {
  masks: MaskDefinition[];
}

export const MaskCatalog = ({ masks }: MaskCatalogProps) => {
  const [selectedId, setSelectedId] = useState<MaskDefinition['id']>(masks[0]?.id ?? 'default');
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedMask = useMemo(
    () => masks.find((mask) => mask.id === selectedId) ?? masks[0],
    [masks, selectedId]
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % masks.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + masks.length) % masks.length;
    }

    if (nextIndex !== index) {
      setSelectedId(masks[nextIndex].id);
      cardRefs.current[nextIndex]?.focus();
    }
  };

  if (!selectedMask) {
    return null;
  }

  return (
    <section className="space-y-6">
      <MaskHeroPreview selectedMask={selectedMask} />
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-label="Mask styles"
      >
        {masks.map((mask, index) => {
          const isSelected = mask.id === selectedMask.id;
          return (
            <MaskCard
              key={mask.id}
              mask={mask}
              selected={isSelected}
              onSelect={() => setSelectedId(mask.id)}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}
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
