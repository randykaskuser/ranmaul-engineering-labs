# Notion → MDX Sync (Phase 3.5)

This doc describes the **publishing automation** layer that syncs a Notion database into this repo’s filesystem-first content model.

## Source of truth

- Notion is the authoring UI.
- GitHub repo is the deploy source of truth.
- Output is committed MDX under:
  - `content/{locale}/{domain}/{slug}.mdx`

## Publishing rule

Only pages where `Draft = false` are synced into the repo.

## How to publish a new article (practical workflow)

This is the recommended, low-friction flow to publish via Notion.

### 1) Create

Create a new row/page inside the Notion database.

Recommended: use a database template called **“New Article”** so the required properties are visible and pre-filled.

### Recommended Notion views (pipeline)

Create these views in the Notion database (works on mobile too):

1) **Draft Queue**
- Filter: `Draft = true`

2) **Ready to Publish**
- Filter: `Draft = true`
- Plus required fields “is not empty”:
  - `Locale`
  - `Domain`
  - `Slug`
  - `CanonicalGroup`
  - `Description`
  - `Tags`
  - `PublishedAt`
  - `UpdatedAt`

3) **Published**
- Filter: `Draft = false`

This structure prevents accidental publishing and makes it easy to work from phone/tablet.

### Optional: “Publish” button inside Notion (Blogger-like)

If you want a single obvious action like Blogger’s publish button, Notion can do this with a **Button** property.

Create a new property:

- `Publish` (Button)

Button actions:

1) Set `Draft` → `false`
2) Set `UpdatedAt` → `now`

Recommendation:

- Only give permission to reviewers/admins to press this button.
- Editors keep writing with `Draft=true`.

This keeps the UX “one click publish” while staying permissioned.

### 2) Fill required metadata (before publish)

Required properties (must be present when `Draft=false`):

- `Title`
- `Description`
- `Locale` (`en` | `id`)
- `Domain` (`qa` | `fpv` | `fishkeeping`)
- `Slug` (lowercase, hyphen-separated)
- `CanonicalGroup`
- `Tags` (multi-select, **must not be empty**)
- `Featured` (checkbox)
- `PublishedAt` (date)
- `UpdatedAt` (date)

Optional:

- `CoverImage` (Files & media)
- `CoverAlt`
- `Series`
- `TranslationOf`
- `RelatedCanonicalGroups`

### Recommended template: “New Article”

In your Notion database:

1) Click `New` → `+ New template`.
2) Name it: `New Article`.
3) Pre-fill defaults:
   - `Draft = true`
   - `Featured = false`
   - `Locale` default (optional)
   - `Domain` default (optional)
4) In the template body, add a starter structure:
   - Title line (H1)
   - “Context” section
   - “Constraints” section
   - “Approach” section
   - “Notes / Data” section
   - “Takeaways” section

This makes authoring feel like a blog editor but keeps everything in Notion.

### 3) Write the body

Write the content inside the Notion page body.

Supported blocks (safe subset):

- paragraph
- headings (H1/H2/H3)
- lists (including nested)
- quote
- code blocks
- divider
- image (will be downloaded into this repo)
- callout (will map to `<Note>` or `<Warning>` depending on icon/text)
- toggle (mapped to `<details><summary>...`)

### 4) Publish

Set:

- `Draft = false`

This is the **publish signal**.

#### Security policy (recommended)

To keep authoring secure without building auth into the website:

- Keep the Notion database **private** (not shared publicly).
- Use Notion roles:
  - **Editors** can create/edit drafts (`Draft=true`).
  - **Reviewers/Admins** are the only ones allowed to set `Draft=false`.

This keeps publishing permissioned while still cross-device.

### Bilingual authoring best practice (EN/ID)

- Each locale is a separate MDX entry with a **localized slug**.
- Pair translations using a stable shared `CanonicalGroup`.
- Optional but recommended:
  - `TranslationOf` = canonicalGroup or source slug

Workflow:
1) publish primary locale first (Draft=false)
2) create translation row (Draft=true), keep same `CanonicalGroup`
3) review translation, then publish (Draft=false)

### 5) Wait for sync

The GitHub Actions workflow runs on schedule (every 15 minutes) and will:

- sync the page into `content/{locale}/{domain}/{slug}.mdx`
- commit the MDX + downloaded media into `main`

If you need instant publish, go to GitHub Actions and run the workflow manually:

- Actions → **Notion → MDX Sync** → Run workflow

### Notes / gotchas

- Keep `Draft=true` for incomplete pages.
- The sync is **fail-fast**: if a published page is missing required fields, the workflow should fail.
- Slugs should be treated as permanent after publishing.

### Reviewer checklist (before setting Draft=false)

Use this checklist to keep publishing consistent:

Metadata:
- [ ] `Locale` correct (`en` or `id`)
- [ ] `Domain` correct (`qa`/`fpv`/`fishkeeping`)
- [ ] `Slug` valid (lowercase-hyphen)
- [ ] `CanonicalGroup` set (stable ID shared across translations)
- [ ] `Description` is a clear 1–2 sentence summary
- [ ] `Tags` non-empty and stable naming
- [ ] `PublishedAt` and `UpdatedAt` correct

Content:
- [ ] Title matches content and is editorial (not clickbait)
- [ ] Headings hierarchy is consistent
- [ ] Code blocks render (no screenshots of code)
- [ ] Images (if any) have meaningful captions/alt intent

Bilingual (if applicable):
- [ ] Translation pair uses same `CanonicalGroup`
- [ ] Slugs are localized per locale
- [ ] Publish order decided (primary first, translation later)

### Troubleshooting

If sync fails:

1) Check the GitHub Actions run log (Notion → MDX Sync).
2) Fix the field mentioned in the error (most failures are missing/invalid metadata).
3) Re-run the workflow manually.

Common causes:
- `Draft=false` but required properties are missing
- invalid `Domain` / `Locale`
- empty `Tags`
- invalid `Slug`

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
