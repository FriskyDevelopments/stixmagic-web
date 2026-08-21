import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  CreatePackRequest,
  CreateReactionRuleRequest,
  CreateStickerRequest,
  CreateTriggerRequest,
  LoreDropRead,
  LoreFunnelEvent,
  LoreIntegrationConnection,
  LoreMemberState,
  LoreResponse,
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
  loreMembers: LoreMemberState[];
  loreResponses: LoreResponse[];
  loreDropReads: LoreDropRead[];
  loreEvents: LoreFunnelEvent[];
  loreIntegrations: LoreIntegrationConnection[];
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
  packMeta: {},
  loreMembers: [],
  loreResponses: [],
  loreDropReads: [],
  loreEvents: [],
  loreIntegrations: []
};

async function loadState(): Promise<PersistedState> {
  if (stateCache) return stateCache;

  try {
    const raw = await readFile(statePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    stateCache = {
      ...structuredClone(seedState),
      ...parsed,
      loreMembers: parsed.loreMembers ?? [],
      loreResponses: parsed.loreResponses ?? [],
      loreDropReads: parsed.loreDropReads ?? [],
      loreEvents: parsed.loreEvents ?? [],
      loreIntegrations: parsed.loreIntegrations ?? []
    };
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

export async function observeTelegramGroup(input: {
  id: string;
  name: string;
  username?: string;
}): Promise<TelegramGroup> {
  const state = await loadState();
  const existing = state.groups.find((item) => item.id === input.id);
  if (existing) {
    existing.name = input.name;
    existing.username = input.username;
    await persistState(state);
    return existing;
  }

  const group: TelegramGroup = {
    id: input.id,
    name: input.name,
    username: input.username,
    memberCount: 0,
    isAdmin: true,
    settings: { reactionsEnabled: true, maxReactionsPerMessage: 3, cooldownSeconds: 30 },
    createdAt: new Date().toISOString()
  };
  state.groups.push(group);
  await persistState(state);
  return group;
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


export async function getOrCreateLoreMember(userId: string, tenantId: string): Promise<LoreMemberState> {
  const state = await loadState();
  const existing = state.loreMembers.find((member) => member.userId === userId && member.tenantId === tenantId);
  if (existing) return existing;

  const member: LoreMemberState = {
    userId,
    tenantId,
    status: 'invited',
    currentStep: 0,
    lastActiveAt: new Date().toISOString()
  };
  state.loreMembers.push(member);
  await persistState(state);
  return member;
}

export async function saveLoreProgress(input: {
  userId: string;
  tenantId: string;
  currentStep: number;
  status: LoreMemberState['status'];
  auraId?: LoreMemberState['auraId'];
  auraVersion?: string;
}): Promise<LoreMemberState> {
  const state = await loadState();
  const member = state.loreMembers.find((item) => item.userId === input.userId && item.tenantId === input.tenantId);
  if (!member) {
    const created: LoreMemberState = {
      userId: input.userId,
      tenantId: input.tenantId,
      status: input.status,
      currentStep: input.currentStep,
      auraId: input.auraId,
      auraVersion: input.auraVersion,
      lastActiveAt: new Date().toISOString()
    };
    state.loreMembers.push(created);
    await persistState(state);
    return created;
  }

  member.status = input.status;
  member.currentStep = input.currentStep;
  member.auraId = input.auraId ?? member.auraId;
  member.auraVersion = input.auraVersion ?? member.auraVersion;
  member.lastActiveAt = new Date().toISOString();
  await persistState(state);
  return member;
}

export async function saveLoreResponse(input: LoreResponse & { tenantId: string }): Promise<LoreResponse> {
  const state = await loadState();
  const existing = state.loreResponses.find((response) => response.userId === input.userId && response.questionId === input.questionId);
  const response: LoreResponse = {
    userId: input.userId,
    questionId: input.questionId,
    optionId: input.optionId,
    answeredAt: input.answeredAt
  };
  if (existing) Object.assign(existing, response);
  else state.loreResponses.push(response);
  await persistState(state);
  return response;
}

export async function listLoreResponses(userId: string): Promise<LoreResponse[]> {
  return (await loadState()).loreResponses.filter((response) => response.userId === userId);
}

export async function markLoreDropRead(userId: string, dropId: string): Promise<LoreDropRead> {
  const state = await loadState();
  const existing = state.loreDropReads.find((read) => read.userId === userId && read.dropId === dropId);
  if (existing) return existing;
  const read: LoreDropRead = { userId, dropId, readAt: new Date().toISOString() };
  state.loreDropReads.push(read);
  await persistState(state);
  return read;
}

export async function hasLoreDropRead(userId: string, dropId: string): Promise<boolean> {
  return (await loadState()).loreDropReads.some((read) => read.userId === userId && read.dropId === dropId);
}

export async function recordLoreEvent(event: LoreFunnelEvent): Promise<void> {
  const state = await loadState();
  state.loreEvents.push(event);
  if (state.loreEvents.length > 10_000) state.loreEvents = state.loreEvents.slice(-10_000);
  await persistState(state);
}

export async function getLoreFunnelSummary(): Promise<Record<string, { events: number; uniqueUsers: number }>> {
  const events = (await loadState()).loreEvents;
  const grouped = new Map<string, { events: number; users: Set<string> }>();
  for (const event of events) {
    const current = grouped.get(event.name) ?? { events: 0, users: new Set<string>() };
    current.events += 1;
    if (event.userId) current.users.add(event.userId);
    grouped.set(event.name, current);
  }
  return Object.fromEntries(Array.from(grouped.entries()).map(([name, value]) => [name, { events: value.events, uniqueUsers: value.users.size }]));
}


export async function getLoreIntegration(tenantId: string, provider: LoreIntegrationConnection['provider']): Promise<LoreIntegrationConnection | null> {
  return (await loadState()).loreIntegrations.find((integration) => integration.tenantId === tenantId && integration.provider === provider) ?? null;
}

export async function saveLoreIntegration(input: LoreIntegrationConnection): Promise<LoreIntegrationConnection> {
  const state = await loadState();
  const existing = state.loreIntegrations.find((integration) => integration.tenantId === input.tenantId && integration.provider === input.provider);
  if (existing) Object.assign(existing, input);
  else state.loreIntegrations.push(input);
  await persistState(state);
  return input;
}

export async function clearLoreIntegration(tenantId: string, provider: LoreIntegrationConnection['provider']): Promise<void> {
  const state = await loadState();
  state.loreIntegrations = state.loreIntegrations.filter((integration) => !(integration.tenantId === tenantId && integration.provider === provider));
  await persistState(state);
}
