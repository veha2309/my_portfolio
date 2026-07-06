import { connectDB, Visitor } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const key = req.query.key || 'global';
      const count = await Visitor.countDocuments({ key });
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      const key = req.body.key || 'global';
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
      let cleanIp = typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown';

      try {
        await Visitor.create({ ip: cleanIp, key });
      } catch (err) {
        if (err.code !== 11000) {
          throw err;
        }
      }

      const count = await Visitor.countDocuments({ key });
      return res.status(200).json({ count });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
