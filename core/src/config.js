export function loadConfig() {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramBotToken) {
    throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    telegramBotToken,
    sessionAnnounceTemplate: process.env.SESSION_ANNOUNCE_TEMPLATE ?? '🎙️ {title} is now live in {chatTitle}.',
  };
}
