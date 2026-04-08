const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS — ISP DNS blocks MongoDB SRV lookups
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(cors());
app.use(express.json());

// --- DB + Model ---
let connected = false;
async function connectDB() {
  if (connected) return;
  await mongoose.connect(process.env.MONGO_URI);
  connected = true;
  console.log('MongoDB connected');
}

const RatingSchema = new mongoose.Schema({
  storageKey: { type: String, required: true },
  name:       { type: String, required: true },
  rating:     { type: Number, required: true, min: 0.5, max: 5 },
  createdAt:  { type: Date, default: Date.now },
});
const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);

// --- Routes ---
// GET /api/ratings/:key
app.get('/api/ratings/:key', async (req, res) => {
  try {
    await connectDB();
    const entries = await Rating.find({ storageKey: req.params.key }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// POST /api/ratings
app.post('/api/ratings', async (req, res) => {
  try {
    await connectDB();
    const { storageKey, name, rating } = req.body;
    if (!storageKey || !name || !rating) return res.status(400).json({ error: 'Missing fields' });
    const entry = await Rating.create({ storageKey, name, rating });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// GET /api/keepalive
app.get('/api/keepalive', async (req, res) => {
  try {
    await connectDB();
    const dummy = await Rating.create({ storageKey: '__keepalive__', name: 'ping', rating: 5 });
    await Rating.deleteOne({ _id: dummy._id });
    res.json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start ---
const PORT = process.env.PORT || 5000;
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
  // keep-alive ping on start then every 10 days
  const ping = async () => {
    try {
      const d = await Rating.create({ storageKey: '__keepalive__', name: 'ping', rating: 5 });
      await Rating.deleteOne({ _id: d._id });
      console.log('Keep-alive ping sent');
    } catch (e) {
      console.error('Keep-alive failed:', e.message);
    }
  };
  ping();
  setInterval(ping, TEN_DAYS);
});
