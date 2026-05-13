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
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedMask = useMemo(
    () => masks.find((mask) => mask.id === selectedId) ?? masks[0],
    [masks, selectedId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = masks.findIndex((m) => m.id === selectedId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % masks.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + masks.length) % masks.length;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextMaskId = masks[nextIndex]?.id;
    if (nextMaskId) {
      setSelectedId(nextMaskId);
      itemsRef.current[nextIndex]?.focus();
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
        aria-label="Select a mask shape"
        onKeyDown={handleKeyDown}
      >
        {masks.map((mask, index) => (
          <MaskCard
            key={mask.id}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            mask={mask}
            selected={mask.id === selectedMask.id}
            onSelect={() => setSelectedId(mask.id)}
          />
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
