# Roadmap scope guardrails (Workspace Rules)

This file prevents accidentally implementing later-phase features early.

Current phase status lives in `docs/roadmap.md`.

## Explicitly forbidden features

Do **not** add (unless the roadmap is explicitly updated first):

- authentication
- database
- Prisma
- Supabase
- Firebase
- CMS / admin panel
- analytics
- search engine
- websocket / real-time systems
- excessive animations
- advanced i18n systems

## Allowed with limits

- Framer Motion, for subtle UI transitions (dropdowns, lightbox, galleries). It must not become heavy or decorative animation.
- RSS feed: one per locale at `/{locale}/feed.xml` (see `docs/planning/2026-10-15-rss-feed.md`).

## When this file changes

If you change phase boundaries or forbidden features:

- Update `docs/roadmap.md` to match.
- Update `README.md` if capabilities or scope statements change.
