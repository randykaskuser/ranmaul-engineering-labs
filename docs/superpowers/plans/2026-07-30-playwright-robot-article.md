# Playwright Robot Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffolds the `qa-automation-skills` repository structure and creates bilingual MDX articles introducing the Playwright Robot skill based on the problem/solution narrative.

**Architecture:** 
1. Create a `qa-automation-skills/playwright-robot` folder containing the raw `SKILL.md` and a root `README.md`.
2. Create an English MDX article in `content/en/qa/why-ai-fails-ui-testing-playwright-mcp.mdx`.
3. Create an Indonesian MDX article in `content/id/qa/mengapa-ai-gagal-menulis-ui-test-playwright-mcp.mdx`.
4. The articles follow the project's strict frontmatter, slug, and content quality rules (engineering tone, no AI filler, concrete reasoning).

**Tech Stack:** Next.js (MDX), Bash (for scaffolding).

## Global Constraints

- Routing: `/{locale}/{domain}/{slug}` where locale is `en` or `id`, domain is `qa`.
- Frontmatter must include: `title`, `description`, `locale`, `domain`, `slug`, `canonicalGroup`, `publishedAt`, `updatedAt`, `tags`, `featured`, `draft`.
- Slugs are localized, but `canonicalGroup` must match between pairs.
- Writing style must be technical, practical, and avoid generic AI filler.
- Content must use the provided `SKILL.md` content inside a code block.

---

### Task 1: Scaffold QA Automation Skills Directory

**Files:**
- Create: `qa-automation-skills/README.md`
- Create: `qa-automation-skills/playwright-robot/SKILL.md`

**Interfaces:**
- Consumes: N/A
- Produces: Local directory structure to be referenced in the articles.

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p qa-automation-skills/playwright-robot
```

- [ ] **Step 2: Create the README.md**

Use the native Write tool (not bash echo/cat) to create `qa-automation-skills/README.md` with the following content:

```markdown
# QA Automation Skills

A collection of Claude Code skills focused on QA Engineering, test automation, and system reliability.

## Skills Available

- **[Playwright Robot](./playwright-robot/SKILL.md)**: An elite QA Automation Architect workflow that takes raw requirements, uses the Playwright MCP to inspect the live accessibility tree, generates POM-structured tests, and self-heals failures.

## Installation

To install a skill locally for your Claude Code sessions:

1. Create a `.claude/skills` directory in your project or home folder.
2. Copy the desired skill folder (e.g., `playwright-robot`) into it.
3. Start `claude` and invoke it via `/playwright-robot`.
```

- [ ] **Step 3: Create the Playwright Robot SKILL.md**

Use the native Write tool to create `qa-automation-skills/playwright-robot/SKILL.md` with the following content:

```markdown
---
name: playwright-robot
description: You are an elite QA Automation Architect armed with the Playwright MCP. Your job is to take raw requirements (PRD, Jira, User Stories) and turn them into robust, maintainable, self-healing Playwright automation suites.
---

# Playwright Robot

You are an elite QA Automation Architect armed with the Playwright MCP. Your job is to take raw requirements (PRD, Jira, User Stories) and turn them into robust, maintainable, self-healing Playwright automation suites.

You MUST follow this exact 4-step workflow:

## 1. Requirement Analysis
Before writing any code, analyze the input requirements.
- Identify the core user journey.
- Assess risks and edge cases.
- Outline the test scenarios to be covered.
- Clearly state the scope of what will be automated (and what will be omitted, e.g., third-party auth).
- Ask the user for the target URL if not provided.

## 2. Live Inspection (Playwright MCP)
**Do not guess selectors.** You must scout the live application using the Playwright MCP to find resilient locators.
- Use `browser_navigate` to open the target URL.
- Use `browser_snapshot` to capture the accessibility tree and find robust locators (prefer `getByRole`, `getByText`, `getByLabel`).
- If interacting with a flow (like a checkout), use `browser_click`, `browser_fill_form`, etc., to move through the flow and snapshot each state.
- Note any specific network requests to wait for if the page is dynamic.

## 3. Code Generation
Write robust, maintainable Playwright TypeScript code based on your live findings.
- **Monorepo Awareness:** Check the current workspace structure. If there is an existing `web/` directory containing a `playwright.config.ts`, you MUST generate all tests and page objects inside that `web/` directory (e.g., `web/tests/`, `web/pages/`).
- **Always use Page Object Models (POM)** to abstract the UI interactions from the test logic.
- Ensure the code follows Playwright best practices (e.g., using `await expect()`, relying on auto-waiting).
- Save the code to appropriate files based on the structure discovered above.

## 4. Run, Validate & Self-Fix
The job is not done until the test passes.
- Use the terminal (Bash/PowerShell) to execute the test.
- **Directory Awareness:** Ensure you run the test from the correct directory. If you placed the tests inside `web/`, you must `cd web` before running `npx playwright test`.
- Read the output logs.
- If the test fails:
  1. Analyze the failure reason.
  2. If a locator changed or was incorrect, use the Playwright MCP to re-inspect the live page.
  3. Apply the fix and re-run the test.
- Loop this fix cycle until the test passes perfectly.

## Getting Started
When invoked, begin immediately with Step 1 and present your Requirement Analysis to the user before proceeding to Step 2.
```

- [ ] **Step 4: Commit**

```bash
git add qa-automation-skills/
git commit -m "feat: scaffold qa-automation-skills repository"
```

### Task 2: Create English MDX Article

**Files:**
- Create: `content/en/qa/why-ai-fails-ui-testing-playwright-mcp.mdx`

**Interfaces:**
- Consumes: `SKILL.md` content from Task 1.
- Produces: The EN blog article.

- [ ] **Step 1: Write the MDX file**

Use the native Write tool to create `content/en/qa/why-ai-fails-ui-testing-playwright-mcp.mdx` with the exact content required (omitted from the plan snippet for brevity but must include full frontmatter, narrative, and skill code block).

- [ ] **Step 2: Commit**

```bash
git add content/en/qa/why-ai-fails-ui-testing-playwright-mcp.mdx
git commit -m "feat(docs): add en article for playwright mcp robot skill"
```

### Task 3: Create Indonesian MDX Article

**Files:**
- Create: `content/id/qa/mengapa-ai-gagal-menulis-ui-test-playwright-mcp.mdx`

**Interfaces:**
- Consumes: N/A
- Produces: The ID blog article.

- [ ] **Step 1: Write the MDX file**

Use the native Write tool to create `content/id/qa/mengapa-ai-gagal-menulis-ui-test-playwright-mcp.mdx` with the exact translated content required.

- [ ] **Step 2: Commit**

```bash
git add content/id/qa/mengapa-ai-gagal-menulis-ui-test-playwright-mcp.mdx
git commit -m "feat(docs): add id article for playwright mcp robot skill"
```