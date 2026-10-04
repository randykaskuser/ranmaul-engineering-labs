# Drone portfolio: interactive Flight Map

Date: 2026-10-04
Status: spec, not implemented
Scope: replace the "Interactive Map Coming Soon" placeholder in
`app/[locale]/drone-portfolio/page.tsx` with a satellite map of flown locations,
plus a synced location list (reference: user mockup, "Flight Map" with pins,
popup card, filter chips, zoom, recenter, side list).

## Context (current state)

- The section is a grey `aspect-[21/9]` box with placeholder text. No map code,
  no map dependency.
- Portfolio items already live in `content/portfolio/{en,id}/*.mdx`, read by
  `lib/portfolio.ts`. Photo items already have a `location` text field. Video
  items (reels) do not.
- The site is a static export (`output: 'export'`) on Cloudflare Pages. No server,
  no runtime env secrets.
- `public/_headers` sets `Permissions-Policy: geolocation=()`, so browser GPS is
  blocked site-wide. CSP (report-only) already allows `img-src https:` and
  `style-src 'unsafe-inline'`, which Leaflet tiles and inline styles need.
- `components/ui/lightbox.tsx` exports `Lightbox({ items, initialIndex, onClose })`
  and already renders both photo and video portfolio items.

## Decisions

### 1. Data: extend portfolio frontmatter, no separate locations file

The map shows portfolio items that have coordinates. One source of truth: adding
a post with coordinates puts it on the map; there is no second list to keep in sync.

New optional frontmatter fields in `lib/portfolio.ts`:

| Field | Type | Rule |
|---|---|---|
| `coordinates` | `[lat, lng]` | Optional. Item appears on the map only if set. Validated as numbers in range. **Rounded to 2 decimals on read** (~1 km) so exact spots never ship, even if a precise value is typed in. |
| `flightType` | `"aerial" \| "fpv"` | Optional, default `"aerial"` (most posts are aerial). Drives filter and pin colour. |

`location` (existing) becomes the pin label and list title. It must be set on any
item that has `coordinates`; the loader throws otherwise, so a broken entry fails
the build instead of rendering an empty label.

Why not reuse `category`: it mixes subject (`Landscape`, `City`) with aircraft
(`FPV`) and gear (`Gear`). Flight type is a separate axis. `category` stays as is
for the photo gallery filter.

Coordinates and `flightType` must be identical in the EN and ID file of a pair
(bilingual pair workflow). Text fields stay localized.

### 2. Rendering: vanilla Leaflet in one client component

- Dependency: `leaflet@1.9.4` (current `latest`; 2.0 is alpha). No `react-leaflet`
  and no `esri-leaflet`: one dependency, not three. Types: `@types/leaflet` (dev).
- New file `components/portfolio/flight-map.tsx` (`"use client"`). The page (Server
  Component) passes a small serializable array: `{ slug, title, location,
  coordinates, flightType, date, image | thumbnail, description }`.
- Leaflet touches `window`, so it is loaded with `await import("leaflet")` inside
  `useEffect`. The JS and tiles load only when the section enters the viewport
  (`IntersectionObserver`), so the rest of the page pays nothing.
- Leaflet CSS is imported from the package inside the component (bundled, same
  origin, CSP-safe).

### 3. Basemap: Esri World Imagery + Esri reference labels

- Imagery: `World_Imagery` tiles. Labels (city/province names, as in the mockup):
  `Reference/World_Boundaries_and_Places` overlay.
- Attribution control stays visible ("Powered by Esri | Source: Esri, Maxar, ...").
- **Blocking open item (see Risks):** Esri's licensing for direct tile use outside
  Esri SDKs is not verified. Resolve before implementation starts.

### 4. UI behaviour

| Element | Behaviour |
|---|---|
| Layout | Desktop (`lg`): map left, list right (~380 px), same height. Mobile: map (4:3) on top, list below with max height and internal scroll. No horizontal page scroll at 390 px. |
| Header | Existing "Locations / Flight Map" plus one-line subtitle, localized with `pick()`. |
| Pins | `L.divIcon` teardrop, 2 colours: aerial and FPV. Colour = flight type, not one colour per city (the mockup's rainbow carries no meaning). |
| Pin labels | Location name shown next to the pin at zoom >= 7; hidden when zoomed out to avoid overlapping labels. Tooltip on hover/focus at any zoom. |
| Popup card | Thumbnail, location, flight type, month + year, one-line description, `>` button. Dark card as in the mockup. |
| `>` button | Opens the existing `Lightbox` with that item (photo or reel). No new detail route. |
| Filter chips | `All / Aerial / FPV`. Hidden entirely if only one flight type has items. Filtering updates pins and list together and refits the view. |
| List | Count ("N locations"), newest first. Click: map flies to the pin and opens its popup. Pin click highlights and scrolls the list item into view. |
| Zoom | Leaflet zoom control, bottom-left. **Scroll-wheel zoom off** until the map is clicked/focused, so scrolling the page never gets trapped. |
| Recenter button | Bottom-right. Fits the view to all currently visible pins. Not GPS: geolocation is blocked by our own `Permissions-Policy`, and a visitor's position is irrelevant to a portfolio. |
| Scale | `L.control.scale({ imperial: false })`, bottom-left. |
| Empty state | If no item has coordinates, the whole section is not rendered (no empty map). |
| Accessibility | The list is the accessible equivalent of the map (real buttons, keyboard reachable). Map container gets an `aria-label`. |

Initial view: fit to all pins with padding. Pins far apart (Jakarta to Bali)
give a zoom of ~6-7, which is fine.

Duplicate coordinates: v1 shows one pin per item. If two items share a spot the
pins overlap; acceptable at the current volume (< 10 located items). Revisit with
clustering only if it becomes a real problem.

## Content prerequisites (before the map can show anything)

1. User supplies, per item that should appear: coordinates (2 decimals is enough)
   and `flightType` if FPV.
2. Reels (`anyer-coastal`, `commercial-real-estate`, `natarasa-heritage`,
   `pulau-merah`) need a `location` value to appear.
3. Fix confusing data found during this review (slugs and titles are correct, so
   no URL changes):
   - Done 2026-10-04: file names did not match their content (Pandawa, Batang
     and Ciwidey were rotated). Renamed so every file name equals its `slug`.
   - Image check needed: the Ciwidey item uses `merapi-crater-web.jpg`. If the
     photo is really Merapi, the pin would be in the wrong place.
   - All four reels have `category: FPV`. Confirm which were really flown FPV
     before copying that into `flightType`; the default is `aerial`.

## Files

| File | Change |
|---|---|
| `package.json` | add `leaflet`, dev `@types/leaflet` |
| `lib/portfolio.ts` | parse/validate `coordinates`, `flightType`; round coordinates |
| `components/portfolio/flight-map.tsx` | new client component (map + list + filter) |
| `app/[locale]/drone-portfolio/page.tsx` | replace placeholder, pass located items |
| `content/portfolio/{en,id}/*.mdx` | add fields; rename mismatched files |
| `docs/content-model-and-publishing-workflow.md` | document the two new fields |
| `docs/architecture.md` / `README.md` | note Leaflet + Esri tiles on drone portfolio |
| `docs/agent/feature_list.json`, `docs/agent/claude-progress.md` | track feature and evidence |

## Verification

- `npm run lint` and `npm run build` pass.
- Build fails on purpose with a test entry that has `coordinates` but no
  `location`, and with out-of-range coordinates (then revert the test entry).
- Preview the static build (`npx serve out` or `npm run preview`) and check with
  Playwright on `/en/drone-portfolio` and `/id/drone-portfolio`:
  - pin count == located item count; list count matches;
  - filter changes pins and list; recenter refits;
  - list click opens the right popup; `>` opens the Lightbox;
  - page scroll over the map does not zoom;
  - 390 px width: no horizontal scroll;
  - no console errors; Leaflet JS is not requested before the section is scrolled
    into view.
- Screenshots (desktop + mobile) recorded in `docs/agent/claude-progress.md`.

## Risks and open items

1. **Esri licensing (blocking).** Esri content is under the Esri Master License
   Agreement; their developer docs say usage must be licensed with an API key or
   ArcGIS identity, and attribution is mandatory. This site also sells drone
   services, so "non-commercial" assumptions are unsafe. Could not open the
   official page from this environment (egress blocked). Action: confirm terms;
   most likely outcome is a free ArcGIS Location Platform account with a
   **referrer-restricted** API key (the key will be public in a static site, so the
   restriction is what protects it). If terms do not fit, choose another imagery
   provider before coding; the component design does not change, only the tile URL.
2. **Bundle/performance.** Leaflet is ~40 KB gzip JS + CSS, plus tile traffic.
   Mitigated by viewport lazy-loading. Measure the drone-portfolio page before and
   after and record it in `docs/benchmarks/`.
3. **Privacy and no-fly zones.** Coordinates are rounded to ~1 km in code. Still,
   avoid posting pins at restricted sites (airports, palaces, military areas).
4. **Scope.** Not in Phase 1 guardrail list, but it adds a dependency
   (`project-architecture-constraints.md`: "only when it clearly reduces total
   complexity"). Justification: pan/zoom/projection by hand would be far more code
   than one well-known library.

## Out of scope

Clustering, GPS "near me", flight paths/GPX tracks, per-location pages, a CMS for
locations, map on article pages.
