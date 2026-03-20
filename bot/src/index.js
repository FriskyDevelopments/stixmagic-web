import { handleCommand } from './commands/basic.js';
import { handleVideoChatEvent } from './handlers/video-chat.js';
import { config } from './services/runtime.js';
import { TelegramApi } from './telegram-api.js';

const api = new TelegramApi(config.telegramBotToken);
let active = true;

await api.setMyCommands([
  { command: 'vc', description: 'Show the current voice chat status' },
  { command: 'join', description: 'Join the speaker queue' },
  { command: 'leave', description: 'Leave the speaker queue' },
  { command: 'status', description: 'Alias for /vc' }
]);

console.log('Telegram VideoChat Companion Bot started.');

process.once('SIGINT', () => {
  active = false;
});
process.once('SIGTERM', () => {
  active = false;
});

while (active) {
  try {
    const updates = await api.getUpdates();

    for (const update of updates) {
      const message = update.message;
      if (!message?.chat) {
        continue;
      }

      const text = typeof message.text === 'string' ? message.text.split(/\s+/)[0] : '';
      const handledEvent = await handleVideoChatEvent(api, message);
      if (handledEvent) {
        continue;
      }

      if (text.startsWith('/')) {
        await handleCommand(api, message, text);
      }
    }
  } catch (error) {
    console.error('Polling loop error:', error);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

console.log('Telegram VideoChat Companion Bot stopped.');
