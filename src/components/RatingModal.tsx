import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import axios from 'axios';

const API = '/api/ratings';

interface RatingEntry {
  name: string;
  rating: number;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey: string;
  title: string;
}

function HalfStarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center space-x-1" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fullFilled = display >= star;
        const halfFilled = !fullFilled && display >= star - 0.5;
        return (
          <div key={star} className="relative w-8 h-8">
            <div className="absolute left-0 top-0 w-1/2 h-full z-10" onMouseEnter={() => setHovered(star - 0.5)} onClick={() => onChange(star - 0.5)} />
            <div className="absolute right-0 top-0 w-1/2 h-full z-10" onMouseEnter={() => setHovered(star)} onClick={() => onChange(star)} />
            <div className="w-8 h-8 relative pointer-events-none">
              <Star size={32} className="absolute text-celestial-outline" fill="transparent" strokeWidth={1.5} />
              {(fullFilled || halfFilled) && (
                <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: fullFilled ? '100%' : '50%' }}>
                  <Star size={32} className="text-celestial-primary" fill="currentColor" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <span className="ml-2 text-celestial-primary font-bold text-lg w-8">{display > 0 ? display : '—'}</span>
    </div>
  );
}

function AverageStars({ avg, size = 16 }: { avg: number; size?: number }) {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = avg >= star;
        const half = !full && avg >= star - 0.5;
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="absolute text-celestial-outline" fill="transparent" strokeWidth={1.5} />
            {(full || half) && (
              <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: full ? '100%' : '50%' }}>
                <Star size={size} className="text-celestial-primary" fill="currentColor" strokeWidth={1.5} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

async function fetchEntries(storageKey: string): Promise<RatingEntry[]> {
  try {
    const { data } = await axios.get<RatingEntry[]>(`${API}/${storageKey}`);
    return data;
  } catch {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }
}

export function RatingDisplay({ storageKey }: { storageKey: string }) {
  const [entries, setEntries] = useState<RatingEntry[]>([]);

  useEffect(() => {
    fetchEntries(storageKey).then(setEntries);
  }, [storageKey]);

  if (entries.length === 0) return null;

  const avg = Math.round((entries.reduce((s, e) => s + e.rating, 0) / entries.length) * 2) / 2;

  return (
    <div className="flex items-center space-x-2">
      <AverageStars avg={avg} />
      <span className="text-[10px] text-celestial-text/40 font-mono">
        {avg}/5 · {entries.length} {entries.length === 1 ? 'rating' : 'ratings'}
      </span>
    </div>
  );
}

export default function RatingModal({ isOpen, onClose, storageKey, title }: RatingModalProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [entries, setEntries] = useState<RatingEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    fetchEntries(storageKey).then(setEntries);
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    load();
    setName('');
    setRating(0);
    setSubmitted(false);
  }, [isOpen, load]);

  const handleSubmit = async () => {
    if (!name.trim() || rating === 0) return;
    setLoading(true);
    const entry = { name: name.trim(), rating };
    try {
      await axios.post(API, { storageKey, ...entry });
    } catch {
      // fallback: save to localStorage
      const updated = [...entries, entry];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    await load();
    setSubmitted(true);
    setLoading(false);
  };

  const avg = entries.length > 0
    ? Math.round((entries.reduce((s, e) => s + e.rating, 0) / entries.length) * 2) / 2
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative glass rounded-3xl p-8 border border-celestial-outline w-full max-w-md shadow-2xl"
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.25 }}
          >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-celestial-primary/40 m-3 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-celestial-primary/40 m-3 rounded-br-lg" />

            <button onClick={onClose} className="absolute top-4 right-4 text-celestial-text/40 hover:text-celestial-text transition-colors">
              <X size={18} />
            </button>

            <div className="space-y-6">
              <div>
                <p className="hud-text text-[10px] text-celestial-primary/60 mb-1">Rating Module</p>
                <h3 className="text-xl font-bold text-celestial-text tracking-tight">{title}</h3>
              </div>

              {entries.length > 0 && (
                <div className="bg-celestial-text/5 rounded-2xl p-4 border border-celestial-outline/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-celestial-text/50 uppercase tracking-widest">Community Score</span>
                    <span className="text-celestial-primary font-bold">{avg} / 5</span>
                  </div>
                  <AverageStars avg={avg} />
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {entries.map((e, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-celestial-text/60">{e.name}</span>
                        <div className="flex items-center space-x-1">
                          <AverageStars avg={e.rating} size={12} />
                          <span className="text-celestial-text/40 ml-1">{e.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!submitted ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-celestial-text/50">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full bg-celestial-text/5 border border-celestial-outline rounded-xl px-4 py-3 text-sm text-celestial-text placeholder:text-celestial-text/20 focus:outline-none focus:border-celestial-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-celestial-text/50">Your Rating</label>
                    <HalfStarRating value={rating} onChange={setRating} />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || rating === 0 || loading}
                    className="w-full py-3 rounded-xl bg-celestial-primary/10 border border-celestial-primary/30 text-celestial-primary text-xs font-bold uppercase tracking-widest hover:bg-celestial-primary/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {loading ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2 py-4"
                >
                  <div className="text-3xl">✦</div>
                  <p className="text-celestial-primary font-bold tracking-widest uppercase text-sm">Rating Logged</p>
                  <p className="text-celestial-text/50 text-xs">Thanks, {name}!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
