# Flight Map bundle cost (2026-11-08)

Measured on the static build (`out/`), Next.js 16.4.3, Leaflet 1.9.4.

| Asset | Raw | Gzip | When loaded |
|---|---|---|---|
| Leaflet chunk (JS) | 148 KB | 42.6 KB | Only after the map section nears the viewport (`IntersectionObserver`, 200 px margin) |
| Page CSS incl. Leaflet CSS + map styles | 10.6 KB | 2.7 KB | With the page |
| Esri tiles | ~50-60 requests on first view | | After the map initialises |

Check (browser, `/en/drone-portfolio` and `/id/drone-portfolio`): before scrolling, no
`.leaflet-container` and 0 requests to `ibasemaps-api.arcgis.com`; after scrolling,
one extra JS chunk and ~54 tile requests.

Not measured: Lighthouse before/after on production (needs the live key).
