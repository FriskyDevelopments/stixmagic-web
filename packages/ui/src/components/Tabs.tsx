'use client';

import { useMemo, useState } from 'react';
import { cn } from '../lib/cn.js';

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

  const active = useMemo(() => items.find((item) => item.id === activeId) ?? items[0], [activeId, items]);

  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-6">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              item.id === active?.id
                ? 'bg-accent-primary text-text'
                : 'bg-panel-secondary text-muted hover:text-text'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{active?.content}</p>
    </section>
  );
};
