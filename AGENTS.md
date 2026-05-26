<!-- BEGIN:nextjs-agent-rules -->
# Repo agent entrypoint (Antigravity / AI agents)

This file is the **single entrypoint** for agents working in this repo.

## Global rules (apply to this repo too)

These are user-global rules that apply across all projects (maintained locally, not checked into this repo):

- **Documentation drift prevention**
  - If you modify behavior, update docs describing that behavior in the same task.
  - Keep `README.md` aligned with capabilities and architecture.
  - Prefer removing duplication over maintaining two sources of truth.
- **Engineering principles**
  - Prefer simple, readable solutions.
  - Keep the filesystem understandable.
  - Minimize dependencies.
  - Keep rules vs workflows vs docs separated.
- **Maintainability / anti-overengineering**
  - Don’t build systems you don’t need yet.
  - Avoid framework-building inside the app.
  - Prefer “few files, clear ownership”.

## 0) Non‑negotiables (single sources of truth)

**Do not re-invent rules here.** Follow the authoritative files below:

- Workspace rules (contracts / must-always-be-true):
  - `.clinerules/project-architecture-constraints.md`
  - `.clinerules/roadmap-scope-guardrails.md`
  - `.clinerules/routing-and-taxonomy-contract.md`
  - `.clinerules/frontmatter-and-slug-contract.md`
  - `.clinerules/content-governance.md`
- Workspace workflows (repeatable procedures):
  - `.clinerules/workflows/publish-mdx-article.md`
  - `.clinerules/workflows/bilingual-article-pair-workflow.md`
  - `.clinerules/workflows/content-update-maintenance.md`
  - `.clinerules/workflows/docs-sync-and-roadmap-alignment.md`

Repo documentation (explanatory reference; not enforcement text):

- `README.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/content-model-and-publishing-workflow.md`

Global rules also apply (outside this repo):

- Documentation drift prevention
- Engineering principles
- Maintainability / anti-overengineering

## 1) This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

Before implementing Next.js-specific changes, **read the relevant guide** in:

`node_modules/next/dist/docs/`

Heed deprecation notices.

## 2) Locked repo contracts (quick summary)

These are repeated here only as a **short safety checklist**. The full source of truth remains in `.clinerules/*`.

### Routing + taxonomy (locked)

- Article routes: `/{locale}/{domain}/{slug}`
- `locale`: `en` | `id`
- `domain`: `qa` | `fpv` | `fishkeeping`
- No new top-level categories.
- Tags are flat; avoid taxonomy explosion.

### Frontmatter model (required fields)

Every MDX entry must include:

- `title`, `description`
- `locale` (`en` | `id`)
- `domain` (`qa` | `fpv` | `fishkeeping`)
- `slug` (localized per locale)
- `canonicalGroup` (stable shared id across locales)
- `publishedAt`, `updatedAt`
- `tags` (array)
- `featured` (boolean)
- `draft` (boolean)

Slug stability: **treat published slugs as permanent**.

### Roadmap / scope guardrails (Phase 1)

Do **not** add (unless roadmap/rules are explicitly updated first):

- authentication, DB, Prisma/Supabase/Firebase
- CMS/admin
- analytics, search, RSS
- websockets/real-time
- heavy animations / Framer Motion
- advanced i18n systems

## 3) Default operating mode for agents

- Prefer **Server Components** by default.
- Keep the architecture simple and readable.
- Minimize dependencies.
- Avoid “framework building” inside the app.
- Don’t create large component hierarchies unless duplication is obvious.

## 4) Workflows (agent checklists)

### A) When changing code / behavior

1. Identify impacted routes/components and the user-facing behavior.
2. Make the smallest change that satisfies the requirement.
3. Run the relevant checks (lint/build/tests) if available.
4. **Docs drift prevention:** if behavior/architecture/routing/content model/scope changed, run:
   - `.clinerules/workflows/docs-sync-and-roadmap-alignment.md`

### B) When publishing or editing content (MDX)

Follow:

- `.clinerules/workflows/publish-mdx-article.md`

Key reminders:

- Validate `/{locale}/{domain}/{slug}`.
- Keep writing technical: no fluff, no marketing tone.
- If updating an existing article, update `updatedAt`.
- Ensure internal links are not orphaning the content.

### C) When handling EN ↔ ID equivalents

Follow:

- `.clinerules/workflows/bilingual-article-pair-workflow.md`

### D) When a tool/workflow changes (prevent content drift)

Follow:

- `.clinerules/workflows/content-update-maintenance.md`

### E) When to use repo skills (if your agent runner supports them)

Some tasks should be handled via specialized skills rather than ad-hoc prompting:

- Security / privacy / vulnerability assessment → use the `security-hardening-auditor` skill
  - Output expectation: evidence-based audit report with prioritized findings + explicit assumptions.
- Reorganizing/auditing `.clinerules/*` and docs governance (deduplication, stale guidance) → use the `governance-guardian` skill
  - Goal: one authoritative owner per concept; avoid conflicting sources of truth.
- Creating/modifying skills (evaluation, optimization) → use the `skill-creator` skill.

## 5) Where to put new guidance

- Must-always-be-true constraint → `.clinerules/*.md`
- Step-by-step process → `.clinerules/workflows/*.md`
- Explanatory reference / rationale → `docs/*.md`

Do not duplicate sources of truth across these layers.
<!-- END:nextjs-agent-rules -->
