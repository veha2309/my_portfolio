import { authenticated, configured, guard, rateLimit } from './_inquiries.js';
import { supabaseRequest } from './_supabase.js';

const targets = ['portfolio', 'vedant', 'financeflow', 'stockpulse', 'stockpulse-mobile', 'vision-assistant', 'mahila-mitr', 'malamen', 'signature-cafe'];
export function validateFeedback(body) {
  if (!body || !targets.includes(body.target) || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) return null;
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) return null;
  if (typeof body.name !== 'string' || body.name.length > 80 || typeof body.email !== 'string' || body.email.length > 254) return null;
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return null;
  return { target: body.target, rating: body.rating, message: body.message.trim(), name: body.name.trim(), email: body.email.trim() };
}
export function createHandler(overrides = {}) {
  const deps = { configured, rateLimit, supabaseRequest, ...overrides };
  return async (req, res) => {
    if (!guard(req, res)) return;
    if (req.method !== 'POST' && !authenticated(req)) return res.status(401).json({ error: 'Please sign in.' });
    if (!deps.configured()) return res.status(503).json({ error: 'Feedback is temporarily unavailable. Please try again later.' });
    try {
      if (req.method === 'POST') {
        const entry = validateFeedback(req.body);
        if (!entry || req.body.website) return res.status(400).json({ error: 'Choose a rating and add feedback (up to 2,000 characters).' });
        if (!await deps.rateLimit(req, 'feedback', 5)) return res.status(429).json({ error: 'Too many submissions. Please try again in 15 minutes.' });
        const { data } = await deps.supabaseRequest('portfolio_feedback?select=id', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(entry) });
        if (!data[0]?.id) throw new Error('Missing acknowledgement');
        return res.status(201).json({ id: data[0].id });
      }
      if (req.method === 'GET') {
        const page = Math.max(1, Math.min(10000, Number.parseInt(req.query?.page || '1', 10) || 1));
        const target = req.query?.target;
        if (target && !targets.includes(target)) return res.status(400).json({ error: 'Invalid feedback filter.' });
        const { data, headers } = await deps.supabaseRequest(`portfolio_feedback?select=*&order=created_at.desc,id.desc&limit=20&offset=${(page - 1) * 20}${target ? `&target=eq.${encodeURIComponent(target)}` : ''}`, { headers: { Prefer: 'count=exact' } });
        return res.status(200).json({ items: data, total: Number(headers.get('content-range')?.split('/')[1]) || 0, page });
      }
      return res.status(405).json({ error: 'Method not allowed.' });
    } catch { return res.status(503).json({ error: 'Feedback is temporarily unavailable. Your submission could not be confirmed.' }); }
  };
}
export default createHandler();
