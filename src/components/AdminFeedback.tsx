import { useEffect, useState } from 'react';
import { feedbackTargets } from '../data/feedback';
type Entry = { id: string; target: string; rating: number; message: string; name: string; email: string; created_at: string };
export default function AdminFeedback() {
  const [items, setItems] = useState<Entry[]>([]);
  const [target, setTarget] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/feedback?page=${page}${target ? `&target=${encodeURIComponent(target)}` : ''}`, { signal: controller.signal, credentials: 'same-origin' })
      .then(async response => { const data = await response.json(); if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || 'Feedback unavailable.'); return data; })
      .then(data => { setItems(data.items); setTotal(data.total); setError(''); })
      .catch(error => { if (!controller.signal.aborted) { setItems([]); setError(error.message || 'Could not load feedback.'); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, target, refresh]);
  return <section aria-labelledby="private-feedback-title"><h2 id="private-feedback-title">Private ratings & feedback</h2><p className="admin-intro">Only you can read these submissions. Nothing here is published.</p>
    <div className="admin-toolbar"><label>Filter feedback<select value={target} onChange={event => { setLoading(true); setTarget(event.target.value); setPage(1); }}><option value="">All feedback</option>{feedbackTargets.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><button className="text-link" onClick={() => { setLoading(true); setRefresh(value => value + 1); }}>Refresh feedback</button></div>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading private feedback…</p> : <><p>{total} submissions</p>{items.length === 0 && !error ? <p className="admin-empty">No feedback yet.</p> : <div className="inquiry-list">{items.map(item => <article className="inquiry-card" key={item.id}><span className="eyebrow">{feedbackTargets.find(target => target.value === item.target)?.label || item.target} · {new Date(item.created_at).toLocaleDateString()}</span><h3>{item.rating} / 5 stars</h3><p className="inquiry-message">{item.message}</p><p>{item.name || 'Anonymous'}</p>{item.email && <a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email} ↗</a>}</article>)}</div>}</>}
    <div className="admin-toolbar"><button className="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage(value => value - 1); }}>Previous feedback</button><button className="button" disabled={page * 20 >= total || loading} onClick={() => { setLoading(true); setPage(value => value + 1); }}>Next feedback</button></div>
  </section>;
}
