# Roadmap

---

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
- category system
- tag system
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