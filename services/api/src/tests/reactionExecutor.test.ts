import assert from 'node:assert/strict';
import test from 'node:test';
import type { ReactionRule } from '@stixmagic/types';
import { executeReactionJob } from '../telegram/reactionExecutor.js';

const baseRule: ReactionRule = {
  id: 'rule-1',
  groupId: '-100123',
  name: 'Magic reply',
  triggerType: 'emoji',
  triggerValue: '✨',
  responseType: 'message',
  responseContent: 'Magic activated!',
  enabled: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

const job = {
  updateId: 12,
  message: {
    message_id: 44,
    chat: { id: -100123, type: 'supergroup', title: 'Test group' },
    text: 'hello ✨'
  }
};

test('executes a matching emoji rule through the Telegram Bot API', async () => {
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), body: JSON.parse(String(init?.body)) as Record<string, unknown> });
    return new Response(JSON.stringify({ ok: true, result: {} }), { status: 200 });
  }) as typeof fetch;

  const result = await executeReactionJob(job, {
    botToken: 'test-token',
    fetchImpl,
    loadRules: async () => [baseRule],
    loadMaxReactions: async () => 3
  });

  assert.equal(result.matched, 1);
  assert.equal(calls[0].url, 'https://api.telegram.org/bottest-token/sendMessage');
  assert.deepEqual(calls[0].body, {
    chat_id: -100123,
    reply_to_message_id: 44,
    text: 'Magic activated!'
  });
});

test('ignores disabled and non-matching rules', async () => {
  let called = false;
  const result = await executeReactionJob(job, {
    botToken: 'test-token',
    fetchImpl: (async () => {
      called = true;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as typeof fetch,
    loadMaxReactions: async () => 3,
    loadRules: async () => [
      { ...baseRule, enabled: false },
      { ...baseRule, id: 'rule-2', triggerValue: '🔥' }
    ]
  });

  assert.equal(result.matched, 0);
  assert.equal(called, false);
});

test('executes sticker responses for matching sticker file ids', async () => {
  let requestBody: Record<string, unknown> | undefined;
  const result = await executeReactionJob(
    { ...job, message: { ...job.message, text: undefined, sticker: { file_id: 'trigger-file' } } },
    {
      botToken: 'test-token',
      fetchImpl: (async (_input: string | URL | Request, init?: RequestInit) => {
        requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }) as typeof fetch,
      loadMaxReactions: async () => 3,
      loadRules: async () => [
        {
          ...baseRule,
          triggerType: 'sticker',
          triggerValue: 'trigger-file',
          responseType: 'sticker',
          responseContent: 'response-file'
        }
      ]
    }
  );

  assert.equal(result.matched, 1);
  assert.equal(requestBody?.sticker, 'response-file');
});
