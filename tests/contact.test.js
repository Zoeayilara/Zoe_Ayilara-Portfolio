import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { validate, looksLikeBot, createRateLimiter, buildEmails, handleContact } from '../lib/contact.js';

const good = { name: 'Ada', email: 'ada@example.com', message: 'I need an API for my shop.' };

test('validate accepts a good message and trims', () => {
  const r = validate({ ...good, name: '  Ada  ' });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, 'Ada');
});

test('validate rejects bad fields with specific messages', () => {
  const r = validate({ name: '', email: 'nope', message: 'hi' });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ['email', 'message', 'name']);
});

test('validate rejects non-string input', () => {
  assert.equal(validate({ name: {}, email: [], message: 5 }).ok, false);
  assert.equal(validate(null).ok, false);
});

test('bot checks: honeypot, missing timer, too fast', () => {
  const now = 100000;
  assert.equal(looksLikeBot({ company: 'Acme', startedAt: 0 }, now), true);
  assert.equal(looksLikeBot({}, now), true);
  assert.equal(looksLikeBot({ startedAt: now - 500 }, now), true);
  assert.equal(looksLikeBot({ company: '', startedAt: now - 10000 }, now), false);
});

test('rate limiter blocks after max within window, then recovers', () => {
  const limited = createRateLimiter({ max: 2, windowMs: 1000 });
  assert.equal(limited('ip', 0), false);
  assert.equal(limited('ip', 10), false);
  assert.equal(limited('ip', 20), true);
  assert.equal(limited('other', 20), false);
  assert.equal(limited('ip', 1500), false);
});

test('notification sets reply_to to the visitor and escapes html', () => {
  const { notify, confirm } = buildEmails(
    { name: 'Eve\r\nBcc: x@y.z', email: 'eve@example.com', message: '<script>x</script>' },
    { CONTACT_TO_EMAIL: 'me@example.com' },
  );
  assert.equal(notify.reply_to, 'eve@example.com');
  assert.deepEqual(notify.to, ['me@example.com']);
  assert.ok(!notify.subject.includes('\n'));
  assert.ok(notify.html.includes('&lt;script&gt;'));
  assert.equal(confirm, null);
});

test('confirmation only with a verified sender and opt-in', () => {
  const env = { CONTACT_TO_EMAIL: 'me@example.com', CONTACT_FROM: 'Zoe <hi@zoe.dev>', CONTACT_CONFIRM: 'true' };
  const { confirm } = buildEmails(good, env);
  assert.deepEqual(confirm.to, ['ada@example.com']);
});

// Request handling, with Resend mocked.
let calls;
let env;
const okFetch = async (url, init) => {
  calls.push({ url, body: JSON.parse(init.body) });
  return { ok: true, json: async () => ({ id: 'em_1' }) };
};
beforeEach(() => {
  calls = [];
  env = { RESEND_API_KEY: 're_test', CONTACT_TO_EMAIL: 'me@example.com' };
});
const human = () => ({ ...good, company: '', startedAt: Date.now() - 8000 });
const call = (over) =>
  handleContact({ method: 'POST', body: human(), ip: Math.random().toString(), env, fetchImpl: okFetch, ...over });

test('sends and returns 202 with reply_to set', async () => {
  const r = await call();
  assert.equal(r.status, 202);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.reply_to, 'ada@example.com');
});

test('accepts a JSON string body', async () => {
  assert.equal((await call({ body: JSON.stringify(human()) })).status, 202);
  assert.equal((await call({ body: '{nope' })).status, 400);
});

test('rejects GET, bad input, and bots without sending', async () => {
  assert.equal((await call({ method: 'GET' })).status, 405);
  const bad = await call({ body: { ...human(), email: 'bad' } });
  assert.equal(bad.status, 400);
  assert.ok(bad.json.fields.email);
  assert.equal((await call({ body: { ...human(), company: 'spam' } })).status, 202);
  assert.equal(calls.length, 0);
});

test('rate limits a noisy ip', async () => {
  let last;
  for (let i = 0; i < 6; i++) last = await call({ ip: '9.9.9.9' });
  assert.equal(last.status, 429);
});

test('reports upstream failure as 502', async () => {
  const r = await call({ fetchImpl: async () => ({ ok: false, status: 422, text: async () => 'bad' }) });
  assert.equal(r.status, 502);
});

test('returns 503 when not configured', async () => {
  env = {};
  assert.equal((await call()).status, 503);
});
