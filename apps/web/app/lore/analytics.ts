import { syncLoreEvent } from './lore-api';

export type LoreFunnelEventName =
  | 'invitation_viewed'
  | 'archive_entered'
  | 'aura_journey_started'
  | 'aura_decision_answered'
  | 'aura_discovered'
  | 'community_invitation_viewed'
  | 'community_invitation_clicked'
  | 'drop_viewed';

type LoreFunnelEvent = {
  name: LoreFunnelEventName;
  occurredAt: string;
  properties: Record<string, string | number | boolean | undefined>;
};

const EVENT_STORAGE_KEY = 'lore-funnel-events-v1';
const endpoint = process.env.NEXT_PUBLIC_LORE_ANALYTICS_ENDPOINT;

export function trackLoreEvent(name: LoreFunnelEventName, properties: LoreFunnelEvent['properties'] = {}): void {
  if (typeof window === 'undefined') return;

  const event: LoreFunnelEvent = {
    name,
    occurredAt: new Date().toISOString(),
    properties
  };

  try {
    const stored = JSON.parse(window.localStorage.getItem(EVENT_STORAGE_KEY) ?? '[]') as LoreFunnelEvent[];
    stored.push(event);
    window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(stored.slice(-100)));
  } catch {
    // Analytics must never block the experience when local storage is unavailable.
  }

  const serverEventMap: Partial<Record<LoreFunnelEventName, string>> = {
    invitation_viewed: 'invitation_opened',
    archive_entered: 'invitation_opened',
    aura_journey_started: 'journey_started',
    aura_decision_answered: 'decision_answered',
    aura_discovered: 'aura_discovered',
    community_invitation_clicked: 'community_cta_clicked',
    drop_viewed: 'drop_opened'
  };
  const serverEventName = serverEventMap[name];
  if (serverEventName) void syncLoreEvent(serverEventName, properties);

  if (!endpoint) return;

  const body = JSON.stringify({
    name: event.name,
    occurredAt: event.occurredAt,
    properties: Object.fromEntries(Object.entries(event.properties).filter(([, value]) => value !== undefined))
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      void fetch(endpoint, { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true });
    }
  } catch {
    // Analytics is best-effort by design.
  }
}

export function readLoreFunnelEvents(): LoreFunnelEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(EVENT_STORAGE_KEY) ?? '[]') as LoreFunnelEvent[];
  } catch {
    return [];
  }
}
