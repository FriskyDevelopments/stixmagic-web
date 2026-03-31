'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Panel } from '@stixmagic/ui';
import type { TelegramGroup, ReactionRule } from '@stixmagic/types';
import { getGroup, getRules, isDemoModeEnabled, isApiFallbackEnabled } from '../../lib/api-client';
import { MOCK_GROUPS, MOCK_RULES } from '../../lib/mock-data';

interface Props {
  groupId: string;
}

function formatApiFailureMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('API 401')) {
    return 'Authentication failed. Re-open the mini app from Telegram and try again.';
  }
  if (message.includes('API 403')) {
    return 'Your account is not authorized to access this group.';
  }
  if (message.includes('API 404')) {
    return 'This group no longer exists or you no longer have access to it.';
  }
  if (message.includes('API 5')) {
    return 'The API is currently unavailable. Please retry in a moment.';
  }
  return 'We could not load this group from the API. Please refresh and try again.';
}

export default function GroupView({ groupId }: Props) {
  const allowFallback = useMemo(() => isDemoModeEnabled() || isApiFallbackEnabled(), []);
  const fallbackGroup = allowFallback ? (MOCK_GROUPS.find((g) => g.id === groupId) ?? null) : null;
  const [group, setGroup] = useState<TelegramGroup | null>(fallbackGroup);
  const [rules, setRules] = useState<ReactionRule[]>(allowFallback ? (MOCK_RULES[groupId] ?? []) : []);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadGroupData() {
      try {
        const [g, r] = await Promise.all([getGroup(groupId), getRules(groupId)]);
        if (g) setGroup(g);
        setRules(r);
        setErrorMessage(null);
      } catch (error) {
        const technicalMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('[API_FAIL]', { allowFallback, message: technicalMessage });
        if (!allowFallback) {
          setErrorMessage(formatApiFailureMessage(error));
          setGroup(null);
          setRules([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadGroupData();
  }, [groupId, allowFallback]);

  if (!group && errorMessage) {
    return (
      <Panel variant="secondary">
        <p className="text-sm font-medium text-text">Couldn&apos;t load this group.</p>
        <p className="mt-1 text-sm text-muted">{errorMessage}</p>
        <p className="mt-2 text-xs text-muted">
          Check your Telegram login/session and API availability, then refresh this page.
        </p>
      </Panel>
    );
  }

  if (!group) {
    return (
      <Panel>
        <p className="text-sm text-muted">Group not found.</p>
      </Panel>
    );
  }

  const activeRules = rules.filter((r) => r.enabled);

  return (
    <div className="space-y-6 pb-10">
      <Panel>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">
          <Link href="/dashboard" className="transition hover:text-accent-indigo">
            Dashboard
          </Link>
          {' / '}
          <Link href="/groups" className="transition hover:text-accent-indigo">
            Groups
          </Link>
          {' / '}
          <span className="text-text">{group.name}</span>
        </p>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text">{group.name}</h1>
            {group.username && <p className="mt-1 text-sm text-muted">{group.username}</p>}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              group.settings.reactionsEnabled
                ? 'bg-accent-teal/15 text-accent-teal'
                : 'bg-muted/10 text-muted'
            }`}
          >
            {group.settings.reactionsEnabled ? 'Reactions Active' : 'Reactions Paused'}
          </span>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-muted">Members</p>
          <p className="mt-2 text-3xl font-extrabold text-accent-cyan">
            {loading ? '—' : group.memberCount.toLocaleString()}
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-muted">Total Rules</p>
          <p className="mt-2 text-3xl font-extrabold text-accent-violet">
            {loading ? '—' : rules.length}
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-muted">Active Rules</p>
          <p className="mt-2 text-3xl font-extrabold text-accent-teal">
            {loading ? '—' : activeRules.length}
          </p>
        </Panel>
      </div>

      <Panel>
        <h2 className="font-semibold text-text">Group Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-accent-primary/10 bg-background/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Magic Reactions</p>
              <p className="mt-0.5 text-xs text-muted">
                Enable or pause all reaction rules for this group
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                group.settings.reactionsEnabled
                  ? 'bg-accent-teal/20 text-accent-teal'
                  : 'bg-muted/10 text-muted'
              }`}
            >
              {group.settings.reactionsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-accent-primary/10 bg-background/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Max Reactions per Message</p>
              <p className="mt-0.5 text-xs text-muted">
                Limit how many rules can fire on a single message
              </p>
            </div>
            <span className="text-sm font-semibold text-accent-indigo">
              {group.settings.maxReactionsPerMessage}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-accent-primary/10 bg-background/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Cooldown</p>
              <p className="mt-0.5 text-xs text-muted">
                Minimum seconds between reactions from the same user
              </p>
            </div>
            <span className="text-sm font-semibold text-accent-indigo">
              {group.settings.cooldownSeconds}s
            </span>
          </div>
        </div>
      </Panel>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Reaction Rules</h2>
        <Link
          href={`/groups/${group.id}/reactions`}
          className="rounded-lg bg-accent-primary/20 px-4 py-2 text-sm font-medium text-accent-indigo transition hover:bg-accent-primary/30"
        >
          Manage Reactions →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Panel key={i} variant="secondary" className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-accent-primary/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-accent-primary/10" />
                  <div className="h-3 w-1/2 rounded bg-accent-primary/10" />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : rules.length === 0 ? (
        <Panel variant="secondary">
          <p className="text-sm text-muted">
            No reaction rules yet.{' '}
            <Link
              href={`/groups/${group.id}/reactions`}
              className="text-accent-cyan hover:text-accent-indigo"
            >
              Create your first rule →
            </Link>
          </p>
        </Panel>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Panel key={rule.id} variant="secondary" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                    rule.triggerType === 'emoji'
                      ? 'bg-accent-orange/15 text-accent-orange'
                      : 'bg-accent-violet/15 text-accent-violet'
                  }`}
                >
                  {rule.triggerType === 'emoji' ? rule.triggerValue : '🎨'}
                </span>
                <div>
                  <p className="text-sm font-medium text-text">{rule.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {rule.triggerType} &rarr; {rule.responseType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    rule.enabled ? 'bg-accent-teal/15 text-accent-teal' : 'bg-muted/10 text-muted'
                  }`}
                >
                  {rule.enabled ? 'Active' : 'Paused'}
                </span>
                <Link
                  href={`/groups/${group.id}/reactions`}
                  className="text-xs text-accent-cyan transition hover:text-accent-indigo"
                >
                  Edit
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
