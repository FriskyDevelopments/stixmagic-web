'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AURA_PROFILES, type AuraId } from '../aura-map';
import { trackLoreEvent } from '../analytics';
import { loadCommunityDestination, loadLoreMember } from '../lore-api';

const PROFILE_STORAGE_KEY = 'lore-aura-profile-v1';

type StoredProfile = { auraId: AuraId; discoveredAt: string };

export default function ProfileExperience({ requestedAura }: { requestedAura?: string }) {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [communityDestination, setCommunityDestination] = useState<string | null>(null);
  const [routeAura, setRouteAura] = useState(requestedAura);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const queryAura = new URLSearchParams(window.location.search).get('aura') ?? undefined;
    setRouteAura(queryAura ?? requestedAura);
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    const localProfile = stored ? (() => {
      try {
        const parsed = JSON.parse(stored) as StoredProfile;
        return parsed.auraId in AURA_PROFILES ? parsed : null;
      } catch {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
        return null;
      }
    })() : null;
    if (localProfile) setProfile(localProfile);

    void loadLoreMember().then(async (remote) => {
      if (cancelled) return;
      if (remote?.member.status === 'complete' && remote.member.auraId) {
        const remoteProfile = { auraId: remote.member.auraId, discoveredAt: remote.member.lastActiveAt } satisfies StoredProfile;
        setProfile(remoteProfile);
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(remoteProfile));
        const destination = await loadCommunityDestination();
        if (!cancelled && destination?.enabled && destination.destination) setCommunityDestination(destination.destination);
      }
      setReady(true);
    }).catch(() => {
      if (!cancelled) setReady(true);
    });
    trackLoreEvent('aura_discovered', { surface: 'profile_revisit', requestedAura: queryAura ?? requestedAura });
    return () => { cancelled = true; };
  }, [requestedAura]);

  const aura = useMemo(() => profile ? AURA_PROFILES[profile.auraId] : null, [profile]);
  const requestMatchesStored = !routeAura || !profile || routeAura === profile.auraId;
  const storedProfile = profile;

  if (!ready) return <main className="lore-profile-page"><div className="lore-journey-loading">Opening your profile…</div></main>;

  if (!aura || !requestMatchesStored || !storedProfile) {
    return (
      <main className="lore-profile-page lore-profile-empty">
        <Link href="/" className="lore-inline-link">← Return to the index</Link>
        <p className="lore-label">PROFILE / NOT YET REVEALED</p>
        <h1>This room is still waiting for your signal.</h1>
        <p>Complete the Archive route in this browser to reveal a personal Aura profile. The result is a creative reflection, not a diagnosis or identity verification.</p>
        <Link className="lore-button lore-button-primary" href="/lore/archive">Enter the Archive <span aria-hidden="true">↘</span></Link>
      </main>
    );
  }

  const inviteReady = Boolean(communityDestination);
  return (
    <main className="lore-profile-page" style={{ '--profile-color': aura.color, '--profile-glow': aura.glow } as React.CSSProperties}>
      <header className="lore-profile-header"><Link href="/" className="lore-inline-link">← Return to the index</Link><span className="lore-label">PROFILE / {aura.name.toUpperCase()}</span></header>
      <section className="lore-profile-hero" aria-labelledby="profile-title">
        <div className="lore-profile-hero-orb" aria-hidden="true" />
        <p className="lore-label">AURA REVEALED · {new Date(storedProfile.discoveredAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
        <h1 id="profile-title">{aura.name}</h1>
        <p className="lore-profile-subtitle">{aura.subtitle}</p>
        <p className="lore-profile-signal">{aura.signal}</p>
      </section>
      <section className="lore-profile-grid">
        <article><p className="lore-label">THE WEATHER</p><h2>What your attention keeps.</h2><p>{aura.description}</p></article>
        <article><p className="lore-label">THE SIGNALS</p><div className="lore-profile-keywords">{aura.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><p className="lore-muted-note">These are invitations to notice, not labels to carry.</p></article>
      </section>
      <section className="lore-profile-community" aria-labelledby="community-title"><p className="lore-label">NEXT / A PRIVATE DOOR</p><h2 id="community-title">A quieter room, when it is ready.</h2><p>After discovery, members may receive a private Telegram invitation. The destination is deliberately absent until the server has a real, reviewed invite configured.</p>{inviteReady ? <a className="lore-button lore-button-primary" href={communityDestination ?? '#'} target="_blank" rel="noreferrer" onClick={() => trackLoreEvent('community_invitation_clicked', { aura: aura.id })}>Open private invitation <span aria-hidden="true">↗</span></a> : <span className="lore-profile-invite-pending">Private invitation pending configuration</span>}<p className="lore-disclaimer">LORE does not claim a live community until this capability is explicitly enabled.</p></section>
      <section className="lore-profile-drop"><p className="lore-label">FIRST DROP / {aura.firstDropId.replaceAll('-', ' ').toUpperCase()}</p><h2>A story is waiting behind the next door.</h2><p>Return to the Archive when the next drop is announced. Your profile keeps the thread in view.</p><Link className="lore-button lore-button-quiet" href="/lore/drops">See the drop calendar <span aria-hidden="true">↗</span></Link></section>
    </main>
  );
}
