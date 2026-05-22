# Phase 3.7 — Security Hardening & Privacy Audit

This report is an evidence-based security + privacy audit for this repo.

Scope focus (per Phase 3.7):

- Next.js app attack surface (routing, headers, SSR/CSR boundaries)
- dependency risk
- content pipeline + file writes (`scripts/notion-sync.mjs`)
- GitHub Actions permissions + secrets exposure
- public media download behavior (SSRF / path traversal)

Assumptions are explicitly stated; unknowns are called out as `Needs confirmation`.

---

## 1. Executive Summary

The codebase is intentionally **static-first** with no authentication, no database, and no user-submitted inputs. This drastically reduces the highest-severity OWASP risks (e.g., Broken Access Control, Injection on user-controlled forms). The primary risks are instead concentrated in:

1) **Supply chain / CI**: GitHub Actions runs on a schedule with `contents: write` and previously referenced third-party actions via floating tags (`@v4`). This creates an attacker path via compromised action tag or dependency chain.

2) **Content pipeline SSRF / media ingestion**: `scripts/notion-sync.mjs` downloads remote media URLs and writes to disk. If an attacker can influence Notion content (or compromise the Notion workspace), they may attempt SSRF or persistent malicious payload ingestion.

3) **Security headers**: `next.config.ts` previously did not set baseline security headers. This increases browser-side exploitability (clickjacking, content sniffing, etc.) in the event of any XSS entrypoint.

Key hardening actions have already been applied as part of this phase:

- Added baseline security headers via Next.js `headers()`.
- Added SSRF guardrails to Notion media downloads (HTTPS-only + host allowlist).
- Pinned GitHub Actions dependencies to commit SHA (reduces supply chain drift).

Remaining high-value work is mostly around CSP, deployment-level HTTPS/HSTS correctness, and dependency vulnerability remediation (PostCSS via Next).

Update (long-term fixes implemented in repo):

- CSP added in **Report-Only** mode (safe rollout) via `next.config.ts`.
- Notion sync workflow blast radius reduced (only stages `content/**` + `public/media/notion/**`).
- Media ingestion hardened further: size cap + MIME allowlist for downloaded media.
- Additional baseline browser isolation: `COOP` + `CORP` headers + disabled `X-Powered-By`.
- Media download hardened further: request timeout + post-download size cap enforcement.
- CODEOWNERS added (`.github/CODEOWNERS`) for ownership clarity + future collaborator guardrail.
- ESLint rule added to prevent `dangerouslySetInnerHTML` usage (`react/no-danger`).

---

## 2. Security Posture Score

**Score: 74 / 100**

Rubric notes:

- **Identity & access control**: 80/100 — No auth surface exists by design. However, publish pipeline relies on GitHub/Notion permissions (external), and the web app has no role enforcement by design.
- **Data protection (secrets, crypto, storage)**: 70/100 — Secrets are stored in GitHub Actions; no evidence of secrets in repo. No encryption at rest concerns in app itself. Needs confirmation on secret rotation policy.
- **App/API hardening**: 72/100 — Minimal API surface. Baseline headers added. CSP not yet implemented.
- **SDLC/supply chain (deps + CI/CD)**: 62/100 — `npm audit` reports moderate vulnerabilities. CI uses write token and scheduled execution (expected), but was using floating action tags (now pinned).
- **Observability & detection**: 55/100 — No explicit security telemetry/logging strategy documented. Likely acceptable for early phase but limits detection.

---

## 3. Top Vulnerabilities

### Finding 1
- **Title**: Scheduled GitHub Action with `contents: write` + floating action tags (pre-fix)
- **Severity**: High
- **Priority**: P1
- **Affected component**: `.github/workflows/notion-sync.yml`
- **Exploitation scenario**:
  1) Attacker compromises `actions/checkout@v4` or `actions/setup-node@v4` tag target (supply chain compromise).
  2) Workflow runs on schedule with write permission.
  3) Malicious action executes arbitrary code inside runner.
  4) Attacker uses `GITHUB_TOKEN` to push commits to `main` (repository integrity compromise).
- **Impact**: Repository compromise, persistent backdoor in code/content, potential secret exfiltration.
- **Likelihood**: Medium — depends on upstream compromise, but impact is high.
- **Remediation**: Pin actions to commit SHA.
- **Quick mitigation**: Pin to SHA now (DONE).
- **Long-term fix**: Add CODEOWNERS / branch protection + require signed commits (if compatible) for automation; consider restricting what the workflow can touch (path filters) or committing to a separate branch.

### Finding 2
- **Title**: Media download pipeline susceptible to SSRF / untrusted host ingestion (pre-fix)
- **Severity**: High
- **Priority**: P1
- **Affected component**: `scripts/notion-sync.mjs` (`downloadToPublic()`)
- **Exploitation scenario**:
  1) Attacker gains ability to publish or modify a Notion page that will be synced (Draft=false), or compromises Notion token.
  2) They set an image/file URL to an internal service endpoint or attacker-controlled host.
  3) Workflow runs; sync script fetches arbitrary URL.
  4) Attacker uses SSRF to reach internal metadata services or exfiltrate data through response side effects.
- **Impact**: Potential secret exposure in CI environment, internal network probing (depending on runner environment), persistent malicious file download.
- **Likelihood**: Medium — requires Notion write/publish capability or token theft.
- **Remediation**: Enforce HTTPS-only and allowlist hosts.
- **Quick mitigation**: Block non-https + untrusted hosts (DONE).
- **Long-term fix**: Add strict content-type allowlist and max download size; download via a dedicated sandbox or isolated runner with reduced egress (if feasible).

### Finding 3
- **Title**: Missing baseline security headers increases browser-side exploitability
- **Severity**: Medium
- **Priority**: P2
- **Affected component**: `next.config.ts`
- **Exploitation scenario**:
  1) If any XSS is introduced via MDX rendering, third-party embeds, or future features.
  2) Browser lacks defense-in-depth protections (nosniff/frame/referrer/permissions policy).
  3) Attacker gains higher reliability for UI redress (clickjacking) or content type confusion.
- **Impact**: Increased exploitability and blast radius of any future content-based bug.
- **Likelihood**: Medium — content platform tends to grow; hardening early is valuable.
- **Remediation**: Add baseline headers site-wide.
- **Quick mitigation**: Add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` (DONE, with note about HTTPS-only requirement).
- **Long-term fix**: Add CSP (likely report-only first) and verify headers in deployment environment.

### Finding 4
- **Title**: Dependency vulnerability: PostCSS XSS advisory in Next transitive dependency
- **Severity**: Medium
- **Priority**: P2
- **Affected component**: `next` → `postcss` (via `npm audit`)
- **Exploitation scenario**:
  1) Attacker influences CSS processing output (build-time) in a way that generates `</style>` injection.
  2) If the resulting CSS is served, could lead to XSS.
  3) Practically, this is most relevant when untrusted CSS is processed.
- **Impact**: Build-time injection leading to client-side script execution.
- **Likelihood**: Low to Medium — depends on whether untrusted CSS is introduced; still important hygiene.
- **Remediation**: Track upstream fix path; attempt safe dependency bump within Next 16 minor versions.
- **Quick mitigation**: Monitor advisory; avoid ingesting untrusted CSS.
- **Long-term fix**: Upgrade Next when safe; consider `overrides` once verified compatible.

---

## 4. Privacy Findings

### Finding P1
- **Title**: Notion token exposure risk via CI environment
- **Severity**: Medium
- **Priority**: P2
- **Affected component**: GitHub Actions secrets (`NOTION_TOKEN`, `NOTION_DATABASE_ID`)
- **Exploitation scenario**:
  1) Any compromised dependency/action in workflow reads env vars.
  2) Exfiltrates token.
  3) Attacker reads/writes Notion content.
- **Impact**: Content integrity compromise; potential leakage of unpublished drafts.
- **Likelihood**: Medium
- **Remediation**: Pin actions (DONE), least-privilege Notion integration token, rotate token periodically.
- **Quick mitigation**: Ensure Notion integration has minimal scopes + database-only access.
- **Long-term fix**: Add secret rotation workflow and incident runbook.

---

## 5. Hardening Recommendations

1) Add **CSP** (start report-only) and tighten over time. **(DONE: report-only)**
2) Consider restricting CI write blast radius: commit only `content/**` + `public/media/notion/**` paths. **(DONE)**
3) Add media download limits in sync script:
   - max bytes **(DONE)**
   - allowed MIME types **(DONE)**
   - safe extension mapping (partial; based on allowed MIME types)
4) Review HSTS correctness per deployment (must be HTTPS-only). (Needs confirmation)

---

## 6. Quick Wins

- Pin GitHub actions to commit SHA (DONE).
- Add baseline security headers (DONE).
- SSRF guardrails for media downloads (DONE).

---

## 7. Mid-Term Improvements

- CSP report-only rollout + tune for MDX components.
- CI path restriction / separate branch strategy for automation pushes.
- Dependency maintenance to eliminate moderate advisories (track Next/PostCSS).

---

## 8. Long-Term Improvements

- Formal threat model doc with explicit trust boundaries (Notion ↔ GitHub ↔ deploy).
- Add security regression checks (headers tests; dependency scanning policy).
- Consider signing automation commits (where compatible) and stronger branch protections.

---

## 9. Final Risk Assessment

Overall risk is **moderate** for the current product surface.

The biggest realistic attacker paths are not traditional web auth bypasses, but rather:

- CI/CD supply-chain compromise affecting repo integrity.
- Notion ingestion pipeline being abused to download or store malicious payloads.

The implemented quick wins reduce the most actionable risks without adding forbidden product scope.
