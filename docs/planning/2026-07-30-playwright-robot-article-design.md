# Technical Spec: Playwright Robot Article & QA Skills Repository

## Overview
This spec outlines the creation of a bilingual blog article (EN/ID) introducing the `playwright-robot` skill, alongside the initialization of a local directory structure meant to be hosted on GitHub as a QA-focused Claude Code skills repository.

## 1. QA Skills Repository Structure
A new directory will be created to house QA-specific Claude Code skills. This will eventually be pushed to a dedicated GitHub repository.
- **Path:** `qa-automation-skills/` (created at the root of the project, or maintained as a separate repo; for now, we will scaffold the folder locally).
- **Contents:**
  - `README.md`: Index and installation guide.
  - `playwright-robot/SKILL.md`: The raw skill file containing the 4-step workflow (Analysis, Live Inspection, Code Generation, Self-Fix).

## 2. Article Outline & Content
**Domain:** `qa`
**Route:** `/{locale}/qa/ai-ui-testing-playwright-mcp` (or similar slug)

### Core Narrative (Approach 1: Problem/Solution)
1. **The Problem:** LLMs fail at E2E testing because they hallucinate CSS selectors. They cannot "see" the DOM.
2. **The Solution:** Playwright MCP allows the AI to capture the live Accessibility Tree, enabling it to write resilient, semantic locators (e.g., `getByRole`).
3. **The Workflow (The Skill):** Introduction of the `playwright-robot` skill, detailing its strict 4-step enforcement:
   - Requirement Analysis
   - Live Inspection (MCP)
   - POM Code Generation
   - Run, Validate, & Self-Fix
4. **Distribution (Hybrid):** The article embeds the `SKILL.md` content directly in a code block for easy copying, while also linking to the `qa-automation-skills` GitHub repository for centralized access and updates.

## 3. Implementation Steps
1. Create the `qa-automation-skills/playwright-robot/SKILL.md` file locally.
2. Draft the English MDX article in `content/en/qa/`.
3. Draft the Indonesian MDX article in `content/id/qa/`.
4. Ensure frontmatter conforms to `.clinerules/frontmatter-and-slug-contract.md`.
5. Update `app/page.tsx` or related indexes if necessary (handled automatically by Next.js SSG based on the content folder).
