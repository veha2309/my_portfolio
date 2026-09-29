// Optional local API bridge. Production uses the same handlers on Vercel.
const express = require('express');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const app = express();
app.use(express.json({ limit: '8kb' }));
for (const [route, modulePath] of [
  ['/api/inquiries', '../api/inquiries.js'],
  ['/api/feedback', '../api/feedback.js'],
  ['/api/admin/session', '../api/admin/session.js'],
  ['/api/ratings', '../api/ratings.js'],
  ['/api/ratings/:key', '../api/ratings.js'],
  ['/api/visitors', '../api/visitors.js'],
  ['/api/keepalive', '../api/keepalive.js'],
]) {
  app.all(route, async (req, res) => {
    try { const { default: handler } = await import(modulePath); await handler(req, res); }
    catch { res.status(503).json({ error: 'Service unavailable.' }); }
  });
}
app.listen(process.env.PORT || 5000, '127.0.0.1', () => console.log('Local Supabase API bridge is ready.'));
