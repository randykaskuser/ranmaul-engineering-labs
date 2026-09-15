# Security Policy

## Scope

This repository is the source for a statically exported Next.js site. There is
no server runtime, no database, and no authentication in production — the build
output is static files served by Cloudflare Pages.

Reports that are in scope:

- vulnerabilities in the application code or build pipeline in this repository
- vulnerabilities in `scripts/notion-sync.mjs` (the content ingestion path)
- exposed secrets or credentials in this repository or its history
- issues in the GitHub Actions workflows under `.github/workflows/`

Out of scope: findings against third-party infrastructure (Cloudflare, GitHub,
Notion), and automated scanner output with no demonstrated impact on this site.

## Supported Versions

Only the current release line receives security updates.

| Version | Supported |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security reports.**

Preferred: use GitHub's private vulnerability reporting on this repository —
open the [Security tab](https://github.com/randykaskuser/ranmaul-engineering-labs/security)
and choose "Report a vulnerability". This keeps the report private until a fix
is published.

Alternative: email **randy.maulana91@gmail.com** with a description of the
issue and the steps to reproduce it.

Please include:

- what the issue is and where (file path, route, or workflow)
- how to reproduce it
- what an attacker could achieve

## What to Expect

- Acknowledgement within 72 hours.
- An assessment of severity and whether the report is in scope.
- If accepted, a fix on a branch and a note to you when it ships.
- Public disclosure timing coordinated with you.

This is a personal project maintained by one person, so response times are
best-effort rather than contractual.
