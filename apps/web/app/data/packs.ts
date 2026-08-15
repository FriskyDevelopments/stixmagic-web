import type { ProductPack } from '@stixmagic/types';

export const SAMPLE_PACKS: ProductPack[] = [
  {
    id: 'motion-alphabet-v1',
    name: 'Motion Alphabet v1',
    category: 'motion-alphabet',
    description: 'Complete animated A–Z neon alphabet, exported as seamless Telegram-ready WebM loops and GIF previews.',
    previewUrl: '/previews/letter-a-neon.gif',
    assetCount: 26,
    tags: ['telegram-ready', 'animated', 'looping', 'letter'],
    formats: ['gif', 'webm'],
    featured: true
  },
  {
    id: 'neon-signals-v1',
    name: 'Neon Signals',
    category: 'neon-signals',
    description: 'Glowing neon symbols and signal indicators. Built for alerts, overlays, and live production screens.',
    previewUrl: '/previews/signal-arrow-01.gif',
    assetCount: 2,
    tags: ['neon', 'symbol', 'animated'],
    formats: ['gif', 'webm'],
    featured: true
  },
  {
    id: 'dj-pack-v1',
    name: 'DJ Pack',
    category: 'dj-pack',
    description: 'Motion stickers for DJ sets: waveforms, equalizers, decks, and crowd energy visuals.',
    previewUrl: '/previews/waveform-loop-01.gif',
    assetCount: 1,
    tags: ['music', 'animated', 'sticker'],
    formats: ['gif', 'webm'],
    featured: false
  },
  {
    id: 'cloud-pack-v1',
    name: 'Cloud Pack',
    category: 'cloud-pack',
    description: 'Animated cloud and weather motifs. Soft looping assets for chill streams and backgrounds.',
    previewUrl: '/previews/cloud-drift-01.gif',
    assetCount: 1,
    tags: ['animated', 'looping', 'sticker'],
    formats: ['gif', 'webm'],
    featured: false
  },
  {
    id: 'overlay-starter-v1',
    name: 'Overlay Starter',
    category: 'overlay-starter',
    description: 'Transparent WebM overlays ready for OBS, Streamlabs, and live production workflows.',
    previewUrl: '/previews/overlay-corner-spark.webm',
    assetCount: 1,
    tags: ['overlay', 'animated'],
    formats: ['webm'],
    featured: false
  },
  {
    id: 'emoji-set-v1',
    name: 'Emoji Set',
    category: 'emoji-set',
    description: 'Animated emoji-style expressions and reactions with looping energy for sticker packs and chat.',
    previewUrl: '/previews/emoji-fire-reaction.gif',
    assetCount: 1,
    tags: ['animated', 'sticker', 'symbol'],
    formats: ['gif', 'webm'],
    featured: false
  }
];
