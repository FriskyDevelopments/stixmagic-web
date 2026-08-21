'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import AuraJourney from '../AuraJourney';
import AuraMap from '../AuraMap';
import { trackLoreEvent } from '../analytics';

export default function ArchiveExperience() {
  useEffect(() => {
    trackLoreEvent('archive_entered', { route: '/lore/archive' });
  }, []);

  return (
    <main className="lore-archive-entry">
      <header className="lore-archive-entry-header">
        <Link href="/" className="lore-inline-link">← Return to the index</Link>
        <span className="lore-label">LORE / ARCHIVE ENTRY 001</span>
      </header>
      <section className="lore-archive-entry-hero" aria-labelledby="archive-entry-title">
        <p className="lore-label">ENTER THE ARCHIVE</p>
        <h1 id="archive-entry-title">The Archive opens through attention.</h1>
        <p>Six decisions. No score to chase. Follow the signal that feels most like the room you are already carrying.</p>
        <div className="lore-archive-entry-meta"><span>06 decisions</span><span>~ 03 minutes</span><span>saved to your member session</span></div>
      </section>
      <AuraMap />
      <AuraJourney />
      <section className="lore-archive-entry-note"><span className="lore-label">A NOTE ON PRIVACY</span><p>When you arrive through a signed member invitation, LORE saves your route and Aura to your member session so you can return from another device. Without an invitation, the demo fallback stays in this browser. Nothing here makes a claim about a live community.</p></section>
    </main>
  );
}
