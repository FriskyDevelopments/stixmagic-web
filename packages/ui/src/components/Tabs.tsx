'use client';

import { useMemo, useState, useRef } from 'react';
import { getRovingRadioGroupNextIndex } from '../lib/rovingRadioGroup';
import { cn } from '../lib/cn';

export interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface TabsProps {
  items: TabItem[];
}

export const Tabs = ({ items }: TabsProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = useMemo(() => items.find((item) => item.id === activeId) ?? items[0], [activeId, items]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const nextIndex = getRovingRadioGroupNextIndex(e.key, index, items.length);
    if (nextIndex === null) return;

    e.preventDefault();
    if (nextIndex === index) return;

    setActiveId(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Content Tabs" aria-orientation="horizontal">
        {items.map((item, index) => {
          const isSelected = item.id === active?.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`tab-${item.id}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50',
                isSelected
                  ? 'bg-accent-primary text-text'
                  : 'bg-panel-secondary text-muted hover:text-text'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        id={`tabpanel-${active?.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active?.id}`}
        tabIndex={0}
        className="mt-4 rounded-lg p-1 text-sm leading-relaxed text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
      >
        <p>{active?.content}</p>
      </div>
    </section>
  );
};
