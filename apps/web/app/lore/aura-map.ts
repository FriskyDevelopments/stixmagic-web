export type AuraId = 'tender-static' | 'deep-water' | 'afterglow' | 'night-bloom';

export type AuraScores = Record<AuraId, number>;

export const AURA_MAP_VERSION = 'v1';
export const AURA_ORDER: AuraId[] = ['tender-static', 'deep-water', 'afterglow', 'night-bloom'];

export type AuraDecision = {
  id: string;
  title: string;
  prompt: string;
  hint: string;
  options: Array<{
    id: string;
    label: string;
    note: string;
    scores: Partial<AuraScores>;
  }>;
};

export type AuraProfile = {
  id: AuraId;
  name: string;
  subtitle: string;
  description: string;
  signal: string;
  color: string;
  glow: string;
  keywords: string[];
  firstDropId: string;
};

export const AURA_PROFILES: Record<AuraId, AuraProfile> = {
  'tender-static': {
    id: 'tender-static',
    name: 'Tender Static',
    subtitle: 'soft signals, almost remembered',
    description: 'You notice what lingers: the pause after a sentence, the warmth in an object, the small evidence that someone was here.',
    signal: 'You follow the afterimage.',
    color: '#d7a8ff',
    glow: 'rgba(215,168,255,.38)',
    keywords: ['resonance', 'memory', 'intimacy'],
    firstDropId: 'the-soft-machinery'
  },
  'deep-water': {
    id: 'deep-water',
    name: 'Deep Water',
    subtitle: 'quiet depth with a reflective edge',
    description: 'You make space for the things that do not announce themselves. Your attention moves slowly enough to find another layer.',
    signal: 'You follow the pressure beneath the surface.',
    color: '#74d8ff',
    glow: 'rgba(116,216,255,.38)',
    keywords: ['depth', 'silence', 'patience'],
    firstDropId: 'weather-report-for-an-interior'
  },
  afterglow: {
    id: 'afterglow',
    name: 'Afterglow',
    subtitle: 'the warmth that stays after leaving',
    description: 'You are drawn to the charge of a moment after it has happened: what remains bright, generous, and unfinished.',
    signal: 'You follow the warmth that remains.',
    color: '#ffb38a',
    glow: 'rgba(255,179,138,.38)',
    keywords: ['warmth', 'movement', 'release'],
    firstDropId: 'a-small-light-left-on'
  },
  'night-bloom': {
    id: 'night-bloom',
    name: 'Night Bloom',
    subtitle: 'a small opening in the dark',
    description: 'You trust the strange opening. Your way in is indirect, and the things you make become visible when the room gets quiet.',
    signal: 'You follow the shape that only appears at night.',
    color: '#b7e8bd',
    glow: 'rgba(183,232,189,.34)',
    keywords: ['intuition', 'thresholds', 'possibility'],
    firstDropId: 'the-night-garden'
  }
};

export type AuraRevelation = {
  signature: string;
  revealPath: Array<{ decisionId: string; signalId: string }>;
};

/** Primary signals used to explain a result; scores still come from every answer. */
export const AURA_REVELATIONS: Record<AuraId, AuraRevelation> = {
  'tender-static': {
    signature: 'You follow the afterimage.',
    revealPath: [
      { decisionId: 'what-stays', signalId: 'impression' },
      { decisionId: 'what-calls', signalId: 'flicker' },
      { decisionId: 'what-makes', signalId: 'image' },
      { decisionId: 'what-opens', signalId: 'memory' },
      { decisionId: 'what-keeps', signalId: 'thread' },
      { decisionId: 'what-returns', signalId: 'softness' }
    ]
  },
  'deep-water': {
    signature: 'You follow the pressure beneath the surface.',
    revealPath: [
      { decisionId: 'what-stays', signalId: 'temperature' },
      { decisionId: 'what-calls', signalId: 'water' },
      { decisionId: 'what-makes', signalId: 'list' },
      { decisionId: 'what-opens', signalId: 'weather' },
      { decisionId: 'what-keeps', signalId: 'stone' },
      { decisionId: 'what-returns', signalId: 'clarity' }
    ]
  },
  afterglow: {
    signature: 'You follow the warmth that remains.',
    revealPath: [
      { decisionId: 'what-stays', signalId: 'light' },
      { decisionId: 'what-calls', signalId: 'voice' },
      { decisionId: 'what-makes', signalId: 'gesture' },
      { decisionId: 'what-opens', signalId: 'company' },
      { decisionId: 'what-keeps', signalId: 'match' },
      { decisionId: 'what-returns', signalId: 'warmth' }
    ]
  },
  'night-bloom': {
    signature: 'You follow the shape that only appears at night.',
    revealPath: [
      { decisionId: 'what-stays', signalId: 'impression' },
      { decisionId: 'what-calls', signalId: 'water' },
      { decisionId: 'what-makes', signalId: 'object' },
      { decisionId: 'what-opens', signalId: 'unknown' },
      { decisionId: 'what-keeps', signalId: 'key' },
      { decisionId: 'what-returns', signalId: 'wonder' }
    ]
  }
};

export const AURA_DECISIONS: AuraDecision[] = [
  {
    id: 'what-stays',
    title: 'When a room empties, what do you notice first?',
    prompt: 'The door has just closed. The room is still holding one thing.',
    hint: 'Choose the trace you would turn toward.',
    options: [
      { id: 'temperature', label: 'The change in temperature', note: 'Something has shifted.', scores: { 'deep-water': 2, 'afterglow': 1 } },
      { id: 'light', label: 'The light left on somewhere', note: 'Someone meant to return.', scores: { afterglow: 2, 'night-bloom': 1 } },
      { id: 'impression', label: 'The shape left in the air', note: 'An absence has an outline.', scores: { 'tender-static': 2, 'night-bloom': 1 } },
      { id: 'silence', label: 'The silence underneath it', note: 'The room is deeper now.', scores: { 'deep-water': 2, 'tender-static': 1 } }
    ]
  },
  {
    id: 'what-calls',
    title: 'Which signal would make you change direction?',
    prompt: 'You are halfway home when something small asks to be followed.',
    hint: 'There is no correct route, only a more interesting one.',
    options: [
      { id: 'flicker', label: 'A flicker behind a curtain', note: 'A private weather system.', scores: { 'tender-static': 2, 'night-bloom': 1 } },
      { id: 'voice', label: 'A voice saying your name', note: 'Familiar, but not expected.', scores: { afterglow: 2, 'tender-static': 1 } },
      { id: 'water', label: 'Water moving where it should not', note: 'A surface has opened.', scores: { 'deep-water': 2, 'night-bloom': 1 } },
      { id: 'warmth', label: 'Warmth from an unlit window', note: 'The invitation is wordless.', scores: { afterglow: 2, 'deep-water': 1 } }
    ]
  },
  {
    id: 'what-makes',
    title: 'What do you make when you cannot explain yourself?',
    prompt: 'The feeling is real. The words are not ready yet.',
    hint: 'Choose the form that can carry it for now.',
    options: [
      { id: 'image', label: 'An image with one detail missing', note: 'Let the viewer enter.', scores: { 'tender-static': 2, 'deep-water': 1 } },
      { id: 'list', label: 'A list of exact observations', note: 'Precision can be a shelter.', scores: { 'deep-water': 2, 'tender-static': 1 } },
      { id: 'gesture', label: 'A gesture for someone else', note: 'Make the feeling useful.', scores: { afterglow: 2, 'night-bloom': 1 } },
      { id: 'object', label: 'An object with a hidden side', note: 'Give the mystery a body.', scores: { 'night-bloom': 2, afterglow: 1 } }
    ]
  },
  {
    id: 'what-opens',
    title: 'The archive opens through which kind of door?',
    prompt: 'You have one hour and the whole night ahead of you.',
    hint: 'Choose the threshold you would keep walking toward.',
    options: [
      { id: 'memory', label: 'A memory you have not visited', note: 'Return without repeating.', scores: { 'tender-static': 2, 'deep-water': 1 } },
      { id: 'weather', label: 'A weather system inside a room', note: 'Read the pressure.', scores: { 'deep-water': 2, 'night-bloom': 1 } },
      { id: 'company', label: 'A light left on for company', note: 'Make an opening generous.', scores: { afterglow: 2, 'tender-static': 1 } },
      { id: 'unknown', label: 'A path that only appears in the dark', note: 'Trust the indirect route.', scores: { 'night-bloom': 2, afterglow: 1 } }
    ]
  },
  {
    id: 'what-keeps',
    title: 'Which small thing would you keep for the journey?',
    prompt: 'The route changes. You can take one trace with you.',
    hint: 'Choose the object that would help you notice more.',
    options: [
      { id: 'thread', label: 'A loose red thread', note: 'A line through the ordinary.', scores: { 'tender-static': 2, 'night-bloom': 1 } },
      { id: 'stone', label: 'A warm stone', note: 'Weight, held gently.', scores: { 'deep-water': 2, afterglow: 1 } },
      { id: 'match', label: 'An unused match', note: 'The possibility of light.', scores: { afterglow: 2, 'night-bloom': 1 } },
      { id: 'key', label: 'A key with no lock', note: 'A question with a shape.', scores: { 'night-bloom': 2, 'deep-water': 1 } }
    ]
  },
  {
    id: 'what-returns',
    title: 'What do you hope returns when you look back?',
    prompt: 'The archive is not a mirror. It changes what it reflects.',
    hint: 'Choose the quality you would recognize again.',
    options: [
      { id: 'softness', label: 'A little more softness', note: 'Let the edges stay human.', scores: { 'tender-static': 2, afterglow: 1 } },
      { id: 'clarity', label: 'A clean line through the noise', note: 'Make space for what is true.', scores: { 'deep-water': 2, 'tender-static': 1 } },
      { id: 'warmth', label: 'The courage to leave warmth', note: 'Give the room something to hold.', scores: { afterglow: 2, 'tender-static': 1 } },
      { id: 'wonder', label: 'A door I did not expect', note: 'Keep the unknown alive.', scores: { 'night-bloom': 2, afterglow: 1 } }
    ]
  }
];

export const EMPTY_AURA_SCORES: AuraScores = {
  'tender-static': 0,
  'deep-water': 0,
  afterglow: 0,
  'night-bloom': 0
};

export function resolveAura(scores: AuraScores): AuraProfile {
  const ranked = (Object.entries(scores) as Array<[AuraId, number]>).sort(([auraA, scoreA], [auraB, scoreB]) => {
    const scoreDelta = scoreB - scoreA;
    return scoreDelta || AURA_ORDER.indexOf(auraA) - AURA_ORDER.indexOf(auraB);
  });
  return AURA_PROFILES[ranked[0]?.[0] ?? AURA_ORDER[0]];
}
