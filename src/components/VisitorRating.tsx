import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';

type RatingEntry = { rating: number };

const ratingKey = 'portfolio-rating-v1';
const visitorKey = 'portfolio-main';

export default function VisitorRating() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(() => localStorage.getItem(ratingKey) === 'submitted');
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [visitorResponse, ratingResponse] = await Promise.all([
          fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: visitorKey }),
            signal: controller.signal,
          }),
          fetch(`/api/ratings/${ratingKey}`, { signal: controller.signal }),
        ]);
        if (!visitorResponse.ok || !ratingResponse.ok) throw new Error('Audience API unavailable');
        const visitorData = await visitorResponse.json() as { count: number };
        const ratingData = await ratingResponse.json() as RatingEntry[];
        setVisitors(visitorData.count); setRatings(ratingData); setOnline(true);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setOnline(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const average = useMemo(() => ratings.length
    ? ratings.reduce((total, entry) => total + entry.rating, 0) / ratings.length : 0, [ratings]);

  const submit = async () => {
    if (!selected || submitting || submitted) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storageKey: ratingKey, name: 'Anonymous visitor', rating: selected }),
      });
      if (!response.ok) throw new Error('Rating API unavailable');
      setRatings((current) => [{ rating: selected }, ...current]);
      localStorage.setItem(ratingKey, 'submitted');
      setSubmitted(true); setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hovered || selected;

  return <section className="audience-signal" aria-labelledby="audience-signal-title">
    <div className="audience-signal__head">
      <span>LIVE / AUDIENCE SIGNAL</span>
      <i className={online ? 'is-online' : ''}>{online ? 'CONNECTED' : 'OFFLINE'}</i>
    </div>
    <div className="audience-signal__grid">
      <div className="audience-signal__metric">
        <span>UNIQUE VISITORS</span>
        <strong>{visitors === null ? '—' : visitors.toLocaleString()}</strong>
        <small>{online ? 'RECORDED ACROSS THE PORTFOLIO' : 'COUNT TEMPORARILY UNAVAILABLE'}</small>
      </div>
      <div className="audience-signal__rating">
        <div><span id="audience-signal-title">RATE THE EXPERIENCE</span><strong>{average ? average.toFixed(1) : '—'}<small>/5</small></strong></div>
        <div className="audience-signal__stars" onPointerLeave={() => setHovered(0)} aria-label="Portfolio rating">
          {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onPointerEnter={() => setHovered(value)} onFocus={() => setHovered(value)} onBlur={() => setHovered(0)} onClick={() => setSelected(value)} aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={selected === value} disabled={submitted}>
            <Star size={22} fill={displayRating >= value ? 'currentColor' : 'none'} />
          </button>)}
        </div>
        <button className="audience-signal__submit" type="button" onClick={submit} disabled={!selected || submitting || submitted}>
          {submitted ? 'SIGNAL RECEIVED — THANK YOU' : submitting ? 'TRANSMITTING...' : 'TRANSMIT RATING'}
        </button>
        <small>{ratings.length ? `${ratings.length} COMMUNITY ${ratings.length === 1 ? 'RATING' : 'RATINGS'}` : 'BE THE FIRST TO LEAVE A SIGNAL'}</small>
      </div>
    </div>
  </section>;
}
