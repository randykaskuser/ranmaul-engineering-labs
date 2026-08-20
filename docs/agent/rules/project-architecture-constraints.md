# Project architecture constraints (Workspace Rules)

These are stable constraints for *this* codebase.

## Stack constraints

- Next.js **App Router** only.
- TypeScript **strict** mode.
- Prefer **Server Components** by default.
- Keep architecture simple; avoid premature abstraction.
- Keep file structure readable; avoid deeply nested folders.
- Minimize dependencies; add a dependency only when it clearly reduces total complexity.

## UI + performance constraints

- Design should be: technical, clean, engineering-focused, readable, minimal.
- Avoid: glassmorphism, giant gradients, over-animated UI, startup marketing aesthetic, clutter.

Performance guardrails:

- Prioritize fast loading, minimal JS.
- Aim for Lighthouse > 90.
- Use semantic HTML, good accessibility, mobile-first layouts.

## Code quality constraints

- Strong typing; avoid `any` unless isolated and justified.
- Reuse components only when necessary (avoid “component explosion”).
- Avoid magic numbers when it harms readability (use named constants).
- Avoid giant components (extract clearly named subcomponents when a file becomes hard to scan).
- Avoid unnecessary hooks.
