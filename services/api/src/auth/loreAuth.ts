import { createHmac, timingSafeEqual } from 'node:crypto';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

export interface LoreIdentity {
  userId: string;
  tenantId: string;
  role: 'member' | 'admin';
  expiresAt: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    loreIdentity?: LoreIdentity;
  }

  interface FastifyInstance {
    authenticateLoreMember: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeLoreAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createLoreInviteToken(input: {
  userId: string;
  tenantId: string;
  role?: LoreIdentity['role'];
  expiresAt: number;
}, secret = process.env.LORE_MEMBER_INVITE_SECRET): string {
  if (!secret) throw new Error('LORE_MEMBER_INVITE_SECRET is not configured');
  const payload = base64UrlEncode(JSON.stringify(input));
  return `${payload}.${signPayload(payload, secret)}`;
}

function verifyToken(token: string, secret: string): LoreIdentity | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = signPayload(payload, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<LoreIdentity>;
    if (!parsed.userId || !parsed.tenantId || !parsed.expiresAt || parsed.expiresAt < Math.floor(Date.now() / 1000)) return null;
    return {
      userId: parsed.userId,
      tenantId: parsed.tenantId,
      role: parsed.role === 'admin' ? 'admin' : 'member',
      expiresAt: parsed.expiresAt
    };
  } catch {
    return null;
  }
}

function getInviteToken(request: FastifyRequest): string | undefined {
  const token = request.headers['x-lore-invite-token'];
  if (typeof token === 'string') return token;
  const authorization = request.headers.authorization;
  return authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined;
}

function resolveIdentity(request: FastifyRequest): LoreIdentity | null {
  const secret = process.env.LORE_MEMBER_INVITE_SECRET;
  const inviteToken = getInviteToken(request);
  if (secret && inviteToken) return verifyToken(inviteToken, secret);

  const allowDevIdentity = process.env.LORE_ALLOW_DEV_IDENTITY === 'true' && process.env.NODE_ENV !== 'production';
  const memberId = request.headers['x-lore-member-id'];
  if (allowDevIdentity && typeof memberId === 'string' && memberId.length > 0) {
    const tenantHeader = request.headers['x-lore-tenant-id'];
    const tenantId = typeof tenantHeader === 'string' && tenantHeader.length > 0 ? tenantHeader : process.env.LORE_DEFAULT_TENANT_ID;
    if (!tenantId) return null;
    return { userId: memberId, tenantId, role: 'member', expiresAt: Math.floor(Date.now() / 1000) + 300 };
  }

  return null;
}

export const loreAuthPlugin: FastifyPluginAsync = async (app) => {
  app.decorate('authenticateLoreMember', async (request: FastifyRequest, reply: FastifyReply) => {
    const identity = resolveIdentity(request);
    if (!identity) {
      await reply.status(401).send({ ok: false, data: { message: 'Valid MyFenrir LORE identity required' } });
      return;
    }
    request.loreIdentity = identity;
  });

  app.decorate('authorizeLoreAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    const identity = resolveIdentity(request);
    if (!identity) {
      await reply.status(401).send({ ok: false, data: { message: 'Valid MyFenrir LORE identity required' } });
      return;
    }
    if (identity.role !== 'admin') {
      await reply.status(403).send({ ok: false, data: { message: 'LORE admin role required' } });
      return;
    }
    request.loreIdentity = identity;
  });
};
