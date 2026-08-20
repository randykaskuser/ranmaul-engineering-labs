# Roadmap scope guardrails (Workspace Rules)

This file prevents accidentally implementing later-phase features early.

## Phase 1 boundary (Foundation)

Phase 1 should establish:

- scalable architecture
- responsive layouts
- locale routing foundation
- visual baseline

Do **not** implement in Phase 1:

- MDX engine / parser/pipeline
- dynamic article rendering beyond what exists today
- search
- analytics
- CMS / admin
- tagging UI/system beyond simple metadata use
- RSS
- heavy animations
- advanced i18n systems

## Explicitly forbidden features (initial phases)

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
- Framer Motion
- excessive animations

## When this file changes

If you change phase boundaries or forbidden features:

- Update `docs/roadmap.md` to match.
- Update `README.md` if capabilities or scope statements change.
