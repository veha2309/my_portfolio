// Server-only Supabase Data API access. Never import this module from src/.
export function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export async function supabaseRequest(path, options = {}) {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
  if (!base || !key) throw new Error('Supabase is not configured');
  const headers = { apikey: key, 'Content-Type': 'application/json', ...options.headers };
  // Legacy service-role JWTs also use Authorization; modern secret keys use apikey.
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options, headers, signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status})`);
  return { data: await response.json(), headers: response.headers };
}

const normalize = row => ({ ...row, _id: row.id, createdAt: row.created_at, updatedAt: row.updated_at });
export const inquiryStore = {
  async create(entry) {
    const { data } = await supabaseRequest('portfolio_inquiries?select=*', {
      method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(entry),
    });
    if (!data[0]?.id) throw new Error('Missing insert acknowledgement');
    return normalize(data[0]);
  },
  async list(page) {
    const { data, headers } = await supabaseRequest(`portfolio_inquiries?select=*&order=created_at.desc,id.desc&limit=20&offset=${(page - 1) * 20}`, { headers: { Prefer: 'count=exact' } });
    const total = Number(headers.get('content-range')?.split('/')[1]);
    if (!Number.isFinite(total)) throw new Error('Missing count');
    return { items: data.map(normalize), total };
  },
  async update(id, status) {
    const { data } = await supabaseRequest(`portfolio_inquiries?id=eq.${encodeURIComponent(id)}&select=*`, {
      method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    });
    return data[0] ? normalize(data[0]) : null;
  },
};
