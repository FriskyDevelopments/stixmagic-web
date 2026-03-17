'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ReactionRule, TriggerType, ResponseType } from '@stixmagic/types';
import { Panel } from '@stixmagic/ui';

interface Props {
  groupId: string;
  groupName: string;
  initialRules: ReactionRule[];
}

const TRIGGER_OPTIONS: { value: TriggerType; label: string; icon: string; hint: string }[] = [
  { value: 'sticker', label: 'Sticker', icon: '🎨', hint: 'Fires when a specific sticker is sent' },
  { value: 'emoji', label: 'Emoji', icon: '😀', hint: 'Fires when a specific emoji is used' }
];

const RESPONSE_OPTIONS: { value: ResponseType; label: string; icon: string; hint: string }[] = [
  { value: 'message', label: 'Text Message', icon: '💬', hint: 'Reply with a text message' },
  { value: 'sticker', label: 'Sticker', icon: '🎨', hint: 'Reply with a sticker' },
  { value: 'animation', label: 'Animation', icon: '✨', hint: 'Reply with an animation (GIF)' },
  { value: 'button_action', label: 'Button Action', icon: '🔘', hint: 'Show inline keyboard buttons' }
];

interface FormState {
  name: string;
  triggerType: TriggerType;
  triggerValue: string;
  responseType: ResponseType;
  responseContent: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  triggerType: 'sticker',
  triggerValue: '',
  responseType: 'message',
  responseContent: ''
};

export default function ReactionsEditor({ groupId, groupName, initialRules }: Props) {
  const [rules, setRules] = useState<ReactionRule[]>(initialRules);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.triggerValue.trim() || !form.responseContent.trim()) return;
    const newRule: ReactionRule = {
      id: `r${Date.now()}`,
      groupId,
      name: form.name,
      triggerType: form.triggerType,
      triggerValue: form.triggerValue,
      responseType: form.responseType,
      responseContent: form.responseContent,
      enabled: true,
      createdAt: new Date().toISOString().split('T')[0] ?? '',
      updatedAt: new Date().toISOString().split('T')[0] ?? ''
    };
    setRules((prev) => [...prev, newRule]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = (rule: ReactionRule) => {
    setTestResult(
      `✅ Test fired! Trigger: "${rule.triggerValue}" → Response: "${rule.responseContent}"`
    );
    setTimeout(() => setTestResult(null), 4000);
  };

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
          <Link href={`/groups/${groupId}`} className="transition hover:text-accent-indigo">
            {groupName}
          </Link>
          {' / '}
          <span className="text-text">Reactions</span>
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-text">Reaction Rules</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Configure triggers and responses for {groupName}. Rules fire when a matching trigger
              is detected in the group chat.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setForm(EMPTY_FORM);
            }}
            className="rounded-lg bg-accent-primary/20 px-5 py-2.5 text-sm font-medium text-accent-indigo transition hover:bg-accent-primary/35"
          >
            + New Rule
          </button>
        </div>
      </Panel>

      {saved && (
        <div className="rounded-xl border border-accent-teal/30 bg-accent-teal/10 px-4 py-3 text-sm text-accent-teal">
          ✅ Rule saved successfully!
        </div>
      )}

      {testResult && (
        <div className="rounded-xl border border-accent-indigo/30 bg-accent-indigo/10 px-4 py-3 text-sm text-accent-indigo">
          {testResult}
        </div>
      )}

      {showForm && (
        <Panel>
          <h2 className="font-semibold text-text">Create Reaction Rule</h2>
          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Rule Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Magic Activation"
                className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Trigger Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {TRIGGER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, triggerType: opt.value })}
                    className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
                      form.triggerType === opt.value
                        ? 'border-accent-primary/50 bg-accent-primary/15'
                        : 'border-accent-primary/10 bg-background/40 hover:border-accent-primary/30'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium text-text">{opt.label}</span>
                    <span className="text-xs text-muted">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Trigger Value
              </label>
              <input
                type="text"
                value={form.triggerValue}
                onChange={(e) => setForm({ ...form, triggerValue: e.target.value })}
                placeholder={
                  form.triggerType === 'emoji' ? 'e.g. ✨ or 🔥' : 'e.g. sticker_file_id'
                }
                className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Response Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {RESPONSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, responseType: opt.value })}
                    className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
                      form.responseType === opt.value
                        ? 'border-accent-violet/50 bg-accent-violet/15'
                        : 'border-accent-primary/10 bg-background/40 hover:border-accent-primary/30'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium text-text">{opt.label}</span>
                    <span className="text-xs text-muted">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Response Content
              </label>
              <input
                type="text"
                value={form.responseContent}
                onChange={(e) => setForm({ ...form, responseContent: e.target.value })}
                placeholder={
                  form.responseType === 'message'
                    ? 'e.g. ✨ Magic activated!'
                    : form.responseType === 'sticker'
                      ? 'e.g. sticker_file_id'
                      : form.responseType === 'animation'
                        ? 'e.g. animation_file_id'
                        : 'e.g. {"text":"Click me","url":"https://..."}'
                }
                className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
              />
            </div>

            {form.name && form.triggerValue && form.responseContent && (
              <div className="rounded-xl border border-accent-teal/20 bg-accent-teal/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-accent-teal">
                  Rule Preview
                </p>
                <p className="mt-2 text-sm text-muted">
                  When{' '}
                  <span className="text-text">
                    {form.triggerType} &ldquo;{form.triggerValue}&rdquo;
                  </span>{' '}
                  is detected, respond with{' '}
                  <span className="text-text">
                    {form.responseType}: &ldquo;{form.responseContent}&rdquo;
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.triggerValue.trim() || !form.responseContent.trim()}
                className="rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-indigo disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save Rule
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                }}
                className="rounded-lg border border-accent-primary/20 px-5 py-2 text-sm font-medium text-muted transition hover:border-accent-primary/40 hover:text-text"
              >
                Cancel
              </button>
            </div>
          </div>
        </Panel>
      )}

      {rules.length === 0 && !showForm ? (
        <Panel variant="secondary">
          <div className="py-6 text-center">
            <p className="text-2xl">✨</p>
            <p className="mt-3 text-sm font-medium text-text">No reaction rules yet</p>
            <p className="mt-1 text-sm text-muted">
              Create your first rule to start automating responses in {groupName}.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-lg bg-accent-primary/20 px-5 py-2 text-sm font-medium text-accent-indigo transition hover:bg-accent-primary/35"
            >
              + Create First Rule
            </button>
          </div>
        </Panel>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Panel key={rule.id} variant="secondary">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      rule.triggerType === 'emoji'
                        ? 'bg-accent-orange/15 text-accent-orange'
                        : 'bg-accent-violet/15 text-accent-violet'
                    }`}
                  >
                    {rule.triggerType === 'emoji' ? '😀' : '🎨'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text">{rule.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          rule.enabled
                            ? 'bg-accent-teal/15 text-accent-teal'
                            : 'bg-muted/10 text-muted'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      <span className="uppercase">{rule.triggerType}</span>{' '}
                      <span className="text-text">&ldquo;{rule.triggerValue}&rdquo;</span>
                      {' → '}
                      <span className="uppercase">{rule.responseType}</span>{' '}
                      <span className="text-text">&ldquo;{rule.responseContent}&rdquo;</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTest(rule)}
                    className="rounded-lg border border-accent-cyan/20 px-3 py-1.5 text-xs font-medium text-accent-cyan transition hover:border-accent-cyan/40 hover:bg-accent-cyan/5"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      rule.enabled
                        ? 'border-muted/20 text-muted hover:border-muted/40 hover:text-text'
                        : 'border-accent-teal/20 text-accent-teal hover:border-accent-teal/40 hover:bg-accent-teal/5'
                    }`}
                  >
                    {rule.enabled ? 'Pause' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="rounded-lg border border-accent-pink/20 px-3 py-1.5 text-xs font-medium text-accent-pink transition hover:border-accent-pink/40 hover:bg-accent-pink/5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
