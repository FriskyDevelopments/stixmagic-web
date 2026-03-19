import type { ProductPack } from '@stixmagic/types';
import { PENDING_PREVIEW_URL } from '@stixmagic/types';

export const SAMPLE_PACKS: ProductPack[] = [
  {
    id: 'motion-alphabet-v1',
    name: 'Motion Alphabet v1',
    category: 'motion-alphabet',
    description: 'Animated A–Z letters with looping motion sequences. Drop into any stream, overlay, or banner.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 26,
    tags: ['animated', 'looping', 'letter'],
    formats: ['gif', 'webm'],
    featured: true
  },
  {
    id: 'neon-signals-v1',
    name: 'Neon Signals',
    category: 'neon-signals',
    description: 'Glowing neon symbols and signal indicators. Built for alerts, overlays, and live production screens.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 18,
    tags: ['neon', 'symbol', 'animated'],
    formats: ['gif', 'webm', 'webp'],
    featured: true
  },
  {
    id: 'dj-pack-v1',
    name: 'DJ Pack',
    category: 'dj-pack',
    description: 'Motion stickers for DJ sets: waveforms, equalizers, decks, and crowd energy visuals.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 24,
    tags: ['music', 'animated', 'sticker'],
    formats: ['gif', 'webm'],
    featured: false
  },
  {
    id: 'cloud-pack-v1',
    name: 'Cloud Pack',
    category: 'cloud-pack',
    description: 'Animated cloud and weather motifs. Soft looping assets for chill streams and backgrounds.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 12,
    tags: ['animated', 'looping', 'sticker'],
    formats: ['gif', 'webp'],
    featured: false
  },
  {
    id: 'overlay-starter-v1',
    name: 'Overlay Starter',
    category: 'overlay-starter',
    description: 'Transparent WebM overlays ready for OBS, Streamlabs, and live production workflows.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 10,
    tags: ['overlay', 'animated'],
    formats: ['webm'],
    featured: false
  },
  {
    id: 'emoji-set-v1',
    name: 'Emoji Set',
    category: 'emoji-set',
    description: 'Animated emoji-style expressions and reactions with looping energy for sticker packs and chat.',
    previewUrl: PENDING_PREVIEW_URL,
    assetCount: 30,
    tags: ['animated', 'sticker', 'symbol'],
    formats: ['gif', 'webp'],
    featured: false
  }
];
