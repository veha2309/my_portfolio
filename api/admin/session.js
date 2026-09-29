import { authenticated, configured, guard, newSession, passwordMatches, rateLimit, setSession } from '../_inquiries.js';

export function createHandler(overrides = {}) {
  const deps = { rateLimit, ...overrides };
  return async function handler(req, res) {
  if (!guard(req, res)) return;
  if (!configured()) return res.status(503).json({ error: 'Admin access is not configured yet.' });
  if (req.method === 'GET') return res.status(authenticated(req) ? 200 : 401).json({ authenticated: authenticated(req) });
  if (req.method === 'DELETE') { setSession(res); return res.status(200).json({ ok: true }); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    if (!await deps.rateLimit(req, 'login', 10)) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    if (!passwordMatches(req.body?.password)) return res.status(401).json({ error: 'Incorrect password.' });
    setSession(res, newSession());
    return res.status(200).json({ authenticated: true });
  } catch { return res.status(503).json({ error: 'Sign-in is temporarily unavailable.' }); }
  };
}
export default createHandler();
