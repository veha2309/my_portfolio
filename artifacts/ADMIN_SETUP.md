# Quote inbox

Clients submit at `/#quote`. Vercel API functions save requests in Supabase Postgres, in `public.portfolio_inquiries`. Open `/admin` on the same portfolio to sign in, read requests, mark them New / Contacted / Closed, and reply through email. No email notification or automatic price is generated. The quote inbox has no MongoDB dependency.

## Enable it

1. Run both SQL files in `supabase/migrations/` in order in your Supabase project's SQL Editor (or apply them using your migration workflow). The first adds enquiries and rate limiting; `202609290002_private_feedback.sql` adds private feedback. Row-level security is enabled, with no browser-role grants or public policies.
2. From the portfolio root, run `node scripts/configure-admin.mjs`. Choose your own password and enter it again to confirm. Input is hidden. Use 12–256 characters; a memorable multi-word passphrase is fine. Only its hash and a random session secret are written to ignored `.env.local`; your password is never printed or stored as plain text. To change an existing password, run `node scripts/configure-admin.mjs --reset`, then update both generated settings in Vercel and redeploy.
3. In your existing Vercel project's environment settings, add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`. A legacy `SUPABASE_SERVICE_ROLE_KEY` is also supported instead of the secret key. These are **server-only**: never use `VITE_` prefixes. Enable them for the intended production/preview environments. Do not use a publishable/anon key for the server's database access.
4. For local full-stack testing, use `vercel dev` from this project with the same settings in `.env.local`. A standalone `vite preview` only serves the frontend. The older Express server is not required for Vercel hosting or this inbox.
5. Deploy separately when ready, then visit `/admin` and sign in using the password you chose. The setup script rotates `ADMIN_SESSION_SECRET` when resetting the password, invalidating previous sessions once applied on Vercel. Admin authentication uses the existing single-owner password/session implementation, not Supabase Auth users.

Until the settings are supplied, the API fails closed and the form offers an email-draft fallback. A static Vite preview alone does not run the serverless functions.

## Access and data

- The server checks authentication for every inbox read/update; hiding `/admin` is not the access control.
- Signed sessions expire after eight hours and use HttpOnly, SameSite=Strict cookies (Secure in production).
- Same-origin mutation checks, strict field validation, a honeypot and Postgres-backed 15-minute rate limits protect the new endpoints. Counters increment atomically through a server-only RPC. Expired buckets are removed on subsequent rate-limit calls.
- All persisted data uses Supabase: `portfolio_inquiries`, `portfolio_rate_limits`, and `portfolio_feedback`. MongoDB connections, dependencies and keepalive jobs have been removed. Legacy public ratings and visitor endpoints return HTTP 410 and expose no data. No external database was deleted or migrated.
- Requests include name, reply email, project type, timeline and message. They are retained until managed in Supabase; there is no public request-list API. The Supabase service secret is only sent from Vercel to Supabase.

Verification uses isolated repository doubles, mocked Supabase REST responses and browser fixtures. No migration or request was applied to your live project. Run a Supabase/Vercel smoke test after configuration: submit one enquiry, sign in, confirm its details and change its status.

Reference: [Supabase Data API security](https://supabase.com/docs/guides/api/securing-your-api).

## Private feedback

Visitors can leave a 1–5 rating and a message for any of the five projects, either web design, the overall portfolio, or working with Vedant. Name and reply email are optional. Each case study has a project-specific form; the homepage form lets visitors choose a target. Nothing is displayed publicly, including averages or individual ratings.

Sign in at `/admin` and select **Private feedback** to read and filter submissions. Reads require the admin session on the server; Supabase browser roles have no table access. The public submission response contains only an acknowledgement ID. The admin credentials continue to use your chosen password and signed sessions; data persistence is entirely Supabase.
