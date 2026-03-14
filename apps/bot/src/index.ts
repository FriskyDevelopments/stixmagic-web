import { loadBotConfig } from '@stixmagic/config';
import { Telegraf } from 'telegraf';

const config = loadBotConfig();
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

bot.start((ctx) =>
  ctx.reply(
    'Stix Magic bot is online. Use /createpack, /addsticker, /listpacks, and /publishpack to manage interactive stickers.'
  )
);

bot.command('createpack', (ctx) => ctx.reply('Create pack flow is ready. Use the web app to define pack metadata.'));
bot.command('addsticker', (ctx) => ctx.reply('Add sticker flow is ready. Upload media in the web app to process assets.'));
bot.command('listpacks', async (ctx) => {
  const response = await fetch(`${config.API_BASE_URL}/packs`);
  const payload = (await response.json()) as { ok: boolean; data: Array<{ id: string; name: string }> };
  const lines = payload.data.length
    ? payload.data.map((pack) => `• ${pack.name} (${pack.id.slice(0, 8)})`).join('\n')
    : 'No packs found yet.';
  await ctx.reply(lines);
});
bot.command('publishpack', (ctx) => ctx.reply('Publish flow connected. Next step: Telegram sticker-set publish API integration.'));

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

  await ctx.reply(`Sticker action executed: ${triggerResult.data.actionType}`);
});

await bot.telegram.setMyCommands([
  { command: 'createpack', description: 'Create a new sticker pack' },
  { command: 'addsticker', description: 'Add a sticker to a pack' },
  { command: 'listpacks', description: 'List your current sticker packs' },
  { command: 'publishpack', description: 'Publish a sticker pack to Telegram' }
]);

await bot.launch();
