# Engineering Labs (website)

Technical editorial platform (Next.js App Router / TypeScript strict / Tailwind v4) with a **filesystem-first MDX content model**.

## Project guidance (agents)

Operational guidance is intentionally separated:

- **Agent entrypoint:** `AGENTS.md` (`CLAUDE.md` imports it)
- **Workspace Rules (constraints/contracts):** `docs/agent/rules/*.md`
- **Workspace Workflows (procedures):** `docs/agent/workflows/*.md`
- **Session state:** `docs/agent/feature_list.json`, `docs/agent/claude-progress.md`
- **Reference docs:** `docs/*.md` (vision/roadmap/architecture)

Start here: `README.md` (this file), then `AGENTS.md`.

## Getting Started

Install, lint, build, and smoke-check in one step (Node 20+):

```bash
./init.sh
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000

There is no unit or e2e test suite. `./init.sh` runs `scripts/smoke.mjs` on the
static export: key routes exist, internal links resolve, `/id` pages have
`lang="id"`. CI (`.github/workflows/verify.yml`) runs the same script on every PR.

## Deployment (Cloudflare Pages)

The project is built as a **pure Static HTML Export** and deployed via Cloudflare Pages. 

```bash
# Preview build locally
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

Key paths:
- `app/` — Next.js App Router routes
- `content/{locale}/{domain}/{slug}.mdx` — article source files
- `lib/content.ts` — content loader + frontmatter validation
- `components/mdx/` — MDX rendering components

## Core contracts (important)

- URL schema: `/{locale}/{domain}/{slug}`
- Allowed locales: `en`, `id`
- Allowed domains: `qa`, `fpv`, `fishkeeping`, `notes`

See:
- `docs/agent/rules/README.md` (rules/workflows index)
- `docs/roadmap.md` (phase plan)
- `docs/content-model-and-publishing-workflow.md` (content contract)

## Roadmap status (high-level)

- Phase 1 (Foundation): ✅ implemented
- Phase 2 (Design System & Layout Refinement): ✅ implemented
- Phase 3 (MDX Architecture): ✅ implemented
- Phase 3.5 (Notion → MDX Sync): ✅ implemented
- Phase 3.6 (Authoring UI / Notion-first): ✅ implemented (see `/create`)

## Authoring (for editors)

- Open `http://localhost:3000/create` (in dev) for the quick checklist.
- Canonical reference: `docs/notion-sync.md`

## Notes

This repo intentionally avoids early-phase features like CMS/admin, search, analytics, auth, and heavy animation.
