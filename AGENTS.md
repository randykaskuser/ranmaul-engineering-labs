<!-- BEGIN:nextjs-agent-rules -->
# Repo agent entrypoint (Antigravity / AI agents)

This file is the **single entrypoint** for agents working in this repo.

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `docs/agent/claude-progress.md` for the latest verified state and next step.
3. Read `docs/agent/feature_list.json` and choose the highest-priority unfinished feature.
4. Review recent commits with `git log --oneline -5`.
5. Run `./init.sh`.
6. Run the required smoke or end-to-end verification before starting new work.

If baseline verification is already failing, fix that first. Do not stack new
feature work on top of a broken starting state.

## Working Rules

- Work on one feature at a time.
- Do not mark a feature complete just because code was added.
- Keep changes within the selected feature scope unless a blocker forces a narrow supporting fix.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.

## Required Artifacts

- `docs/agent/feature_list.json`: source of truth for feature state
- `docs/agent/claude-progress.md`: session log and current verified status
- `init.sh`: standard startup and verification path
- `docs/agent/session-handoff.md`: optional compact handoff for larger sessions

## Documentation & Planning

To keep the repository organized, all architectural, planning, and long-term documentation must be placed in the `docs/` directory:

- **`docs/planning/`**: Use this for new feature technical specs, implementation plans, and architecture designs. Create a spec here *before* beginning major, multi-file coding tasks.
- **`docs/roadmaps/`**: Use this for long-term goals, feature roadmaps, and phase completion tracking.
- **`docs/benchmarks/`**: Use this to store baseline performance metrics and tracking files.
- **`docs/agent/`**: Reserved exclusively for AI session state tracking (progress, handoffs, and feature lists).

## Git & Merge Policy

**NEVER merge branches into `main` (or the default branch) automatically or autonomously.**
Even if tests pass and a task is complete, leave the work on the feature branch. You must only merge or push to `main` when the user explicitly commands you to do so. All automated loops or "finishing" skills must stop at committing the code to the local feature branch.

## Definition Of Done

A feature is done only when all of the following are true:

- the target behavior is implemented
- the required verification actually ran
- evidence is recorded in `docs/agent/feature_list.json` or `docs/agent/claude-progress.md`
- the repository remains restartable from the standard startup path

## Temporary Files Policy

The repository root must remain clean.

The following file patterns should never accumulate in the root directory:

- fix*.js
- patch*.html
- test*.js
- temp*.html
- debug*.js

Instead, place temporary work inside:

temporary/
├── patches/
├── experiments/
└── debugging/

Example:
temporary/patches/fix_nav_styles.html
temporary/experiments/new_hero_gradient.html

## File Creation & Shell Escaping

- **Never use PowerShell or Bash string expansion to write scripts.** Attempting to create multiline HTML, JS, or JSON files using `echo` or `cat` with PowerShell here-strings (`@"..."@`) corrupts quotes and syntax.
- **Always use the native `Write` and `Edit` tools** to create, modify, or append to files. This completely bypasses shell escaping issues.

## Root Directory Hygiene

The repository root is reserved for permanent project artifacts only.

Before creating a new script in the root directory, determine whether it belongs in:

- tools/
- temporary/
- tests/
- scripts/

Temporary development scripts must never become permanent root-level files.

At the end of each session, review all newly created root-level files and either:
- move them to their appropriate directory, or
- delete them if no longer needed.

## End Of Session

Before ending a session:

1. Update `docs/agent/claude-progress.md`.
2. Update `docs/agent/feature_list.json`.
3. Record any unresolved risk or blocker.
4. Run validation/preview to make sure nothing is broken.
5. Commit with a descriptive message once the work is in a safe state.
6. Leave the repo clean enough for the next session to run `./init.sh` immediately.
7. Review newly created utility scripts.
8. Move temporary scripts to `temporary/` or delete them if no longer needed.
9. Leave the repository root clean enough for the next session.

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
- `domain`: `qa` | `fpv` | `fishkeeping` | `notes`
- No new top-level categories.
- Tags are flat; avoid taxonomy explosion.

### Frontmatter model (required fields)

Every MDX entry must include:

- `title`, `description`
- `locale` (`en` | `id`)
- `domain` (`qa` | `fpv` | `fishkeeping` | `notes`)
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
