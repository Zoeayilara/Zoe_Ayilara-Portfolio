import { handleContact } from '../../lib/contact.js';

// Pasted values often carry stray spaces or newlines.
const clean = (env) => Object.fromEntries(Object.entries(env).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));

export default async (req, context) => {
  let body = null;
  if (req.method === 'POST') body = await req.text();
  const { status, json } = await handleContact({
    method: req.method,
    body,
    ip: context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown',
    // Netlify.env is the documented way to read variables in modern functions.
    env: clean({
      RESEND_API_KEY: globalThis.Netlify?.env?.get('RESEND_API_KEY') ?? process.env.RESEND_API_KEY,
      CONTACT_TO_EMAIL: globalThis.Netlify?.env?.get('CONTACT_TO_EMAIL') ?? process.env.CONTACT_TO_EMAIL,
      CONTACT_FROM: globalThis.Netlify?.env?.get('CONTACT_FROM') ?? process.env.CONTACT_FROM,
      CONTACT_CONFIRM: globalThis.Netlify?.env?.get('CONTACT_CONFIRM') ?? process.env.CONTACT_CONFIRM,
    }),
  });
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (status === 405) headers.Allow = 'POST';
  return new Response(JSON.stringify(json), { status, headers });
};

export const config = { path: '/api/contact' };
