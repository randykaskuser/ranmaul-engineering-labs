# Design: Add `notes` Domain + Layoff Article (Bilingual)

**Date:** 2026-08-19
**Status:** Approved
**Scope:** Add a new `notes` domain to the site taxonomy + publish a bilingual article pair about post-layoff actions.

## Context

The site currently supports three domains: `qa`, `fpv`, `fishkeeping`. All are specific hobby/professional niches treated as systems to debug and tune.

The author wants to publish a practical guide article about what to do after a layoff. This doesn't fit any existing domain. A new catch-all domain `notes` will house one-off or infrequent content outside the core three niches.

**Why `notes`:** The name is intentionally low-commitment. It doesn't promise a specific topic category, so it won't look hollow with 1-2 articles. It fits the "engineering journal" identity — engineers keep notes.

## Part 1: Add `notes` Domain

### Contract Changes (must land first)

| File | Change |
|---|---|
| `.clinerules/routing-and-taxonomy-contract.md` | Add `notes` to allowed domain list |
| `.clinerules/frontmatter-and-slug-contract.md` | Add `notes` to domain enum |
| `AGENTS.md` | Update domain list in "Routing + taxonomy" section |

### Code Changes

| File | Change |
|---|---|
| `lib/content.ts` | Add `"notes"` to `DOMAINS` array (line ~14) |
| `lib/site.ts` | Add nav entry `{ label: "Notes", href: "/notes" }` — last position |
| `components/layout/site-header.tsx` | Add `"/notes"` to `localizedDomains` array |
| `scripts/notion-sync.mjs` | Add `"notes"` to DOMAINS Set |
| `app/(static)/create/page.tsx` | Add `notes` to domain list in UI |

### Content Directories

Create:
- `content/en/notes/`
- `content/id/notes/`

### Routing

No new route files needed. `app/[locale]/[domain]/page.tsx` and `app/[locale]/[domain]/[slug]/page.tsx` already use dynamic `[domain]` param validated against the `DOMAINS` constant. Adding `"notes"` to `DOMAINS` makes `/en/notes/*` and `/id/notes/*` work automatically.

### Nav Order

QA → FPV → Fishkeeping → **Notes** (last, catch-all position).

## Part 2: Bilingual Article Pair

### Indonesian Article

- **File:** `content/id/notes/4-hal-setelah-kena-layoff.mdx`
- **Title:** 4 Hal yang Harus Kamu Lakukan Setelah Kena Layoff
- **Slug:** `4-hal-setelah-kena-layoff`
- **Route:** `/id/notes/4-hal-setelah-kena-layoff`

### English Article

- **File:** `content/en/notes/4-things-after-layoff.mdx`
- **Title:** 4 Things You Must Do After Getting Laid Off
- **Slug:** `4-things-after-layoff`
- **Route:** `/en/notes/4-things-after-layoff`

### Shared Frontmatter

| Field | ID | EN |
|---|---|---|
| `locale` | `id` | `en` |
| `domain` | `notes` | `notes` |
| `canonicalGroup` | `4-things-after-layoff` | `4-things-after-layoff` |
| `draft` | `true` | `true` |
| `featured` | `false` | `false` |
| `tags` | `["career", "layoff"]` | `["career", "layoff"]` |
| `publishedAt` | `2026-08-19` | `2026-08-19` |
| `updatedAt` | `2026-08-19` | `2026-08-19` |

### Article Structure

Both articles follow the same structure but are independently written (not literal translations):

1. **Intro** — Brief context on layoffs in tech. 2-3 sentences. No emotional padding.
2. **Step 1** — What to do, why, how. Actionable.
3. **Step 2** — Same format.
4. **Step 3** — Same format.
5. **Step 4** — Same format.
6. **Closing** — 1-2 sentences. No motivational cliches.

### Tone

Practical guide. Straightforward, actionable. Consistent with the site's practitioner voice but not forced into an "engineering systems" framing. The author is a QA engineer writing about a real career event — the credibility comes from the practitioner angle, not from metaphors.

### Content Note

ID article draft is ready (provided by author). The 4 steps cover: (1) Klaim JHT BPJS Ketenagakerjaan, (2) Jaminan Kehilangan Pekerjaan (JKP), (3) BPJS Kesehatan status, (4) Paklaring + document backup. EN version will be independently written based on the same content — not a literal translation. Both published as `draft: true` for author review.

## Out of Scope

- Domain listing page redesign
- SEO metadata for `notes` domain beyond defaults
- Social/OG images for the article
- Any other articles in the `notes` domain

## Risks

- **Empty domain page:** `/en/notes` and `/id/notes` will show only 1 article each. Acceptable — `notes` is intentionally low-volume.
- **Scope creep:** `notes` could become a dumping ground. Mitigated by the site's strict content governance (no fluff, no marketing tone, practitioner voice required).

## Implementation Order

1. Update contracts (3 files)
2. Update code (5 files)
3. Create content directories
4. Write ID article MDX
5. Write EN article MDX
6. Build verification
