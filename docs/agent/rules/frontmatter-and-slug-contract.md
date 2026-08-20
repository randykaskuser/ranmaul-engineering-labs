# Frontmatter + slug contract (Workspace Rules)

This defines the content metadata contract for this repo.

## Localized slug strategy (locked)

Use **localized slugs per locale**.

Examples:

- EN: `/en/fpv/li-ion-range-testing`
- ID: `/id/fpv/uji-jarak-li-ion`

Implication: each locale optimizes keyword intent naturally.

## Canonical grouping (locked)

Translation pairs are related by a stable shared ID:

- `canonicalGroup`: stable shared id across locales (e.g. `fpv-li-ion-range-testing`)

Optional mapping:

- `translationOf`: canonical reference to the source entry when relevant

Principle:

- Localized articles are not machine-translated duplicates; they are independent localized entries that remain conceptually aligned.

## Frontmatter model

Required fields:

- `title`
- `description`
- `locale` (`en` | `id`)
- `domain` (`qa` | `fpv` | `fishkeeping` | `notes`)
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
- `readingTime` (computed later allowed)
- `translationOf`
- `relatedCanonicalGroups`

## Slug stability rule (locked)

Published slugs should be treated as permanent.

Avoid changing URLs unless:

- the original slug is severely incorrect, and
- SEO damage outweighs redirect complexity.
