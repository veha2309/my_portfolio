import { useEffect, useState, type FormEvent } from 'react';
import AdminFeedback from '../components/AdminFeedback';

type Inquiry = { _id: string; name: string; email: string; service: string; timeline: string; message: string; status: 'new' | 'contacted' | 'closed'; createdAt: string };
async function api(path: string, options?: RequestInit) {
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' });
  const data = await response.json().catch(() => { throw new Error('The admin API is unavailable. Check the server configuration.'); });
  if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in.' : data.error || 'Request failed.');
  return data;
}
export default function Admin() {
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState<'enquiries' | 'feedback'>('enquiries');
  useEffect(() => {
    let active = true;
    api('/api/admin/session').then(() => { if (active) setSignedIn(true); }).catch((err: Error) => { if (active && err.message !== 'Please sign in.') setError(err.message); }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!signedIn || tab !== 'enquiries') return;
    let active = true;
    api(`/api/inquiries?page=${page}`).then(data => { if (active) { setItems(data.items); setTotal(data.total); } }).catch((err: Error) => { if (active) { setError(err.message); if (err.message === 'Please sign in.') setSignedIn(false); } });
    return () => { active = false; };
  }, [signedIn, page, refresh, tab]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const form = event.currentTarget;
    try { await api('/api/admin/session', { method: 'POST', body: JSON.stringify({ password: new FormData(form).get('password') }) }); form.reset(); setSignedIn(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Sign-in failed.'); }
    finally { setBusy(false); }
  }
  async function update(item: Inquiry, status: Inquiry['status']) {
    setBusy(true); setError('');
    try { const data = await api('/api/inquiries', { method: 'PATCH', body: JSON.stringify({ id: item._id, status }) }); setItems(previous => previous.map(entry => entry._id === item._id ? data.item : entry)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Update failed.'); }
    finally { setBusy(false); }
  }
  return <main id="main" tabIndex={-1} className="admin-page container">
    <span className="eyebrow">PRIVATE WORKSPACE</span><h1>Your private <em>inbox.</em></h1>
    <p className="admin-intro">Manage quote requests and read private project, portfolio, and collaboration feedback.</p>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {checking ? <p role="status">Checking your session…</p> : !signedIn ? <form className="quote-form admin-login" onSubmit={login}><label>Admin password<input type="password" name="password" autoComplete="current-password" required maxLength={256} /></label><button className="button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form> : <>
      <div className="admin-toolbar"><span>{total} enquiries · Page {page}</span><button className="text-link" onClick={() => { setError(''); setRefresh(value => value + 1); }}>Refresh inbox</button><button className="text-link" onClick={async () => { try { await api('/api/admin/session', { method: 'DELETE' }); setSignedIn(false); setItems([]); setPage(1); } catch { setError('Could not sign out. Please try again.'); } }}>Sign out</button></div>
      <div className="admin-toolbar" role="group" aria-label="Inbox view"><button className="button" aria-pressed={tab === 'enquiries'} onClick={() => setTab('enquiries')}>Quote requests</button><button className="button" aria-pressed={tab === 'feedback'} onClick={() => setTab('feedback')}>Private feedback</button></div>
      {tab === 'feedback' ? <AdminFeedback /> : <>
        {items.length === 0 ? <p className="admin-empty">No enquiries on this page yet.</p> : <div className="inquiry-list">{items.map(item => <article className="inquiry-card" key={item._id}><div className="admin-toolbar"><span className="eyebrow">{item.service} · {new Date(item.createdAt).toLocaleDateString()}</span><label>Status<select value={item.status} disabled={busy} onChange={event => void update(item, event.target.value as Inquiry['status'])}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label></div><h2>{item.name || 'Prospective client'}</h2><a href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`Re: ${item.service} project enquiry`)}`}>{item.email} ↗</a><p className="inquiry-message">{item.message}</p><p>Timeline: {item.timeline}</p></article>)}</div>}
        <div className="admin-toolbar"><button className="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><button className="button" disabled={page * 20 >= total} onClick={() => setPage(value => value + 1)}>Next</button></div>
      </>}
    </>}
  </main>;
}
