import type { TelegramGroup, ReactionRule } from '@stixmagic/types';
import { MOCK_GROUPS, MOCK_RULES } from './mock-data';

/**
 * Set NEXT_PUBLIC_API_URL to your backend base URL (e.g. http://localhost:4000)
 * to connect the dashboard to a real API. When unset, all reads fall back to
 * the built-in mock data so the UI is fully browsable without a backend.
 *
 * NOTE: NEXT_PUBLIC_* variables are inlined at build time by Next.js (including
 * static-export builds). Set this in .env.local or your CI environment before
 * building to embed the correct URL.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  const json = (await res.json()) as { ok: boolean; data: T };
  if (!json.ok) throw new Error(`API responded with ok=false for ${path}`);
  return json.data;
}

export async function getGroups(): Promise<TelegramGroup[]> {
  if (!API_BASE) return MOCK_GROUPS;
  try {
    return await apiFetch<TelegramGroup[]>('/groups');
  } catch {
    return MOCK_GROUPS;
  }
}

export async function getGroup(id: string): Promise<TelegramGroup | null> {
  if (!API_BASE) return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  try {
    return await apiFetch<TelegramGroup>(`/groups/${id}`);
  } catch {
    return MOCK_GROUPS.find((g) => g.id === id) ?? null;
  }
}

export async function getRules(groupId: string): Promise<ReactionRule[]> {
  if (!API_BASE) return MOCK_RULES[groupId] ?? [];
  try {
    return await apiFetch<ReactionRule[]>(`/groups/${groupId}/rules`);
  } catch {
    return MOCK_RULES[groupId] ?? [];
  }
}

export async function createRule(
  groupId: string,
  rule: Omit<ReactionRule, 'id' | 'groupId' | 'createdAt' | 'updatedAt'>
): Promise<ReactionRule> {
  const today = new Date().toISOString().split('T')[0];
  if (!API_BASE) {
    return { ...rule, id: `r${Date.now()}`, groupId, createdAt: today, updatedAt: today };
  }
  const res = await fetch(`${API_BASE}/groups/${groupId}/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule)
  });
  if (!res.ok) throw new Error('Failed to create rule');
  const json = (await res.json()) as { ok: boolean; data: ReactionRule };
  return json.data;
}

export async function toggleRule(
  groupId: string,
  ruleId: string,
  enabled: boolean
): Promise<void> {
  if (!API_BASE) return;
  const res = await fetch(`${API_BASE}/groups/${groupId}/rules/${ruleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error(`Failed to toggle rule ${ruleId}`);
}

export async function deleteRule(groupId: string, ruleId: string): Promise<void> {
  if (!API_BASE) return;
  const res = await fetch(`${API_BASE}/groups/${groupId}/rules/${ruleId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete rule ${ruleId}`);
}
