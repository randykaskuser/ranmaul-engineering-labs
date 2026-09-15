# Security Review — 2026-09 (public-repo readiness)

Scope: full-repo audit, not a branch diff. Supersedes the findings status in
`docs/security-hardening-phase-3-7.md` (which had drifted — see §6).

Method: manual review plus `npm audit` against the lockfile, a credential-pattern
sweep over **every blob in git history** (not just HEAD), a build + output
inspection, and advisory verification against GitHub Security Advisories.

---

## 1. Headline answer

**The repository is already public** (confirmed via GitHub API:
`visibility: public`, `private: false`, created 2026-05-19). So the question is
not "would it be safe" but "is it safe now".

**Verdict: broadly yes — no credential leak.** No secret was found in the current
tree or in any historical commit. The architecture (static export, no auth, no
database, no user input) removes most high-severity web risk by construction.

The real issues are **dependency currency, CI supply chain, and repo hygiene** —
not data exposure. All code and dependency findings below are fixed; the
remaining open items are ones that need your decision.

---

## 2. Findings

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Critical | Next.js 16.2.11 — two RCE advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4) | **Fixed** → 16.3.3 |
| 2 | High | `sharp` 0.35.3 — libheif vulns (GHSA-rgj7-g3m4-5g8c) | **Fixed** → 0.35.4 |
| 3 | High | `js-yaml` CPU-exhaustion DoS (GHSA-2883-xcg3-v3hh) | **Fixed** → 3.15.2 / 4.3.2 |
| 4 | Medium | `peter-evans/create-pull-request@v7` used as a floating tag while other actions were SHA-pinned | **Fixed** → SHA-pinned |
| 5 | Low | JSON-LD injection: `JSON.stringify` does not escape `</script>` | **Fixed** → `<` escaped as `\u003c` |
| 6 | Medium | `SECURITY.md` vulnerability contact is the placeholder `randy@example.com` | **Open — needs your decision** |
| 7 | Low–Medium | `.claude/settings.local.json` is committed and pre-approves `git push *`, `git commit *`, `winget install *`, `gh auth *` | **Open — needs your decision** |
| 8 | Low | `.wrangler/` local dev state tracked (25 files, ~13 MB) despite being gitignored | **Open — needs your decision** |
| 9 | Low | Root-level scratch files leak local Windows paths and a Notion data-source ID | **Open — needs your decision** |
| 10 | Info | CV page publishes personal email and city | By design; correctly excluded from indexing |
| 11 | Info | CSP is `Content-Security-Policy-Report-Only` | Intentional rollout stage |

---

## 3. Fixed in this change

### 3.1 Next.js RCE advisories (Critical) — severity is nominal here

`npm audit` flagged two critical RCEs. **Neither is exploitable in this
deployment**, and it matters that this is stated accurately rather than treated
as a fire:

- **GHSA-p293-qw3h-jr36** requires a running Next.js server on a *Windows
  filesystem*. This site is a static export served by Cloudflare Pages — there
  is no Next.js server in production.
- **GHSA-2xp9-vwfh-vxw4** triggers in the *Image Optimization API* when AVIF
  files are optimized. `next.config.ts` sets `output: 'export'` and
  `images.unoptimized: true`, so the optimizer is not present in the output.

The real residual exposure was **local `next dev`**, plus the general cost of
running an unpatched framework. Bumped to 16.3.3 anyway — it is a patch-level
bump within the same major, and the build is verified green.

### 3.2 sharp / js-yaml

`sharp` was held at 0.35.3 by an **override in `package.json`** — the override
itself was what pinned it below the patched 0.35.4. Bumped the override.

For `js-yaml`, forcing a v4 override **breaks the build**: `gray-matter` calls
`yaml.safeLoad`, which v4 removed. `npm audit fix` instead resolved `gray-matter`
onto the patched **3.15.2**, keeping the v3 API. No override needed.

Result: `npm audit` → **0 vulnerabilities**, `npm run build` → green.

### 3.3 GitHub Actions pin

`actions/checkout` and `actions/setup-node` were SHA-pinned, but
`peter-evans/create-pull-request@v7` was not. A floating tag can be repointed by
a compromised maintainer account, and this workflow runs every 15 minutes with
`contents: write` and three secrets in scope (`NOTION_TOKEN`,
`NOTION_DATABASE_ID`, `OPENROUTER_API_KEY`). Pinned to
`84ae59a2cdc2258d6fa0732dd66352dddae2a412` (v7.0.9), verified via `git ls-remote`
against the upstream repo rather than trusting a single web lookup.

### 3.4 JSON-LD injection

In `app/[locale]/[domain]/[slug]/page.tsx`, article frontmatter was serialized
with `JSON.stringify` into a `dangerouslySetInnerHTML` `<script type="application/ld+json">`
block. `JSON.stringify` does **not** escape `</script>`, so a `title` or
`description` containing that sequence would close the script element and allow
arbitrary markup.

Exploitability was low — content is repo-controlled and the Notion sync bot's
output goes through a CODEOWNERS-gated PR — but the sync pipeline means article
text originates *outside* the repo, so "content is trusted" is an assumption
worth removing rather than relying on. Fixed by escaping `<` as `\u003c`, which
is valid JSON and inert in HTML. Verified: built output still parses as JSON and
contains no literal `<`.

The second `dangerouslySetInnerHTML` (`app/cv-randy-maulana/CvClient.tsx`) is a
static CSS string with no interpolation — no action needed.

---

## 4. Open items (your call)

### 4.1 `SECURITY.md` points nowhere (Medium)

The disclosure address is `randy@example.com` — a placeholder. On a public repo
this means a researcher who finds a real issue has **no working way to report it
privately**, and the policy explicitly tells them not to open an issue. Either
put a real address in, or enable GitHub private vulnerability reporting and link
that instead.

### 4.2 `.claude/settings.local.json` is committed (Low–Medium)

This file is conventionally local-only and is **not** in `.gitignore`. It
pre-approves, without prompting:

```
Bash(git push *)   Bash(git commit *)   Bash(git add *)
PowerShell(winget install *)   PowerShell(gh auth *)
```

Two consequences. It publishes your local tooling layout and a
`d:/Development/...` path; more importantly, anyone who clones or forks this
public repo and runs an agent in it inherits pre-approved package installation
and push permissions. Recommend `git rm --cached` it and add
`.claude/settings.local.json` to `.gitignore`.

### 4.3 Tracked `.wrangler/` state (Low)

`.gitignore` lists `.wrangler/`, but gitignore does not apply retroactively — 25
files were committed before the rule and remain tracked, including a 9.3 MB MP4
and five ~800 KB JPEGs in the local R2 emulator. I inspected the blobs: they are
ordinary media, **not secrets**. This is a size/hygiene problem, not a security
one. `git rm -r --cached .wrangler` removes them going forward.

### 4.4 Root-level scratch files (Low)

`AGENTS.md` mandates a clean root. Currently present and tracked:

- `describe_image.py`, `parse_image.py` — dead scripts containing
  `C:/Users/Randy M/DOWNLOADS/...`, leaking your Windows username
- `fix-notion.mjs` — one-off Notion archiver with a hardcoded data-source ID
  `36552ebc-a28d-8056-8c30-000ba81c965f` (an identifier, not a credential —
  useless without `NOTION_TOKEN`, but no reason to publish it)
- `package.json.tmp`, `playwright-base-b64.txt` — empty files
- `D:Developmentwebsite-elabs...transcript.txt` — a mangled-filename agent
  transcript

None is a credential leak. All should be deleted or moved to `temporary/`.

**Note on history:** deleting these now removes them from the working tree but
**not from git history** — they stay readable at old commits on a public repo.
Since none contains a secret, a history rewrite is not warranted. If you disagree
about the Windows username, that would be the only reason to rewrite.

---

## 5. What is genuinely solid

Stated as evidence, not reassurance:

- **No secrets, current or historical.** Swept every blob reachable from all refs
  for OpenAI/Anthropic keys, GitHub PATs, AWS keys, Google API keys, Notion
  tokens, Slack tokens, JWTs and PEM private keys. Zero hits. `.env` has never
  been committed (`git log --diff-filter=A` on all env paths returns nothing).
- **`scripts/notion-sync.mjs` is well-hardened** — genuinely, not nominally:
  HTTPS-only with a host allowlist (`prod-files-secure.s3...`, `secure.notion-static.com`,
  `www.notion.so`), a 12 MiB cap enforced both from `content-length` *and*
  post-download, a 15 s abort timeout, and an image-only MIME allowlist that
  rejects SVG/HTML payloads. Path traversal is closed at the source: slugs must
  match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and locale/domain are checked against
  `Set` allowlists before any `path.join`.
- **Security headers ship correctly** via `public/_headers` (verified present in
  `out/_headers` after build): HSTS, `X-Frame-Options: DENY`, `nosniff`, COOP,
  CORP, a restrictive `Permissions-Policy`, and a Report-Only CSP.
- **The CV page is properly contained**: `robots: { index: false }` in metadata,
  `Disallow: /cv-randy-maulana` in `robots.txt`, and absent from `sitemap.xml`.
  All three verified in build output.
- **Static export removes whole vulnerability classes.** No server runtime means
  no SSRF, no injection, no auth bypass, no session handling in production.
- **Workflow triggers are safe**: `schedule` and `workflow_dispatch` only — no
  `pull_request_target`, so no "pwn request" path to the secrets.

---

## 6. Corrections to the previous audit

`docs/security-hardening-phase-3-7.md` contains two claims that no longer match
the code. Flagged here per the repo's documentation-drift rule:

1. It claims baseline security headers were "added via Next.js `headers()`" in
   `next.config.ts`. **`headers()` is a no-op under `output: 'export'`** — Next.js
   cannot serve headers for a static export. The current `next.config.ts` has no
   `headers()` function at all. The actual (and correct) implementation is
   `public/_headers`, which Cloudflare Pages consumes. The outcome is right; the
   documented mechanism is wrong.
2. It claims an ESLint rule `react/no-danger` was added to prevent
   `dangerouslySetInnerHTML`. **No such rule exists in `eslint.config.mjs`**, and
   two usages are in the tree. One of them was finding #5 above.

The second point is the more useful lesson: a control recorded as "done" but
never actually enabled is worse than a known gap, because it stops anyone from
looking. Verify controls in the code, not in the changelog.

---

## 7. Recommended order of work

1. Fix `SECURITY.md` (§4.1) — a public repo with a dead disclosure channel.
2. Untrack `.claude/settings.local.json` (§4.2) and add it to `.gitignore`.
3. Untrack `.wrangler/` and clean the root (§4.3, §4.4).
4. Enable Dependabot / GitHub security alerts so §2 items 1–3 surface
   automatically rather than at audit time.
5. Promote CSP from Report-Only to enforcing once the report stream is clean.

## 8. Assumptions and limits

- Cloudflare Pages account security, Notion workspace access, and GitHub
  Actions secret values were **not** in scope — they are outside the repo.
- Secret scanning used pattern matching. A high-entropy credential in a format
  not matched by those patterns could evade it. Enabling GitHub secret scanning
  on the repo would give independent coverage.
- Advisory applicability in §3.1 is my assessment from the advisory text plus
  this repo's config. The advisories do not explicitly address static exports;
  the reasoning is stated so you can check it.
- `npm audit` reflects the lockfile, and only vulnerabilities that have been
  published. It is a floor on dependency risk, not a ceiling.
