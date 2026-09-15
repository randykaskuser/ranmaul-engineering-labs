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
not data exposure. **All findings in §2 are now fixed in the repository.** What
remains (§7) is owner action in GitHub settings, which cannot be done from a
commit.

---

## 2. Findings

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Critical | Next.js 16.2.11 — two RCE advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4) | **Fixed** → 16.3.3 |
| 2 | High | `sharp` 0.35.3 — libheif vulns (GHSA-rgj7-g3m4-5g8c) | **Fixed** → 0.35.4 |
| 3 | High | `js-yaml` CPU-exhaustion DoS (GHSA-2883-xcg3-v3hh) | **Fixed** → 3.15.2 / 4.3.2 |
| 4 | Medium | `peter-evans/create-pull-request@v7` used as a floating tag while other actions were SHA-pinned | **Fixed** → SHA-pinned |
| 5 | Low | JSON-LD injection: `JSON.stringify` does not escape `</script>` | **Fixed** → `<` escaped as `\u003c` |
| 6 | Medium | `SECURITY.md` vulnerability contact is the placeholder `randy@example.com` | **Fixed** → real channels + scope |
| 7 | Low–Medium | `.claude/settings.local.json` is committed and pre-approves `git push *`, `git commit *`, `winget install *`, `gh auth *` | **Fixed** → untracked + gitignored |
| 8 | Low | `.wrangler/` local dev state tracked (25 files, ~13 MB) despite being gitignored | **Fixed** → untracked |
| 9 | Low | Root-level scratch files leak local Windows paths and a Notion data-source ID | **Fixed** → deleted |
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

## 4. Resolved in the follow-up commit

### 4.1 `SECURITY.md` points nowhere (Medium) — fixed

The disclosure address is `randy@example.com` — a placeholder. On a public repo
this means a researcher who finds a real issue has **no working way to report it
privately**, and the policy explicitly tells them not to open an issue. Either
put a real address in, or enable GitHub private vulnerability reporting and link
that instead.

**Resolved.** `SECURITY.md` now names GitHub private vulnerability reporting as
the preferred channel and `randy.maulana91@gmail.com` as the fallback, and adds
a scope section plus a response-time expectation. The fallback address was
chosen because it is *already* published in this repo via the CV page, so it
introduces no new exposure. Two caveats for the owner:

- Private vulnerability reporting must be **enabled in repo settings**
  (Settings → Security → Private vulnerability reporting). Until then the email
  is the only working channel.
- If a different contact address is preferred, change it — this was a judgement
  call made to avoid publishing an address that was not already public.

### 4.2 `.claude/settings.local.json` is committed (Low–Medium) — fixed

This file is conventionally local-only and is **not** in `.gitignore`. It
pre-approves, without prompting:

```
Bash(git push *)   Bash(git commit *)   Bash(git add *)
PowerShell(winget install *)   PowerShell(gh auth *)
```

Two consequences. It publishes your local tooling layout and a
`d:/Development/...` path; more importantly, anyone who clones or forks this
public repo and runs an agent in it inherits pre-approved package installation
and push permissions.

**Resolved.** Untracked with `git rm --cached` and added to `.gitignore`. The
file remains on disk, so local development is unaffected.

### 4.3 Tracked `.wrangler/` state (Low) — fixed

`.gitignore` lists `.wrangler/`, but gitignore does not apply retroactively — 25
files were committed before the rule and remain tracked, including a 9.3 MB MP4
and five ~800 KB JPEGs in the local R2 emulator. I inspected the blobs: they are
ordinary media, **not secrets**. This is a size/hygiene problem, not a security
one.

**Resolved.** Untracked with `git rm -r --cached .wrangler`. The existing
`.gitignore` rule now actually takes effect, and local dev state is untouched on
disk.

### 4.4 Root-level scratch files (Low) — fixed

`AGENTS.md` mandates a clean root. Currently present and tracked:

- `describe_image.py`, `parse_image.py` — dead scripts containing
  `C:/Users/Randy M/DOWNLOADS/...`, leaking your Windows username
- `fix-notion.mjs` — one-off Notion archiver with a hardcoded data-source ID
  `36552ebc-a28d-8056-8c30-000ba81c965f` (an identifier, not a credential —
  useless without `NOTION_TOKEN`, but no reason to publish it)
- `package.json.tmp`, `playwright-base-b64.txt` — empty files
- `D:Developmentwebsite-elabs...transcript.txt` — a mangled-filename agent
  transcript

None is a credential leak.

**Resolved.** All six deleted. Nothing in the repo referenced them (verified by
`git grep`), and the build passes without them. The tracked root is now only
permanent project artifacts, as `AGENTS.md` requires.

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

## 7. Remaining work (owner action required)

Everything in §2 is now fixed in the repo. What is left cannot be done from the
repository and needs action in GitHub / Cloudflare settings:

1. **Enable private vulnerability reporting** (Settings → Security). Until then
   the email fallback in `SECURITY.md` is the only reporting channel.
2. **Confirm the Dependabot count.** On push, GitHub reported 7 alerts
   (4 critical, 3 high) on `main`, while `npm audit` on this branch reports 0.
   Dependabot counts differently — dev dependencies, per-advisory-per-package,
   and the GitHub Actions ecosystem. Check `/security/dependabot` after this
   lands to confirm the branch clears them rather than trusting the `0`.
3. **Enable GitHub secret scanning** for independent coverage — the sweep in §5
   was pattern-based and would miss an unusual credential format.
4. **Do NOT promote the CSP as currently written** — see §9. Measured: enforcing
   it as-is breaks the site.
5. **Consider branch protection on `main`**, since `CODEOWNERS` alone does not
   enforce review.

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

---

## 9. CSP: the documented "promote to enforcing" plan would break the site

This was listed in the first pass as routine follow-up work. It is not. I tested
it, and the result inverts the recommendation.

### What was measured

The `out/` build was served over local HTTP with the policy applied as a real
enforcing `Content-Security-Policy` header, then loaded in Chromium with
`securitypolicyviolation` events and console output captured.

| Policy | CSP violations | Violated directive |
|---|---|---|
| Current policy, enforced (`script-src 'self'`) | **9** | `script-src-elem` |
| Same but `script-src 'self' 'unsafe-inline'` | **0** | — |

Every violation is `Refused to execute inline script because it violates the
following Content Security Policy directive`.

### Why

A Next.js static export emits inline `<script>` blocks with no `src`: the
`next-themes` anti-flash script, which must run before paint, and the React
Server Component hydration payload (`self.__next_f.push(...)`). A scan of the
build found **520 inline script blocks with a body across 112 HTML pages**.

`script-src 'self'` blocks all of them by specification. Enforcing the policy as
written would leave the site unhydrated — no theme, no client interactivity.

### Why the usual escapes do not apply

- **Nonces** require a server to generate a per-response value. There is no
  server; this is a static export on a CDN.
- **Hashes** would have to cover the RSC payload of every page, which differs
  per page and changes on every build. Hundreds of hashes in `_headers`,
  regenerated each deploy. Not maintainable.

### The actual choice

There are only two real options, and it is a judgement call, not a fix:

1. **Leave it Report-Only.** Nothing is enforced, including the directives that
   would work fine. Status quo.
2. **Enforce with `script-src 'self' 'unsafe-inline'`.** This enforces
   `default-src`, `base-uri`, `object-src 'none'`, `frame-ancestors 'none'`,
   `form-action 'self'`, `connect-src 'self'` and `upgrade-insecure-requests` —
   all real, and all currently unenforced. It gives up CSP's inline-script XSS
   protection, which is the directive people most associate with CSP.

Option 2 is a net improvement: it trades a protection you do not currently have
(Report-Only enforces nothing) for seven you also do not currently have. But
`'unsafe-inline'` in a committed security header is the kind of change the
repository owner should make deliberately, so it is left here as a
recommendation rather than applied.

The concrete edit, if you want it, is in `public/_headers`: rename
`Content-Security-Policy-Report-Only` to `Content-Security-Policy` and change
`script-src 'self'` to `script-src 'self' 'unsafe-inline'`.
