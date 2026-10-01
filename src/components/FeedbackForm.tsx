import { useState, type FormEvent } from 'react';
import { feedbackTargets } from '../data/feedback';

export default function FeedbackForm({ target }: { target?: string }) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: target || values.get('target'), rating: Number(values.get('rating')), message: values.get('message'), name: values.get('name'), email: values.get('email'), website: values.get('website') }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.id) throw new Error(data.error || 'Feedback could not be sent. Please try again later.');
      form.reset(); setStatus('Thank you. Your feedback was sent privately to Vedant.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not send feedback. Please try again.'); }
    finally { setBusy(false); }
  }
  return <section className={`feedback-section ${target ? "" : "feedback-section--compact"}`} id="feedback" aria-labelledby="feedback-title">
    <div><span className="eyebrow">PRIVATE FEEDBACK</span><h2 id="feedback-title">A little feedback.<br /><em>A better next step.</em></h2><p>{target ? `Share your thoughts on ${feedbackTargets.find(item => item.value === target)?.label || 'this project'}.` : 'Share feedback about the studio, a project, or your experience working with Vedant.'} Your rating and message are private. They won’t appear on the public website.</p></div>
    <details className="feedback-details"><summary>{target ? "Leave private feedback" : "Share private feedback"} <span aria-hidden="true">＋</span></summary><form className="quote-form" onSubmit={submit}>
      <fieldset disabled={busy} className="feedback-fields">
        {!target && <label>Feedback about<select name="target" defaultValue="portfolio">{feedbackTargets.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>}
        <fieldset className="rating-options"><legend>Your rating</legend>{[1, 2, 3, 4, 5].map(value => <label key={value}><input type="radio" name="rating" value={value} required aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} /><span>{value} ★</span></label>)}</fieldset>
        <label>Your feedback<textarea name="message" required maxLength={2000} rows={4} placeholder="What worked well? What could be better?" /></label>
        <label>Your name (optional)<input name="name" maxLength={80} autoComplete="name" /></label>
        <label>Email for a reply (optional)<input name="email" type="email" maxLength={254} autoComplete="email" /></label>
        <label className="form-honeypot" aria-hidden="true">Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="button" disabled={busy}>{busy ? 'Sending…' : 'Send private feedback'}</button>
      </fieldset>
      <p role="status" className="quote-status">{status}</p>
    </form></details>
  </section>;
}
