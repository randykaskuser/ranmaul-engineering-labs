# Engineering Labs (website)

Technical editorial platform (Next.js App Router / TypeScript strict / Tailwind v4) with a **filesystem-first MDX content model**.

## Project guidance (Cline)

Operational guidance is intentionally separated:

- **Workspace Rules (constraints/contracts):** `.clinerules/*.md`
- **Workspace Workflows (procedures):** `.clinerules/workflows/*.md`
- **Reference docs:** `docs/*.md` (vision/roadmap/architecture)

Start here: `README.md` (this file), then `.clinerules/README.md`.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000

Key paths:
- `app/` — Next.js App Router routes
- `content/{locale}/{domain}/{slug}.mdx` — article source files
- `lib/content.ts` — content loader + frontmatter validation
- `components/mdx/` — MDX rendering components

## Core contracts (important)

- URL schema: `/{locale}/{domain}/{slug}`
- Allowed locales: `en`, `id`
- Allowed domains: `qa`, `fpv`, `fishkeeping`

See:
- `.clinerules/README.md` (rules/workflows index)
- `docs/roadmap.md` (phase plan)
- `docs/content-model-and-publishing-workflow.md` (content contract)

## Roadmap status (high-level)

- Phase 1 (Foundation): ✅ implemented
- Phase 2 (Design System & Layout Refinement): ✅ implemented
- Phase 3 (MDX Architecture): ✅ implemented
- Phase 3.5 (Notion → MDX Sync): ✅ implemented

## Notes

This repo intentionally avoids early-phase features like CMS/admin, search, analytics, auth, and heavy animation.
