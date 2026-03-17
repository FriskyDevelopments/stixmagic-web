import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Panel } from '@stixmagic/ui';
import { MOCK_GROUPS, MOCK_RULES, getGroup } from '../../lib/mock-data';

export function generateStaticParams() {
  return MOCK_GROUPS.map((group) => ({ group_id: group.id }));
}

interface Props {
  params: { group_id: string };
}

export default function GroupPage({ params }: Props) {
  const group = getGroup(params.group_id);
  if (!group) notFound();

  const rules = MOCK_RULES[group.id] ?? [];
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
            {group.memberCount.toLocaleString()}
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-muted">Total Rules</p>
          <p className="mt-2 text-3xl font-extrabold text-accent-violet">{rules.length}</p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-muted">Active Rules</p>
          <p className="mt-2 text-3xl font-extrabold text-accent-teal">{activeRules.length}</p>
        </Panel>
      </div>

      <Panel>
        <h2 className="font-semibold text-text">Group Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-accent-primary/10 bg-background/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Magic Reactions</p>
              <p className="mt-0.5 text-xs text-muted">Enable or pause all reaction rules for this group</p>
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
              <p className="mt-0.5 text-xs text-muted">Limit how many rules can fire on a single message</p>
            </div>
            <span className="text-sm font-semibold text-accent-indigo">
              {group.settings.maxReactionsPerMessage}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-accent-primary/10 bg-background/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Cooldown</p>
              <p className="mt-0.5 text-xs text-muted">Minimum seconds between reactions from the same user</p>
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

      {rules.length === 0 ? (
        <Panel variant="secondary">
          <p className="text-sm text-muted">
            No reaction rules yet.{' '}
            <Link href={`/groups/${group.id}/reactions`} className="text-accent-cyan hover:text-accent-indigo">
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
                  {rule.triggerType === 'emoji' ? '😀' : '🎨'}
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
