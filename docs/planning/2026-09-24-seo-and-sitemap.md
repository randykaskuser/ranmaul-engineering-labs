# SEO pass and sitemap (Roadmap Phase 8)

Date: 2026-09-24
Scope: metadata, structured data, sitemap, default share image. No new routes,
no analytics, no RSS (roadmap guardrails).

## Findings (build of `main` at a3087a7)

1. `public/images/og-default.jpg` is a 0-byte file, but article JSON-LD points to it.
2. Pages that set `openGraph` replace the root one (Next merges metadata shallowly),
   so most pages have no `og:image`, no `og:site_name`, and `og:locale` is `en_US`
   on Indonesian pages.
3. Article JSON-LD builds `SITE_URL + coverImage`; four covers are absolute R2 URLs,
   producing `https://ranmaul.comhttps://...`. Two covers are placeholder SVGs
   (`/file.svg`, `/window.svg`), which social networks cannot render.
4. Article JSON-LD author is "Randy M. Portfolio" (the site name), not a person.
5. Home (`/`, `/en`, `/id`), drone portfolio, tags: no canonical, no hreflang.
   `/` and `/en` are the same page with no canonical between them.
6. Drone portfolio title/description are English-only and generic, although it is
   the page that should rank for "jasa drone jabodetabek".
7. Sitemap misses home locales, tools/projects/contact, drone portfolio; every
   index entry uses `lastModified: new Date()`, so it changes on every build.
8. ~65 tag pages with 1-2 articles each are thin, near-duplicate listings.

## Decisions

- One helper, `createPageMetadata(title, description, { path, locale, alternates, image, noindex })`,
  returns complete metadata: canonical, hreflang (+ `x-default`), full Open Graph
  (site name, locale, default image), Twitter card. Every page uses it.
- New 1200x630 `og-default.jpg`, generated once from an existing portfolio photo.
- Home: canonical `/` for both `/` and `/en`; `/id` canonical to itself. JSON-LD
  `WebSite` + `Person`.
- Drone portfolio: localized, keyword-led title/description; JSON-LD `Service` with
  `Offer`s built from the same `DRONES` data the page renders (prices must match).
- Articles: resolve cover URLs correctly, skip SVG covers for share images,
  author/publisher = Person "Randy Maulana", add `inLanguage`.
- Tag pages: `noindex, follow` and left out of the sitemap. Reversible once tags
  have more articles.
- Sitemap: every indexable page with `alternates.languages`; `lastModified` from
  article dates (indexes use their newest article); static pages omit it.
  Excluded: tags, `/cv-randy-maulana` (disallowed in robots.txt), `/create`,
  `/about` (placeholder), `/en` (canonicalized to `/`).

## Verification

- lint, tsc, build; crawl `out/` for broken links.
- Parse every page: one canonical, hreflang pairs point to existing pages,
  `og:image` present and resolvable, JSON-LD parses as JSON.
- Sitemap: every URL exists in `out/`, none is noindex or robots-disallowed.
