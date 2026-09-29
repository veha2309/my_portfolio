import { storageConfigured, supabaseRequest } from './_supabase.js';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const cookieName = 'portfolio_admin';

export function configured() {
  return Boolean(storageConfigured() && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET?.length >= 32);
}
export function passwordMatches(password) {
  const [salt, hash] = (process.env.ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || '') || typeof password !== 'string' || password.length > 256) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, 'hex'));
}
const sign = value => createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('hex');
export function newSession() {
  const value = `${Date.now() + 8 * 60 * 60 * 1000}.${randomBytes(24).toString('hex')}`;
  return `${value}.${sign(value)}`;
}
export function authenticated(req) {
  if (!configured()) return false;
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token) return false;
  if (token.split('.').length !== 3) return false;
  const [expires, nonce, signature] = token.split('.');
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() || !/^[a-f0-9]{48}$/.test(nonce || '') || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  return timingSafeEqual(Buffer.from(sign(`${expires}.${nonce}`), 'hex'), Buffer.from(signature, 'hex'));
}
export function setSession(res, token = '') {
  res.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${token ? 28800 : 0}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}
export function sameOrigin(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (!origin) return req.method === 'GET';
  try {
    const parsed = new URL(origin);
    if (process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(parsed.hostname)) return true;
    return parsed.host === req.headers.host && parsed.protocol === 'https:';
  } catch { return false; }
}
export function guard(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!sameOrigin(req)) { res.status(403).json({ error: 'Request origin not allowed.' }); return false; }
  if (['POST', 'PATCH'].includes(req.method) && !req.headers['content-type']?.startsWith('application/json')) { res.status(415).json({ error: 'JSON required.' }); return false; }
  if (JSON.stringify(req.body || {}).length > 6000) { res.status(413).json({ error: 'Request too large.' }); return false; }
  return true;
}
export async function rateLimit(req, action, maximum) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const window = Math.floor(Date.now() / 900000);
  const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(`${action}:${ip}:${window}`).digest('hex');
  const { data } = await supabaseRequest('rpc/portfolio_consume_rate_limit', { method: 'POST', body: JSON.stringify({ bucket_key: key, maximum }) });
  return data === true;
}
export function validateInquiry(body) {
  if (!body || typeof body !== 'object') return null;
  const limits = { name: 80, email: 254, service: 30, timeline: 40, message: 1200 };
  const entry = {};
  for (const [key, max] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || body[key].trim().length > max) return null;
    entry[key] = body[key].trim();
  }
  if (!entry.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) || !['Website', 'Web app', 'Mobile app', 'Redesign'].includes(entry.service)) return null;
  return entry;
}
