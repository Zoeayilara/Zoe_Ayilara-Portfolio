// Core logic for the contact endpoint, kept free of any platform API
// so it can be unit tested without a server.

export const LIMITS = { name: 100, email: 254, message: 5000, minMessage: 10, minFillMs: 2500 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(body) {
  const errors = {};
  const data = {
    name: typeof body?.name === 'string' ? body.name.trim() : '',
    email: typeof body?.email === 'string' ? body.email.trim() : '',
    message: typeof body?.message === 'string' ? body.message.trim() : '',
  };

  if (!data.name) errors.name = 'Add your name so I know who’s writing.';
  else if (data.name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;

  if (!EMAIL_RE.test(data.email) || data.email.length > LIMITS.email)
    errors.email = 'Enter an email address I can reply to.';

  if (data.message.length < LIMITS.minMessage)
    errors.message = 'Write at least a sentence about what you need.';
  else if (data.message.length > LIMITS.message)
    errors.message = `Keep the message under ${LIMITS.message} characters.`;

  return { data, errors, ok: Object.keys(errors).length === 0 };
}

// Bots fill hidden fields and submit instantly. Humans do neither.
export function looksLikeBot(body, now = Date.now()) {
  if (typeof body?.company === 'string' && body.company.trim() !== '') return true;
  const started = Number(body?.startedAt);
  if (!Number.isFinite(started)) return true;
  return now - started < LIMITS.minFillMs;
}

// Best-effort limit per warm serverless instance. Good enough to stop
// someone hammering the form; not a substitute for a shared store.
export function createRateLimiter({ max = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const hits = new Map();
  return function limited(key, now = Date.now()) {
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return false;
  };
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Strip anything that could break out of an email header.
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').slice(0, 120);

export function buildEmails({ name, email, message }, env) {
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';
  const safeName = oneLine(name);

  const notify = {
    from,
    to: [to],
    reply_to: email,
    subject: `New message from ${safeName}`,
    text: `${message}\n\n—\n${safeName} <${email}>\nSent from your portfolio. Reply to this email to answer them directly.`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#0e1a2b;max-width:560px">
<p style="margin:0 0 4px;color:#5b6675;font-size:13px">New message from your portfolio</p>
<p style="margin:0 0 20px;font-size:18px;font-weight:700">${escapeHtml(safeName)} &lt;${escapeHtml(email)}&gt;</p>
<div style="white-space:pre-wrap;padding:16px 18px;background:#eceef1;border-radius:10px">${escapeHtml(message)}</div>
<p style="margin:20px 0 0;color:#5b6675;font-size:13px">Hit reply to answer ${escapeHtml(safeName)} directly.</p>
</div>`,
  };

  // A confirmation to the sender only works once you send from your own
  // verified domain (CONTACT_FROM). Resend's test sender can only email you.
  const confirm =
    env.CONTACT_FROM && env.CONTACT_CONFIRM === 'true'
      ? {
          from,
          to: [email],
          reply_to: to,
          subject: 'Got your message',
          text: `Hi ${safeName},\n\nThanks for reaching out. I’ve got your message and I’ll reply from this address, usually within a day.\n\nZoe\n\n— Your message —\n${message}`,
        }
      : null;

  return { notify, confirm };
}

// Platform-agnostic request handling. The Netlify function is a thin
// wrapper around this, which keeps it testable without a server.
const limited = createRateLimiter();

async function sendEmail(payload, key, fetchImpl) {
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    let reason = detail;
    try {
      reason = JSON.parse(detail).message || detail;
    } catch {
      /* keep raw text */
    }
    const err = new Error(`Resend ${res.status}: ${String(reason).slice(0, 300)}`);
    err.upstream = { status: res.status, reason: String(reason).slice(0, 200) };
    throw err;
  }
  return res.json();
}

export async function handleContact({ method, body, ip = 'unknown', env, fetchImpl = fetch, limiter = limited }) {
  if (method !== 'POST') return { status: 405, json: { error: 'Use POST to send a message.' } };

  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = env;
  const missing = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL'].filter((k) => !env[k] || !String(env[k]).trim());
  if (missing.length) {
    // Names only, never values, so this is safe to return.
    console.error(`contact: missing env ${missing.join(', ')}`);
    return { status: 503, json: { error: 'The contact form is offline right now.', missing } };
  }

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return { status: 400, json: { error: 'The request body must be JSON.' } };
    }
  }

  if (limiter(ip)) {
    return { status: 429, json: { error: 'Too many messages from your connection. Try again in a few minutes.' } };
  }

  // Pretend success so bots get no signal.
  if (looksLikeBot(body)) return { status: 202, json: { ok: true } };

  const { data, errors, ok } = validate(body);
  if (!ok) return { status: 400, json: { error: 'Some fields need fixing.', fields: errors } };

  const { notify, confirm } = buildEmails(data, env);
  try {
    const sent = await sendEmail(notify, RESEND_API_KEY, fetchImpl);
    if (confirm) await sendEmail(confirm, RESEND_API_KEY, fetchImpl).catch((e) => console.error('contact: confirm failed', e));
    return { status: 202, json: { ok: true, id: sent.id } };
  } catch (err) {
    console.error('contact: send failed', err);
    // Resend's own reason (never contains the key) makes setup problems obvious.
    return { status: 502, json: { error: 'The message didn’t send. Try again in a minute.', upstream: err.upstream } };
  }
}
