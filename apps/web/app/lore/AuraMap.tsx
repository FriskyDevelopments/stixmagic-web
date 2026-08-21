'use client';

import { AURA_MAP_VERSION, AURA_ORDER, AURA_PROFILES, AURA_REVELATIONS, type AuraId } from './aura-map';

const signalLabels: Record<string, string> = {
  impression: 'the shape in the air',
  flicker: 'a flicker behind the curtain',
  image: 'an image with one detail missing',
  memory: 'a memory not yet visited',
  thread: 'a loose red thread',
  softness: 'a little more softness',
  temperature: 'the change in temperature',
  water: 'water where it should not be',
  list: 'a list of exact observations',
  weather: 'weather inside a room',
  stone: 'a warm stone',
  clarity: 'a clean line through the noise',
  light: 'the light left on somewhere',
  voice: 'a voice saying your name',
  gesture: 'a gesture for someone else',
  company: 'a light left on for company',
  match: 'an unused match',
  warmth: 'the courage to leave warmth',
  object: 'an object with a hidden side',
  unknown: 'a path in the dark',
  key: 'a key with no lock',
  wonder: 'a door not expected'
};

export default function AuraMap() {
  return (
    <section className="lore-aura-map" aria-labelledby="aura-map-title">
      <div className="lore-aura-map-heading">
        <div>
          <p className="lore-label">THE REVELATION MAP / {AURA_MAP_VERSION}</p>
          <h2 id="aura-map-title">Four weather systems.<br />One route through attention.</h2>
        </div>
        <p>Every answer adds weight to more than one signal. The highest weighted Aura is revealed at the end; ties resolve in the published order below.</p>
      </div>
      <div className="lore-aura-map-grid">
        {AURA_ORDER.map((id: AuraId, index) => {
          const aura = AURA_PROFILES[id];
          const revelation = AURA_REVELATIONS[id];
          return (
            <article key={id} className="lore-aura-map-card" style={{ '--map-color': aura.color, '--map-glow': aura.glow } as React.CSSProperties}>
              <div className="lore-aura-map-card-top"><span>A / {String(index + 1).padStart(2, '0')}</span><span>{id}</span></div>
              <div className="lore-aura-map-orb" aria-hidden="true" />
              <h3>{aura.name}</h3>
              <p className="lore-aura-map-subtitle">{aura.subtitle}</p>
              <p className="lore-aura-map-signature">“{revelation.signature}”</p>
              <p className="lore-label">REVEALED THROUGH</p>
              <ol>{revelation.revealPath.map(({ decisionId, signalId }, pathIndex) => <li key={decisionId}><span>{String(pathIndex + 1).padStart(2, '0')}</span><strong>{signalLabels[signalId] ?? signalId}</strong></li>)}</ol>
              <div className="lore-aura-map-keywords">{aura.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
            </article>
          );
        })}
      </div>
      <div className="lore-aura-map-rule"><span className="lore-label">THE RULE</span><p>Six choices · weighted signals · {AURA_MAP_VERSION} ruleset · stable tie-break order · creative reflection, not diagnosis.</p></div>
    </section>
  );
}
