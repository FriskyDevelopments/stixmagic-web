import type { AssetPreviewItem } from '@stixmagic/types';

const NEON_ALPHABET: AssetPreviewItem[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((letter) => ({
  id: `letter-${letter.toLowerCase()}-neon`,
  name: `Letter ${letter} — Neon`,
  description: `Telegram-ready neon-glow letter ${letter} with a seamless looping pulse.`,
  previewUrl: `/previews/letter-${letter.toLowerCase()}-neon.gif`,
  formats: ['gif', 'webm'],
  tags: ['telegram-ready', 'animated', 'looping', 'letter', 'neon'],
  packId: 'motion-alphabet-v1'
}));

export const SAMPLE_ASSETS: AssetPreviewItem[] = [
  ...NEON_ALPHABET,
  {
    id: 'signal-flash-01',
    name: 'Signal Flash',
    description: 'Sharp neon flash signal with rapid blink and fade-out.',
    previewUrl: '/previews/signal-flash-01.gif',
    formats: ['gif', 'webm'],
    tags: ['neon', 'symbol', 'animated'],
    packId: 'neon-signals-v1'
  },
  {
    id: 'waveform-loop-01',
    name: 'Waveform Loop',
    description: 'Audio waveform animation with 4-beat loop, ideal for DJ overlays.',
    previewUrl: '/previews/waveform-loop-01.gif',
    formats: ['gif', 'webm'],
    tags: ['music', 'animated', 'overlay'],
    packId: 'dj-pack-v1'
  },
  {
    id: 'cloud-drift-01',
    name: 'Cloud Drift',
    description: 'Soft drifting cloud loop in muted tones. Minimal and calming.',
    previewUrl: '/previews/cloud-drift-01.gif',
    formats: ['gif', 'webm'],
    tags: ['animated', 'looping', 'sticker'],
    packId: 'cloud-pack-v1'
  },
  {
    id: 'overlay-corner-spark',
    name: 'Corner Spark',
    description: 'Transparent orbital corner burst with a traveling comet, layered neon arcs, and a seamless OBS-ready loop.',
    previewUrl: '/previews/overlay-corner-spark.webm',
    formats: ['webm'],
    tags: ['transparent', 'obs-ready', 'overlay', 'animated'],
    packId: 'overlay-starter-v1'
  },
  {
    id: 'emoji-fire-reaction',
    name: 'Fire Reaction',
    description: 'Looping fire emoji animation for chat reactions and sticker packs.',
    previewUrl: '/previews/emoji-fire-reaction.gif',
    formats: ['gif', 'webm'],
    tags: ['animated', 'sticker', 'symbol'],
    packId: 'emoji-set-v1'
  },
  {
    id: 'signal-arrow-01',
    name: 'Arrow Signal',
    description: 'Animated directional arrow in neon style. Points right with a glow-in flash.',
    previewUrl: '/previews/signal-arrow-01.gif',
    formats: ['gif', 'webm'],
    tags: ['neon', 'symbol', 'animated'],
    packId: 'neon-signals-v1'
  }
];
