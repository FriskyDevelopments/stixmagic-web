'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Panel } from '@stixmagic/ui';
import type { TelegramGroup, ReactionRule } from '@stixmagic/types';
import { getGroups, getRules } from '../lib/api-client';
import { MOCK_GROUPS, MOCK_RULES } from '../lib/mock-data';

export default function GroupsPage() {
  const [groups, setGroups] = useState<TelegramGroup[]>(MOCK_GROUPS);
  const [allRules, setAllRules] = useState<Record<string, ReactionRule[]>>(MOCK_RULES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups().then(async (fetchedGroups) => {
      const adminGroups = fetchedGroups.filter((g) => g.isAdmin);
      setGroups(adminGroups);
      const rulesMap: Record<string, ReactionRule[]> = {};
      await Promise.all(
        adminGroups.map(async (g) => {
          rulesMap[g.id] = await getRules(g.id);
        })
      );
      setAllRules(rulesMap);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <Panel>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent-cyan">
              <Link href="/dashboard" className="transition hover:text-accent-indigo">
                Dashboard
              </Link>
              {' / '}
              <span className="text-text">Groups</span>
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-text">Connected Groups</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Select a group to view its settings and manage reaction rules. Only groups where you
              are an admin are shown.
            </p>
          </div>
        </div>
      </Panel>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Panel key={i} variant="secondary" className="animate-pulse">
              <div className="h-4 w-3/4 rounded bg-accent-primary/10" />
              <div className="mt-6 h-3 w-full rounded bg-accent-primary/10" />
              <div className="mt-2 h-3 w-2/3 rounded bg-accent-primary/10" />
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
                <Panel className="flex h-full cursor-pointer flex-col gap-4">
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

                  <div className="mt-auto grid grid-cols-2 gap-3 border-t border-accent-primary/10 pt-4 text-xs">
                    <div>
                      <p className="text-muted">Members</p>
                      <p className="mt-0.5 font-semibold text-text">
                        {group.memberCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Active rules</p>
                      <p className="mt-0.5 font-semibold text-text">
                        {activeCount}/{rules.length}
                      </p>
                    </div>
                  </div>

                  <p className="text-right text-xs font-medium text-accent-cyan">
                    Manage reactions →
                  </p>
                </Panel>
              </Link>
            );
          })}
        </div>
      )}

      <Panel variant="secondary">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-text">Don&apos;t see your group?</p>
            <p className="mt-1 text-sm text-muted">
              Add the Stix Magic bot to your Telegram group and promote it to admin so it can
              detect triggers and send reactions.
            </p>
            <ol className="mt-3 space-y-1 text-xs text-muted">
              <li>1. Open your Telegram group settings</li>
              <li>2. Go to Administrators → Add Administrator</li>
              <li>3. Search for and add the Stix Magic bot</li>
              <li>4. Grant it permission to send messages and read messages</li>
              <li>5. Refresh this page — your group will appear automatically</li>
            </ol>
          </div>
          {/* NEXT_PUBLIC_BOT_USERNAME is embedded at build time.
              Set it in .env.local (or CI) before building for the correct bot link.
              A leading "@" is stripped automatically if present. */}
          <a
            href={`https://t.me/${(process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'StixMagicBot').replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-accent-cyan/10 px-5 py-2.5 text-center text-sm font-medium text-accent-cyan transition hover:bg-accent-cyan/20"
          >
            Open Bot in Telegram →
          </a>
        </div>
      </Panel>
    </div>
  );
}

