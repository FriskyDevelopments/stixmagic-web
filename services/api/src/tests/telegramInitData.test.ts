import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { validateTelegramInitData } from '../auth/telegramInitData.js';

function sign(params: URLSearchParams, botToken: string): string {
  const check = Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  return createHmac('sha256', secret).update(check).digest('hex');
}

test('valid init data is accepted', () => {
  const token = '123:ABC';
  const params = new URLSearchParams();
  params.set('auth_date', String(Math.floor(Date.now() / 1000)));
  params.set('user', JSON.stringify({ id: 42 }));
  params.set('hash', sign(params, token));

  const identity = validateTelegramInitData(params.toString(), token);
  assert.equal(identity.userId, '42');
});

test('invalid hash is rejected', () => {
  const token = '123:ABC';
  const params = new URLSearchParams();
  params.set('auth_date', String(Math.floor(Date.now() / 1000)));
  params.set('user', JSON.stringify({ id: 42 }));
  params.set('hash', '00ff');

  assert.throws(() => validateTelegramInitData(params.toString(), token));
});

test('stale auth_date is rejected', () => {
  const token = '123:ABC';
  const params = new URLSearchParams();
  params.set('auth_date', String(Math.floor(Date.now() / 1000) - 3600));
  params.set('user', JSON.stringify({ id: 42 }));
  params.set('hash', sign(params, token));

  assert.throws(() => validateTelegramInitData(params.toString(), token, 60));
});

test('missing init data is rejected', () => {
  assert.throws(() => validateTelegramInitData(undefined, '123:ABC'));
});
