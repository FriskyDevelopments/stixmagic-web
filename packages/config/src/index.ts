import { z } from 'zod';
import type {
  BotRuntimeMode,
  TelegramMiniAppContext,
  TelegramMiniAppInitData,
  TelegramPlatformConfig,
  TelegramSurfaceLinks
} from '@stixmagic/types';

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  POSTGRES_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1)
});

const telegramSharedSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_BOT_USERNAME: z.string().min(1).default('StixMagicBot'),
  TELEGRAM_MINI_APP_URL: z.string().url(),
  TELEGRAM_BOT_MODE: z.enum(['polling', 'webhook']).default('polling'),
  TELEGRAM_WEBHOOK_URL: z.string().url().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().min(8).optional(),
  TELEGRAM_INIT_DATA_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(3600),
  STIXMAGIC_API_BASE_URL: z.string().url(),
  STIXMAGIC_PUBLIC_WEB_URL: z.string().url()
});

const webSchema = baseSchema.extend({
  WEB_PORT: z.coerce.number().int().positive().default(3000),
  NEXT_PUBLIC_STIXMAGIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME: z.string().min(1).optional(),
  NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_STIXMAGIC_PUBLIC_WEB_URL: z.string().url().optional(),
  NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL: z.string().url().optional(),
  NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA: z.enum(['true', 'false']).optional()
});

const apiSchema = baseSchema.extend({
  API_PORT: z.coerce.number().int().positive().default(4000),
  ...telegramSharedSchema.shape
});

const botSchema = baseSchema.extend({
  BOT_PORT: z.coerce.number().int().positive().default(4100),
  ...telegramSharedSchema.shape,
  TRIGGER_ENGINE_URL: z.string().url().default('http://localhost:4300')
});

const stickerEngineSchema = baseSchema.extend({
  STICKER_ENGINE_PORT: z.coerce.number().int().positive().default(4200)
});

const triggerEngineSchema = baseSchema.extend({
  TRIGGER_ENGINE_PORT: z.coerce.number().int().positive().default(4300)
});

const telegramClientSchema = z.object({
  NEXT_PUBLIC_STIXMAGIC_API_BASE_URL: z.string().url().default('http://localhost:4000'),
  NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME: z.string().default('StixMagicBot'),
  NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL: z.string().url().default('http://localhost:3000/dashboard'),
  NEXT_PUBLIC_STIXMAGIC_PUBLIC_WEB_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_STIXMAGIC_ALLOW_API_FALLBACK: z.enum(['true', 'false']).default('false')
});

export type WebConfig = z.infer<typeof webSchema>;
export type ApiConfig = z.infer<typeof apiSchema>;
export type BotConfig = z.infer<typeof botSchema>;
export type StickerEngineConfig = z.infer<typeof stickerEngineSchema>;
export type TriggerEngineConfig = z.infer<typeof triggerEngineSchema>;
export type TelegramClientEnv = z.infer<typeof telegramClientSchema>;

export const loadWebConfig = (): WebConfig => webSchema.parse(process.env);
export const loadApiConfig = (): ApiConfig => apiSchema.parse(process.env);
export const loadBotConfig = (): BotConfig => botSchema.parse(process.env);
export const loadStickerEngineConfig = (): StickerEngineConfig => stickerEngineSchema.parse(process.env);
export const loadTriggerEngineConfig = (): TriggerEngineConfig => triggerEngineSchema.parse(process.env);
export const loadTelegramClientEnv = (env: NodeJS.ProcessEnv = process.env): TelegramClientEnv =>
  telegramClientSchema.parse(env);

const normalizeBotUsername = (username: string): string => username.replace(/^@/, '');

export function buildTelegramSurfaceLinks(input: {
  botUsername: string;
  miniAppUrl: string;
}): TelegramSurfaceLinks {
  const botUsername = normalizeBotUsername(input.botUsername);
  const miniAppUrl = input.miniAppUrl.replace(/\/$/, '');

  return {
    botUsername,
    miniAppUrl,
    botStartUrl: `https://t.me/${botUsername}`,
    miniAppStartUrl: `https://t.me/${botUsername}/app`
  };
}

export function buildTelegramPlatformConfig(input: {
  runtimeMode: BotRuntimeMode;
  botUsername: string;
  miniAppUrl: string;
  apiBaseUrl: string;
  webhookUrl?: string;
}): TelegramPlatformConfig {
  return {
    productName: 'STIX MΛGIC',
    platform: 'telegram',
    runtimeMode: input.runtimeMode,
    botUsername: normalizeBotUsername(input.botUsername),
    miniAppUrl: input.miniAppUrl,
    apiBaseUrl: input.apiBaseUrl,
    webhookUrl: input.webhookUrl,
    links: buildTelegramSurfaceLinks({
      botUsername: input.botUsername,
      miniAppUrl: input.miniAppUrl
    })
  };
}

export function getTelegramPlatformConfigFromBotEnv(env: NodeJS.ProcessEnv = process.env): TelegramPlatformConfig {
  const config = botSchema.parse(env);
  return buildTelegramPlatformConfig({
    runtimeMode: config.TELEGRAM_BOT_MODE,
    botUsername: config.TELEGRAM_BOT_USERNAME,
    miniAppUrl: config.TELEGRAM_MINI_APP_URL,
    apiBaseUrl: config.STIXMAGIC_API_BASE_URL,
    webhookUrl: config.TELEGRAM_WEBHOOK_URL
  });
}

export function getTelegramPlatformConfigFromApiEnv(env: NodeJS.ProcessEnv = process.env): TelegramPlatformConfig {
  const config = apiSchema.parse(env);
  return buildTelegramPlatformConfig({
    runtimeMode: config.TELEGRAM_BOT_MODE,
    botUsername: config.TELEGRAM_BOT_USERNAME,
    miniAppUrl: config.TELEGRAM_MINI_APP_URL,
    apiBaseUrl: config.STIXMAGIC_API_BASE_URL,
    webhookUrl: config.TELEGRAM_WEBHOOK_URL
  });
}

export function getTelegramPlatformConfigFromWebEnv(env: NodeJS.ProcessEnv = process.env): TelegramPlatformConfig {
  const config = loadTelegramClientEnv(env);
  return buildTelegramPlatformConfig({
    runtimeMode: 'polling',
    botUsername: config.NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME,
    miniAppUrl: config.NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL,
    apiBaseUrl: config.NEXT_PUBLIC_STIXMAGIC_API_BASE_URL
  });
}

export function parseTelegramMiniAppContext(rawInitData?: string | null): TelegramMiniAppContext {
  if (!rawInitData) {
    return {
      launchSource: 'direct',
      initDataUnsafe: null
    };
  }

  const params = new URLSearchParams(rawInitData);
  const userParam = params.get('user');
  let user: TelegramMiniAppInitData['user'];

  if (userParam) {
    try {
      user = JSON.parse(userParam) as TelegramMiniAppInitData['user'];
    } catch {
      user = undefined;
    }
  }

  const initDataUnsafe: TelegramMiniAppInitData = {
    queryId: params.get('query_id') ?? undefined,
    authDate: params.get('auth_date') ?? undefined,
    hash: params.get('hash') ?? undefined,
    user,
    chatType: params.get('chat_type') ?? undefined,
    chatInstance: params.get('chat_instance') ?? undefined,
    startParam: params.get('start_param') ?? undefined
  };

  return {
    launchSource: initDataUnsafe.startParam ? 'deep_link' : 'direct',
    initDataUnsafe,
    rawInitData
  };
}
