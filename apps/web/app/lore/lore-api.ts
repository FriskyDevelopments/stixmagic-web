import type { LoreAuraId, LoreMemberState, LoreResponse } from '@stixmagic/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_LORE_API_BASE_URL?.trim() ?? '').replace(/\/$/, '');
const INVITE_SESSION_KEY = 'lore-invite-token-session';

export type LoreMeResponse = {
  member: LoreMemberState;
  responses: LoreResponse[];
  firstDropRead: boolean;
};

function readInviteToken(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('invite');
  if (fromUrl) {
    window.sessionStorage.setItem(INVITE_SESSION_KEY, fromUrl);
    return fromUrl;
  }
  return window.sessionStorage.getItem(INVITE_SESSION_KEY);
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { 'content-type': 'application/json' };
  const inviteToken = readInviteToken();
  if (inviteToken) headers['x-lore-invite-token'] = inviteToken;

  const devMemberId = process.env.NEXT_PUBLIC_LORE_DEV_MEMBER_ID;
  const devTenantId = process.env.NEXT_PUBLIC_LORE_DEV_TENANT_ID;
  if (devMemberId) headers['x-lore-member-id'] = devMemberId;
  if (devTenantId) headers['x-lore-tenant-id'] = devTenantId;
  return headers;
}

async function loreRequest<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...buildHeaders(), ...(init?.headers ?? {}) }
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { ok?: boolean; data?: T };
    return payload.ok ? payload.data ?? null : null;
  } catch {
    return null;
  }
}

export function loadLoreMember(): Promise<LoreMeResponse | null> {
  return loreRequest<LoreMeResponse>('/lore/me');
}

export function syncLoreResponse(questionId: string, optionId: string): Promise<unknown> {
  return loreRequest('/lore/responses', { method: 'POST', body: JSON.stringify({ questionId, optionId }) });
}

export function syncLoreProgress(input: { currentStep: number; status: LoreMemberState['status']; auraId?: LoreAuraId; auraVersion?: string }): Promise<unknown> {
  return loreRequest('/lore/progress', { method: 'POST', body: JSON.stringify(input) });
}

export function syncLoreDropRead(dropId: string): Promise<unknown> {
  return loreRequest(`/lore/drops/${encodeURIComponent(dropId)}/read`, { method: 'POST', body: '{}' });
}

export function syncLoreEvent(name: string, properties: Record<string, string | number | boolean | undefined> = {}): Promise<unknown> {
  return loreRequest('/lore/events', { method: 'POST', body: JSON.stringify({ name, properties }) });
}

export function loadCommunityDestination(): Promise<{ enabled: boolean; destination: string | null } | null> {
  return loreRequest<{ enabled: boolean; destination: string | null }>('/lore/community-destination');
}


export type GoogleCalendarIntegrationStatus = {
  provider: 'google-calendar';
  status: 'not_configured' | 'not_connected' | 'connecting' | 'connected' | 'error' | 'disconnected';
  connection: { connectionId: string; createdAt: string; errors: Array<{ type: string; logId: string }> } | null;
  lastTraceId: string | null;
};

export function loadGoogleCalendarStatus(): Promise<GoogleCalendarIntegrationStatus | null> {
  return loreRequest<GoogleCalendarIntegrationStatus>('/integrations/google-calendar/status');
}

export function startGoogleCalendarConnection(): Promise<{ status: string; connectLink: string | null; expiresAt: string; traceId: string } | null> {
  return loreRequest('/integrations/google-calendar/connect', { method: 'POST', body: '{}' });
}

export function testGoogleCalendarConnection(): Promise<{ status: string; events: Array<{ id: string | null; title: string; start: string | null; end: string | null; link: string | null }>; lastSyncedAt: string; traceId: string } | null> {
  return loreRequest('/integrations/google-calendar/test', { method: 'POST', body: '{}' });
}

export function disconnectGoogleCalendar(): Promise<{ status: string; traceId: string } | null> {
  return loreRequest('/integrations/google-calendar', { method: 'DELETE' });
}
