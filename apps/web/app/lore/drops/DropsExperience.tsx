'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { trackLoreEvent } from '../analytics';
import { syncLoreDropRead } from '../lore-api';
import { getDrop, LORE_DROPS, type LoreDrop } from '../drop-data';

const PROFILE_STORAGE_KEY = 'lore-aura-profile-v1';

export default function DropsExperience({ dropId }: { dropId?: string }) {
  const [hasProfile, setHasProfile] = useState(false);
  const [ready, setReady] = useState(false);
  const selectedDrop = useMemo(() => dropId ? getDrop(dropId) : undefined, [dropId]);

  useEffect(() => {
    const profile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    setHasProfile(Boolean(profile));
    setReady(true);
    trackLoreEvent(selectedDrop ? 'drop_viewed' : 'invitation_viewed', { drop: selectedDrop?.id, memberOnly: selectedDrop?.visibility === 'member-only' });
  }, [selectedDrop]);

  if (!ready) return <main className="lore-drops-page"><div className="lore-journey-loading">Opening the drop calendar…</div></main>;

  return (
    <main className="lore-drops-page">
      <header className="lore-drops-header"><Link href="/" className="lore-inline-link">← Return to the index</Link><span className="lore-label">LORE / RELEASE CALENDAR</span></header>
      <section className="lore-drops-hero"><p className="lore-label">DROPS / SMALL DOORS INTO THE NEXT ROOM</p><h1>Keep a light on for what is coming.</h1><p>Some drops are open fragments. Others are reserved for the private room that follows discovery. Dates are shown in UTC.</p></section>
      {selectedDrop ? <DropDetail drop={selectedDrop} hasProfile={hasProfile} /> : <div className="lore-drop-list">{LORE_DROPS.map((drop) => <DropCard key={drop.id} drop={drop} hasProfile={hasProfile} />)}</div>}
      <section className="lore-drops-privacy"><p className="lore-label">ACCESS NOTE</p><p>In this MVP, the member gate is a local preview of the intended journey. Production protection must move to authenticated server checks before exclusive content is considered private.</p></section>
    </main>
  );
}

function DropCard({ drop, hasProfile }: { drop: LoreDrop; hasProfile: boolean }) {
  const isOpen = drop.visibility === 'public' || hasProfile;
  return (
    <article className={`lore-drop-card ${drop.visibility === 'member-only' ? 'is-member' : ''}`}>
      <div className="lore-drop-date"><span>{drop.releaseLabel.split(' · ')[0]}</span><small>{drop.releaseLabel.split(' · ')[1]}</small></div>
      <div className="lore-drop-copy"><p className="lore-card-meta">{drop.eyebrow} · {drop.visibility === 'member-only' ? 'private room' : 'open archive'}</p><h2>{drop.title}</h2><p>{drop.summary}</p><Link className="lore-text-link" href={`/lore/drops/${drop.id}`}>{isOpen ? 'Open drop' : 'View release note'} <span aria-hidden="true">↗</span></Link></div>
      <div className={`lore-drop-status ${isOpen ? 'is-open' : ''}`}><span aria-hidden="true">{isOpen ? '○' : '◌'}</span>{isOpen ? (drop.visibility === 'public' ? 'Open' : 'Member access') : 'Unlock after Aura'}</div>
    </article>
  );
}

function DropDetail({ drop, hasProfile }: { drop: LoreDrop; hasProfile: boolean }) {
  const isOpen = drop.visibility === 'public' || hasProfile;

  useEffect(() => {
    if (!isOpen || !hasProfile) return;
    void syncLoreDropRead(drop.id);
  }, [drop.id, hasProfile, isOpen]);

  return (
    <article className="lore-drop-detail" style={{ '--drop-accent': drop.auraId === 'afterglow' ? '#ffb38a' : drop.auraId === 'night-bloom' ? '#b7e8bd' : drop.auraId === 'deep-water' ? '#74d8ff' : '#d7a8ff' } as React.CSSProperties}>
      <p className="lore-label">{drop.eyebrow} · {drop.releaseLabel}</p><h2>{drop.title}</h2><p className="lore-drop-detail-summary">{drop.summary}</p>
      {isOpen ? <><div className="lore-drop-detail-body"><p>{drop.body}</p></div><p className="lore-disclaimer">This is a creative artifact for the LORE archive. Keep what resonates; leave what does not.</p></> : <div className="lore-drop-lock"><span aria-hidden="true">◌</span><h3>This drop is held for the private room.</h3><p>Reveal an Aura to open the member-only layer. Nothing is sent to a community or third party from this browser.</p><Link className="lore-button lore-button-primary" href="/lore/archive">Reveal your Aura <span aria-hidden="true">↘</span></Link></div>}
      <Link className="lore-inline-link" href="/lore/drops">← Back to release calendar</Link>
    </article>
  );
}
