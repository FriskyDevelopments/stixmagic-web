'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AURA_DECISIONS,
  AURA_MAP_VERSION,
  AURA_PROFILES,
  EMPTY_AURA_SCORES,
  resolveAura,
  type AuraId,
  type AuraScores
} from './aura-map';
import { trackLoreEvent } from './analytics';
import { loadLoreMember, syncLoreEvent, syncLoreProgress, syncLoreResponse } from './lore-api';

const JOURNEY_STORAGE_KEY = 'lore-aura-journey-v1';
const PROFILE_STORAGE_KEY = 'lore-aura-profile-v1';

type JourneySnapshot = {
  stage: number;
  answers: string[];
  scores: AuraScores;
  startedAt: string;
  completedAt?: string;
  auraId?: AuraId;
};

const freshJourney = (): JourneySnapshot => ({
  stage: 0,
  answers: [],
  scores: { ...EMPTY_AURA_SCORES },
  startedAt: new Date().toISOString()
});

function journeyFromRemote(member: { currentStep: number; status: string; auraId?: AuraId; lastActiveAt: string }, responses: Array<{ questionId: string; optionId: string }>, localJourney: JourneySnapshot | null): JourneySnapshot {
  const scores: AuraScores = { ...EMPTY_AURA_SCORES };
  const answers: string[] = [];
  const orderedResponses = AURA_DECISIONS.map((decision) => responses.find((response) => response.questionId === decision.id)).filter(Boolean) as Array<{ questionId: string; optionId: string }>;

  for (const response of orderedResponses) {
    const decision = AURA_DECISIONS.find((item) => item.id === response.questionId);
    const option = decision?.options.find((item) => item.id === response.optionId);
    if (!option) continue;
    answers.push(option.id);
    (Object.keys(option.scores) as AuraId[]).forEach((auraId) => { scores[auraId] += option.scores[auraId] ?? 0; });
  }

  const stage = Math.min(AURA_DECISIONS.length, Math.max(member.currentStep, answers.length));
  const completed = member.status === 'complete' && Boolean(member.auraId);
  return {
    stage,
    answers,
    scores,
    startedAt: localJourney?.startedAt ?? member.lastActiveAt,
    ...(completed ? { completedAt: member.lastActiveAt, auraId: member.auraId } : {})
  };
}

function persistJourney(snapshot: JourneySnapshot) {
  window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(snapshot));
}

export default function AuraJourney({ onComplete }: { onComplete?: (aura: AuraId) => void }) {
  const [journey, setJourney] = useState<JourneySnapshot>(freshJourney);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const saved = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    const localJourney = saved ? (() => {
      try {
        return JSON.parse(saved) as JourneySnapshot;
      } catch {
        window.localStorage.removeItem(JOURNEY_STORAGE_KEY);
        return null;
      }
    })() : null;

    void loadLoreMember().then((remote) => {
      if (cancelled) return;
      if (remote?.member && (remote.member.status === 'complete' || remote.member.status === 'in_progress')) {
        const remoteJourney = journeyFromRemote(remote.member, remote.responses, localJourney);
        setJourney(remoteJourney);
        persistJourney(remoteJourney);
      } else if (localJourney) {
        setJourney(localJourney);
      }
      setReady(true);
    }).catch(() => {
      if (localJourney) setJourney(localJourney);
      setReady(true);
    });

    trackLoreEvent('aura_journey_started', { resumed: Boolean(saved) });
    void syncLoreEvent('journey_started', { resumed: Boolean(saved) });
    return () => { cancelled = true; };
  }, []);

  const decision = AURA_DECISIONS[journey.stage];
  const result = useMemo(() => journey.completedAt ? (journey.auraId ? AURA_PROFILES[journey.auraId] : resolveAura(journey.scores)) : null, [journey.auraId, journey.completedAt, journey.scores]);

  const answer = (optionId: string, scores: Partial<AuraScores>) => {
    const nextScores: AuraScores = { ...journey.scores };
    (Object.keys(scores) as AuraId[]).forEach((auraId) => {
      nextScores[auraId] += scores[auraId] ?? 0;
    });

    const nextStage = journey.stage + 1;
    const completedAt = nextStage >= AURA_DECISIONS.length ? new Date().toISOString() : undefined;
    const discoveredAura = completedAt ? resolveAura(nextScores) : null;
    const nextJourney: JourneySnapshot = {
      ...journey,
      stage: nextStage,
      answers: [...journey.answers, optionId],
      scores: nextScores,
      completedAt,
      auraId: discoveredAura?.id ?? journey.auraId
    };

    setJourney(nextJourney);
    persistJourney(nextJourney);
    trackLoreEvent('aura_decision_answered', { decision: decision.id, option: optionId, stage: nextStage });
    void syncLoreResponse(decision.id, optionId);
    void syncLoreProgress({ currentStep: nextStage, status: completedAt ? 'complete' : 'in_progress', auraId: discoveredAura?.id, auraVersion: discoveredAura ? AURA_MAP_VERSION : undefined });

    if (completedAt && discoveredAura) {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ auraId: discoveredAura.id, discoveredAt: completedAt }));
      trackLoreEvent('aura_discovered', { aura: discoveredAura.id, journeyDurationMs: Date.now() - new Date(journey.startedAt).getTime() });
      void syncLoreEvent('aura_discovered', { aura: discoveredAura.id });
      onComplete?.(discoveredAura.id);
    }
  };

  const restart = () => {
    const next = freshJourney();
    setJourney(next);
    persistJourney(next);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    trackLoreEvent('aura_journey_started', { resumed: false, restarted: true });
  };

  if (!ready) {
    return <div className="lore-journey-loading" aria-live="polite">Opening the Archive…</div>;
  }

  if (result) {
    const aura = result;
    return (
      <section className="lore-journey-result" aria-labelledby="aura-result-title">
        <div className="lore-journey-result-orb" style={{ background: aura.color, boxShadow: `0 0 70px ${aura.glow}` }} aria-hidden="true" />
        <p className="lore-label">AURA REVEALED · {journey.completedAt ? new Date(journey.completedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ''}</p>
        <h2 id="aura-result-title">{aura.name}</h2>
        <p className="lore-journey-result-subtitle">{aura.subtitle}</p>
        <p className="lore-journey-result-copy">{aura.description}</p>
        <p className="lore-journey-signal">{aura.signal}</p>
        <div className="lore-journey-result-actions">
          <Link className="lore-button lore-button-primary" href={{ pathname: '/lore/profile', query: { aura: aura.id } }}>Open your profile <span aria-hidden="true">↗</span></Link>
          <button type="button" className="lore-button lore-button-quiet" onClick={restart}>Take the route again <span aria-hidden="true">↻</span></button>
        </div>
        <p className="lore-disclaimer">Your result is saved in this browser. It is a creative reflection, not a diagnosis or identity verification.</p>
      </section>
    );
  }

  return (
    <section className="lore-journey" aria-labelledby="journey-title">
      <div className="lore-journey-header">
        <div>
          <p className="lore-label">DECISION {String(journey.stage + 1).padStart(2, '0')} / {String(AURA_DECISIONS.length).padStart(2, '0')}</p>
          <h2 id="journey-title">{decision.title}</h2>
        </div>
        <div className="lore-journey-progress" aria-label={`${journey.stage} of ${AURA_DECISIONS.length} decisions answered`}><span style={{ width: `${(journey.stage / AURA_DECISIONS.length) * 100}%` }} /></div>
      </div>
      <p className="lore-journey-prompt">{decision.prompt}</p>
      <p className="lore-journey-hint">{decision.hint}</p>
      <div className="lore-decision-grid">
        {decision.options.map((option, index) => (
          <button type="button" key={option.id} className="lore-decision-card" onClick={() => answer(option.id, option.scores)}>
            <span className="lore-decision-number">{String.fromCharCode(65 + index)}</span>
            <strong>{option.label}</strong>
            <span>{option.note}</span>
            <span className="lore-decision-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="lore-journey-footer"><span>Your path is saved automatically.</span><button type="button" onClick={restart}>Start over</button></div>
    </section>
  );
}
