import { createLoreInviteToken } from '../auth/loreAuth.js';

export type LoreEmailKind = 'invitation' | 'recovery';

export function createLoreEmailPayload(input: { userId: string; tenantId: string; email: string; kind: LoreEmailKind }) {
  const expiresAt = Math.floor(Date.now() / 1000) + (input.kind === 'recovery' ? 48 * 60 * 60 : 7 * 24 * 60 * 60);
  const token = createLoreInviteToken({ userId: input.userId, tenantId: input.tenantId, expiresAt });
  const baseUrl = process.env.LORE_PUBLIC_URL;
  if (!baseUrl) throw new Error('LORE_PUBLIC_URL is not configured');

  const link = `${baseUrl.replace(/\/$/, '')}/lore/archive?invite=${encodeURIComponent(token)}`;
  return {
    to: input.email,
    subject: input.kind === 'recovery' ? 'Return to your LORE route' : 'Your invitation to LORE',
    template: input.kind === 'recovery' ? 'lore-recovery' : 'lore-invitation',
    link,
    expiresAt: new Date(expiresAt * 1000).toISOString()
  };
}

export async function deliverLoreEmail(payload: ReturnType<typeof createLoreEmailPayload>): Promise<'sent' | 'not_configured'> {
  const webhookUrl = process.env.LORE_EMAIL_WEBHOOK_URL;
  if (!webhookUrl) return 'not_configured';
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Lore email delivery failed with status ${response.status}`);
  return 'sent';
}
