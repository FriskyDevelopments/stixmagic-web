import { createHmac, timingSafeEqual } from 'node:crypto';

export interface ValidatedMiniAppIdentity {
  userId: string;
  username?: string;
  authDate: number;
  raw: string;
}

export class TelegramInitDataError extends Error {
  constructor(message: string, public readonly statusCode = 401) {
    super(message);
  }
}

function parseInitData(rawInitData: string): URLSearchParams {
  const params = new URLSearchParams(rawInitData);
  if (!params.get('hash')) throw new TelegramInitDataError('Missing init data hash', 401);
  if (!params.get('auth_date')) throw new TelegramInitDataError('Missing auth_date in init data', 401);
  if (!params.get('user')) throw new TelegramInitDataError('Missing user in init data', 401);
  return params;
}

export function validateTelegramInitData(rawInitData: string | undefined, botToken: string, maxAgeSeconds = 3600): ValidatedMiniAppIdentity {
  if (!rawInitData) {
    throw new TelegramInitDataError('Missing Telegram init data', 401);
  }

  const params = parseInitData(rawInitData);
  const hash = params.get('hash')!;
  const authDate = Number(params.get('auth_date'));

  if (!Number.isFinite(authDate) || authDate <= 0) {
    throw new TelegramInitDataError('Invalid auth_date in init data', 401);
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) {
    throw new TelegramInitDataError('Telegram init data is stale', 401);
  }

  const checkPairs = Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const digest = createHmac('sha256', secret).update(checkPairs).digest('hex');

  const digestBuffer = Buffer.from(digest, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  if (digestBuffer.length !== hashBuffer.length || !timingSafeEqual(digestBuffer, hashBuffer)) {
    throw new TelegramInitDataError('Invalid Telegram init data signature', 401);
  }

  let user: { id: number; username?: string };
  try {
    user = JSON.parse(params.get('user') ?? '{}') as { id: number; username?: string };
  } catch {
    throw new TelegramInitDataError('Invalid Telegram init data user payload', 401);
  }

  if (!user.id) {
    throw new TelegramInitDataError('Missing Telegram user id', 401);
  }

  return {
    userId: String(user.id),
    username: user.username,
    authDate,
    raw: rawInitData
  };
}
