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
const ALLOW_API_FALLBACK = clientEnv.NEXT_PUBLIC_STIXMAGIC_ALLOW_API_FALLBACK === 'true';

/**
 * Create a demo Telegram mini-app bootstrap object populated with mock configuration, context, and groups.
 *
 * @returns A TelegramMiniAppBootstrap populated with mock config values, environment-derived bot and mini-app identifiers/URLs (including start URLs), a direct launch context, and MOCK_GROUPS.
 */
function buildDemoBootstrap(): TelegramMiniAppBootstrap {
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

/**
 * Retrieve the Telegram WebApp `initData` string from the browser environment if available.
 *
 * @returns The `initData` string from `window.Telegram.WebApp` if present and non-empty, or `null` otherwise.
 */
function resolveInitDataHeader(): string | null {
  if (typeof window === 'undefined') return null;
  const telegram = (window as Window & { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
  const initData = telegram?.WebApp?.initData;
  return initData && initData.length > 0 ? initData : null;
}

/**
 * Fetches a typed API resource from the configured API base.
 *
 * @param path - URL path appended to the configured API base (should start with `/`)
 * @param init - Optional fetch init; provided headers are merged and, if present in the browser, Telegram `initData` is added as `x-telegram-init-data`. A `Content-Type: application/json` header is ensured when not already present.
 * @returns The `data` payload from the API response parsed as `T`.
 * @throws Error when the HTTP response status is not OK or when the API response has `ok: false`.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const initDataHeader = resolveInitDataHeader();
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (initDataHeader && !headers.has('x-telegram-init-data')) {
    headers.set('x-telegram-init-data', initDataHeader);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });

  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) throw new Error(`API responded with ok=false for ${path}`);
  return json.data;
}

/**
 * Retrieve the Telegram mini-app bootstrap configuration for the current environment.
 *
 * If demo mode is enabled, returns a built demo bootstrap. Otherwise requests the
 * bootstrap from the API; if that request fails and API fallback is enabled, returns
 * the demo bootstrap instead.
 *
 * @returns The Telegram mini-app bootstrap configuration
 * @throws An error from the API request when demo mode is disabled and API fallback is not enabled
 */
export async function getMiniAppBootstrap(): Promise<TelegramMiniAppBootstrap> {
  if (DEMO_MODE) {
    return buildDemoBootstrap();
  }

  try {
    return await apiFetch<TelegramMiniAppBootstrap>('/telegram/mini-app/bootstrap');
  } catch (error) {
    if (ALLOW_API_FALLBACK) return buildDemoBootstrap();
    throw error;
  }
}

/**
 * Retrieve the list of Telegram groups, using mock data when configured to run in demo mode or when API fallback is allowed and the request fails.
 *
 * @returns An array of `TelegramGroup` objects; returns `MOCK_GROUPS` when demo mode is enabled or when the API call fails and fallback is allowed.
 */
export async function getGroups(): Promise<TelegramGroup[]> {
  if (DEMO_MODE) return MOCK_GROUPS;
  try {
    return await apiFetch<TelegramGroup[]>('/groups');
  } catch (error) {
    if (!ALLOW_API_FALLBACK) throw error;
    return MOCK_GROUPS;
  }
}

/**
 * Fetches a Telegram group by id, using demo data when DEMO_MODE is enabled or when the API fails and fallback is allowed.
 *
 * @param id - The group's identifier
 * @returns The matching `TelegramGroup` if found, or `null` if no group exists
 */
export async function getGroup(id: string): Promise<TelegramGroup | null> {
  if (DEMO_MODE) return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  try {
    return await apiFetch<TelegramGroup>(`/groups/${id}`);
  } catch (error) {
    if (!ALLOW_API_FALLBACK) throw error;
    return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  }
}

/**
 * Fetches the reaction rules for the specified group, falling back to demo data when configured or when the API request fails and fallback is allowed.
 *
 * @param groupId - The identifier of the group whose rules should be retrieved
 * @returns An array of reaction rules for the specified group; when demo mode is enabled or the API fails and fallback is allowed, returns the corresponding mock rules (possibly an empty array)
 */
export async function getRules(groupId: string): Promise<ReactionRule[]> {
  if (DEMO_MODE) return MOCK_RULES[groupId] ?? [];
  try {
    return await apiFetch<ReactionRule[]>(`/groups/${groupId}/rules`);
  } catch (error) {
    if (!ALLOW_API_FALLBACK) throw error;
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

/**
 * Indicates whether the client is configured to use demo/mock data.
 *
 * @returns `true` if demo mode is enabled, `false` otherwise.
 */
export function isDemoModeEnabled(): boolean {
  return DEMO_MODE;
}

/**
 * Indicates whether falling back to demo/mock data for API failures is enabled.
 *
 * @returns `true` if API fallback is enabled, `false` otherwise.
 */
export function isApiFallbackEnabled(): boolean {
  return ALLOW_API_FALLBACK;
}
