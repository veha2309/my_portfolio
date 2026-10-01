# Vedant Digital Studio

An independent design and development studio led by Vedant Shukla, creating brand websites, web applications, and mobile experiences.

The homepage is organised around a customer's journey: services, website concepts, selected independent products, a four-stage process, the founder, common questions, and a project enquiry. Career history, education, skills lists, and private ratings are outside the homepage.

## Routes

- `/`: the studio, services, selected work, process, and founder.
- `/quote`: a dedicated project enquiry; `service=website`, `web-app`, `mobile-app`, or `redesign` selects the service, introduction, and brief prompt. Website showcase links also carry a validated design reference. Unsubmitted form values are retained in session storage while browsing; old `/#quote` links redirect here.
- `/work`: all five independent product case studies; website concepts are presented on the homepage.
- `/projects/:slug`: individual product case studies.
- `/feedback`: private feedback for the studio, projects, and working with Vedant. Existing backend target keys are preserved.
- `/admin`: protected enquiry and feedback inbox.

Website examples are clearly labelled as concepts. Product examples are independent projects; illustrations are identified as such. No client endorsements or business results are claimed.

## Local development and verification

```sh
npm install
npm run dev
npm run build
npm run lint
npm run test:e2e
npm run test:api
npm run preview -- --host 127.0.0.1
```

Browser checks use installed Chrome and a production preview on port 4173. Coverage includes customer navigation, enquiry submission and fallbacks, case-study routes, the work archive, private feedback, admin flows, responsive layouts, keyboard access, scroll restoration, and motion cleanup.

## Design and motion

React, TypeScript, Vite, and GSAP. Self-hosted Inter and Cormorant Garamond. The homepage uses a dark spatial hero, staged headline reveals, floating website previews, pointer depth, and native scroll choreography. Touch layouts omit pointer effects. Reduced-motion preferences remove movement; continuous hero motion pauses offscreen and when the tab is hidden.

- `src/pages/Home.tsx`: customer-facing studio content.
- `src/data/project.ts`: product case-study content and contact links.
- `src/studio.css`: studio visual system.
- `src/hooks/usePageMotion.ts`: motion and pointer interaction cleanup.
- `public/studio-mark.svg`: studio favicon.
- `public/social-card.svg` and `.png`: studio share card.

`npm run artwork` regenerates product illustrations and preserves the separately authored studio share card. `npm run verify:visuals` captures layouts and renders its PNG, using a preview on port 4173.

## Enquiries and private feedback

Vercel API functions store requests in Supabase. See [admin setup](artifacts/ADMIN_SETUP.md) for migrations and server-only configuration. Local browser tests mock API responses and do not prove that production credentials or database migrations are configured.

The separate personal portfolio checkout is `../personal-portfolio`. This studio work does not modify that site. The studio changes are verified locally and have not been deployed.
