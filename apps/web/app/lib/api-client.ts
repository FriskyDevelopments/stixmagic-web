import { loadTelegramClientEnv } from '@stixmagic/config';
import type {
  ApiResponse,
  CreateReactionRuleRequest,
  ReactionRule,
  TelegramGroup,
  TelegramMiniAppBootstrap
} from '@stixmagic/types';
import { MOCK_GROUPS, MOCK_RULES } from './mock-data';

const clientEnv = loadTelegramClientEnv();
const API_BASE = clientEnv.NEXT_PUBLIC_STIXMAGIC_API_BASE_URL;
const DEMO_MODE = clientEnv.NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA === 'true';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) throw new Error(`API responded with ok=false for ${path}`);
  return json.data;
}

export async function getMiniAppBootstrap(): Promise<TelegramMiniAppBootstrap> {
  if (DEMO_MODE) {
    return {
      config: {
        productName: 'STIX MΛGIC',
        platform: 'telegram',
        runtimeMode: 'polling',
        botUsername: clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME,
        miniAppUrl: clientEnv.NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL,
        apiBaseUrl: API_BASE,
        links: {
          botUsername: clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME,
          miniAppUrl: clientEnv.NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL,
          botStartUrl: `https://t.me/${clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME.replace(/^@/, '')}`,
          miniAppStartUrl: `https://t.me/${clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME.replace(/^@/, '')}/app`
        }
      },
      context: {
        launchSource: 'direct',
        initDataUnsafe: null
      },
      groups: MOCK_GROUPS
    };
  }

  try {
    return await apiFetch<TelegramMiniAppBootstrap>('/telegram/mini-app/bootstrap');
  } catch {
    return {
      config: {
        productName: 'STIX MΛGIC',
        platform: 'telegram',
        runtimeMode: 'polling',
        botUsername: clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME,
        miniAppUrl: clientEnv.NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL,
        apiBaseUrl: API_BASE,
        links: {
          botUsername: clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME,
          miniAppUrl: clientEnv.NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL,
          botStartUrl: `https://t.me/${clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME.replace(/^@/, '')}`,
          miniAppStartUrl: `https://t.me/${clientEnv.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME.replace(/^@/, '')}/app`
        }
      },
      context: {
        launchSource: 'direct',
        initDataUnsafe: null
      },
      groups: MOCK_GROUPS
    };
  }
}

export async function getGroups(): Promise<TelegramGroup[]> {
  if (DEMO_MODE) return MOCK_GROUPS;
  try {
    return await apiFetch<TelegramGroup[]>('/groups');
  } catch {
    return MOCK_GROUPS;
  }
}

export async function getGroup(id: string): Promise<TelegramGroup | null> {
  if (DEMO_MODE) return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  try {
    return await apiFetch<TelegramGroup>(`/groups/${id}`);
  } catch {
    return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  }
}

export async function getRules(groupId: string): Promise<ReactionRule[]> {
  if (DEMO_MODE) return MOCK_RULES[groupId] ?? [];
  try {
    return await apiFetch<ReactionRule[]>(`/groups/${groupId}/rules`);
  } catch {
    return MOCK_RULES[groupId] ?? [];
  }
}

export async function createRule(
  groupId: string,
  rule: CreateReactionRuleRequest
): Promise<ReactionRule> {
  const today = new Date().toISOString().split('T')[0];
  if (DEMO_MODE) {
    return { ...rule, id: `r${Date.now()}`, groupId, createdAt: today, updatedAt: today };
  }

  return await apiFetch<ReactionRule>(`/groups/${groupId}/rules`, {
    method: 'POST',
    body: JSON.stringify(rule)
  });
}

export async function toggleRule(
  groupId: string,
  ruleId: string,
  enabled: boolean
): Promise<void> {
  if (DEMO_MODE) return;
  await apiFetch<ReactionRule>(`/groups/${groupId}/rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled })
  });
}

export async function deleteRule(groupId: string, ruleId: string): Promise<void> {
  if (DEMO_MODE) return;
  await apiFetch<{ deleted: boolean }>(`/groups/${groupId}/rules/${ruleId}`, {
    method: 'DELETE'
  });
}

export function isDemoModeEnabled(): boolean {
  return DEMO_MODE;
}
