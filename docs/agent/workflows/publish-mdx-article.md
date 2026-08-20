# Publish an MDX article (Workspace Workflow)

This workflow is the repeatable procedure for publishing content in this repo.

## Preconditions

- You understand and will follow:
  - `.clinerules/routing-and-taxonomy-contract.md`
  - `.clinerules/frontmatter-and-slug-contract.md`
  - `.clinerules/content-governance.md`

## Steps

### 1) Draft

- Pick `locale` and `domain`.
- Choose a localized `slug` according to locale keyword intent.
- Assign `canonicalGroup`.
- Write a structured draft with evidence and reasoning.

### 2) Technical review

- Verify claims, configs, and reproducibility.
- Ensure troubleshooting/decision trail is explicit.

### 3) Editorial review

- Check title clarity, metadata quality, readability.
- Validate tags and taxonomy consistency.
- Confirm the “no fluff” writing rule.

### 4) Publish

- Set `draft: false`.
- Confirm internal links and related content references.
- Ensure the published URL matches `/{locale}/{domain}/{slug}`.

### 5) Post-publish maintenance

- Update article when tools/workflows change.
- Keep `updatedAt` accurate.
- Preserve slug permanence (avoid URL churn).
