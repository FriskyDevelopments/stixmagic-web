'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ReactionRule, TriggerType, ResponseType } from '@stixmagic/types';
import { Panel } from '@stixmagic/ui';
import { getRules, createRule, toggleRule, deleteRule, isDemoModeEnabled } from '../../../lib/api-client';

interface Props {
  groupId: string;
  groupName: string;
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

const COMMON_EMOJIS = [
  '✨', '🔥', '❤️', '😂', '🎉', '👍', '💯', '🚀',
  '⭐', '💎', '🌟', '👏', '🤔', '😍', '🙏', '💪',
  '🎯', '🏆', '✅', '🤩', '😎', '🫡', '🥰', '💀'
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

const RESPONSE_PLACEHOLDER: Record<ResponseType, string> = {
  message: 'e.g. ✨ Magic activated!',
  sticker: 'Paste the sticker file ID from Telegram',
  animation: 'Paste the animation (GIF) file ID from Telegram',
  button_action: 'e.g. {"text":"Click me","url":"https://t.me/yourbot"}'
};

const RESPONSE_HINT: Partial<Record<ResponseType, string>> = {
  sticker:
    'To get a sticker file ID: forward the sticker to @userinfobot or use the /sticker command with your Stix Magic bot.',
  animation:
    'To get a GIF file ID: send the animation in a chat with your Stix Magic bot, which will reply with the file ID.'
};

/**
 * Render an interactive editor for creating, listing, and managing reaction rules for a group.
 *
 * The component loads rules for `groupId`, shows a form to create new rules, and displays existing
 * rules with controls to simulate, enable/disable, and delete them.
 *
 * Notes:
 * - Toggling and deleting rules update the UI optimistically and persist changes via API calls.
 * - Simulation is local-only and does not call the backend.
 *
 * @param groupId - The identifier of the group whose reaction rules are managed
 * @param groupName - The display name of the group used in UI labels and messages
 * @returns The React element that provides the ReactionsEditor UI for the specified group
 */
export default function ReactionsEditor({ groupId, groupName }: Props) {
  const [rules, setRules] = useState<ReactionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadRules() {
      try {
        const r = await getRules(groupId);
        setRules(r);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[API_FAIL]', { message });
        setError(`Failed to load reaction rules: ${message}`);
      } finally {
        setLoading(false);
      }
    }

    loadRules();
  }, [groupId]);

  // Clear auto-dismiss timers when the component unmounts to avoid
  // setting state on an unmounted component.
  useEffect(() => {
    if (!saved) return;
    const id = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(id);
  }, [saved]);

  useEffect(() => {
    if (!testResult) return;
    const id = setTimeout(() => setTestResult(null), 4000);
    return () => clearTimeout(id);
  }, [testResult]);

  const setTriggerType = (triggerType: TriggerType) =>
    setForm((prev) => ({ ...prev, triggerType, triggerValue: '' }));

  const setResponseType = (responseType: ResponseType) =>
    setForm((prev) => ({ ...prev, responseType, responseContent: '' }));

  const handleToggle = async (id: string, current: boolean) => {
    const previousRules = rules;
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !current } : r)));
    try {
      await toggleRule(groupId, id, !current);
    } catch (err) {
      setRules(previousRules);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to toggle rule: ${message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reaction rule?')) {
      return;
    }
    const previousRules = rules;
    setRules((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteRule(groupId, id);
    } catch (err) {
      setRules(previousRules);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to delete rule: ${message}`);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.triggerValue.trim() || !form.responseContent.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const newRule = await createRule(groupId, {
        name: form.name,
        triggerType: form.triggerType,
        triggerValue: form.triggerValue,
        responseType: form.responseType,
        responseContent: form.responseContent,
        enabled: true
      });
      setRules((prev) => [...prev, newRule]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSaved(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to save the rule: ${message}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const handleSimulate = (rule: ReactionRule) => {
    setTestResult(
      `🔄 Simulated locally — trigger: "${rule.triggerValue}" → response (${rule.responseType}): "${rule.responseContent}". Wire Telegram execution in the bot runtime for full production behavior.`
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <Panel>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">
          <Link href="/dashboard" className="rounded p-0.5 transition hover:text-accent-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">
            Dashboard
          </Link>
          {' / '}
          <Link href="/groups" className="rounded p-0.5 transition hover:text-accent-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">
            Groups
          </Link>
          {' / '}
          <Link href={`/groups/${groupId}`} className="rounded p-0.5 transition hover:text-accent-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50">
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
            className="rounded-lg bg-accent-primary/20 px-5 py-2.5 text-sm font-medium text-accent-indigo transition hover:bg-accent-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
          >
            + New Rule
          </button>
        </div>
      </Panel>

      {saved && (
        <div className="rounded-xl border border-accent-teal/30 bg-accent-teal/10 px-4 py-3 text-sm text-accent-teal">
          ✅ Rule saved successfully.
          {isDemoModeEnabled()
            ? ' Demo mode is enabled, so this rule exists only in local scaffold data.'
            : ' It will be applied through the shared Telegram API surface.'}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-accent-pink/30 bg-accent-pink/10 px-4 py-3 text-sm text-accent-pink">
          ⚠️ {error}
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
            {/* Rule Name */}
            <div>
              <label htmlFor="rule-name" className="block text-xs font-medium uppercase tracking-wider text-muted">
                Rule Name
              </label>
              <input
                id="rule-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Magic Activation"
                className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
              />
            </div>

            {/* Trigger Type */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Trigger Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {TRIGGER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTriggerType(opt.value)}
                    aria-pressed={form.triggerType === opt.value}
                    className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 ${
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

            {/* Trigger Value */}
            <div>
              <label htmlFor="trigger-value" className="block text-xs font-medium uppercase tracking-wider text-muted">
                Trigger Value
              </label>

              {form.triggerType === 'emoji' ? (
                <>
                  <p className="mt-1 text-xs text-muted">
                    Click an emoji to select it, or type your own below.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-accent-primary/10 bg-background/40 p-3">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setForm({ ...form, triggerValue: emoji })}
                        aria-label={`Select emoji ${emoji}`}
                        aria-pressed={form.triggerValue === emoji}
                        className={`rounded-lg px-2 py-1 text-lg transition hover:bg-accent-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 ${
                          form.triggerValue === emoji ? 'bg-accent-primary/30 ring-1 ring-accent-primary/50' : ''
                        }`}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    id="trigger-value"
                    type="text"
                    value={form.triggerValue}
                    onChange={(e) => setForm({ ...form, triggerValue: e.target.value })}
                    placeholder="Selected emoji will appear here, or type your own"
                    className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
                  />
                </>
              ) : (
                <>
                  <input
                    id="trigger-value"
                    type="text"
                    value={form.triggerValue}
                    onChange={(e) => setForm({ ...form, triggerValue: e.target.value })}
                    placeholder="Paste the sticker file ID from Telegram"
                    className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
                  />
                  <p className="mt-1.5 text-xs text-muted">
                    💡 To find a sticker&apos;s file ID: forward the sticker to your Stix Magic bot
                    and it will reply with the file ID you can paste here.
                  </p>
                </>
              )}
            </div>

            {/* Response Type */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted">
                Response Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {RESPONSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setResponseType(opt.value)}
                    aria-pressed={form.responseType === opt.value}
                    className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/50 ${
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

            {/* Response Content */}
            <div>
              <label htmlFor="response-content" className="block text-xs font-medium uppercase tracking-wider text-muted">
                Response Content
              </label>
              {form.responseType === 'message' ? (
                <textarea
                  id="response-content"
                  value={form.responseContent}
                  onChange={(e) => setForm({ ...form, responseContent: e.target.value })}
                  placeholder={RESPONSE_PLACEHOLDER.message}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
                />
              ) : (
                <input
                  id="response-content"
                  type="text"
                  value={form.responseContent}
                  onChange={(e) => setForm({ ...form, responseContent: e.target.value })}
                  placeholder={RESPONSE_PLACEHOLDER[form.responseType]}
                  className="mt-2 w-full rounded-lg border border-accent-primary/20 bg-background/60 px-3 py-2 text-sm text-text placeholder-muted/50 outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30"
                />
              )}
              {RESPONSE_HINT[form.responseType] && (
                <p className="mt-1.5 text-xs text-muted">💡 {RESPONSE_HINT[form.responseType]}</p>
              )}
            </div>

            {/* Rule Preview */}
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
                disabled={
                  saving ||
                  !form.name.trim() ||
                  !form.triggerValue.trim() ||
                  !form.responseContent.trim()
                }
                className="rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save Rule'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                }}
                className="rounded-lg border border-accent-primary/20 px-5 py-2 text-sm font-medium text-muted transition hover:border-accent-primary/40 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
              >
                Cancel
              </button>
            </div>
          </div>
        </Panel>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Panel key={i} variant="secondary" className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent-primary/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-accent-primary/10" />
                  <div className="h-3 w-1/2 rounded bg-accent-primary/10" />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : rules.length === 0 && !showForm ? (
        <Panel variant="secondary">
          <div className="py-6 text-center">
            <p className="text-2xl">✨</p>
            <p className="mt-3 text-sm font-medium text-text">No reaction rules yet</p>
            <p className="mt-1 text-sm text-muted">
              Create your first rule to start automating responses in {groupName}.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-lg bg-accent-primary/20 px-5 py-2 text-sm font-medium text-accent-indigo transition hover:bg-accent-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
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
                    {rule.triggerType === 'emoji' ? rule.triggerValue : '🎨'}
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
                    onClick={() => handleSimulate(rule)}
                    aria-label={`Simulate rule ${rule.name}`}
                    title="Simulates the rule locally — connect a backend to fire it in Telegram"
                    className="rounded-lg border border-accent-cyan/20 px-3 py-1.5 text-xs font-medium text-accent-cyan transition hover:border-accent-cyan/40 hover:bg-accent-cyan/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
                  >
                    Simulate
                  </button>
                  <button
                    onClick={() => handleToggle(rule.id, rule.enabled)}
                    aria-label={`${rule.enabled ? 'Pause' : 'Enable'} rule ${rule.name}`}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 ${
                      rule.enabled
                        ? 'border-muted/20 text-muted hover:border-muted/40 hover:text-text focus-visible:ring-muted/50'
                        : 'border-accent-teal/20 text-accent-teal hover:border-accent-teal/40 hover:bg-accent-teal/5 focus-visible:ring-accent-teal/50'
                    }`}
                  >
                    {rule.enabled ? 'Pause' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    aria-label={`Delete rule ${rule.name}`}
                    className="rounded-lg border border-accent-pink/20 px-3 py-1.5 text-xs font-medium text-accent-pink transition hover:border-accent-pink/40 hover:bg-accent-pink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
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

