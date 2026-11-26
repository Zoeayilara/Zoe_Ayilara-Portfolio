import { handleContact } from '../../lib/contact.js';

export default async (req, context) => {
  let body = null;
  if (req.method === 'POST') body = await req.text();
  const { status, json } = await handleContact({
    method: req.method,
    body,
    ip: context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown',
    env: process.env,
  });
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (status === 405) headers.Allow = 'POST';
  return new Response(JSON.stringify(json), { status, headers });
};

export const config = { path: '/api/contact' };
