# Phase 1 + Verified Build (Round 2)

## ⚠️ Security — do this first
Your originally uploaded `server/.env` contained a **live MongoDB Atlas URI with a real username/password** in
plaintext. I removed it from this package and left `server/.env.example` instead. Before doing anything else:
1. Rotate that database user's password in MongoDB Atlas.
2. Make sure `.env` is in `server/.gitignore`.
3. Never re-add a real `.env` to a zip/repo you share.

## Now build-verified ✅
With the `package.json`, `vite.config.ts`, `index.html`, and `tsconfig.json` you sent, I assembled the full project,
ran `npm install`, `tsc -b`, and `vite build` for real. Two files were missing from what you'd sent (standard Vite
scaffolding, not part of your custom code) and I added them so the build works:
- `tsconfig.app.json` / `tsconfig.node.json` — referenced by your `tsconfig.json` but not included
- `src/vite-env.d.ts` — needed for `import './index.css'` to type-check; standard in every Vite React template

`tsc -b` passes clean, `vite build` succeeds, and I served the production `dist/` with `vite preview` and confirmed
the HTML/JS/CSS all load with `200`s.

## Bundle-size fix found by the real build
The first production build came back at **1.36MB JS (390KB gzip)** in a single chunk, with Vite's own warning about
chunks over 500KB — largely `three.js` + `@react-three/fiber`, which are purely decorative background chrome. I
lazy-loaded the `Scene` component behind `React.lazy` + `Suspense` (with a plain themed-background fallback so
there's no blank flash). Result, same build tooling, verified:

| | Before | After |
|---|---|---|
| Main JS chunk | 1.36 MB (390 KB gzip) | **467 KB (150 KB gzip)** |
| 3D scene | bundled in main chunk | separate 888 KB (240 KB gzip) chunk, loads async after first paint |

This means first paint / interactivity no longer waits on Three.js to download and parse.

## Everything from Round 1 (all still in place, now build-verified)
| File | Change |
|---|---|
| `components/SectionHeading.tsx` | Was a 0-byte empty file. Built a real reusable heading (eyebrow + title + optional highlighted word + optional corner brackets), wired into `Projects.tsx` and `Resume.tsx`. |
| `components/SkillBadge.tsx` | Was hardcoded `slate-700`/`slate-600`, ignoring your theme system. Re-themed to `celestial-*` variables. |
| `components/ContextMenu.tsx` | Replaced the Hinglish joke message with an on-brand HUD-style message. |
| `components/Cursor.tsx` + `index.css` | Custom cursor / `cursor: none` gated behind `(hover: hover) and (pointer: fine)` so touch devices keep native tap behavior. |
| `index.css` | `prefers-reduced-motion` media query shortens all transitions/animations to near-zero. |
| `components/3d/Scene.tsx` | Starfield count 1500 → 500 under 768px; camera parallax/scroll-dolly dampened ~85% under reduced motion; now lazy-loaded (see above). |
| `hooks/usePrefersReducedMotion.ts` | New shared hook (`usePrefersReducedMotion`, `useHasFinePointer`). |
| `components/Preloader.tsx` (new) | Cinematic once-per-session boot sequence, collapses fast under reduced motion. |
| `App.tsx` | Wired in `Preloader` + `Suspense`-wrapped lazy `Scene`; main content `aria-hidden` while booting. |
| `HUD.tsx`, `NavBar.tsx`, `Footer.tsx`, `pages/Home.tsx` | Added `aria-label`s to icon-only buttons/links that had no accessible name. |

## Recommended next (not yet implemented)
1. **Lenis** for inertial smooth-scroll (currently native `scrollIntoView` — fine, not "buttery").
2. Move Google Fonts loading from the render-blocking `@import` in `index.css` to `<link rel="preconnect">` +
   `<link rel="stylesheet">` in `index.html` — now that I have `index.html`, I can do this next round.
3. `frameloop="demand"` or visibility-based pause on the R3F `<Canvas>` when the tab isn't focused.
4. Footer visitor-counter fetch fails silently on error — worth a small inline fallback state.
5. Skip-to-content link for keyboard users (fixed navbar currently has no bypass).
6. `eslint.config.js` wasn't in what you sent, so I couldn't run lint — happy to add a standard one if useful.

Tell me which of these — or which of the original 12-point ask — to take further.
