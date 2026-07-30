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
