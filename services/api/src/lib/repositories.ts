import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
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

interface PersistedState {
  admins: Array<{ telegramUserId: string; role: 'admin' }>;
  groups: TelegramGroup[];
  rules: ReactionRule[];
  packs: StickerPack[];
  triggers: Trigger[];
  webhookUpdates: number[];
  packMeta: Record<string, { packName: string; title: string }>;
}

const statePath = path.resolve(process.cwd(), 'data/state.json');
let stateCache: PersistedState | null = null;

const seedState: PersistedState = {
  admins: [],
  groups: [
    {
      id: '1',
      name: 'Stix Magic Fans',
      username: '@stixmagic_fans',
      memberCount: 1247,
      isAdmin: true,
      settings: { reactionsEnabled: true, maxReactionsPerMessage: 3, cooldownSeconds: 30 },
      createdAt: '2024-01-15T00:00:00.000Z'
    }
  ],
  rules: [],
  packs: [],
  triggers: [],
  webhookUpdates: [],
  packMeta: {}
};

async function loadState(): Promise<PersistedState> {
  if (stateCache) return stateCache;

  try {
    const raw = await readFile(statePath, 'utf8');
    stateCache = JSON.parse(raw) as PersistedState;
  } catch {
    stateCache = structuredClone(seedState);
    await persistState(stateCache);
  }

  return stateCache;
}

async function persistState(nextState: PersistedState): Promise<void> {
  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, JSON.stringify(nextState, null, 2));
}

async function updateState(updater: (state: PersistedState) => void): Promise<void> {
  const state = await loadState();
  updater(state);
  await persistState(state);
}

export async function ensureAdminIdentity(telegramUserId: string): Promise<void> {
  await updateState((state) => {
    if (!state.admins.some((item) => item.telegramUserId === telegramUserId)) {
      state.admins.push({ telegramUserId, role: 'admin' });
    }
  });
}

export async function listTelegramGroups(): Promise<TelegramGroup[]> {
  return (await loadState()).groups;
}

export async function getTelegramGroup(groupId: string): Promise<TelegramGroup | null> {
  return (await loadState()).groups.find((item) => item.id === groupId) ?? null;
}

export async function listReactionRules(groupId: string): Promise<ReactionRule[]> {
  return (await loadState()).rules.filter((rule) => rule.groupId === groupId);
}

export async function createReactionRule(groupId: string, input: CreateReactionRuleRequest): Promise<ReactionRule> {
  const now = new Date().toISOString();
  const rule: ReactionRule = { id: randomUUID(), groupId, ...input, createdAt: now, updatedAt: now };
  await updateState((state) => {
    state.rules.push(rule);
  });
  return rule;
}

export async function updateReactionRule(groupId: string, ruleId: string, enabled: boolean): Promise<ReactionRule | null> {
  const state = await loadState();
  const rule = state.rules.find((item) => item.id === ruleId && item.groupId === groupId);
  if (!rule) return null;
  rule.enabled = enabled;
  rule.updatedAt = new Date().toISOString();
  await persistState(state);
  return rule;
}

export async function deleteReactionRule(groupId: string, ruleId: string): Promise<boolean> {
  const state = await loadState();
  const next = state.rules.filter((item) => !(item.id === ruleId && item.groupId === groupId));
  if (next.length === state.rules.length) return false;
  state.rules = next;
  await persistState(state);
  return true;
}

export async function listPacks(): Promise<StickerPack[]> {
  return (await loadState()).packs;
}

export async function createPack(input: CreatePackRequest): Promise<StickerPack> {
  const now = new Date().toISOString();
  const pack: StickerPack = { id: randomUUID(), name: input.name, ownerId: input.ownerId, stickers: [], createdAt: now, updatedAt: now };
  await updateState((state) => state.packs.push(pack));
  return pack;
}

export async function createTrigger(input: CreateTriggerRequest): Promise<Trigger> {
  const trigger: Trigger = {
    id: randomUUID(),
    stickerId: input.stickerId,
    actionType: input.actionType,
    actionPayload: input.actionPayload,
    enabled: true,
    createdAt: new Date().toISOString()
  };
  await updateState((state) => state.triggers.push(trigger));
  return trigger;
}

export async function listTriggers(): Promise<Trigger[]> {
  return (await loadState()).triggers;
}

export async function createSticker(input: CreateStickerRequest): Promise<Sticker> {
  const sticker: Sticker = {
    id: randomUUID(),
    packId: input.packId,
    imageUrl: input.imageUrl,
    metadata: input.metadata,
    triggerId: input.triggerId,
    createdAt: new Date().toISOString()
  };

  await updateState((state) => {
    const pack = state.packs.find((item) => item.id === input.packId);
    if (!pack) throw new Error('Pack not found');
    pack.stickers.push(sticker);
    pack.updatedAt = new Date().toISOString();
  });

  return sticker;
}

export async function isAdminTelegramUser(telegramUserId: string): Promise<boolean> {
  return (await loadState()).admins.some((item) => item.telegramUserId === telegramUserId);
}

export async function upsertWebhookUpdate(updateId: number): Promise<boolean> {
  const state = await loadState();
  if (state.webhookUpdates.includes(updateId)) return false;
  state.webhookUpdates.push(updateId);
  await persistState(state);
  return true;
}

export async function setTelegramPackMetadata(packId: string, values: { packName: string; title: string }): Promise<void> {
  await updateState((state) => {
    state.packMeta[packId] = values;
  });
}
