export function loadConfig() {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramBotToken) {
    throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    telegramBotToken,
    botUsername: process.env.BOT_USERNAME,
    sessionAnnounceTemplate: process.env.SESSION_ANNOUNCE_TEMPLATE ?? '🎙️ {title} is now live in {chatTitle}.',
    webPort: Number(process.env.WEB_PORT ?? 3000)
  };
}
