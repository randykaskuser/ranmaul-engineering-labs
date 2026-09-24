# Architecture

## Stack

Frontend:
- Next.js
- TypeScript
- TailwindCSS

Deployment:
- Vercel

Content:
- MDX (future phase)

Comments:
- Giscus (future phase)

Analytics:
- Plausible or Umami (future phase)

---

# Core Sections

/app
/components
/content
/lib
/styles
/docs

---

# Content Structure

/content
    /qa
    /fpv
    /fishkeeping

---

# Route Structure

/                               (English home)
    /about, /contact, /projects, /tools, /create, /cv-randy-maulana   (English only)
    /{locale}                       (en | id home)
    /{locale}/{domain}              (qa | fpv | fishkeeping | notes)
    /{locale}/{domain}/{slug}
    /{locale}/tags, /{locale}/tags/{tag}
    /{locale}/drone-portfolio

Locale handling (static export, no middleware):
- Links to locale-only sections go through `localizeHref()` in `lib/site.ts`.
- The EN/ID toggle uses `getLocaleSwitchHref()` plus an article translation map
  built in `app/layout.tsx` at build time. It never links to a missing page.
- `<html lang>`: `scripts/set-html-lang.mjs` (npm `postbuild`) sets `lang="id"`
  on `out/id/**`; `HtmlLang` in `translation-context.tsx` updates it on client
  navigation.
- Legacy URLs (`/qa-lab`, `/fpv-lab`, `/fishkeeping`, `/drone-portfolio`, `/qa`,
  `/fpv`, `/notes`) are 301s in `public/_redirects` (Cloudflare Pages).

---

# Design Direction

References:
- Vercel
- Linear
- technical engineering blogs

Style:
- minimal
- readable
- technical
- content-first

---

# Future Features

Planned later:
- MDX blog engine
- tagging system
- RSS
- search
- SEO enhancements
- utilities/tools
- article recommendations
- YouTube integration

These are NOT part of MVP Phase 1.