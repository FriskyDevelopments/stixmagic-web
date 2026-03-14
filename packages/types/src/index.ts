export type Platform = 'telegram' | 'discord' | 'slack';

export type ActionType = 'send_message' | 'run_command' | 'call_webhook' | 'bot_reaction';

export type MaskType =
  | 'default'
  | 'circle'
  | 'square'
  | 'oval'
  | 'diamond'
  | 'star'
  | 'heart';

export interface User {
  id: string;
  username: string;
  platform: Platform;
  createdAt: string;
}

export interface StickerMetadata {
  width: number;
  height: number;
  format: 'webp' | 'png' | 'webm';
  sizeBytes: number;
  maskType: MaskType;
  interactive: boolean;
}

export interface Sticker {
  id: string;
  packId: string;
  imageUrl: string;
  metadata: StickerMetadata;
  triggerId: string;
  createdAt: string;
}

export interface StickerPack {
  id: string;
  name: string;
  ownerId: string;
  stickers: Sticker[];
  createdAt: string;
  updatedAt: string;
}

export interface Trigger {
  id: string;
  stickerId: string;
  actionType: ActionType;
  actionPayload: Record<string, unknown>;
  enabled: boolean;
  createdAt: string;
}

export interface MaskDefinition {
  id: MaskType;
  name: string;
  description: string;
  category: 'classic' | 'expressive';
}

export interface StickerCreatedEvent {
  type: 'sticker.created';
  occurredAt: string;
  stickerId: string;
  packId: string;
}

export interface StickerUsedEvent {
  type: 'sticker.used';
  occurredAt: string;
  platform: Platform;
  stickerId: string;
  actorId: string;
  chatId: string;
}

export type DomainEvent = StickerCreatedEvent | StickerUsedEvent;

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

export interface CreateStickerRequest {
  packId: string;
  imageUrl: string;
  metadata: StickerMetadata;
  triggerId: string;
}

export interface CreatePackRequest {
  name: string;
  ownerId: string;
}

export interface CreateTriggerRequest {
  stickerId: string;
  actionType: ActionType;
  actionPayload: Record<string, unknown>;
}

export const BUILTIN_MASKS: MaskDefinition[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Keeps the full image intact for fast sticker generation.',
    category: 'classic'
  },
  {
    id: 'circle',
    name: 'Circle',
    description: 'Perfect for profile-style stickers with balanced framing.',
    category: 'classic'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Clean geometric mask built for UI iconography and logos.',
    category: 'classic'
  },
  {
    id: 'oval',
    name: 'Oval',
    description: 'Soft portrait-style crop for expressive character stickers.',
    category: 'expressive'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Sharp angular crop that feels dynamic in chat streams.',
    category: 'expressive'
  },
  {
    id: 'star',
    name: 'Star',
    description: 'High-energy badge mask for reaction-focused sticker packs.',
    category: 'expressive'
  },
  {
    id: 'heart',
    name: 'Heart',
    description: 'Community favorite mask for emotive and social moments.',
    category: 'expressive'
  }
];
