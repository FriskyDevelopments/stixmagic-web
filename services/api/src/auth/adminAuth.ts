import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { loadApiConfig } from '@stixmagic/config';
import { ensureAdminIdentity, isAdminTelegramUser } from '../lib/repositories.js';
import { TelegramInitDataError, type ValidatedMiniAppIdentity, validateTelegramInitData } from './telegramInitData.js';

declare module 'fastify' {
  interface FastifyRequest {
    principal?: ValidatedMiniAppIdentity;
  }

  interface FastifyInstance {
    authenticateTelegramUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const config = loadApiConfig();

function getRawInitData(request: FastifyRequest): string | undefined {
  return (request.headers['x-telegram-init-data'] as string | undefined) ??
    ((request.query as { tgWebAppData?: string }).tgWebAppData);
}

export const adminAuthPlugin: FastifyPluginAsync = async (app) => {
  if (process.env.ADMIN_TELEGRAM_USER_ID) {
    await ensureAdminIdentity(process.env.ADMIN_TELEGRAM_USER_ID);
  }

  app.decorate('authenticateTelegramUser', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.principal = validateTelegramInitData(
        getRawInitData(request),
        config.TELEGRAM_BOT_TOKEN,
        config.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS
      );
    } catch (error) {
      if (error instanceof TelegramInitDataError) {
        await reply.status(error.statusCode).send({ ok: false, data: { message: error.message } });
        return;
      }
      throw error;
    }
  });

  app.decorate('authorizeAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    await app.authenticateTelegramUser(request, reply);
    if (reply.sent || !request.principal) return;

    const isAdmin = await isAdminTelegramUser(request.principal.userId);
    if (!isAdmin) {
      await reply.status(403).send({ ok: false, data: { message: 'Admin role required' } });
    }
  });
};
