# Session Handoff

Optional. Use it only when a session ends mid-feature and the progress log is
not enough to resume. Clear it back to "No active handoff" once the feature is
`completed` or `blocked`.

## Status

- **Feature:** 16, Drone portfolio interactive Flight Map (`blocked`, code done)
- **Branch:** `claude/admiring-maxwell-lcac2g` (not merged)
- **Done so far:** map implemented and verified locally with a placeholder key;
  4 items located; images moved to R2 without metadata. Details: progress log 2026-11-08.
- **Not done / unverified:** live map (owner pastes `NEXT_PUBLIC_ESRI_API_KEY` from `.env.local` into Pages
  build env); coordinates for anyer-coastal, batang-rest-area,
  commercial-real-estate (held, privacy); FPV SD card.
- **Exact next step:** add coordinates from the owner's data (scratch approach: EXIF
  GPS / first SRT `latitude`/`longitude`, round 2 decimals, same in EN and ID), set
  `flightType: fpv` for FPV items, rebuild, verify filter chips appear.
- **Commands to resume:** `./init.sh`; local map check: build with
  `NEXT_PUBLIC_ESRI_API_KEY=<key>` then preview `static-out` (`.claude/launch.json`).

## Format (when used)

- **Feature:** id + title from `feature_list.json`
- **Branch:**
- **Done so far:** (verified only)
- **Not done / unverified:**
- **Exact next step:**
- **Commands to resume:** usually `./init.sh`, then ...
