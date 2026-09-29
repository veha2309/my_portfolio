import { useState, type FormEvent } from "react";
import Arrow from "./Arrow";
import { contact } from "../data/project";

export default function FreelanceInquiry() {
  const [service, setService] = useState("Website");
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const idea = String(values.get("idea") ?? "").trim();
    if (!idea) { setStatus("Add a little about your project to prepare your brief."); return; }
    const fallbackDraft = { subject: `${service} project enquiry`, body: `Hi Vedant,\n\nI'm interested in a ${service.toLowerCase()} project.\n\nName: ${String(values.get("name") || "Not provided").trim()}\nReply email: ${values.get("email")}\nTimeline: ${values.get("timeline")}\n\n${idea}\n\nI'd love to discuss the scope and a tailored quote.` };
    setDraft(null);
    setSending(true);
    setStatus("");
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: String(values.get('name') || ''), email: String(values.get('email') || ''), service, timeline: String(values.get('timeline') || ''), message: idea, website: String(values.get('website') || '') }) });
      const result = await response.json().catch(() => ({ error: 'Direct enquiries are unavailable. You can email your brief instead.' }));
      if (!response.ok || typeof result.id !== 'string') throw new Error(result.error || 'Could not confirm your request. Please email your brief instead.');
      setDraft(null); form.reset(); setService('Website');
      setStatus('Your enquiry has been received. I’ll reply to your email to discuss the scope and a tailored quote.');
    } catch (err) { setDraft(fallbackDraft); setStatus(err instanceof Error ? err.message : 'Could not send your request. Please email your brief instead.'); }
    finally { setSending(false); }
  }
  return <section id="quote" className="quote-section container" aria-labelledby="quote-title">
    <div className="quote-copy" data-reveal><span className="eyebrow">03 / FOR YOUR NEXT CHAPTER</span><h2 id="quote-title">A good idea.<br />A beautiful <em>beginning.</em></h2><p>“Let’s make your business look as good as the work you do.”</p><p>From a first website to a fresh direction, I design and build thoughtful web experiences. Tell me what you have in mind for a clear scope and a tailored quote.</p><a className="text-link" href={`mailto:${contact.email}`}>Prefer a simple hello? Email me <Arrow /></a><div className="project-process"><span>01 / Find the direction</span><span>02 / Design the details</span><span>03 / Bring it to life</span></div></div>
    <form className="quote-form" onSubmit={prepare} onChange={() => { setDraft(null); setStatus(""); }} data-reveal>
      <fieldset><legend>What are we making?</legend><div className="service-options">{["Website", "Web app", "Mobile app", "Redesign"].map(item => <label key={item}><input type="radio" name="service" value={item} checked={service === item} onChange={() => setService(item)} /><span>{item}</span></label>)}</div></fieldset>
      <label>Your name <span>(optional)</span><input name="name" autoComplete="name" maxLength={80} placeholder="A name to say hello to" /></label>
      <label>Your email<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@yourbusiness.com" /></label>
      <label className="form-honeypot" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label>A little about your idea<textarea name="idea" required maxLength={1200} rows={4} placeholder="What do you do, and what would you love to build?" /></label>
      <label>Your timeline<select name="timeline" defaultValue="Let's discuss"><option>Let's discuss</option><option>Within a month</option><option>1–3 months</option><option>Just exploring</option></select></label>
      <button className="button" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send quote request'} <Arrow /></button>
      <p className="quote-note">Your request goes directly to my private project inbox. I’ll use your email to discuss the scope and send a tailored quote. Prefer email? <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
      <p className="quote-status" role="status">{status}</p>
      {draft && <div className="draft-actions"><a className="text-link" href={`mailto:${contact.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}>Open email draft <Arrow /></a><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`); setStatus("Brief copied. Paste it into your preferred email app."); } catch { setStatus("Copy is unavailable. Use Open email draft instead."); } }}>Copy brief</button></div>}
    </form>
  </section>;
}
