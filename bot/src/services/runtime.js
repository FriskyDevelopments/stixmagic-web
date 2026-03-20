import { SessionStore, formatAnnouncement, formatSessionStatus, loadConfig } from '@videochat-bot/core';

export const config = loadConfig();
export const sessionStore = new SessionStore();

export function buildAnnouncement(chatTitle) {
  return formatAnnouncement(config.sessionAnnounceTemplate, {
    title: 'Voice chat session',
    chatTitle
  });
}

export function getStatus(chatId, chatTitle) {
  return formatSessionStatus(sessionStore.get(chatId, chatTitle));
}
