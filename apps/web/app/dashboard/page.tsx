import Link from 'next/link';
import { Panel } from '@stixmagic/ui';
import { MOCK_GROUPS, MOCK_RULES } from '../lib/mock-data';

const totalRules = Object.values(MOCK_RULES).reduce((sum, rules) => sum + rules.length, 0);
const activeRules = Object.values(MOCK_RULES)
  .flat()
  .filter((r) => r.enabled).length;

const stats = [
  {
    label: 'Connected Groups',
    value: MOCK_GROUPS.length,
    accent: 'text-accent-cyan'
  },
  {
    label: 'Total Reaction Rules',
    value: totalRules,
    accent: 'text-accent-violet'
  },
  {
    label: 'Active Rules',
    value: activeRules,
    accent: 'text-accent-teal'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <Panel>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">Admin Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-text">Stix Magic Dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Configure magic reactions for your Telegram groups. Select a group to manage its reaction
          rules, or create new ones to automate responses.
        </p>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Panel key={stat.label} variant="secondary">
            <p className="text-xs uppercase tracking-wider text-muted">{stat.label}</p>
            <p className={`mt-2 text-4xl font-extrabold ${stat.accent}`}>{stat.value}</p>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_GROUPS.map((group) => {
            const rules = MOCK_RULES[group.id] ?? [];
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
