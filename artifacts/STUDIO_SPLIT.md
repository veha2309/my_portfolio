# Digital studio split — 1 October 2026

Existing repository renamed to veha2309/vedant-digital-studio. Local origin updated. Studio changes are local-only to avoid a Git push triggering the existing Vercel deployment.

Studio identity, metadata, navigation and footer updated. Homepage now introduces services, website examples, and engineering case studies. Quotes, admin, private feedback and all Supabase API contracts remain unchanged.

Separate independent repository source: personal-portfolio/ (ignored by studio Git). No backend or private configuration copied.

Validation: studio build/lint pass; 12 API tests pass; 29/31 initial browser checks passed, then all 17 navigation/layout checks passed after updating the expected studio title and first mobile-menu item. Quote, private feedback, admin, gallery and email/external prompt checks passed.

Final validation: 30/31 full-suite checks passed, then all four admin tests passed after correcting the expected studio title. All 31 browser scenarios are passing across the full run and targeted rerun. Scroll p95 17.2 ms, one frame over 50 ms, no long tasks or runtime errors in an unthrottled headless desktop lab run.
