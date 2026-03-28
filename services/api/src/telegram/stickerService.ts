import { loadApiConfig } from '@stixmagic/config';
import { setTelegramPackMetadata } from '../lib/repositories.js';

const config = loadApiConfig();

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

async function callTelegram<T>(method: string, payload: Record<string, unknown>): Promise<T> {
  const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as TelegramApiResponse<T>;
  if (!response.ok || !body.ok || body.result === undefined) {
    throw new Error(body.description ?? `Telegram API call failed: ${method}`);
  }
  return body.result;
}

export const telegramStickerService = {
  async createPack(params: { packId: string; userId: string; title: string; name: string; pngSticker: string; emojis: string }) {
    await callTelegram<boolean>('createNewStickerSet', {
      user_id: Number(params.userId),
      name: params.name,
      title: params.title,
      stickers: [
        {
          sticker: params.pngSticker,
          format: 'static',
          emoji_list: [params.emojis]
        }
      ]
    });

    await setTelegramPackMetadata(params.packId, { packName: params.name, title: params.title });
    return { packName: params.name, title: params.title };
  },

  async addSticker(params: { userId: string; name: string; pngSticker: string; emojis: string }) {
    return callTelegram<boolean>('addStickerToSet', {
      user_id: Number(params.userId),
      name: params.name,
      sticker: {
        sticker: params.pngSticker,
        format: 'static',
        emoji_list: [params.emojis]
      }
    });
  },

  async publishStickerJob(payload: Record<string, unknown>) {
    const mode = String(payload.mode);
    if (mode === 'create_pack') {
      await this.createPack({
        packId: String(payload.packId),
        userId: String(payload.userId),
        title: String(payload.title),
        name: String(payload.packName),
        pngSticker: String(payload.pngSticker),
        emojis: String(payload.emojis ?? '✨')
      });
      return;
    }

    if (mode === 'add_sticker') {
      await this.addSticker({
        userId: String(payload.userId),
        name: String(payload.packName),
        pngSticker: String(payload.pngSticker),
        emojis: String(payload.emojis ?? '✨')
      });
      return;
    }

    throw new Error(`Unknown sticker publish mode: ${mode}`);
  }
};
