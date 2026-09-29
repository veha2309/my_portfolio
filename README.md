# Vedant Shukla — Cinematic Developer Portfolio

An interactive portfolio built as two connected experiences: a restrained editorial interface and an optional futuristic Game Mode. The site presents selected product work through cinematic motion, spatial project exploration, responsive layouts, and performance-aware interaction design.

Repository: [github.com/veha2309/my_portfolio](https://github.com/veha2309/my_portfolio)

## Experience

### Editorial mode

- Cinematic loading sequence and scene-based background transitions
- Smooth Lenis scrolling synchronized with GSAP and ScrollTrigger
- A project constellation that gathers at the center and scatters as the visitor scrolls
- Click-to-open project case studies with scroll locking and reliable state restoration
- Subtle pointer-driven depth, a custom cursor, and responsive motion
- Selected systems: FinanceFlow, StockPulse, StockPulse Mobile, and Vision Assistant
- PlastiSense retained as supporting research context

### Game Mode

- Optional interface activated from the portfolio without replacing the standard experience
- Developer-terminal boot sequence with skippable loading
- Project missions, player profile, skill tree, experience log, achievements, and contact terminal
- Keyboard navigation, spatial navigation, progress persistence, and browser Back support
- Lightweight Web Audio feedback that begins only after user interaction
- Reduced-effects toggle and mobile-specific controls
- Full exit flow that restores the visitor's original portfolio position
- Persistent unique visitor count and an anonymous community rating panel

See [GAME_MODE_WALKTHROUGH.md](./GAME_MODE_WALKTHROUGH.md) for the complete interaction guide.

## Performance and accessibility

The visual system is designed to remain expressive without requiring a game engine or an additional WebGL scene.

- Game Mode and the background field are code-split
- Pointer animation is batched with `requestAnimationFrame`
- Cursor and background rendering stop when idle
- Moving overlays avoid expensive live backdrop sampling
- Smooth scrolling pauses while the tab is hidden or Game Mode is active
- Touch and lower-resource devices receive an automatic lightweight effects tier
- `prefers-reduced-motion` is respected throughout both experiences
- Native cursors and simplified interactions are preserved on touch devices
- Dialogs support Escape, accessible labels, and focus-friendly controls

## Technology

- React 19
- TypeScript
- Vite 6
- GSAP and ScrollTrigger
- Lenis
- Framer Motion
- Lucide React
- CSS transforms, gradients, and responsive layout systems
- Web Audio API

## Run locally

```bash
git clone https://github.com/veha2309/my_portfolio.git
cd my_portfolio
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

```bash
npm run dev      # start the development server
npm run build    # type-check and create a production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project structure

```text
src/
├── components/       shared navigation, cursor, HUD, loader, and background
├── data/             projects, skills, experience, and navigation content
├── game-mode/        lazy-loaded alternate portfolio experience
├── hooks/            motion and device capability hooks
├── pages/            home, project archive, and dossier sections
└── store/            shared scene state
```

## Featured work

| Project | Focus | Stack |
| --- | --- | --- |
| FinanceFlow | Personal finance and transaction intelligence | React, TypeScript, Supabase, Zustand, Recharts |
| StockPulse | Market monitoring and portfolio visibility | Next.js, TypeScript, Supabase, PostgreSQL |
| StockPulse Mobile | Mobile trading and per-holding risk controls | Flutter, Provider, Supabase, Hive |
| Vision Assistant | Assistive spatial perception and navigation context | Flutter, TensorFlow Lite, Camera |

## Contact

- [LinkedIn](https://linkedin.com/in/vedant-shukla-79a6342b1)
- [GitHub](https://github.com/veha2309)
- [Email](mailto:448vedantshukla@gmail.com)

Built and continually refined by Vedant Shukla.
# Vedant Shukla — Cinematic Portfolio

A dark editorial portfolio for web and mobile engineering. Built with React, TypeScript, Vite, native scrolling, and GSAP. The homepage presents four selected projects, capabilities, experience, education, and contact links. Each project has a shareable case-study route.

## Run locally

```sh
npm install
npm run dev
```

```sh
npm run build             # Type-check and production build
npm run preview           # Serve dist on port 4173
npm run lint              # ESLint
npm run test:e2e          # 16 browser checks (requires installed Chrome)
npm run verify:visuals    # Screenshots, scroll profile, social-card PNG
npm run audit:performance # Mobile Lighthouse report
```

Run verification against a completed production build. Visual and performance scripts expect `http://127.0.0.1:4173`. Do not rebuild while browser checks are running. Playwright uses the installed Google Chrome channel. Lighthouse uses port 9223 temporarily.

## Content and design

- `src/data/project.ts` is the single source for the four featured projects and contact links.
- Routes: `/projects/financeflow`, `/projects/stockpulse`, `/projects/stockpulse-mobile`, and `/projects/vision-assistant`.
- `src/data/experience.ts` and `src/data/skills.ts` retain the existing professional record.
- `src/index.css` contains shared tokens, responsive layouts, and interaction styles.
- Inter and Cormorant Garamond are self-hosted; licenses are in `public/fonts`.
- The user-supplied portrait is served as an optimized WebP; its original PNG is retained. `node scripts/optimize-portrait.mjs` regenerates the WebP without cropping or changing the photo. Project SVGs are original, clearly labeled **product illustrations**, not screenshots. Both web demos require sign-in before their product interfaces are visible.
- `npm run artwork` regenerates the illustrations and social-card SVG. Run visual verification afterward to regenerate the PNG.

## Motion and accessibility

GSAP is the only JavaScript animation library. Desktop hero choreography spans 70% of a viewport of scrolling without pinning or scroll hijacking. Project images move slightly while visible; other sections have short entry transitions. Mobile has no scroll choreography. Reduced-motion preferences disable these effects and smooth scrolling, including changes made while the page is open.

Native cursor, semantic links, keyboard focus styles, skip link, mobile menu with focus containment and Escape dismissal, and route-aware titles. Browser Back restores the previous portfolio scroll position. Content remains visible if motion does not initialize. Unknown pages and project slugs provide recovery links.

Game Mode, WebGL scenes, preloaders, custom cursors, ratings UI, and the old animation stack have been retired. Existing API endpoints, database schemas, server code, and hosting configuration are unchanged.

## Figma reference

[Vedant — Cinematic Portfolio](https://www.figma.com/design/cFnVMkwfMPEWwEtxDNvIX0)

Contains screen containers, color and spacing variables, typography styles, a foundations board, and four editable illustration components. Figma's Starter MCP tool limit blocked full screen composition, interaction components, screenshots, and asset export. The website follows the approved art direction but is **not a verified pixel match to completed Figma screens**. `artifacts/figma-state.json` records exact IDs and remaining work for continuation when access is available.

## Verification

See `artifacts/VERIFICATION.md` for measurements, coverage, and limitations. Lighthouse reports and screenshots are generated under `artifacts/` and ignored by Git. No deployment was performed.
# Latest portfolio additions

All backend storage now uses Supabase. Private ratings and feedback are available per project, per website design, for the overall portfolio, and for working with Vedant. Read submissions under `/admin` → **Private feedback**. Apply both SQL migrations described in [admin setup](artifacts/ADMIN_SETUP.md). MongoDB has been removed; old rating and visitor routes are retired rather than exposing legacy data.

The homepage includes a separate Web designs section for Malamen / Signature Cafe with real desktop captures and three scrolled mobile sections per website. Quote requests go through Vercel API functions into Supabase and can be read in the protected `/admin` inbox. Follow [admin setup](artifacts/ADMIN_SETUP.md) to apply the Supabase migration and configure server-only Vercel settings. Mahila Mitr appears as a regular project card for the Flutter mobile app, including private chat and a supporting Next.js admin panel.