import Link from 'next/link';
import { Panel } from '@stixmagic/ui';
import { MOCK_GROUPS, MOCK_RULES } from '../lib/mock-data';

export default function GroupsPage() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_GROUPS.map((group) => {
          const rules = MOCK_RULES[group.id] ?? [];
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

      <Panel variant="secondary">
        <p className="text-sm text-muted">
          Don&apos;t see your group?{' '}
          <span className="text-accent-cyan">
            Add the Stix Magic bot to your Telegram group and make it an admin to get started.
          </span>
        </p>
      </Panel>
    </div>
  );
}
