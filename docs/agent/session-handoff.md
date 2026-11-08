# Session Handoff

Optional. Use it only when a session ends mid-feature and the progress log is
not enough to resume. Clear it back to "No active handoff" once the feature is
`completed` or `blocked`.

## Status

- **Feature:** 16, Drone portfolio interactive Flight Map
- **Branch:** `claude/admiring-maxwell-lcac2g` (main merged in on 2026-11-08)
- **Done so far:** spec `docs/planning/2026-10-04-drone-flight-map.md`; rotated
  portfolio file names fixed (file name == `slug` for all 18 files, build OK).
- **Not done / unverified:** no map code. Esri tile licensing not verified.
  No coordinates yet: current `public/images/portfolio/*-web.jpg` have no EXIF.
- **Exact next step:** (1) user confirms Esri terms / gets a referrer-restricted
  ArcGIS key, or picks another imagery provider; (2) user provides original
  photos (EXIF GPS) or DJI `.SRT` files; read coordinates, round to 2 decimals,
  strip metadata from web versions, upload to R2; (3) implement per spec.
- **Commands to resume:** `./init.sh`, then read the spec.

## Format (when used)

- **Feature:** id + title from `feature_list.json`
- **Branch:**
- **Done so far:** (verified only)
- **Not done / unverified:**
- **Exact next step:**
- **Commands to resume:** usually `./init.sh`, then ...
