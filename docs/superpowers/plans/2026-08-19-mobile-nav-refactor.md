# Mobile Nav Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the mobile navigation menu in `components/layout/site-header.tsx` from an expanding top border block into a floating card, restructuring the list into logical collapsible groups for mobile users, and adding a footer inside the card.

**Architecture:** The desktop navigation (from `NAV_LINKS`) remains unchanged. The mobile navigation will construct its own groups (Engineering, Explore, Elsewhere, Connect) using data mapped from `NAV_LINKS` directly within `site-header.tsx`.

---

### Task 1: Refactor `site-header.tsx` mobile layout

**Files:**
- Modify: `components/layout/site-header.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS` from `lib/site.ts`.
- Produces: A floating card mobile menu overlay with restructured groups.

- [ ] **Step 1: Import new icons**
Add `Plus`, `Minus` to lucide-react imports. Remove `ChevronDown` if unused. Import `LinkedinIcon` and `InstagramIcon` from `components/icons/social-icons`.

- [ ] **Step 2: Build mobile navigation groups locally**
Inside `SiteHeader` function body, construct `mobileGroups`. 

```typescript
  // Group 1: Engineering (from NAV_LINKS)
  const engineeringGroup = NAV_LINKS.find((n) => n.label === "Engineering");
  // Group 2: Explore (from NAV_LINKS)
  const exploreGroup = NAV_LINKS.find((n) => n.label === "Explore");
  // Group 3: Elsewhere (Home, Notes, About)
  const elsewhereGroup = {
    label: "Elsewhere",
    children: NAV_LINKS.filter((n) => ["Home", "Notes", "About"].includes(n.label))
  };
  // Group 4: Connect (Contact)
  const connectGroup = {
    label: "Connect",
    children: NAV_LINKS.filter((n) => ["Contact"].includes(n.label))
  };

  const mobileGroups = [engineeringGroup, exploreGroup, elsewhereGroup, connectGroup].filter(Boolean) as any[];
```

- [ ] **Step 3: Add overlay backdrop**
In the return statement, when `open` is true, render a fixed backdrop.

```tsx
        {/* Mobile Menu Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-canvas/50 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
```

- [ ] **Step 4: Update the `motion.nav` to be a floating card**
Update the `<motion.nav>` wrapper.

```tsx
        {/* Mobile Menu Card */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-4 right-4 top-[4.5rem] z-50 overflow-hidden rounded-2xl border border-hairline bg-surface-card p-2 shadow-sm md:hidden"
              aria-label="Mobile"
            >
```
*Note: Adjust `top-[]` value if needed to match header height + gap.*

- [ ] **Step 5: Map through `mobileGroups` for the accordion**
Inside `motion.nav`, map `mobileGroups`. Use `Plus` and `Minus` icons instead of `ChevronDown`.

```tsx
              <ul className="flex flex-col gap-1 text-[0.95rem] text-body">
                {mobileGroups.map((entry) => {
                  const isExpanded = expandedGroups.includes(entry.label);
                  return (
                    <li key={entry.label}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2.5 font-medium transition-colors hover:bg-canvas/60 hover:text-ink"
                        onClick={() => toggleGroup(entry.label)}
                      >
                        {entry.label}
                        {isExpanded ? (
                          <Minus className="size-4" />
                        ) : (
                          <Plus className="size-4 text-muted" />
                        )}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-1 flex flex-col gap-1 pl-4 pr-2 pb-2">
                              {entry.children.map((child: any) => (
                                <li key={child.href}>
                                  <Link
                                    href={getLocalizedHref(child.href)}
                                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-canvas/60 hover:text-ink"
                                    onClick={() => setOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
```

- [ ] **Step 6: Add the Bottom Section**
Below the `ul`, add the footer.

```tsx
              <div className="mt-2 border-t border-hairline px-3 pb-2 pt-4">
                <div className="font-medium text-ink">Engineering Labs</div>
                <div className="mt-1 text-xs text-muted">QA Engineer · FPV Pilot · Tech Enthusiast</div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-[10px] text-muted">© 2026 Randy Maulana.</div>
                  <div className="flex items-center gap-3 text-muted">
                    <a href="https://linkedin.com/in/ranmaul" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors" aria-label="LinkedIn">
                      <LinkedinIcon className="size-4" />
                    </a>
                    <a href="https://instagram.com/ranmaul" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors" aria-label="Instagram">
                      <InstagramIcon className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
```

- [ ] **Step 7: Verify Build**
Run `npm run build` or `npx tsc --noEmit` to ensure no type errors from the `any` casting. The UI should work properly.

- [ ] **Step 8: Commit**
```bash
git add components/layout/site-header.tsx
git commit -m "feat(nav): refactor mobile menu into floating card with accordions and footer"
```
