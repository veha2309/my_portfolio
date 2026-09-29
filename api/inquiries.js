import { authenticated, configured, guard, rateLimit, validateInquiry } from './_inquiries.js';
import { inquiryStore } from './_supabase.js';

export function createHandler(overrides = {}) {
  const deps = { configured, inquiryStore, rateLimit, ...overrides };
  return async function handler(req, res) {
  if (!guard(req, res)) return;
  if (!deps.configured()) return res.status(503).json({ error: 'Direct enquiries are not available yet. Please email Vedant instead.' });
  try {
    if (req.method === 'POST') {
      if (req.body?.website) return res.status(400).json({ error: 'Unable to submit this request.' });
      const entry = validateInquiry(req.body);
      if (!entry) return res.status(400).json({ error: 'Enter a valid email and a project brief of up to 1,200 characters.' });
      if (!await deps.rateLimit(req, 'inquiry', 5)) return res.status(429).json({ error: 'Too many enquiries. Try again in 15 minutes or email Vedant.' });
      const saved = await deps.inquiryStore.create(entry);
      return res.status(201).json({ id: saved._id, message: 'Your enquiry is saved. Vedant will reply to your email.' });
    }
    if (!authenticated(req)) return res.status(401).json({ error: 'Please sign in.' });
    if (req.method === 'GET') {
      const page = Math.max(1, Math.min(10000, Number.parseInt(req.query?.page || '1', 10) || 1));
      const { items, total } = await deps.inquiryStore.list(page);
      return res.status(200).json({ items, total, page });
    }
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id) || !['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid enquiry update.' });
      const item = await deps.inquiryStore.update(id, status);
      return item ? res.status(200).json({ item }) : res.status(404).json({ error: 'Enquiry not found.' });
    }
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch { return res.status(503).json({ error: 'The inbox is temporarily unavailable. Please try again or email Vedant.' }); }
  };
}
export default createHandler();
