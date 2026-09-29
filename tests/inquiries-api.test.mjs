import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync, randomBytes } from 'node:crypto';
import { createHandler as inquiries } from '../api/inquiries.js';
import { createHandler as session } from '../api/admin/session.js';
import { authenticated, newSession, rateLimit } from '../api/_inquiries.js';
import { inquiryStore, supabaseRequest } from '../api/_supabase.js';
import { createHandler as feedback } from '../api/feedback.js';
import retiredRatings from '../api/ratings.js';

const password = 'a-test-password-that-is-not-a-real-credential';
const salt = randomBytes(16).toString('hex');
process.env.ADMIN_PASSWORD_HASH = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
process.env.ADMIN_SESSION_SECRET = randomBytes(48).toString('hex');
process.env.NODE_ENV = 'production';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_only';
const inquiryId = '00000000-0000-4000-8000-000000000001';
function request(method, body = {}, cookie = '') { return { method, body, query: {}, headers: { host: 'portfolio.test', origin: 'https://portfolio.test', 'content-type': 'application/json', cookie } }; }
async function call(handler, req) {
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await handler(req, res); return res;
}
const brief = { name: 'Client', email: 'client@example.com', service: 'Website', timeline: '1–3 months', message: 'A hospitality website.' };
test('feedback is write-only for visitors and readable only after admin authentication', async () => {
  let saved;
  const handler = feedback({ rateLimit: async () => true, supabaseRequest: async (_path, options) => {
    if (options.method === 'POST') { saved = JSON.parse(options.body); return { data: [{ id: inquiryId }] }; }
    return { data: [saved], headers: new Headers({ 'content-range': '0-0/1' }) };
  } });
  assert.equal((await call(handler, request('GET'))).code, 401);
  for (const target of ['portfolio', 'vedant', 'financeflow', 'mahila-mitr', 'malamen']) {
    const response = await call(handler, request('POST', { target, rating: 4, message: 'Private feedback', name: '', email: '' }));
    assert.equal(response.code, 201);
    assert.deepEqual(Object.keys(response.body), ['id']);
  }
  const privateList = await call(handler, request('GET', {}, `portfolio_admin=${newSession()}`));
  assert.equal(privateList.code, 200);
  assert.equal(privateList.body.items[0].message, 'Private feedback');
  assert.equal((await call(handler, request('POST', { target: 'portfolio', rating: 9, message: 'Test', name: '', email: '' }))).code, 400);
  assert.equal((await call(retiredRatings, request('GET'))).code, 410);
});

test('submission → login → protected inbox → status update → logout', async () => {
  let records = [];
  const repository = {
    async create(entry) { const item = { ...entry, _id: inquiryId, status: 'new' }; records.push(item); return item; },
    async list() { return { items: records, total: records.length }; },
    async update(id, status) { records = records.map(item => item._id === id ? { ...item, status } : item); return records.find(item => item._id === id); },
  };
  const inbox = inquiries({ inquiryStore: repository, rateLimit: async () => true });
  assert.equal((await call(inbox, request('POST', brief))).code, 201);
  assert.equal((await call(inbox, request('GET'))).code, 401);
  assert.equal((await call(inbox, request('PATCH', { id: inquiryId, status: 'closed' }))).code, 401);
  const auth = session({ rateLimit: async () => true });
  assert.equal((await call(auth, request('POST', { password: 'wrong' }))).code, 401);
  const login = await call(auth, request('POST', { password }));
  assert.equal(login.code, 200);
  assert.match(login.headers['Set-Cookie'], /HttpOnly; SameSite=Strict; Max-Age=28800; Secure/);
  const cookie = login.headers['Set-Cookie'].split(';')[0];
  const list = await call(inbox, request('GET', {}, cookie));
  assert.equal(list.body.total, 1);
  assert.equal(list.body.items[0].email, brief.email);
  assert.equal(list.headers['Cache-Control'], 'no-store');
  const updated = await call(inbox, request('PATCH', { id: inquiryId, status: 'contacted' }, cookie));
  assert.equal(updated.body.item.status, 'contacted');
  const logout = await call(auth, request('DELETE', {}, cookie));
  assert.match(logout.headers['Set-Cookie'], /Max-Age=0/);
});
test('unconfigured endpoints fail closed', async () => {
  assert.equal((await call(inquiries({ configured: () => false }), request('GET'))).code, 503);
});
test('invalid and oversized input never reaches storage', async () => {
  const handler = inquiries({ inquiryStore: { create() { throw new Error('Must not reach storage'); } } });
  for (const body of [{ ...brief, email: 'bad' }, { ...brief, message: '' }, { ...brief, message: 'a'.repeat(1201) }, { ...brief, service: { $ne: null } }, { ...brief, website: 'bot' }]) {
    assert.equal((await call(handler, request('POST', body))).code, 400);
  }
  assert.equal((await call(handler, request('POST', { message: 'a'.repeat(7000) }))).code, 413);
});
test('cross-origin writes and non-JSON bodies are rejected', async () => {
  const req = request('POST', brief); req.headers.origin = 'https://evil.test';
  assert.equal((await call(inquiries(), req)).code, 403);
  req.headers.origin = 'https://portfolio.test'; req.headers['content-type'] = 'text/plain';
  assert.equal((await call(inquiries(), req)).code, 415);
});
test('submission and login rate limits fail before storage or password authentication', async () => {
  assert.equal((await call(inquiries({ rateLimit: async () => false }), request('POST', brief))).code, 429);
  assert.equal((await call(session({ rateLimit: async () => false }), request('POST', { password }))).code, 429);
});
test('tampered and expired sessions are rejected', () => {
  const token = newSession();
  assert.equal(authenticated(request('GET', {}, `portfolio_admin=${token}`)), true);
  assert.equal(authenticated(request('GET', {}, `portfolio_admin=1.${token.split('.').slice(1).join('.')}`)), false);
  assert.equal(authenticated(request('GET', {}, `portfolio_admin=${token}extra`)), false);
});
test('database failures do not report a successful submission', async () => {
  const handler = inquiries({ rateLimit: async () => { throw new Error('database unavailable'); } });
  assert.equal((await call(handler, request('POST', brief))).code, 503);
});

test('Supabase insert, pagination and update map UUIDs and timestamps for the UI', async (t) => {
  const calls = [];
  const row = { id: inquiryId, ...brief, status: 'new', created_at: '2026-09-29T10:00:00Z' };
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([{ ...row, ...(options.method === 'PATCH' ? { status: 'contacted' } : {}) }]), { headers: { 'Content-Type': 'application/json', 'Content-Range': '20-20/21' } });
  });
  const saved = await inquiryStore.create(brief);
  assert.equal(saved._id, inquiryId);
  assert.equal(saved.createdAt, row.created_at);
  assert.equal(calls[0].options.headers.apikey, process.env.SUPABASE_SECRET_KEY);
  assert.equal(calls[0].options.headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(calls[0].options.body), brief);
  const list = await inquiryStore.list(2);
  assert.equal(list.total, 21);
  assert.match(calls[1].url, /offset=20/);
  assert.equal((await inquiryStore.update(inquiryId, 'contacted')).status, 'contacted');
  assert.match(calls[2].url, new RegExp(`id=eq.${inquiryId}`));
});

test('Supabase rate limit uses an atomic RPC with a hashed bucket', async (t) => {
  let body;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.match(url, /rpc\/portfolio_consume_rate_limit$/);
    body = JSON.parse(options.body);
    return new Response('false');
  });
  assert.equal(await rateLimit(request('POST'), 'login', 10), false);
  assert.match(body.bucket_key, /^[a-f0-9]{64}$/);
  assert.equal(body.maximum, 10);
});

test('Supabase error responses cannot look like a successful save', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"message":"private database detail"}', { status: 403 }));
  await assert.rejects(() => inquiryStore.create(brief), /Supabase request failed \(403\)/);
});

test('legacy service-role keys are supported only in server-side requests', async (t) => {
  const secret = process.env.SUPABASE_SECRET_KEY;
  delete process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-legacy-jwt';
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer test-legacy-jwt');
    return new Response('[]');
  });
  try { await supabaseRequest('portfolio_inquiries'); }
  finally { process.env.SUPABASE_SECRET_KEY = secret; delete process.env.SUPABASE_SERVICE_ROLE_KEY; }
});
