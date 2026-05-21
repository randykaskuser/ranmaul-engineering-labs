# Notion → MDX Sync (Phase 3.5)

This doc describes the **publishing automation** layer that syncs a Notion database into this repo’s filesystem-first content model.

## Source of truth

- Notion is the authoring UI.
- GitHub repo is the deploy source of truth.
- Output is committed MDX under:
  - `content/{locale}/{domain}/{slug}.mdx`

## Publishing rule

Only pages where `Draft = false` are synced into the repo.

## Required GitHub Actions secrets

Set these in:
`Settings → Secrets and variables → Actions`

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

## Notion database schema (property names)

The sync script expects these property names exactly:

Required:

- `Title` (title)
- `Description` (rich text)
- `Locale` (select: `en` | `id`)
- `Domain` (select: `qa` | `fpv` | `fishkeeping`)
- `Slug` (rich text)
- `CanonicalGroup` (rich text)
- `Tags` (multi-select; must be non-empty)
- `Featured` (checkbox)
- `Draft` (checkbox)
- `PublishedAt` (date)
- `UpdatedAt` (date)

Optional:

- `CoverImage` (rich text; recommended to be a local path like `/media/notion/...` or a stable URL)
- `CoverAlt` (rich text)
- `Series` (rich text)
- `TranslationOf` (rich text)
- `RelatedCanonicalGroups` (multi-select)

## What gets converted

The script converts a minimal, safe block set:

- paragraph
- headings (H1/H2/H3)
- bulleted/numbered lists
- quote
- code blocks
- divider
- image (downloaded to `public/media/notion/...`)
- callout → mapped to MDX `<Note>...</Note>`

Unsupported blocks are skipped (safe rollout).

## Local usage

Dry-run (no writes):

```bash
npm run notion:sync:dry
```

Write changes to `content/`:

```bash
npm run notion:sync
```

CI check mode (fails if repo is out-of-sync):

```bash
npm run notion:sync:check
```
