'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Aura = {
  id: string;
  name: string;
  note: string;
  color: string;
  glow: string;
};

type ShelfItem = {
  id: string;
  title: string;
  kind: string;
  note: string;
  accent: string;
};

type RitualCard = {
  id: string;
  title: string;
  prompt: string;
  intent: string;
  aura: string;
};

const STORAGE_KEYS = {
  onboarding: 'lore-onboarding-complete',
  ambient: 'lore-ambient-enabled',
  shelf: 'lore-shelf-v1'
} as const;

const auras: Aura[] = [
  { id: 'tender-static', name: 'Tender Static', note: 'soft signals, almost remembered', color: '#d7a8ff', glow: 'rgba(215,168,255,.35)' },
  { id: 'deep-water', name: 'Deep Water', note: 'quiet depth with a reflective edge', color: '#74d8ff', glow: 'rgba(116,216,255,.34)' },
  { id: 'afterglow', name: 'Afterglow', note: 'the warmth that stays after leaving', color: '#ffb38a', glow: 'rgba(255,179,138,.34)' },
  { id: 'night-bloom', name: 'Night Bloom', note: 'a small opening in the dark', color: '#b7e8bd', glow: 'rgba(183,232,189,.30)' }
];

const profiles = [
  { name: 'Mara K.', role: 'image-maker / west archive', aura: 'Tender Static', mark: 'MK', color: '#d7a8ff' },
  { name: 'Niko Vale', role: 'field notes / night shift', aura: 'Deep Water', mark: 'NV', color: '#74d8ff' },
  { name: 'Ari Sol', role: 'soundless rituals / room 04', aura: 'Afterglow', mark: 'AS', color: '#ffb38a' }
];

const archiveEntries = [
  { id: 'weather-report-01', title: 'Weather Report for an Interior', meta: 'Entry 014 · essay · 06 min', excerpt: 'A room can keep a different kind of weather. This is a record of the pressure before the door opens.', aura: 'Deep Water', accent: '#74d8ff' },
  { id: 'small-light-02', title: 'A Small Light, Left On', meta: 'Entry 021 · image sequence · 04 min', excerpt: 'Five images for the hour when the day has ended but the night has not yet arrived.', aura: 'Afterglow', accent: '#ffb38a' },
  { id: 'handful-of-air-03', title: 'A Handful of Air', meta: 'Entry 033 · field note · 03 min', excerpt: 'On collecting what cannot be held, and why the attempt changes the collector.', aura: 'Tender Static', accent: '#d7a8ff' }
];

const ritualCards: RitualCard[] = [
  { id: 'threshold', title: 'The Threshold', prompt: 'Photograph the place where one room becomes another. Do not include the door.', intent: 'notice', aura: 'Deep Water' },
  { id: 'borrowed-weather', title: 'Borrowed Weather', prompt: 'Write three lines about a feeling that belongs to someone else. Keep the tense uncertain.', intent: 'write', aura: 'Tender Static' },
  { id: 'afterimage', title: 'Afterimage', prompt: 'Choose the last color you saw today. Give it a temperature, a weight, and a secret.', intent: 'begin', aura: 'Afterglow' },
  { id: 'night-garden', title: 'Night Garden', prompt: 'Arrange five ordinary objects as if they have been waiting for one another.', intent: 'make', aura: 'Night Bloom' },
  { id: 'the-unsent', title: 'The Unsent', prompt: 'Make something for a person who will never see it. Let the gesture be enough.', intent: 'release', aura: 'Tender Static' }
];

const coverTextures = [
  { id: 'grain', name: 'Fine grain', className: 'texture-grain' },
  { id: 'rings', name: 'Orbit rings', className: 'texture-rings' },
  { id: 'paper', name: 'Paper light', className: 'texture-paper' }
];

const onboardingPanels = [
  { kicker: '01 / THE WORLD', title: 'A quiet index of what moves through us.', body: 'LORE is a place for profiles, fragments, and small signals. Begin anywhere; the path will still be yours.' },
  { kicker: '02 / THE ARCHIVE', title: 'Read slowly. Keep what follows you.', body: 'The archive gathers essays, images, and field notes. Your Shelf lets you hold onto a discovery without creating an account.' },
  { kicker: '03 / THE AURAS', title: 'Every entry carries a weather system.', body: 'Auras are emotional coordinates, not categories. Follow a color, a phrase, or the feeling you cannot name yet.' },
  { kicker: '04 / YOUR ROOM', title: 'Make a little room for the unseen.', body: 'Draw a ritual, compose a cover, or read The Thread. Everything here is a personal creative artifact—not identity verification.' }
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="lore-label">{children}</p>;
}

function SaveButton({ saved, onClick, label = 'Save to shelf' }: { saved: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className={`lore-save-button ${saved ? 'is-saved' : ''}`} onClick={onClick} aria-pressed={saved} aria-label={saved ? 'Saved to shelf' : label}>
      <span aria-hidden="true">{saved ? '＋' : '＋'}</span> {saved ? 'Saved' : label}
    </button>
  );
}

export default function LoreExperience() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [shelf, setShelf] = useState<ShelfItem[]>([]);
  const [activeRitual, setActiveRitual] = useState(ritualCards[0]);
  const [ritualIntent, setRitualIntent] = useState('all');
  const [toast, setToast] = useState('');
  const [selectedAura, setSelectedAura] = useState(auras[0]);
  const [selectedTexture, setSelectedTexture] = useState(coverTextures[0]);
  const [coverTitle, setCoverTitle] = useState('A room for the unseen');

  useEffect(() => {
    const onboardingComplete = window.localStorage.getItem(STORAGE_KEYS.onboarding) === 'true';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const storedAmbient = window.localStorage.getItem(STORAGE_KEYS.ambient);
    const storedShelf = window.localStorage.getItem(STORAGE_KEYS.shelf);

    setOnboardingOpen(!onboardingComplete);
    setAmbientEnabled(storedAmbient ? storedAmbient === 'true' : !prefersReducedMotion);
    if (storedShelf) {
      try {
        setShelf(JSON.parse(storedShelf) as ShelfItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEYS.shelf);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.shelf, JSON.stringify(shelf));
  }, [shelf]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredRituals = useMemo(
    () => ritualIntent === 'all' ? ritualCards : ritualCards.filter((card) => card.intent === ritualIntent),
    [ritualIntent]
  );

  const chooseRitualIntent = (intent: string) => {
    const nextPool = intent === 'all' ? ritualCards : ritualCards.filter((card) => card.intent === intent);
    setRitualIntent(intent);
    if (nextPool.length) setActiveRitual(nextPool[0]);
  };

  const dismissOnboarding = () => {
    window.localStorage.setItem(STORAGE_KEYS.onboarding, 'true');
    setOnboardingOpen(false);
  };

  const toggleAmbient = () => {
    const next = !ambientEnabled;
    setAmbientEnabled(next);
    window.localStorage.setItem(STORAGE_KEYS.ambient, String(next));
  };

  const saveItem = (item: ShelfItem) => {
    setShelf((current) => {
      if (current.some((saved) => saved.id === item.id)) {
        setToast('Already on your Shelf');
        return current;
      }
      setToast('Saved to your local Shelf');
      return [item, ...current];
    });
  };

  const removeItem = (id: string) => {
    setShelf((current) => current.filter((item) => item.id !== id));
  };

  const isSaved = (id: string) => shelf.some((item) => item.id === id);

  const drawRitual = () => {
    const pool = filteredRituals.length ? filteredRituals : ritualCards;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setActiveRitual(next);
  };

  const shareRitual = async () => {
    const url = `${window.location.origin}${window.location.pathname}#ritual-${activeRitual.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast('Ritual link copied');
    } catch {
      window.location.hash = `ritual-${activeRitual.id}`;
      setToast('Ritual link ready in the address bar');
    }
  };

  const exportCover = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 1800;
    const context = canvas.getContext('2d');
    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0c14');
    gradient.addColorStop(0.52, selectedAura.color);
    gradient.addColorStop(1, '#06070b');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.2;
    for (let index = 0; index < 90; index += 1) {
      const x = (index * 191) % canvas.width;
      const y = (index * 317) % canvas.height;
      context.fillStyle = '#ffffff';
      context.fillRect(x, y, 2, 2);
    }
    context.globalAlpha = 1;

    context.strokeStyle = 'rgba(255,255,255,.32)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(970, 470, 270, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(970, 470, 196, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = '#ffffff';
    context.font = '700 64px Arial';
    context.letterSpacing = '16px';
    context.fillText('LORE', 120, 170);
    context.font = '400 42px Arial';
    context.letterSpacing = '0px';
    context.fillText(coverTitle.slice(0, 34), 120, 1530);
    context.font = '400 26px Arial';
    context.fillStyle = 'rgba(255,255,255,.72)';
    context.fillText(`${selectedAura.name} · personal creative artifact`, 120, 1600);

    const link = document.createElement('a');
    link.download = 'lore-cover-artifact.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToast('Cover exported as a personal artifact');
  };

  return (
    <div className="lore-shell">
      <div className={`lore-ambient ${ambientEnabled ? 'is-on' : ''}`} aria-hidden="true">
        <span className="lore-ambient-orbit lore-ambient-orbit-one" />
        <span className="lore-ambient-orbit lore-ambient-orbit-two" />
        <span className="lore-ambient-grain" />
        <span className="lore-ambient-ghost lore-ambient-ghost-one" />
        <span className="lore-ambient-ghost lore-ambient-ghost-two" />
      </div>

      <div className="lore-utility-row">
        <span>LORE / an index of interior weather</span>
        <button type="button" className="lore-ambient-toggle" onClick={toggleAmbient} aria-pressed={ambientEnabled}>
          <span className={`lore-toggle-dot ${ambientEnabled ? 'is-on' : ''}`} aria-hidden="true" />
          Ambient layer {ambientEnabled ? 'on' : 'off'}
        </button>
      </div>

      <section className="lore-hero" aria-labelledby="lore-hero-title">
        <div className="lore-hero-copy">
          <SectionLabel>FIELD NOTE 001 · ENTER WITHOUT A MAP</SectionLabel>
          <h1 id="lore-hero-title">Make room for the unseen.</h1>
          <p className="lore-hero-lede">LORE is a living index of people, fragments, and rituals for paying attention. Follow a signal. Keep a trace. Leave changed.</p>
          <div className="lore-hero-actions">
            <Link className="lore-button lore-button-primary" href="/lore/archive">Enter the Archive <span aria-hidden="true">↘</span></Link>
            <Link className="lore-button lore-button-quiet" href="/lore/thread">Read The Thread <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="lore-disclaimer">A personal creative space. No accounts. No claims of live community.</p>
        </div>
        <div className="lore-cover-orbit" aria-label="LORE cover preview">
          <div className="lore-cover-orbit-ring ring-one" />
          <div className="lore-cover-orbit-ring ring-two" />
          <div className="lore-cover-mark">L<span>O</span>RE</div>
          <div className="lore-cover-caption"><span>VOL. 01</span><span>UNSEEN / SEEN</span></div>
        </div>
      </section>

      <nav className="lore-anchor-nav" aria-label="LORE sections">
        <a href="#world">World</a>
        <a href="#archive">Archive</a>
        <a href="#rituals">Rituals</a>
        <a href="#cover">Cover room</a>
        <a href="#shelf">Shelf ({shelf.length})</a>
      </nav>

      <section id="world" className="lore-section" aria-labelledby="world-title">
        <div className="lore-section-heading">
          <div>
            <SectionLabel>01 / THE DIRECTORY</SectionLabel>
            <h2 id="world-title">Start with a weather system.</h2>
          </div>
          <p>There is no right door into LORE. These Auras are coordinates for the kind of attention you want to practice.</p>
        </div>
        <div className="lore-aura-grid">
          {auras.map((aura) => (
            <button type="button" key={aura.id} className="lore-aura-card" style={{ '--aura-color': aura.color, '--aura-glow': aura.glow } as React.CSSProperties} onClick={() => { setSelectedAura(aura); document.getElementById('rituals')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span className="lore-aura-index">A / {String(auras.indexOf(aura) + 1).padStart(2, '0')}</span>
              <span className="lore-aura-orb" aria-hidden="true" />
              <strong>{aura.name}</strong>
              <span>{aura.note}</span>
              <span className="lore-aura-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="lore-directory-strip">
          <div>
            <SectionLabel>PEOPLE IN THE INDEX</SectionLabel>
            <p>Three points of view, held lightly.</p>
          </div>
          <div className="lore-profile-row">
            {profiles.map((profile) => (
              <button type="button" className="lore-profile" key={profile.name} onClick={() => saveItem({ id: `profile-${profile.name}`, title: profile.name, kind: 'Profile', note: profile.role, accent: profile.color })}>
                <span className="lore-profile-mark" style={{ borderColor: profile.color, color: profile.color }}>{profile.mark}</span>
                <span><strong>{profile.name}</strong><small>{profile.aura}</small></span>
                <span className="sr-only">Save {profile.name} to shelf</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="archive" className="lore-section lore-section-archive" aria-labelledby="archive-title">
        <div className="lore-section-heading">
          <div>
            <SectionLabel>02 / THE ARCHIVE</SectionLabel>
            <h2 id="archive-title">Keep the door open.</h2>
          </div>
          <Link className="lore-inline-link" href="/lore/thread">Enter the Canon Thread <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="lore-archive-list">
          {archiveEntries.map((entry, index) => (
            <article className="lore-archive-card" key={entry.id}>
              <div className="lore-archive-art" style={{ '--archive-accent': entry.accent } as React.CSSProperties}><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="lore-archive-copy">
                <p className="lore-card-meta">{entry.meta} · {entry.aura}</p>
                <h3>{entry.title}</h3>
                <p>{entry.excerpt}</p>
                <div className="lore-card-actions">
                  <Link className="lore-text-link" href={`/lore/thread#${entry.id}`}>Read fragment <span aria-hidden="true">↗</span></Link>
                  <SaveButton saved={isSaved(`archive-${entry.id}`)} onClick={() => saveItem({ id: `archive-${entry.id}`, title: entry.title, kind: 'Archive', note: entry.meta, accent: entry.accent })} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="rituals" className="lore-section" aria-labelledby="rituals-title">
        <div className="lore-section-heading">
          <div>
            <SectionLabel>03 / THE RITUAL DECK</SectionLabel>
            <h2 id="rituals-title">A prompt is a small door.</h2>
          </div>
          <p>Draw a card when you need a beginning. Save the ones that keep looking back.</p>
        </div>
        <div className="lore-ritual-layout">
          <div className="lore-ritual-controls" role="group" aria-label="Filter ritual prompts">
            {['all', 'begin', 'make', 'notice', 'write', 'release'].map((intent) => (
              <button type="button" key={intent} className={ritualIntent === intent ? 'is-active' : ''} onClick={() => chooseRitualIntent(intent)}>{intent}</button>
            ))}
          </div>
          <div className="lore-ritual-card" id={`ritual-${activeRitual.id}`}>
            <div className="lore-ritual-card-top"><span>RITUAL / {activeRitual.aura.toUpperCase()}</span><span>{activeRitual.intent}</span></div>
            <div className="lore-ritual-card-body">
              <p className="lore-card-meta">Drawn for this moment</p>
              <h3>{activeRitual.title}</h3>
              <p>{activeRitual.prompt}</p>
            </div>
            <div className="lore-ritual-card-bottom">
              <button type="button" className="lore-button lore-button-primary" onClick={drawRitual}>Draw another <span aria-hidden="true">↻</span></button>
              <button type="button" className="lore-button lore-button-quiet" onClick={shareRitual}>Share this card <span aria-hidden="true">↗</span></button>
              <SaveButton saved={isSaved(`ritual-${activeRitual.id}`)} onClick={() => saveItem({ id: `ritual-${activeRitual.id}`, title: activeRitual.title, kind: 'Ritual', note: activeRitual.prompt, accent: selectedAura.color })} label="Keep card" />
            </div>
          </div>
          <div className="lore-ritual-note">
            <SectionLabel>THE DECK REMEMBERS</SectionLabel>
            <p>{filteredRituals.length} cards in this drawer.</p>
            <p className="lore-muted-note">Your favorites stay in this browser only. There is nothing to sign up for yet.</p>
          </div>
        </div>
      </section>

      <section id="cover" className="lore-section lore-cover-section" aria-labelledby="cover-title">
        <div className="lore-section-heading">
          <div>
            <SectionLabel>04 / COVER ROOM</SectionLabel>
            <h2 id="cover-title">Compose a trace of your own.</h2>
          </div>
          <p>Use the approved LORE palette and local textures to make a cover. Export is generated in your browser—no image-generation service involved.</p>
        </div>
        <div className="lore-cover-room">
          <div className={`lore-cover-preview ${selectedTexture.className}`} style={{ '--cover-aura': selectedAura.color, '--cover-glow': selectedAura.glow } as React.CSSProperties}>
            <div className="lore-cover-preview-ring ring-one" />
            <div className="lore-cover-preview-ring ring-two" />
            <div className="lore-cover-preview-word">LORE</div>
            <div className="lore-cover-preview-title">{coverTitle || 'A room for the unseen'}</div>
            <div className="lore-cover-preview-meta">{selectedAura.name} · personal creative artifact</div>
          </div>
          <div className="lore-cover-controls">
            <label htmlFor="cover-title-input">Cover title</label>
            <input id="cover-title-input" value={coverTitle} onChange={(event) => setCoverTitle(event.target.value)} maxLength={48} />
            <fieldset>
              <legend>Aura color</legend>
              <div className="lore-swatch-row">
                {auras.map((aura) => <button type="button" key={aura.id} className={`lore-swatch ${selectedAura.id === aura.id ? 'is-selected' : ''}`} style={{ background: aura.color }} onClick={() => setSelectedAura(aura)} aria-label={`Use ${aura.name}`} aria-pressed={selectedAura.id === aura.id} />)}
              </div>
            </fieldset>
            <fieldset>
              <legend>Texture</legend>
              <div className="lore-texture-row">
                {coverTextures.map((texture) => <button type="button" key={texture.id} className={`lore-texture-choice ${selectedTexture.id === texture.id ? 'is-selected' : ''}`} onClick={() => setSelectedTexture(texture)} aria-pressed={selectedTexture.id === texture.id}><span className={texture.className} aria-hidden="true" />{texture.name}</button>)}
              </div>
            </fieldset>
            <button type="button" className="lore-button lore-button-primary lore-export-button" onClick={exportCover}>Export PNG <span aria-hidden="true">↓</span></button>
            <p className="lore-disclaimer">Personal creative artifact. Not official identity verification.</p>
          </div>
        </div>
      </section>

      <section id="shelf" className="lore-section lore-shelf-section" aria-labelledby="shelf-title">
        <div className="lore-section-heading">
          <div>
            <SectionLabel>05 / YOUR SHELF</SectionLabel>
            <h2 id="shelf-title">A place for what followed you home.</h2>
          </div>
          <p>Saved discoveries live only in this browser until real accounts exist.</p>
        </div>
        {shelf.length === 0 ? (
          <div className="lore-empty-shelf"><span className="lore-empty-mark" aria-hidden="true">○</span><h3>Nothing is resting here yet.</h3><p>Save an archive entry, ritual card, or profile and it will appear on your Shelf.</p><a href="#archive" className="lore-inline-link">Browse the archive <span aria-hidden="true">↘</span></a></div>
        ) : (
          <div className="lore-shelf-grid">{shelf.map((item) => <article className="lore-shelf-card" key={item.id} style={{ '--shelf-accent': item.accent } as React.CSSProperties}><div><p className="lore-card-meta">{item.kind}</p><h3>{item.title}</h3><p>{item.note}</p></div><button type="button" className="lore-remove-button" onClick={() => removeItem(item.id)}>Remove</button></article>)}</div>
        )}
      </section>

      <section id="system" className="lore-section lore-system-section" aria-labelledby="system-title">
        <div><SectionLabel>06 / THE TYPE ROOM</SectionLabel><h2 id="system-title">A small system, held with care.</h2><p>LORE uses contrast, restraint, and a single field of color to keep the page quiet without making it vague.</p></div>
        <div className="lore-type-specimen"><span className="lore-type-display">Aa</span><span className="lore-type-body">Readable body / patient rhythm / clear focus</span><span className="lore-type-mono">MONO LABELS · AURA ACCENTS · 08 / 16 / 32</span></div>
      </section>

      {toast && <div className="lore-toast" role="status">{toast}</div>}

      {onboardingOpen && (
        <div className="lore-onboarding-backdrop" role="presentation">
          <section className="lore-onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
            <button type="button" className="lore-onboarding-skip" onClick={dismissOnboarding}>Skip intro</button>
            <div className="lore-onboarding-art" aria-hidden="true"><span>{String(onboardingStep + 1).padStart(2, '0')}</span><i /></div>
            <div className="lore-onboarding-copy"><p className="lore-label">{onboardingPanels[onboardingStep].kicker}</p><h2 id="onboarding-title">{onboardingPanels[onboardingStep].title}</h2><p>{onboardingPanels[onboardingStep].body}</p></div>
            <div className="lore-onboarding-footer"><div className="lore-onboarding-dots" aria-label={`Step ${onboardingStep + 1} of ${onboardingPanels.length}`}>{onboardingPanels.map((panel, index) => <button type="button" key={panel.kicker} className={index === onboardingStep ? 'is-active' : ''} onClick={() => setOnboardingStep(index)} aria-label={`Go to intro step ${index + 1}`} />)}</div>{onboardingStep < onboardingPanels.length - 1 ? <button type="button" className="lore-button lore-button-primary" onClick={() => setOnboardingStep((step) => step + 1)}>Continue <span aria-hidden="true">↘</span></button> : <button type="button" className="lore-button lore-button-primary" onClick={dismissOnboarding}>Enter LORE <span aria-hidden="true">↗</span></button>}</div>
          </section>
        </div>
      )}
    </div>
  );
}
