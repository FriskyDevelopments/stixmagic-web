'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Panel } from '@stixmagic/ui';
import type { TelegramGroup, ReactionRule } from '@stixmagic/types';
import { getGroups, getRules, getMiniAppBootstrap, isApiFallbackEnabled, isDemoModeEnabled } from '../lib/api-client';
import { MOCK_GROUPS, MOCK_RULES } from '../lib/mock-data';

export default function DashboardPage() {
  const [groups, setGroups] = useState<TelegramGroup[]>(MOCK_GROUPS);
  const [allRules, setAllRules] = useState<Record<string, ReactionRule[]>>(MOCK_RULES);
  const [loading, setLoading] = useState(true);
  const [launchSource, setLaunchSource] = useState('direct');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const bootstrap = await getMiniAppBootstrap();
        setLaunchSource(bootstrap.context.launchSource);

        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
        const rulesMap: Record<string, ReactionRule[]> = {};
        await Promise.all(
          fetchedGroups.map(async (g) => {
            rulesMap[g.id] = await getRules(g.id);
          })
        );
        setAllRules(rulesMap);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setErrorMessage(`Failed to load control center data from API: ${message}`);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalRules = Object.values(allRules).reduce((sum, rules) => sum + rules.length, 0);
  const activeRules = Object.values(allRules)
    .flat()
    .filter((r) => r.enabled).length;

  const stats = [
    { label: 'Connected Groups', value: groups.length, accent: 'text-accent-cyan' },
    { label: 'Total Reaction Rules', value: totalRules, accent: 'text-accent-violet' },
    { label: 'Active Rules', value: activeRules, accent: 'text-accent-teal' }
  ];

  return (
    <div className="space-y-8 pb-10">
      <Panel>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">Telegram Mini App / Control Center</p>
        <h1 className="mt-3 text-3xl font-semibold text-text">STIX MΛGIC Telegram Control Center</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Manage the same Telegram product system the bot launches. Groups, reaction rules, and future deployment actions all route through this mini app surface.
        </p>
        <p className="mt-3 text-xs text-muted">
          Launch source: <span className="text-text">{launchSource}</span>. {isDemoModeEnabled() ? 'Demo data is enabled for this build.' : 'Live API mode is enabled for this build.'}
        </p>
        {!isDemoModeEnabled() && isApiFallbackEnabled() ? (
          <p className="mt-2 text-xs text-amber-300">
            API fallback is enabled for this build. Mock data can appear when API requests fail.
          </p>
        ) : null}
        {errorMessage ? <p className="mt-2 text-xs text-red-300">{errorMessage}</p> : null}
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Panel key={stat.label} variant="secondary">
            <p className="text-xs uppercase tracking-wider text-muted">{stat.label}</p>
            <p className={`mt-2 text-4xl font-extrabold ${stat.accent}`}>
              {loading ? '—' : stat.value}
            </p>
          </Panel>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Your Groups</h2>
          <Link
            href="/groups"
            className="text-sm font-medium text-accent-cyan transition hover:text-accent-indigo"
          >
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Panel key={i} variant="secondary" className="animate-pulse">
                <div className="h-4 w-3/4 rounded bg-accent-primary/10" />
                <div className="mt-3 h-3 w-1/2 rounded bg-accent-primary/10" />
              </Panel>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const rules = allRules[group.id] ?? [];
              const activeCount = rules.filter((r) => r.enabled).length;
              return (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Panel className="cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-text">{group.name}</p>
                        {group.username && (
                          <p className="mt-0.5 text-xs text-muted">{group.username}</p>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          group.settings.reactionsEnabled
                            ? 'bg-accent-teal/15 text-accent-teal'
                            : 'bg-muted/10 text-muted'
                        }`}
                      >
                        {group.settings.reactionsEnabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                      <span>{group.memberCount.toLocaleString()} members</span>
                      <span>
                        {activeCount}/{rules.length} rules active
                      </span>
                    </div>
                  </Panel>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Panel variant="secondary">
        <h2 className="text-lg font-semibold text-text">Quick start</h2>
        <ol className="mt-4 space-y-3">
          {[
            { step: '1', text: 'Select a group from the list above' },
            { step: '2', text: 'Open the Reactions tab to manage rules' },
            { step: '3', text: 'Create a new rule by choosing a trigger and a response' },
            { step: '4', text: 'Save and test the rule directly in your group' }
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-primary/20 text-xs font-bold text-accent-indigo">
                {step}
              </span>
              <span className="text-sm text-muted">{text}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
