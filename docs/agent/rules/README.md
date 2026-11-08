# Workspace guidance index

This repo intentionally separates guidance into:

- **Workspace Rules** (`docs/agent/rules/*.md`): stable project constraints/contracts.
- **Workspace Workflows** (`docs/agent/workflows/*.md`): repeatable procedures.
- **Documentation** (`docs/*.md`): explanatory reference (vision/roadmap/architecture).

If you’re unsure where to put new guidance:

- If it is a **must-always-be-true constraint**, put it in **workspace rules**.
- If it is a **step-by-step process**, put it in **workspace workflows**.
- If it explains “why / context / reference”, keep it in **docs**.

## Entrypoints

- Repo entrypoint: `README.md`
- Agent entrypoint: `AGENTS.md`
- Workspace guidance: this file + the rules/workflows listed below

## Core workspace rules

- `project-architecture-constraints.md`
- `roadmap-scope-guardrails.md`
- `routing-and-taxonomy-contract.md`
- `frontmatter-and-slug-contract.md`
- `content-governance.md`

## Core workspace workflows

- `../workflows/publish-mdx-article.md`
- `../workflows/bilingual-article-pair-workflow.md`
- `../workflows/content-update-maintenance.md`
- `../workflows/docs-sync-and-roadmap-alignment.md`
