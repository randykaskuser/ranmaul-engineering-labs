# Roadmap

---

## Current status (snapshot)

> Status meanings:
> - **Done**: implemented + used in production code paths.
> - **In progress**: partially implemented / needs polish or audit.
> - **Not started**: not implemented yet.

| Phase | Status | Notes |
|---|---|---|
| Phase 1 — Foundation | **Done** | Next.js App Router + TS + base layout + locale routing + dark mode baseline + placeholder pages exist. |
| Phase 2 — Design System & Layout Refinement | **In progress** | Tokens/layout exist, but typography scale + spacing rhythm + editorial width rules + nav polish need final audit to call “Done”. |
| Phase 3 — MDX Architecture | **Done (already present)** | MDX components + content routes + content folder exist in repo. |
| Phase 3.5 — Publishing Automation (Notion → MDX Sync) | **Done (shipped)** | Notion sync script + CI workflow in place; hardened for multi-data-source DBs. |
| Phase 3.6 — Authoring UI (Notion-first) | **In progress** | Repo has guide/docs; Notion-side templates/views are external and need ongoing ops. |
| Phase 3.7 — Security Hardening & Privacy Audit | **Not started** | Run the `security-hardening-auditor` skill against code + CI/CD + content pipeline; ship prioritized fixes without adding new product scope. |
| Phase 4 — Homepage Maturity | **Not started / partial** | Some sections/pages exist, but not yet “mature homepage” per deliverables. |
| Phase 5 — Content Population | **In progress** | Content exists and pipeline works; content volume/coverage is ongoing. |
| Phase 6 — Drone Portfolio Expansion | **Not started / partial** | Placeholder portfolio pages exist; expansion/case-study system not fully built. |
| Phase 7 — Tools & Utilities | **Not started** | Tools pages exist but utilities not built yet. |
| Phase 8 — SEO Optimization | **Not started / partial** | Some metadata exists; sitemap/RSS/structured data not fully implemented. |
| Phase 9 — Ecosystem Expansion | **Not started** | Deferred until content maturity. |

# Phase 1 — Foundation

## Goals

- initialize Next.js project
- configure TypeScript
- configure TailwindCSS
- create scalable folder structure
- create shared layout system
- create responsive navbar/footer
- implement locale-aware routing
- implement simple locale switching
- implement dark mode support
- create placeholder pages
- implement metadata foundation

## Deliverables

- working responsive website
- locale-aware routing
- placeholder bilingual pages
- clean architecture
- production-ready foundation

## Scope Boundary

Phase 1 should ONLY establish:
- scalable architecture
- responsive layouts
- locale routing foundation
- visual baseline

DO NOT implement:
- MDX engine
- article rendering
- search
- analytics
- CMS
- tagging
- RSS
- animations
- advanced i18n systems

---

# Phase 2 — Design System & Layout Refinement

## Goals

- typography system
- spacing rhythm
- reusable containers
- editorial layout refinement
- responsive polish
- dark mode refinement
- reusable section primitives
- navigation refinement

## Deliverables

- polished visual foundation
- reusable layout primitives
- refined responsive behavior
- premium editorial rhythm
- production-quality layout system

## Focus

The platform should start feeling like:
- premium engineering journal
- technical editorial platform
- cinematic creator-engineer showcase

NOT:
- dashboard
- startup landing page
- generic portfolio

---

# Phase 3 — MDX Architecture

## Goals

- implement MDX pipeline
- frontmatter support
- metadata support
- syntax highlighting
- better code block wrapper (readability; copy affordance optional)
- lightweight tag browsing (no search)
- domain index pages (content listing)
- multilingual article architecture

## Deliverables

- scalable article engine
- multilingual article support
- reusable article layouts
- production-ready content publishing workflow

## Content Requirements

Future article publishing should require:
1. creating one MDX file
2. adding frontmatter
3. optional cover image

---

# Phase 3.5 — Publishing Automation (Notion → MDX Sync)

## Purpose

This phase adds an **authoring workflow** on top of the filesystem-first MDX model:

- Notion becomes the editor UI
- GitHub remains the source of truth for deployed content (MDX committed to repo)
- Output stays compatible with **static deploy + CDN caching (Cloudflare-friendly)**

This is **not** a redesign phase. It is a publishing pipeline phase.

## Goals

- define a single Notion database schema for all domains + locales
- implement Notion → Markdown/MDX conversion
- map Notion callouts to MDX `<Note/>` / `<Warning/>` where possible
- media idempotency + cleanup (optional): remove unused downloaded assets safely
- CI hardening (optional): fail clearly on commit/push permission issues + retry strategy
- generate canonical MDX files into the repo under:
  - `website-elabs/website/content/{locale}/{domain}/{slug}.mdx`
- implement media handling with stability in mind:
  - download cover/inline images (Notion URLs may expire)
  - store locally under `website-elabs/website/public/media/notion/...`
- implement **contract enforcement** so publishing stays clean:
  - required fields present when publishing
  - locale/domain allowed values only
  - prevent duplicate routes (`/{locale}/{domain}/{slug}`)
  - bilingual enforcement (EN+ID pair) using a shared `CanonicalGroup`

## Trigger Strategy

Because Notion does not provide a native “publish webhook”, automation should use one of:

- scheduled polling (recommended default): GitHub Actions runs every 5–15 minutes
- external trigger (optional): Zapier/Make/n8n triggers GitHub Actions for near real-time

## Deliverables

- Notion database schema documented (properties + allowed values)
- sync script that:
  - fetches Notion pages
  - converts blocks → MDX
  - writes MDX + media to the correct folders
  - fails CI if the publishing contract is violated
- GitHub Actions workflow that:
  - runs on schedule
  - commits generated content changes back to the repo
  - triggers the deploy pipeline

## Scope Boundary

This phase should NOT add:
- a CMS UI inside the website
- a backend service requirement
- a real-time publish system unless explicitly chosen (external trigger)

---

# Phase 3.6 — Authoring UI (Notion-first)

## Purpose

Provide a **simple, cross-device, secure authoring experience** without adding a CMS/admin panel inside the website.

Notion is the “UI”, GitHub remains the canonical source-of-truth after sync.

## Goals

- define an authoring workflow that works well on mobile/tablet/desktop
- provide a clear “draft → ready → publish” pipeline inside Notion using views + templates
- make publishing safe:
  - only authorized editors can create/modify drafts
  - only reviewers can set `Draft=false`
  - contract violations fail the sync (so bad content cannot silently ship)
- provide a minimal website guide page for editors (checklist + how-to)

## Deliverables

- Notion database template: “New Article” with the required properties visible + ordered
- Notion views:
  - `Draft Queue` (Draft=true)
  - `Ready to Publish` (Draft=true + required fields not empty)
  - `Published` (Draft=false)
- documented bilingual authoring best practice:
  - stable shared `canonicalGroup`
  - localized `slug` per locale
  - optional `translationOf` to link source
- website page: “Create & publish articles” (mobile-friendly reference)

## Scope boundary

This phase should NOT add:
- authentication
- database
- CMS/admin panel inside the website
- real-time publish system

---

# Phase 3.7 — Security Hardening & Privacy Audit

## Purpose

Reduce security and privacy risk early, while the surface area is still manageable.

This is **not** a feature phase; it is a hardening phase.

## Goals

- run an evidence-based audit using the repo skill: `security-hardening-auditor`
- cover:
  - Next.js app attack surface (routing, headers, SSR/CSR boundaries)
  - dependency risk (npm audit / advisories)
  - content pipeline + file writes (`scripts/notion-sync.mjs`)
  - GitHub Actions permissions + secrets exposure
  - any public media download behavior (SSRF / path traversal checks)
- produce a prioritized remediation backlog (severity + priority)
- implement **high-impact / low-risk** fixes only (no new backend systems)

## Deliverables

- security + privacy audit report committed to repo (in docs)
- a small set of targeted fixes (config / code hardening)
- documented assumptions + threat model snapshot

## Scope Boundary

This phase should NOT add:
- authentication
- databases
- new services
- analytics

---

# Phase 4 — Homepage Maturity

## Goals

- premium hero section
- featured categories
- drone portfolio preview
- featured projects
- latest articles section
- refined CTA/footer sections

## Deliverables

- production-quality homepage
- strong creator-engineer positioning
- cinematic FPV presentation layer
- polished editorial pacing

---

# Phase 5 — Content Population

## Goals

Create initial evergreen content:
- QA engineering articles
- FPV engineering articles
- fishkeeping system articles
- drone case studies

## Deliverables

- searchable evergreen content foundation
- architecture stress-tested by real content
- initial SEO surface area

## Important

This phase validates:
- readability
- spacing
- MDX architecture
- responsive behavior
- metadata systems
- long-form article experience

---

# Phase 6 — Drone Portfolio Expansion

## Goals

Expand drone portfolio into:
- cinematic case studies
- technical flight journals
- FPV project showcases
- aerial documentation pages

## Deliverables

- premium portfolio experience
- reusable portfolio architecture
- cinematic showcase system

## Future Portfolio Support

Each future portfolio item should support:
- title
- location
- project description
- embedded video
- image gallery
- drone setup
- shooting conditions
- project goals
- client context

---

# Phase 7 — Tools & Utilities

## Goals

Build lightweight engineering-focused utilities.

Examples:
- battery calculators
- flight time estimators
- YAML/JSON validators
- tank volume calculators
- water change calculators

## Deliverables

- repeat-visitor functionality
- practical engineering utilities
- SEO-supporting utility pages

---

# Phase 8 — SEO Optimization

## Goals

- sitemap
- RSS
- structured metadata
- internal linking
- OpenGraph refinement
- multilingual SEO refinement
- canonical URLs

## Deliverables

- SEO-ready content platform
- scalable indexing structure
- improved search discoverability

---

# Phase 9 — Ecosystem Expansion

## Possible Future Features

ONLY after content maturity:
- YouTube integration
- Giscus comments
- affiliate systems
- sponsor pages
- downloadable templates
- engineering snippets
- newsletter

## Important

Do NOT prioritize ecosystem features before:
- content quality
- architecture maturity
- publishing consistency
- SEO foundation