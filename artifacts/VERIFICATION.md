# Portfolio rebuild verification

## Environment

Windows, installed Google Chrome, Vite production preview at `http://127.0.0.1:4173`. Lighthouse 13.5.0 with default simulated mobile throttling. Local lab results, not field data or a physical-device guarantee.

## Baseline comparison

| Metric | Original | Rebuilt |
| --- | ---: | ---: |
| Initial JavaScript, gzip | 136.96 KB | 128.69 KB |
| Main CSS, gzip | 21.76 KB | 4.89 KB |
| Main CSS, uncompressed | 103.74 KB | 20.56 KB |
| Vite transformed modules | 1,714 | 59 |
| Mobile Lighthouse performance | 92 | 98 |
| Mobile Lighthouse accessibility | 95 | 100 |
| LCP | 2.81 s | 2.23 s |
| CLS | 0.0115 | 0 |
| Total blocking time | 45.5 ms | 19 ms |

Case-study code loads on demand (~1.14 KB gzip beyond the shared bundle). Self-hosted Latin fonts total ~72 KB. SVG project illustrations are 4–10 KB each. The supplied portrait is served as a 157 KB WebP rather than its 1.54 MB PNG original.

The baseline Lighthouse CLI produced a complete report but exited with a Windows temporary-profile cleanup error. Its results were read from the saved JSON. The rebuilt audit script uses Playwright to own Chrome, avoiding that CLI cleanup issue.

## Browser coverage

`npm run test:e2e` covers 16 scenarios:

- Homepage content, project links, anchor positioning, and runtime errors.
- All four case studies: direct load, reload, next project, Back, and return to work.
- Portfolio scroll restoration.
- Media loading and overflow at 360, 390, 768, 1024, and 1440 px.
- Mobile menu focus containment, Escape, links, and breakpoint cleanup.
- Reduced-motion initialization and live preference changes.
- Unknown routes/slugs, recovery links, title, and robots metadata.
- Keyboard skip link.

## Visual and motion evidence

Desktop and mobile screenshots cover the hero, projects, about section, and case studies. Project illustrations are explicitly identified. Font families and media geometry were inspected in the browser.

An eight-second scripted desktop scroll at 1440×1000, without CPU throttling, recorded 479 frame intervals, an approximately 17 ms 95th-percentile interval, no intervals over 50 ms, and no long tasks. See `scroll-profile.json`; this does not guarantee identical performance on every device.

## Figma and external links

Figma access was confirmed; the reference file contains tokens and illustration components. The Starter tool quota stopped full composition and export. Comparison against completed Figma screens could not be performed. Exact IDs and pending work are in `figma-state.json`.

FinanceFlow and StockPulse demo links were opened in the browser; both show sign-in pages. FinanceFlow, StockPulse, StockPulse Mobile, the GitHub profile, and the app download returned HTTP 200. The old Vision Assistant repository returned 404, so its broken source link was replaced with a project inquiry email link. LinkedIn returned 403 to automated verification; its existing profile URL is retained. No accounts were created, private application data accessed, or messages sent.

The final pre-portrait-change audit also scored 100 for best practices and SEO. The new supplied portrait is lazy-loaded as WebP; desktop/mobile framing is checked separately.

## Preserved boundaries

No changes to `api/`, `server/`, database data, or `vercel.json`. No deployment. Social metadata exists in the HTML shell; route-specific metadata updates client-side. Bots that do not execute JavaScript receive common portfolio metadata.
# Freelance showcase iteration — September 29, 2026

## Work-led opening revision

Removed the hero portrait (the supplied photo remains in About). Replaced the three-line heading with “Digital craft. Human feeling.” and a compact strip of Malamen, Signature Cafe and FinanceFlow previews. Added a warm ivory project gallery to break up the dark layout. Removed the decorative scrolling ribbon and portrait animation; the project strip uses restrained desktop scroll offsets with reduced-motion support. Web designs retain their dedicated section and three mobile captures.

Build/lint and all 27 browser checks passed on the layout. Final asset optimization uses 640px local WebP hero previews. Latest local simulated-mobile Lighthouse: performance **95**, accessibility/best-practices/SEO **100**, LCP **2.72 s** (above the 2.5 s goal), CLS **0**, TBT **76 ms**. Initial JS **133.98 kB gzip**. Scroll profile: p95 **17.4 ms**, zero frames over 50 ms, zero JavaScript long tasks. No deployment.

## Editorial visual and motion refinement

Added a desktop hero portrait using the supplied photo, a scroll-driven typographic band, large image-led project rows with side-by-side descriptions, and an editorial transition before Web designs. GSAP adds portrait parallax, a rotating hero accent, project text entrances and restrained section movement. No perpetual loop, cursor tracking, scroll hijacking, or new animation dependency. Small screens use a simpler layout; reduced-motion styles immediately remove transforms.

Production build and lint pass; all 27 browser checks passed on the visual redesign. Subsequent refinements removed overlapping transform ownership and text opacity changes. Final Lighthouse 13.5 simulated mobile audit: **97 performance**, **100 accessibility**, **100 best practices**, **100 SEO**, **LCP 2.41 s**, **CLS 0**, **TBT 40 ms**. Initial JS **133.91 kB gzip**. Scroll lab sample before final motion cleanup: p95 **17.4 ms**, zero JavaScript long tasks, two frames above 50 ms, no runtime errors. These are local headless Chrome measurements, not physical-device guarantees. No deployment or Figma update was performed.

## Supabase-only storage and private feedback

Removed MongoDB runtime code, both mongoose dependencies, the connection helper, and the database keepalive cron. The optional local server now dispatches the same Supabase-backed API handlers as Vercel. Old public ratings and visitor routes return 410. Existing external database data was not deleted or transferred.

Added `portfolio_feedback` with RLS and server-only grants, public validated/rate-limited submissions, authenticated admin reads and target filtering. No public results or averages are shown. All nine targets are covered: five projects, two website designs, overall portfolio, and collaboration with Vedant. Apply migration `202609290002_private_feedback.sql` after the enquiry migration to activate this feature. Live migration/deployment remain pending.

## Supabase correction

The current quote inbox uses Supabase Postgres behind Vercel functions. The MongoDB implementation described in earlier entries below is superseded for the inbox. The new additive migration is `supabase/migrations/202609290001_portfolio_inquiries.sql`; it restricts both new tables and the atomic rate-limit RPC to server access. `artifacts/ADMIN_SETUP.md` is the current setup guide. Existing legacy ratings/visitor APIs are preserved. Live SQL application and hosted verification are pending configuration; tests do not write to a live database.

## Three-screen gallery and quote inbox follow-up

- Each website's mobile view now shows three real scrolled section captures. Desktop displays all three; narrow screens use a keyboard-focusable native horizontal gallery with scroll snapping.
- Direct quote submission now uses `POST /api/inquiries`, collecting a reply email and writing to a new MongoDB collection. `/admin` is a lazy-loaded, noindex inbox with password authentication, status changes, refresh, pagination, and email reply links.
- Added server-side session verification, HttpOnly cookies, same-origin checks, input limits, a honeypot, and Mongo-backed rate limits. API tests use an isolated repository double and browser tests use network fixtures; no live database writes were made.
- Before activation, follow `artifacts/ADMIN_SETUP.md` to generate admin credentials and configure the server environment. The UI only confirms receipt after a valid API acknowledgement and retains the email fallback on failure.
- Latest build: initial JS **132.53 kB gzip**; admin route **1.69 kB gzip**. Build and lint pass. The Lighthouse figures below predate this inbox/gallery follow-up.


- Added Malamen and Signature Cafe with actual desktop/mobile captures, live/source links, accessible preview controls, and clear concept labels.
- Added a local inquiry builder with project type, name, timeline and brief. Email drafts are encoded; editing invalidates an older draft. Clipboard has failure feedback. No backend or automatic sending.
- Mahila Mitr is a regular fifth card. Its case study describes the Flutter mobile app: cycle logging/calendars, chosen-partner pairing, private chat with message expiry, notes and reflections, plus a supporting admin panel. Verified from `../mahila-mitr/mobile-app/README.md` and `lib/main.dart`. Encryption is accurately described as server-side, not end-to-end. Public mobile repository returned 404; only verified web-admin links are shown. Separate admin section uses the actual public login capture. Web designs are in their own section after the project grid.
- Build and lint pass. Initial JavaScript: **131.86 kB gzip**, lazy case study: **1.33 kB gzip**. All **21 browser tests pass**.
- Final Lighthouse 13.5 simulated mobile run against local production preview: **96 performance**, **100 accessibility**, **100 best practices**, **100 SEO**; LCP **2.62 s**, CLS **0**, TBT **30.5 ms**. LCP narrowly misses the 2.5 s target; this is a lab measurement, not a deployed/physical-device result.
- Desktop scroll profile: 8 seconds, 1440×1000, unthrottled headless Chrome: p95 frame **17.4 ms**, **0 frames over 50 ms**, **0 long tasks**, no runtime errors. Sample was taken before the final mobile-only entrance simplification and preview-frame fit adjustment.
- Browser coverage includes 360–1440 px, all five project routes/reloads/Back, mobile menu/focus, reduced motion, website/size switching, quote encoding/copy/edit invalidation, and mobile-first Mahila content.
- Figma remains limited by the previously reported account tool quota; this iteration was verified locally. Nothing deployed.
