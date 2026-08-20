# Routing + taxonomy contract (Workspace Rules)

These are permanent decisions intended to avoid expensive migrations later.

## URL schema (locked)

All article routes follow:

`/{locale}/{domain}/{slug}`

Allowed values:

- `locale`: `en` | `id`
- `domain`: `qa` | `fpv` | `fishkeeping` | `notes`
- `slug`: lowercase, hyphen-separated, **no dates in URL**

Principle:

- URLs describe the *problem/topic*, not chronology.

## Taxonomy model (locked)

Top-level domains are fixed to:

- `qa`
- `fpv`
- `fishkeeping`
- `notes`

New domains require explicit contract amendment.

Detail classification uses **tags** only.

Tag governance:

- Keep tags flat (no nested tag trees).
- Prefer stable, reusable tag names.
- Avoid category explosion.
