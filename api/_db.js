const mongoose = require('mongoose');

let cached = global._mongoConn;
if (!cached) cached = global._mongoConn = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const RatingSchema = new mongoose.Schema({
  storageKey: { type: String, required: true },
  name:       { type: String, required: true },
  rating:     { type: Number, required: true, min: 0.5, max: 5 },
  createdAt:  { type: Date, default: Date.now },
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);

module.exports = { connectDB, Rating };
