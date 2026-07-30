# Game Mode Walkthrough

## Architecture audit

The portfolio is a Vite + React 19 single-page application. The standard experience is composed in `src/App.tsx`, uses GSAP and ScrollTrigger for section motion, Lenis for desktop scrolling, a shared scene context for the global background, and local data modules for projects, skills, and experience.

Game Mode is implemented as a fixed, independent experience layer. It does not replace, route-refactor, or remount the standard portfolio. Its JavaScript and stylesheet are lazy-loaded only after activation.

## Entering Game Mode

Use the floating `PRESS START / GAME MODE` control. Activation:

1. Saves the current portfolio scroll position.
2. Adds `?mode=game` to browser history.
3. Pauses the portfolio smooth-scroll engine.
4. Lazy-loads the Game Mode bundle.
5. Runs the short, skippable boot sequence.

The boot sequence can be skipped with its button, Enter, or Space.

## Main menu

The composed main menu provides:

- Continue / Project Missions
- Player Profile
- Skill Tree
- Experience Log
- Achievements
- Contact Terminal
- Exit Game Mode

The context panel explains the currently selected command.

## Keyboard controls

- Arrow Up / W: previous main-menu command
- Arrow Down / S: next main-menu command
- Enter / Space: select
- Escape: return to the main menu, close mission details, or exit from the home screen
- Tab / Shift+Tab: standard focus navigation through buttons and links

## Screens

### Player Profile

Uses a live developer-terminal identity panel and truthful profile information; no personal portrait appears in Game Mode. Capability categories use qualitative tiers rather than invented percentages.

### Project Missions

Mission nodes are derived from `src/data/project.ts`. Mission details reuse project descriptions, technologies, outcomes, repository links, and live links. The standard project archive remains available as a gateway from mission detail.

### Skill Tree

Branches are generated from `src/data/skills.ts`. Nodes use non-numeric states such as Core and Validated.

### Experience Log

Entries are generated directly from `src/data/experience.ts`.

### Achievements

Achievements only describe capabilities evidenced by real portfolio projects. No user, revenue, award, or client statistics are invented.

### Contact Terminal

Provides the existing email, GitHub, and LinkedIn channels. It does not simulate a successful form submission.

## Exit and restoration

Game Mode can be exited through the HUD, the main menu, Escape, or browser Back. Exit removes Game Mode effects, resumes Lenis, removes the query parameter, and restores the saved portfolio scroll position.

Entering and exiting now uses a shared cinematic iris transition so the editorial portfolio and interactive system feel like two views of the same experience.

## Spatial system map and progression

A persistent dock connects Identity Core, Missions, Skills, Experience Logs, Achievements, and Contact. Opening a real project mission records it as discovered in local browser storage and updates the HUD progress indicator. A concise first-connection briefing appears once and can be dismissed permanently on that device.

## Mobile fallback

Mobile uses a handheld layout with stacked menu controls, full-width mission nodes, large touch targets, simplified grids, no hover dependency, and reduced background depth.

## Reduced motion and effects

The interface respects `prefers-reduced-motion`. A persistent HUD control also lets visitors switch to reduced effects. Reduced mode disables moving grids, scanlines, terminal command sequencing, and long boot motion. The preference is stored locally.

## Sound system

The HUD sound toggle activates a lightweight Web Audio synthesizer after the visitor's click. Navigation, selection, return, and power actions use distinct restrained tones. Audio never autoplays, requires no downloaded sound assets, and the preference is stored locally.

## Performance

- Game Mode component and CSS are code-split.
- No game engine is included.
- No additional WebGL canvas is created.
- Existing portfolio content remains mounted and unchanged beneath the isolated layer.
- Effects use CSS transforms and opacity.
- Pointer-driven 3D depth is applied to Game Mode information panels and the standard portfolio project constellation; it is disabled on touch layouts and reduced-motion settings.
- Event listeners and timers are cleaned up on exit.
- Background portfolio scrolling is paused while Game Mode is active.

## Files created

- `src/game-mode/GameModeRoot.tsx`
- `src/game-mode/GameModeLauncher.tsx`
- `src/game-mode/gameMode.types.ts`
- `src/game-mode/data/gameData.ts`
- `src/game-mode/game-mode.css`
- `GAME_MODE_WALKTHROUGH.md`

## Files modified

- `src/App.tsx`
- `src/index.css`

## Known limitations

- Sound architecture is prepared, but no audio assets are included.
- Contact uses verified external channels rather than a server-backed submission form.
- Mission art is interface-driven; additional project screenshots can be integrated later without changing the Game Mode architecture.
- Game Mode uses an overlay plus `?mode=game`, not a separate router route, to guarantee exact portfolio-state restoration.
