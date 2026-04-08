import { connectDB, Rating } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { key } = req.query;
    const entries = await Rating.find({ storageKey: key }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}
