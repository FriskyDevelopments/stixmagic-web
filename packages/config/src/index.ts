import { z } from 'zod';

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  POSTGRES_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1)
});

const webSchema = baseSchema.extend({
  WEB_PORT: z.coerce.number().int().positive().default(3000)
});

const apiSchema = baseSchema.extend({
  API_PORT: z.coerce.number().int().positive().default(4000)
});

const botSchema = baseSchema.extend({
  BOT_PORT: z.coerce.number().int().positive().default(4100),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  API_BASE_URL: z.string().url(),
  TRIGGER_ENGINE_URL: z.string().url().default('http://localhost:4300')
});

const stickerEngineSchema = baseSchema.extend({
  STICKER_ENGINE_PORT: z.coerce.number().int().positive().default(4200)
});

const triggerEngineSchema = baseSchema.extend({
  TRIGGER_ENGINE_PORT: z.coerce.number().int().positive().default(4300)
});

export type WebConfig = z.infer<typeof webSchema>;
export type ApiConfig = z.infer<typeof apiSchema>;
export type BotConfig = z.infer<typeof botSchema>;
export type StickerEngineConfig = z.infer<typeof stickerEngineSchema>;
export type TriggerEngineConfig = z.infer<typeof triggerEngineSchema>;

export const loadWebConfig = (): WebConfig => webSchema.parse(process.env);
export const loadApiConfig = (): ApiConfig => apiSchema.parse(process.env);
export const loadBotConfig = (): BotConfig => botSchema.parse(process.env);
export const loadStickerEngineConfig = (): StickerEngineConfig => stickerEngineSchema.parse(process.env);
export const loadTriggerEngineConfig = (): TriggerEngineConfig => triggerEngineSchema.parse(process.env);
