# Session Handoff

Optional. Use it only when a session ends mid-feature and the progress log is
not enough to resume. Clear it back to "No active handoff" once the feature is
`completed` or `blocked`.

## Status

No active handoff.

## Format (when used)

- **Feature:** id + title from `feature_list.json`
- **Branch:**
- **Done so far:** (verified only)
- **Not done / unverified:**
- **Exact next step:**
- **Commands to resume:** usually `./init.sh`, then ...
