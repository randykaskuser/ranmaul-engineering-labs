# Session Progress

## 2026-08-19
- Added `next-themes` and `lucide-react` dependencies.
- Added `<ThemeProvider>` in `app/layout.tsx`.
- Updated `styles/tokens.css` with `[data-theme='dark']` block to support manual dark mode toggle.
- Created `<ThemeToggle>` component in `components/layout/theme-toggle.tsx`.
- Refactored `<SiteHeader>` in `components/layout/site-header.tsx`:
  - Added new `<ThemeToggle>` component.
  - Moved translation toggle outside the mobile dropdown menu.
  - Restructured mobile and desktop layouts for clearer accessibility.
- Fixed React warnings related to `useTheme` hydration and unescaped entities in CV component.
- Added `eslint-plugin-react` to fix CI linting errors caused by missing dependencies.
- Fixed 11 ESLint warnings across components and scripts.
- Cleaned up root directory by moving script files to temporary/scripts/ and removing unused directories.

- Refactored header navigation:
  - Replaced flat `NAV_LINKS` with grouped structure in `lib/site.ts`.
  - Built custom mega-dropdown component (`<NavDropdown>`) using `framer-motion`.
  - Grouped navigation into "Engineering" and "Explore" dropdowns on desktop.
  - Implemented accordion-style collapsible groups in mobile menu.
  - Added Lucide icons to dropdown items.

- Refactored footer layout:
  - Implemented 4-column responsive CSS grid layout matching the main navigation groups (Engineering, Explore, Elsewhere).
  - Built custom `<LinkedinIcon>` and `<InstagramIcon>` inline SVG components.
  - Added subtle hover interactions with `<ArrowUpRight>` on links.
  - Simplified bottom bar.

## 2026-08-20
- Completed Drone Services Refactor (Issue #26):
  - Created `<DroneServicesSection>` component displaying 3 service tiers.
  - Inserted new section into `app/drone-portfolio/page.tsx` above Equipment.
  - Refactored `app/page.tsx` home page FPV teaser to act as a CTA funnel.
  - Fixed hardcoded string bug in `app/page.tsx` by restoring `contentDict` translation keys for English and Indonesian.
- Fixed Drone Portfolio issues:
  - Added proper localized routing (`app/[locale]/drone-portfolio/page.tsx`) wrapping the base page, so `/en/drone-portfolio` and `/id/drone-portfolio` work properly.
  - Adjusted `app/drone-portfolio/page.tsx` to handle route params resolution safely.
  - Duplicated the english drone content into `content/portfolio/id/` so the indonesian version of the site has data to show.
  - Fixed location metadata mismatches in `content/portfolio/en/` portfolio mdx files (Batang Rest Area KM 371, Pandawa Beach, and Ciwidey Highlands now show correct locations).
  - Updated `<VideoGallery>` in `components/portfolio/video-gallery.tsx` to use the `<ConicHoverCard>` component so Instagram Reel thumbnails and styling match the homepage.
  - Fixed Journal "Latest Stories" in `app/[locale]/drone-portfolio/page.tsx` missing thumbnails by adding proper Next.js `<Image>` mapping to `story.coverImage`.

## 2026-09-15
- Full-repo security review (public-repo readiness). Report: `docs/security-review-2026-09.md`.
- Confirmed repo is already public on GitHub; no secrets found in HEAD or in any
  historical blob across all refs. `.env` has never been committed.
- Remediated (all verified by `npm audit` + `npm run build`):
  - `next` 16.2.11 -> 16.3.3 (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4). Neither
    advisory is exploitable under `output: 'export'`; bumped for currency.
  - `sharp` override ^0.35.3 -> ^0.35.4 (GHSA-rgj7-g3m4-5g8c). The override itself
    was pinning it below the patch.
  - `js-yaml` -> 3.15.2 / 4.3.2 via `npm audit fix` (GHSA-2883-xcg3-v3hh). A v4
    override was attempted first and reverted: it breaks `gray-matter`, which
    calls the v3-only `yaml.safeLoad`.
  - `peter-evans/create-pull-request@v7` -> SHA-pinned to v7.0.9
    (`84ae59a...`), matching the other actions in the workflow.
  - JSON-LD injection in `app/[locale]/[domain]/[slug]/page.tsx`: `JSON.stringify`
    does not escape `</script>`; now escapes `<` as `<`.
- Verification: `npm audit` reports 0 vulnerabilities; `npm run build` succeeds;
  built JSON-LD still parses as valid JSON with no literal `<`.
- Corrected two drifted claims in `docs/security-hardening-phase-3-7.md`
  (headers are in `public/_headers`, not `next.config.ts` `headers()`; the
  `react/no-danger` ESLint rule was never actually added).
- Follow-up commit closed the four remaining hygiene/disclosure items:
  - `SECURITY.md` rewritten: GitHub private vulnerability reporting as the
    preferred channel, `randy.maulana91@gmail.com` (already public via the CV
    page, so no new exposure) as fallback, plus a scope section and response
    expectations. NOTE: private vulnerability reporting must still be enabled in
    repo settings before that channel works.
  - `.claude/settings.local.json` untracked and added to `.gitignore`. It
    pre-approved `git push *` / `winget install *`, which any forker inherited.
    Still present on disk; local dev unaffected.
  - `.wrangler/` untracked (25 files, ~13 MB). Blobs were inspected first and
    are ordinary media, not secrets. The existing gitignore rule now applies.
  - Deleted six dead root files (`describe_image.py`, `parse_image.py`,
    `fix-notion.mjs`, `package.json.tmp`, `playwright-base-b64.txt`, and a
    mangled-filename agent transcript). Nothing referenced them. Tracked root is
    now permanent artifacts only, per AGENTS.md.
  - Re-verified after cleanup: build green, lint 0 errors (3 pre-existing
    unused-import warnings), `npm audit` 0 vulnerabilities.
- Still open, owner action outside the repo (report §7): enable private
  vulnerability reporting; reconcile GitHub's Dependabot count (7 alerts on
  `main` at push time) against the clean `npm audit` on this branch; enable
  secret scanning; consider branch protection. These need GitHub repo-settings
  and Dependabot APIs; no MCP tool exposes them and direct HTTP to the GitHub
  API is blocked in the agent session, so they must be done in the GitHub UI.
- CSP recommendation REVERSED after measurement (report §9). Promoting the
  existing Report-Only policy to enforcing would BREAK the site: the build emits
  520 inline script blocks across 112 pages (next-themes anti-flash script + RSC
  hydration payload), and `script-src 'self'` blocks all of them. Verified by
  serving `out/` with the policy as a real enforcing header and loading it in
  Chromium: 9 `script-src-elem` violations with the current policy, 0 with
  `script-src 'self' 'unsafe-inline'`. Nonces need a server (none exists) and
  hashes would change every build. Left as an owner decision, not applied.
- Deleted files remain readable in git history. Not rewritten: none contained a
  credential, only a local Windows username path and a Notion data-source ID.

## 2026-09-24
- Site correctness fixes (spec: `docs/planning/2026-09-24-site-link-and-seo-fixes.md`):
  - Footer section links now locale-aware (`LocalizedLink`, `localizeHref()` in `lib/site.ts`).
  - Homepage "MDX Components" card no longer links to the unpublished `notion-sync-smoke-test`; points to `/projects`.
  - EN/ID toggle: translation map built in `app/layout.tsx` at build time; replaced effect-based `TranslationSetter`. Tags and English-only pages fall back to existing pages.
  - `<html lang="id">` on Indonesian pages via `scripts/set-html-lang.mjs` (npm `postbuild`) + `HtmlLang` client component.
  - `generateMetadata` for domain index, tags index, and tag pages. Home uses absolute site title.
  - MDX body `h1` renders as `h2` (Notion bodies repeat the title).
  - Removed `redirect()` stub pages (unsupported in static export); added `public/_redirects`.
- Verification: `npm run lint` (0 errors, 3 pre-existing warnings), `npm run build`, crawl of `out/`:
  0 broken internal links (was 55 unique), 0 articles with 2 h1 (was 13), 49/49 `/id` pages `lang="id"`.
  `wrangler pages dev out`: legacy URLs return 301. Chromium: toggle EN->ID article works, lang updates on client nav.
- Open risks:
  - `postbuild` only runs if Cloudflare's build command is `npm run build`. If it runs `next build` directly, `/id` pages keep `lang="en"` (links still fine).
  - `init.sh` referenced in AGENTS.md does not exist.
  - Duplicate tag casing in content (`Maintenance` vs `maintenance`).
  - Contact/About/Projects/Tools are still placeholders (section 2 of the audit).

## 2026-09-24 (b)
- Tools page: DevSpace (download links to GitHub releases) and QA Agent Skills (plugin install).
- Projects page: Notion -> MDX pipeline and this site. PrepAI, Lapak AI, ViralClipper excluded (private; owner declined PrepAI/Lapak AI).
- Contact page: Instagram primary; WhatsApp only for drone booking.
- Drone services: removed placeholder "From Rp X" prices; each card opens WhatsApp with a pre-filled quote message (`whatsappLink()` in `lib/site.ts`).
- WhatsApp/Instagram/GitHub URLs now live in `lib/site.ts` only.
- Verification: lint 0 errors (3 pre-existing warnings), build, crawl 0 broken links, Chromium at 390px: no horizontal scroll on /tools, /contact.
- Pending owner input: Personal Butler case study (source repo is on company GitLab; write-up must use only owner-approved, company-free facts). Real drone prices if they want them public.
- Drone pricing: Air 3S Rp900.000/battery, 3 batteries Rp2.500.000; Neo 2 standalone Rp650.000/visit (2 batteries, pilot on site max 3h; based on owner-provided Neo 1 reference of Rp550.000/visit in Surabaya); editing Rp300.000–500.000/clip. FPV removed from services and equipment (owner not comfortable offering it). Image placeholders per drone (set `image`, files in public/images/drones/).
- Projects: Personal Butler case study added, generic only (built for work; no company, tool, colleague names, screenshots or repo link).
- Homepage hero: "Drone Pilot & QA Engineer." (was "FPV Cinematic Pilot"); kicker "Certified drone pilot · Jabodetabek" to avoid repeating the title. Drone photos: owner will provide later.

## 2026-09-24 (c)
- Added `init.sh` (AGENTS.md startup path): Node >= 20 check, `npm install`, `npm run lint`, `npm run build`; `RUN_START_COMMAND=1` starts dev server. Based on the template in the owner's other repos; the butler repo is on company GitLab and was not reachable. Verified: `./init.sh` exits 0.
- CV: GitHub link fixed to github.com/randykaskuser and now shown next to LinkedIn; Grab Senior QA period corrected to OCT 2019 - MAY 2026 (was APR 2017, overlapping KUDO). Start month is inferred from the KUDO end date; owner to confirm.
- Drone: Neo 2 4-battery package Rp1.100.000 (4 batteries in one visit, pilot on site max 4h; saves Rp200.000 vs 2 visits). Price is Claude's proposal, mirroring the Air 3S Rp200.000 bundle saving.
- Resolved: the "init.sh missing" risk from the 2026-09-24 entry.
- Follow-up (same day): owner asked to ignore the CV date overlap -> Grab Senior QA period reverted to APR 2017 - MAY 2026 (GitHub link fix kept). Neo 2 bundle capped at 3 batteries (owner's max): "Paket 3 baterai" Rp850.000 (per-visit Rp650.000 + 3rd battery Rp200.000; price is Claude's proposal).
- Tools, Projects, Contact are now bilingual at /{locale}/tools|projects|contact (copy via `Localized` + `pick()` in lib/site.ts); old /tools, /projects, /contact 301 to /en/... in public/_redirects. Verified: build, tsc, crawl 0 broken links, /id pages lang="id" (52/52), toggle /id/x <-> /en/x, redirects 301 via wrangler, 390px no horizontal scroll.
- Neo 2 flight-time estimates added (owner OK with Rp850.000 bundle): ~8–10 min per battery landing at ~30% (DJI spec 19 min; reviews report 11–16 min real use on a full battery). Per visit ~16–20 min total, 3-battery ~24–30 min. Notes box explains real-world vs DJI spec for both drones.

## 2026-09-24 (d) — SEO pass and sitemap
- Spec: `docs/planning/2026-09-24-seo-and-sitemap.md`.
- `lib/page-metadata.ts`: `createPageMetadata()` now returns canonical, hreflang (+ x-default), full Open Graph (site name, locale, image) and Twitter card. Needed because Next.js replaces a parent's `openGraph` entirely when a page sets its own.
- `public/images/og-default.jpg` was a 0-byte file; replaced with a 1200x630 image rendered from `portfolio/coastal-topdown-web.jpg`.
- Home: EN/ID titles with name + role (+ "Jasa Drone Jabodetabek" in ID); `/en` canonical -> `/`; JSON-LD WebSite + Person (`components/seo/json-ld.tsx`).
- Drone portfolio: localized keyword titles/descriptions; JSON-LD Service with Offers generated from `DRONES` (same data the page renders).
- Articles: JSON-LD image URL bug fixed (R2 covers produced `https://ranmaul.comhttps://...`); SVG covers fall back to the default share image; author/publisher = Person; `inLanguage`; `x-default` hreflang.
- Section indexes: real descriptions per domain and locale. Tag pages: `noindex, follow`.
- `app/sitemap.ts`: 38 URLs (home, localized pages, section indexes, articles) with hreflang alternates; lastmod from article dates (no more `new Date()` on every build). Excludes tags, CV, /create, /about, /en.
- Verification: lint 0 errors, tsc, build; scripted check over 109 pages (canonical/hreflang targets exist, og:image present, JSON-LD parses, sitemap URLs exist and are indexable): 0 problems; link crawl: 0 broken.
- Owner actions: submit https://ranmaul.com/sitemap.xml in Google Search Console; replace `/file.svg` and `/window.svg` article covers with real images.

## 2026-09-25
- Dark sections on /drone-portfolio in light mode: Tailwind v4 `dark:` defaulted to `prefers-color-scheme`, while the site theme is `data-theme` (next-themes). Added `@custom-variant dark` bound to `[data-theme=dark]` in `app/globals.css`. Verified in Chromium: OS dark + site light -> light; OS light + site dark -> dark; system mode follows OS.
- Drone hero carousel: 4 of 9 featured items are videos with no image and rendered as black slides. Hero now takes featured items with an image only (5 slides, all images load).
- Placeholder SVG covers (`/file.svg`, `/window.svg`) on 4 articles replaced with generated 1600x900 covers in `public/assets/covers/` (EN/ID per article); `updatedAt` bumped to 2026-09-25. (Later confirmed: these articles are not in Notion, so a re-sync does not touch them.)
- Verification: lint 0 errors, build, SEO check 0 problems, crawl 0 broken links.
- Follow-up: the 4 generated covers are now hosted on R2 (`elabs-images` bucket, same as other article covers), rendered with Cloudflare Browser Rendering and uploaded via the Cloudflare API: `https://pub-8985a094178a4352b0af0536c390a51b.r2.dev/<article-slug>.jpg`. MDX `coverImage` points there; `public/assets/covers/` removed. Verified in Cloudflare: 1600x900 JPEG, image/jpeg, sizes within 0.5% of the local renders; title layout inside frame. Correction: these 4 articles are not in the Notion database (it only has the Channa and Cloudy Eye articles), and notion-sync only writes files for Notion pages (no delete/prune logic), so no Notion update is needed.
