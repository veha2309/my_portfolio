import { useState, useEffect, useRef, type FormEvent } from "react";
import Arrow from "./Arrow";
import { contact } from "../data/project";

const initial = { service: "Website", idea: "", timeline: "Let's discuss", name: "", email: "", website: "" };
const stages = ["Service", "Idea & timeline", "Contact details"];
export default function FreelanceInquiry({ reference }: { reference: { name: string; request: number } | null }) {
  const [fields, setFields] = useState(initial);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const move = (next: number) => {
    if (busy.current) return;
    setStep(next);
    requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('.quote-step-title')?.focus({ preventScroll: true }));
  };
  useEffect(() => {
    if (!reference || busy.current) return;
    const note = `Design reference: ${reference.name}.`;
    setFields(current => ({ ...current, service: 'Website', idea: current.idea.includes(note) ? current.idea : current.idea.length + note.length + 2 <= 1200 ? `${current.idea}${current.idea ? '\n\n' : ''}${note}` : current.idea }));
    setStep(1); setDraft(null);
    setStatus(`Design reference: ${reference.name}. Your existing brief is preserved; references are added when space allows.`);
    const frame = requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('.quote-step-title')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [reference]);
  function update(key: keyof typeof initial, value: string) {
    setFields(current => ({ ...current, [key]: value })); setDraft(null); setStatus('');
  }
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (step < 2) {
      if (step === 1 && !fields.idea.trim()) { setStatus('Add a little about your project.'); form.current?.querySelector('textarea')?.focus(); return; }
      move(step + 1); return;
    }
    const fallbackDraft = { subject: `${fields.service} project enquiry`, body: `Hi Vedant,\n\nI'm interested in a ${fields.service.toLowerCase()} project.\n\nName: ${fields.name.trim() || 'Not provided'}\nReply email: ${fields.email}\nTimeline: ${fields.timeline}\n\n${fields.idea.trim()}\n\nI'd love to discuss the scope and a tailored quote.` };
    busy.current = true; setDraft(null); setSending(true); setStatus('');
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fields.name, email: fields.email, service: fields.service, timeline: fields.timeline, message: fields.idea.trim(), website: fields.website }) });
      const result = await response.json().catch(() => ({ error: 'Direct enquiries are unavailable. You can email your brief instead.' }));
      if (!response.ok || typeof result.id !== 'string') throw new Error(result.error || 'Could not confirm your request. Please email your brief instead.');
      setFields(initial); setStep(0);
      setStatus('Your enquiry has been received. I’ll reply to your email to discuss the scope and a tailored quote.');
    } catch (error) { setDraft(fallbackDraft); setStatus(error instanceof Error ? error.message : 'Could not send your request. Please email your brief instead.'); }
    finally { busy.current = false; setSending(false); }
  }
  return <section id="quote" className="quote-section container" aria-labelledby="quote-title">
    <div className="quote-copy" data-reveal><span className="eyebrow">03 / FOR YOUR NEXT CHAPTER</span><h2 id="quote-title">A good idea.<br />A beautiful <em>beginning.</em></h2><p>“Let’s make your business look as good as the work you do.”</p><p>Tell me what you have in mind. We’ll find the direction, define the scope, and discuss a personalised quote.</p><a className="text-link" href={`mailto:${contact.email}`}>Prefer a simple hello? Email me <Arrow /></a>
      <div className="studio-process">{[['Discover', 'Discuss your goals and agree on the scope.'], ['Design', 'Shape the visual direction and key screens.'], ['Build', 'Turn the agreed design into a working experience.'], ['Launch', 'Check the details and prepare the agreed delivery.']].map(([title, text], index) => <div key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </div>
    <form ref={form} className="quote-form quote-wizard" onSubmit={prepare} data-reveal>
      <ol className="quote-progress" aria-label="Quote request progress">{stages.map((title, index) => <li key={title} aria-current={step === index ? 'step' : undefined}><span>0{index + 1}</span>{title}</li>)}</ol>
      <h3 className="quote-step-title" tabIndex={-1}>{['What are we making?', 'Tell me about your idea.', 'Where can I reach you?'][step]}</h3>
      <p className="quote-note">A conversation first. A personalised quote once we understand the scope.</p>
      <fieldset hidden={step !== 0} disabled={sending}><legend>Choose your project type</legend><div className="service-options">{['Website', 'Web app', 'Mobile app', 'Redesign'].map(item => <label key={item}><input type="radio" name="service" value={item} checked={fields.service === item} onChange={() => update('service', item)} /><span>{item}</span></label>)}</div></fieldset>
      <fieldset hidden={step !== 1} disabled={sending} className="quote-step-fields">
        <label>A little about your idea<textarea name="idea" required={step === 1} maxLength={1200} rows={5} value={fields.idea} onChange={event => update('idea', event.target.value)} placeholder="What do you do, and what would you love to build?" /></label>
        <label>Your timeline<select name="timeline" value={fields.timeline} onChange={event => update('timeline', event.target.value)}><option>Let's discuss</option><option>Within a month</option><option>1–3 months</option><option>Just exploring</option></select></label>
      </fieldset>
      <fieldset hidden={step !== 2} disabled={sending} className="quote-step-fields">
        <div className="quote-summary"><span className="eyebrow">YOUR BRIEF</span><div><strong>{fields.service}</strong><button type="button" className="text-link" onClick={() => move(0)}>Edit service</button></div><p>{fields.idea}</p><div><span>{fields.timeline}</span><button type="button" className="text-link" onClick={() => move(1)}>Edit brief</button></div></div>
        <label>Your name <span>(optional)</span><input name="name" autoComplete="name" maxLength={80} value={fields.name} onChange={event => update('name', event.target.value)} placeholder="A name to say hello to" /></label>
        <label>Your email<input name="email" type="email" autoComplete="email" required={step === 2} maxLength={254} value={fields.email} onChange={event => update('email', event.target.value)} placeholder="you@yourbusiness.com" /></label>
      </fieldset>
      <label className="form-honeypot" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={event => update('website', event.target.value)} /></label>
      <div className="quote-navigation">{step > 0 && <button type="button" className="text-link" disabled={sending} onClick={() => move(step - 1)}>Back</button>}<button className="button" type="submit" disabled={sending}>{sending ? 'Sending…' : step === 2 ? 'Send quote request' : 'Next'} <Arrow /></button></div>
      <p className="quote-note">Your request goes directly to my private project inbox. This is a quote request, not an instant price. Prefer email? <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
      <p className="quote-status" role="status">{status}</p>
      {draft && <div className="draft-actions"><a className="text-link" href={`mailto:${contact.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}>Open email draft <Arrow /></a><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`); setStatus('Brief copied. Paste it into your preferred email app.'); } catch { setStatus('Copy is unavailable. Use Open email draft instead.'); } }}>Copy brief</button></div>}
    </form>
  </section>;
}
