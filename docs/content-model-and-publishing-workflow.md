# Content Model & Publishing Workflow (Pre-Phase 3 MDX)

Status: **Locked before MDX engine implementation**

Purpose:
- Prevent expensive migration after MDX architecture starts.
- Lock permanent decisions for URL, slug, metadata, taxonomy, and publishing flow.

---

## 1) URL Philosophy (Locked)

All article routes follow:

`/{locale}/{domain}/{slug}`

Examples:
- `/en/qa/reducing-mobile-e2e-runtime`
- `/en/fpv/li-ion-range-testing`
- `/id/fpv/uji-jarak-li-ion`

Rules:
- `locale`: `en` | `id`
- `domain`: `qa` | `fpv` | `fishkeeping`
- `slug`: lowercase, hyphen-separated, no dates in URL
- URL should describe problem/topic, not publishing chronology

Rationale:
- Human-readable
- SEO-friendly
- Scales cleanly with bilingual long-form content

---

## 2) Localized Slug Strategy (Locked: Option A)

Use **localized slugs per locale**.

Examples:
- EN: `/en/fpv/li-ion-range-testing`
- ID: `/id/fpv/uji-jarak-li-ion`

Implications:
- Each locale can optimize keyword language naturally.
- Requires explicit mapping between translation pairs.

Required mapping fields (frontmatter-level concept):
- `canonicalGroup`: stable shared ID across locales (e.g. `fpv-li-ion-range-testing`)
- `locale`: `en` | `id`
- `translationOf` (optional): canonical reference to source entry when relevant

---

## 3) Taxonomy Model (Locked)

Top-level domains are fixed to:
- `qa`
- `fpv`
- `fishkeeping`

No extra top-level categories.

Detail classification uses **tags** only.

Tag examples:
- QA: `appium`, `playwright`, `ci`, `flaky-test`, `test-architecture`
- FPV: `elrs`, `long-range`, `li-ion`, `tuning`, `blackbox`
- Fishkeeping: `filtration`, `water-chemistry`, `maintenance`, `troubleshooting`

Governance:
- Keep tags flat (no nested tag trees)
- Prefer stable, reusable tag names
- Avoid category explosion via subcategories

---

## 4) Featured Content Philosophy (Locked)

Only feature content with strong technical value.

Eligible:
- Deep experiments
- Troubleshooting investigations
- Engineering comparisons
- Decision breakdowns with constraints/trade-offs

Not eligible:
- Random updates
- Personal diary-style entries
- Light announcements without technical depth

Featured rubric (minimum 3/4):
1. Real technical problem/context
2. Documented reasoning and constraints
3. Reproducible method or actionable framework
4. Practical takeaway applicable by technical readers

---

## 5) Evergreen Content Priority (Locked)

Prioritize content that remains useful over long periods.

Prefer:
- troubleshooting
- comparisons
- workflows
- experiments
- technical reasoning
- system design decisions

Avoid:
- trend-chasing
- short-lived announcements
- news-style posting

Rationale:
- stronger long-term SEO quality
- better knowledge compounding
- higher repeat-visit value for technical readers

---

## 6) Canonical Philosophy (Locked)

Localized articles are independent localized entries, not machine-translated duplicates.

Each locale version:
- may differ in phrasing
- may optimize for locale-specific terminology
- should remain conceptually aligned through `canonicalGroup`

Cross-locale linking should exist where equivalent entries are available.

Canonical handling principles:
- prevent duplicate confusion by keeping locale-specific URL + metadata explicit
- preserve conceptual grouping through `canonicalGroup`
- prioritize semantic equivalence, not literal sentence-level translation

### Translation automation note (Phase 3.55)

If translation automation is enabled (ID → EN via OpenRouter), it must still honor the canonical philosophy:

- EN entries are grouped to their ID source via the same stable `canonicalGroup`.
- EN `slug` is localized and may differ from ID.
- The auto-generated EN content is a starting point; it may later be edited for better localization.

---

## 7) Media Governance (Locked)

Default cover policy:
- Preferred ratio: **16:9**
- Optional alternate for specific editorial needs: **4:3**

Prefer:
- compressed media
- meaningful captions
- technically relevant visuals
- diagrams/screenshots that support understanding

Avoid:
- decorative media overload
- oversized galleries without context
- repetitive cinematic filler

Rules:
- One clear cover per article
- Avoid visual inconsistency from mixed random aspect ratios
- Optimize images for web delivery (compressed, responsive variants later in implementation)

Gallery policy (future MDX components):
- Keep layout consistent within article type
- Prioritize narrative clarity over decorative density

---

## 8) Code Block Philosophy (Locked)

For QA-heavy technical content:
- Default: no forced line-wrap for code blocks
- Horizontal overflow allowed
- Mobile must support smooth horizontal scrolling
- Syntax theme must align with site dark/light modes
- Copy-button is optional and can be added after baseline MDX stability

Goal:
- Preserve code integrity and readability across screen sizes

---

## 9) Article Length Philosophy (Guideline)

Positioning prioritizes deep, documented, searchable writing.

Suggested tiers:
- **Field Note**: 800–1400 words
- **Technical Guide**: 1800–3000 words
- **Case Study / Comparison**: 2500+ words

Notes:
- Depth > frequency
- Prioritize clarity, evidence, and decision trace

---

## 10) Recommended Article Structure (Convention)

Suggested structure for technical articles:
1. Context / Problem
2. Constraints
3. Investigation / Experiment
4. Findings
5. Trade-offs
6. Final Decision
7. Practical Takeaways

Not every article must strictly follow this order,
but technical reasoning should remain traceable.

---

## 11) Frontmatter Model (Pre-Implementation Contract)

Required fields:
- `title`
- `description`
- `locale` (`en` | `id`)
- `domain` (`qa` | `fpv` | `fishkeeping`)
- `slug`
- `canonicalGroup`
- `publishedAt`
- `updatedAt`
- `tags` (array)
- `featured` (boolean)
- `draft` (boolean)

Optional fields:
- `coverImage`
- `coverAlt`
- `series`
- `readingTime` (can be computed later)
- `translationOf`
- `relatedCanonicalGroups`

---

## 12) Publishing Workflow (Locked)

### Step 1 — Draft
- Pick locale and domain
- Choose slug according to locale keyword intent
- Assign canonicalGroup
- Write structured draft with evidence and reasoning

### Step 2 — Technical Review
- Verify claims, configs, and reproducibility
- Ensure troubleshooting/decision trail is explicit

### Step 3 — Editorial Review
- Check title clarity, metadata quality, and readability
- Validate tags and taxonomy consistency

### Step 4 — Publish
- Set `draft: false`
- Confirm internal links and related content references

### Step 4.5 — Auto-translation (optional pipeline)

If configured, after an ID page is published and synced, the pipeline can auto-create an EN peer entry:

- Source: ID entry (`locale=id`, `draft=false`)
- Target: EN entry (`locale=en`, `draft=false`)
- Required link:
  - same `canonicalGroup` across both locales
  - `translationOf` may be set to the source `canonicalGroup` for traceability

This step is a publishing automation feature and should not require a CMS/admin inside the website.

### Step 5 — Maintenance
- Update article when workflows/tools change
- Keep `updatedAt` accurate
- Preserve slug permanence (avoid URL churn)

---

## 13) Slug Stability Rule (Locked)

Published slugs should be treated as permanent.

Avoid changing URLs unless:
- the original slug is severely incorrect
- SEO damage outweighs redirect complexity

Preserve stable long-term URLs whenever possible.

---

## 14) Writing Quality Rule (Locked)

Avoid:
- generic AI-style filler
- exaggerated marketing language
- shallow summaries
- keyword stuffing

Prioritize:
- concrete reasoning
- technical clarity
- evidence-backed statements
- practical usefulness

---

## 15) Internal Linking Rules (Pre-MDX)

- Prefer contextual links to related experiments/case notes
- Link by conceptual relevance, not only same domain
- EN ↔ ID equivalent articles should be cross-linked where available
- Avoid orphan articles (every published piece should link to or from at least one relevant entry)

---

## 16) Out of Scope for This Document

This file does **not** implement MDX engine mechanics.

Out of scope (Phase 3+ implementation work):
- MDX parser/pipeline wiring
- dynamic route code
- syntax highlighter integration details
- search indexing
- CMS or automation tooling

This document is a **decision contract** to make Phase 3 implementation safe.
