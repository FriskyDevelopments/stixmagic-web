import { randomUUID } from 'node:crypto';
import type {
  CreatePackRequest,
  CreateReactionRuleRequest,
  CreateStickerRequest,
  CreateTriggerRequest,
  ReactionRule,
  Sticker,
  StickerPack,
  TelegramGroup,
  Trigger
} from '@stixmagic/types';

const packs = new Map<string, StickerPack>();
const stickers = new Map<string, Sticker>();
const triggers = new Map<string, Trigger>();

const groups = new Map<string, TelegramGroup>([
  [
    '1',
    {
      id: '1',
      name: 'Stix Magic Fans',
      username: '@stixmagic_fans',
      memberCount: 1247,
      isAdmin: true,
      settings: {
        reactionsEnabled: true,
        maxReactionsPerMessage: 3,
        cooldownSeconds: 30
      },
      createdAt: '2024-01-15'
    }
  ],
  [
    '2',
    {
      id: '2',
      name: 'Dev Workspace',
      username: '@devworkspace',
      memberCount: 42,
      isAdmin: true,
      settings: {
        reactionsEnabled: false,
        maxReactionsPerMessage: 1,
        cooldownSeconds: 60
      },
      createdAt: '2024-03-01'
    }
  ],
  [
    '3',
    {
      id: '3',
      name: 'Community Hub',
      username: '@stixmagic_community',
      memberCount: 3890,
      isAdmin: true,
      settings: {
        reactionsEnabled: true,
        maxReactionsPerMessage: 5,
        cooldownSeconds: 15
      },
      createdAt: '2024-04-20'
    }
  ]
]);

const reactionRules = new Map<string, ReactionRule>([
  [
    'r1',
    {
      id: 'r1',
      groupId: '1',
      name: 'Magic Activation',
      triggerType: 'sticker',
      triggerValue: 'sticker_abc123',
      responseType: 'message',
      responseContent: '✨ Magic activated!',
      enabled: true,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01'
    }
  ],
  [
    'r2',
    {
      id: 'r2',
      groupId: '1',
      name: 'Sparkle Response',
      triggerType: 'emoji',
      triggerValue: '✨',
      responseType: 'sticker',
      responseContent: 'sticker_sparkle_id',
      enabled: true,
      createdAt: '2024-02-10',
      updatedAt: '2024-02-15'
    }
  ],
  [
    'r3',
    {
      id: 'r3',
      groupId: '1',
      name: 'Fire Emoji Burst',
      triggerType: 'emoji',
      triggerValue: '🔥',
      responseType: 'animation',
      responseContent: 'animation_fire_burst',
      enabled: false,
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    }
  ],
  [
    'r4',
    {
      id: 'r4',
      groupId: '2',
      name: 'Dev Poke',
      triggerType: 'sticker',
      triggerValue: 'sticker_poke_id',
      responseType: 'message',
      responseContent: '👋 Hey developer!',
      enabled: true,
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10'
    }
  ]
]);

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
  },

  listTelegramGroups(): TelegramGroup[] {
    return Array.from(groups.values());
  },

  getTelegramGroup(groupId: string): TelegramGroup | null {
    return groups.get(groupId) ?? null;
  },

  listReactionRules(groupId: string): ReactionRule[] {
    return Array.from(reactionRules.values()).filter((rule) => rule.groupId === groupId);
  },

  createReactionRule(groupId: string, input: CreateReactionRuleRequest): ReactionRule {
    const now = new Date().toISOString();
    const rule: ReactionRule = {
      id: randomUUID(),
      groupId,
      ...input,
      createdAt: now,
      updatedAt: now
    };

    reactionRules.set(rule.id, rule);
    return rule;
  },

  updateReactionRule(groupId: string, ruleId: string, patch: Pick<ReactionRule, 'enabled'>): ReactionRule | null {
    const current = reactionRules.get(ruleId);
    if (!current || current.groupId !== groupId) return null;

    const updated: ReactionRule = {
      ...current,
      enabled: patch.enabled,
      updatedAt: new Date().toISOString()
    };

    reactionRules.set(ruleId, updated);
    return updated;
  },

  deleteReactionRule(groupId: string, ruleId: string): boolean {
    const current = reactionRules.get(ruleId);
    if (!current || current.groupId !== groupId) return false;

    reactionRules.delete(ruleId);
    return true;
  }
};
