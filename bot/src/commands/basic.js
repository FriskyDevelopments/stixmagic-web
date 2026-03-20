import { getStatus, sessionStore } from '../services/runtime.js';

function actorLabel(message) {
  const user = message.from ?? {};
  if (user.username) {
    return `@${user.username}`;
  }

  return [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unknown user';
}

export async function handleCommand(api, message, command) {
  const chatId = message.chat.id;
  const chatTitle = message.chat.title ?? 'this group';

  if (command === '/start') {
    await api.sendMessage(chatId, [
      'Telegram VideoChat Companion Bot is online.',
      'Commands:',
      '/vc — show current room status',
      '/join — add yourself to the speaker queue',
      '/leave — leave the speaker queue',
      '/status — alias for /vc'
    ].join('\n'));
    return true;
  }

  if (command === '/vc' || command === '/status') {
    await api.sendMessage(chatId, getStatus(String(chatId), chatTitle));
    return true;
  }

  if (command === '/join') {
    const session = sessionStore.addToQueue(String(chatId), chatTitle, actorLabel(message));
    await api.sendMessage(chatId, `Added to the speaker queue. Current queue length: ${session.speakerQueue.length}.`);
    return true;
  }

  if (command === '/leave') {
    const session = sessionStore.removeFromQueue(String(chatId), chatTitle, actorLabel(message));
    await api.sendMessage(chatId, `Removed from the speaker queue. Current queue length: ${session.speakerQueue.length}.`);
    return true;
  }

  return false;
}
