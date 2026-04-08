const { connectDB, Rating } = require('./_db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    const dummy = await Rating.create({ storageKey: '__keepalive__', name: 'ping', rating: 5 });
    await Rating.deleteOne({ _id: dummy._id });
    res.status(200).json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
