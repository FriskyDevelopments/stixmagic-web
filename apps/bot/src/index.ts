import { loadBotConfig, getTelegramPlatformConfigFromBotEnv } from '@stixmagic/config';
import { Telegraf, Markup } from 'telegraf';
import type { ApiResponse, StickerPack } from '@stixmagic/types';

const config = loadBotConfig();
const telegramPlatform = getTelegramPlatformConfigFromBotEnv();
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  return (await res.json()) as T;
};

const buildMiniAppKeyboard = () =>
  Markup.inlineKeyboard([
    Markup.button.webApp('Open STIX MΛGIC control center', telegramPlatform.miniAppUrl),
    Markup.button.url('Bot profile', telegramPlatform.links.botStartUrl)
  ]);

bot.start((ctx) =>
  ctx.reply(
    'STIX MΛGIC is online. Open the mini app to manage groups, reaction rules, and deployment-safe Telegram flows from one place.',
    buildMiniAppKeyboard()
  )
);

bot.command('app', (ctx) =>
  ctx.reply('Launch the STIX MΛGIC mini app to manage Telegram groups and automation rules.', buildMiniAppKeyboard())
);

bot.command('createpack', (ctx) =>
  ctx.reply(
    'Create pack flow is managed in the STIX MΛGIC mini app so bot and web surfaces stay in sync.',
    buildMiniAppKeyboard()
  )
);

bot.command('addsticker', (ctx) =>
  ctx.reply(
    'Upload and process sticker assets through the STIX MΛGIC mini app. The bot stays focused on Telegram-native entry points.',
    buildMiniAppKeyboard()
  )
);

bot.command('listpacks', async (ctx) => {
  const response = await fetch(`${config.STIXMAGIC_API_BASE_URL}/packs`);
  const payload = (await response.json()) as ApiResponse<StickerPack[]>;
  const lines = payload.data.length
    ? payload.data.map((pack) => `• ${pack.name} (${pack.id.slice(0, 8)})`).join('\n')
    : 'No packs found yet.';
  await ctx.reply(lines, buildMiniAppKeyboard());
});

bot.command('publishpack', (ctx) =>
  ctx.reply(
    'Publish still needs Telegram sticker-set API integration, but the command path now points to the shared STIX MΛGIC production flow.',
    buildMiniAppKeyboard()
  )
);

bot.on('sticker', async (ctx) => {
  const stickerId = ctx.message.sticker.file_unique_id;

  const triggerResult = await postJson<{ ok: boolean; data: { actionType: string } }>(
    `${config.TRIGGER_ENGINE_URL}/execute`,
    {
      stickerId,
      actionType: 'bot_reaction',
      actionPayload: {
        reaction: '✨'
      },
      context: {
        platform: 'telegram',
        chatId: String(ctx.chat.id),
        actorId: String(ctx.from?.id ?? '')
      }
    }
  );

  await ctx.reply(
    `Sticker action executed: ${triggerResult.data.actionType}. Manage the next step in the mini app.`,
    buildMiniAppKeyboard()
  );
});

await bot.telegram.setMyCommands([
  { command: 'start', description: 'Open STIX MΛGIC entry point' },
  { command: 'app', description: 'Open the STIX MΛGIC mini app' },
  { command: 'createpack', description: 'Create a new sticker pack' },
  { command: 'addsticker', description: 'Add a sticker to a pack' },
  { command: 'listpacks', description: 'List your current sticker packs' },
  { command: 'publishpack', description: 'Publish a sticker pack to Telegram' }
]);

if (telegramPlatform.runtimeMode === 'webhook' && config.TELEGRAM_WEBHOOK_URL) {
  await bot.telegram.setWebhook(config.TELEGRAM_WEBHOOK_URL);
} else {
  await bot.telegram.deleteWebhook({ drop_pending_updates: false });
}

await bot.launch();
