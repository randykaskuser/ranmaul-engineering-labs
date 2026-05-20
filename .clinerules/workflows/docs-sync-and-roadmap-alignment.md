# Docs sync + roadmap alignment (Workspace Workflow)

This workflow prevents documentation drift.

## Trigger

Run this workflow whenever you:

- add/modify a feature
- change architecture decisions
- change scope boundaries or forbidden features
- change content model contracts (routing/frontmatter/taxonomy)

## Checklist

1. **Update project docs (if applicable):**
   - `README.md` (capabilities, run instructions, architecture notes)
   - `docs/architecture.md` (stack, folder conventions, route structure)
   - `docs/roadmap.md` (phase boundaries, scope, deliverables)
   - `docs/vision.md` (only if product intent/audience changes)

2. **Update workspace rules/workflows:**
   - If it’s a permanent constraint/contract → update `.clinerules/*.md`.
   - If it’s an operational procedure → update `.clinerules/workflows/*.md`.

3. **Remove duplication:**
   - If you updated a rule/workflow, ensure `/docs` doesn’t also carry the same enforcement text.
   - Keep `/docs` as explanatory reference, not operational instruction.
