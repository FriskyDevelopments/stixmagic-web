import { z } from 'zod';
import type { ReactionRule } from '@stixmagic/types';
import { getTelegramGroup, listReactionRules } from '../lib/repositories.js';

const telegramMessageSchema = z.object({
  message_id: z.number().int(),
  chat: z.object({ id: z.number(), type: z.string(), title: z.string().optional() }),
  text: z.string().optional(),
  sticker: z.object({ file_id: z.string() }).optional()
});

const triggerJobSchema = z.object({
  updateId: z.number().int().nonnegative(),
  message: telegramMessageSchema.nullable()
});

type TelegramMessage = z.infer<typeof telegramMessageSchema>;
type FetchLike = typeof fetch;

function matchesRule(rule: ReactionRule, message: TelegramMessage): boolean {
  if (!rule.enabled) return false;
  if (rule.triggerType === 'sticker') {
    return message.sticker?.file_id === rule.triggerValue;
  }
  return Boolean(message.text?.includes(rule.triggerValue));
}

function parseButtonAction(content: string): { text: string; url: string } {
  const parsed = JSON.parse(content) as { text?: unknown; url?: unknown };
  if (typeof parsed.text !== 'string' || typeof parsed.url !== 'string') {
    throw new Error('Button action must contain string text and url fields');
  }
  return { text: parsed.text, url: parsed.url };
}

function buildTelegramRequest(rule: ReactionRule, message: TelegramMessage): {
  method: string;
  body: Record<string, unknown>;
} {
  const common = { chat_id: message.chat.id, reply_to_message_id: message.message_id };
  switch (rule.responseType) {
    case 'message':
      return { method: 'sendMessage', body: { ...common, text: rule.responseContent } };
    case 'sticker':
      return { method: 'sendSticker', body: { ...common, sticker: rule.responseContent } };
    case 'animation':
      return { method: 'sendAnimation', body: { ...common, animation: rule.responseContent } };
    case 'button_action': {
      const button = parseButtonAction(rule.responseContent);
      return {
        method: 'sendMessage',
        body: {
          ...common,
          text: button.text,
          reply_markup: { inline_keyboard: [[{ text: button.text, url: button.url }]] }
        }
      };
    }
  }
}

async function callTelegram(
  token: string,
  request: ReturnType<typeof buildTelegramRequest>,
  fetchImpl: FetchLike
): Promise<void> {
  const response = await fetchImpl(`https://api.telegram.org/bot${token}/${request.method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request.body)
  });
  if (!response.ok) {
    throw new Error(`Telegram ${request.method} failed with HTTP ${response.status}`);
  }
  const payload = (await response.json()) as { ok?: boolean; description?: string };
  if (!payload.ok) {
    throw new Error(payload.description ?? `Telegram ${request.method} returned ok=false`);
  }
}

export async function executeReactionJob(
  payload: unknown,
  options: {
    botToken?: string;
    fetchImpl?: FetchLike;
    loadRules?: (groupId: string) => Promise<ReactionRule[]>;
    loadMaxReactions?: (groupId: string) => Promise<number>;
  } = {}
): Promise<{ matched: number }> {
  const job = triggerJobSchema.parse(payload);
  if (!job.message) return { matched: 0 };

  const botToken = options.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is required to execute reaction rules');

  const groupId = String(job.message.chat.id);
  const rules = await (options.loadRules ?? listReactionRules)(groupId);
  const maxReactions = options.loadMaxReactions
    ? await options.loadMaxReactions(groupId)
    : (await getTelegramGroup(groupId))?.settings.maxReactionsPerMessage ?? 1;
  const matchingRules = rules.filter((rule) => matchesRule(rule, job.message!)).slice(0, maxReactions);

  for (const rule of matchingRules) {
    await callTelegram(botToken, buildTelegramRequest(rule, job.message), options.fetchImpl ?? fetch);
  }

  return { matched: matchingRules.length };
}
