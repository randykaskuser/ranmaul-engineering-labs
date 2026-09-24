# Site link and SEO correctness fixes

Date: 2026-09-24
Scope: bug fixes only. No new features, routes, or dependencies.

## Problem

A crawl of the static export (`out/`, 112 pages) found:

1. Footer links `/qa`, `/fpv`, `/notes` 404 on every page. The header prefixes
   these with the locale; the footer does not.
2. Homepage "MDX Components" card links to `/{locale}/qa/notion-sync-smoke-test`,
   which is not published.
3. The EN/ID toggle points to pages that do not exist:
   - Articles: the translation URL is set in a client effect, so the static HTML
     contains a naive `/en` <-> `/id` swap. EN and ID slugs differ, so it 404s.
   - Tags: tag names are localized, so `/en/tags/x` has no `/id/tags/x`.
   - English-only pages (`/about`, `/contact`, ...) link to `/id/about` etc.
4. `/id/*` pages render `<html lang="en">`.
5. 79 pages share the default title (domain indexes, tag pages, home).
6. 13 articles render two `<h1>` because the MDX body starts with `# Title`.
7. `/qa-lab`, `/fpv-lab`, `/fishkeeping`, `/drone-portfolio` use `redirect()`,
   which static export does not support. They emit an empty error shell.

## Decisions

- **Locale-aware links:** one helper `localizeHref()` in `lib/site.ts`, used by the
  header, footer (via a small client `LocalizedLink`), and homepage.
- **Language toggle:** the root layout (server) builds a map of article path ->
  translated path at build time and passes it to `TranslationProvider`. The
  header reads it synchronously, so the static HTML is correct. Fallbacks:
  locale-prefixed pages up to 2 segments swap the locale; deeper pages without a
  translation go to the other locale's section index; English-only pages go to
  the other locale's home. Replaces the effect-based `TranslationSetter`.
- **`lang` attribute:** the root layout cannot know the locale in a static
  export. Moving to per-locale root layouts would force a full page reload on
  every navigation between `/` and `/{locale}/*`, so it was rejected. Instead:
  a client `HtmlLang` component keeps `lang` right after navigation, and a
  `postbuild` script sets `lang="id"` in the static HTML under `out/id/`.
- **MDX `h1`:** articles are synced from Notion, so editing MDX would be
  overwritten. MDX `h1` renders as `h2` instead.
- **Legacy paths:** delete the redirect stub pages and add `public/_redirects`
  (Cloudflare Pages) with 301s for `/qa-lab`, `/fpv-lab`, `/fishkeeping`,
  `/drone-portfolio`, `/qa`, `/fpv`, `/notes`.

## Verification

- `npm run lint`, `npm run build`.
- Re-run the crawl: no broken internal links, `/id/*` has `lang="id"`, no
  duplicate default titles on domain/tag pages, one `<h1>` per article.
