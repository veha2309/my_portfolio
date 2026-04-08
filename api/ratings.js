const { connectDB, Rating } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { storageKey, name, rating } = req.body;
    if (!storageKey || !name || !rating) return res.status(400).json({ error: 'Missing fields' });
    const entry = await Rating.create({ storageKey, name, rating });
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ error: 'Failed to save rating' });
  }
};
