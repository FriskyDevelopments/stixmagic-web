import { randomUUID } from 'node:crypto';
import type {
  CreatePackRequest,
  CreateStickerRequest,
  CreateTriggerRequest,
  Sticker,
  StickerPack,
  Trigger
} from '@stixmagic/types';

const packs = new Map<string, StickerPack>();
const stickers = new Map<string, Sticker>();
const triggers = new Map<string, Trigger>();

export const store = {
  listPacks(): StickerPack[] {
    return Array.from(packs.values());
  },

  createPack(input: CreatePackRequest): StickerPack {
    const now = new Date().toISOString();
    const pack: StickerPack = {
      id: randomUUID(),
      name: input.name,
      ownerId: input.ownerId,
      stickers: [],
      createdAt: now,
      updatedAt: now
    };

    packs.set(pack.id, pack);
    return pack;
  },

  createTrigger(input: CreateTriggerRequest): Trigger {
    const trigger: Trigger = {
      id: randomUUID(),
      stickerId: input.stickerId,
      actionType: input.actionType,
      actionPayload: input.actionPayload,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    triggers.set(trigger.id, trigger);
    return trigger;
  },

  listTriggers(): Trigger[] {
    return Array.from(triggers.values());
  },

  createSticker(input: CreateStickerRequest): Sticker {
    const sticker: Sticker = {
      id: randomUUID(),
      packId: input.packId,
      imageUrl: input.imageUrl,
      metadata: input.metadata,
      triggerId: input.triggerId,
      createdAt: new Date().toISOString()
    };

    stickers.set(sticker.id, sticker);

    const pack = packs.get(sticker.packId);
    if (pack) {
      pack.stickers = [...pack.stickers, sticker];
      pack.updatedAt = new Date().toISOString();
      packs.set(pack.id, pack);
    }

    return sticker;
  }
};
