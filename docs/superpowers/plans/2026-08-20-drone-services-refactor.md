# Drone Services Portfolio Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Homepage to act as a teaser for drone services, and transform the Drone Portfolio page into a unified showcase and service conversion page.

**Architecture:** 
- **Homepage (`app/page.tsx`):** Replace the complex grid and descriptions in the "Recent Drone Flights" section with a streamlined teaser and a single CTA linking to the Drone Portfolio.
- **Drone Portfolio (`app/drone-portfolio/page.tsx`):** Insert a new `DroneServicesSection` immediately after the `VideoGallery`. Relocate the `Equipment` section below it. 
- **Components:** Create a new `DroneServicesSection` component that displays the three service tiers (Property Aerial, FPV Cinematic, Custom/Commercial) with "Starting from Rp X" pricing structure and clear CTAs.

**Tech Stack:** React, Next.js, Tailwind CSS, Lucide React (for icons), TypeScript.

## Global Constraints

- Never use string expansion to write scripts. Always use native `Write` and `Edit` tools.
- Do not commit directly to `main`. Work remains on the feature branch until explicitly told to merge.
- Design must follow the existing site editorial aesthetics (using `editorial-card`, `display-title`, `type-kicker`, `type-lede`, etc.).
- Maintain responsive behavior and use existing layout components like `<Section>` and `<Reveal>`.

---

### Task 1: Create the Drone Services Component

**Files:**
- Create: `components/portfolio/drone-services-section.tsx`

**Interfaces:**
- Consumes: `Reveal`, `Section` components from `@/components/layout/`
- Produces: `DroneServicesSection` React component for use in the portfolio page.

- [ ] **Step 1: Write the component skeleton**
  - Create the file `components/portfolio/drone-services-section.tsx`
  - Import `Section`, `Reveal`, `Link` (from `next/link`), and Lucide icons (e.g., `Building2`, `Video`, `Briefcase`).
  
```tsx
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { Building2, Video, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DroneServicesSection() {
  const services = [
    {
      id: "property",
      title: "Property Aerial",
      icon: Building2,
      price: "From Rp X",
      features: ["Aerial photos", "High-res Video", "Real Estate & Construction"],
      cta: "Details",
      href: "/contact" // Or specific section if needed later
    },
    {
      id: "cinematic",
      title: "FPV Cinematic",
      icon: Video,
      price: "From Rp X",
      features: ["FPV cinematic runs", "Tourism & Events", "Dynamic tracking shots"],
      cta: "Details",
      href: "/contact"
    },
    {
      id: "custom",
      title: "Custom / Commercial",
      icon: Briefcase,
      price: "Let's discuss",
      features: ["Custom requirements", "Specific gear setup", "Complex maneuvers"],
      cta: "Contact",
      href: "/contact"
    }
  ];

  return (
    <Section space="xl" className="py-24 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
      <div className="container-wide">
        <Reveal>
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Drone Services</h2>
            <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight mb-6">
              Need aerial footage for your project?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              I provide aerial photography and FPV cinematic filming for commercial projects, properties, tourism, and events.
            </p>
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <div key={service.id} className="editorial-card p-8 flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <service.icon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black dark:text-white">{service.title}</h4>
                    <p className="text-sm font-semibold text-neutral-500 mt-1 uppercase tracking-wider">{service.price}</p>
                  </div>
                </div>
                
                <ul className="flex-1 space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                      <span className="mr-2 text-neutral-300 dark:text-neutral-700">•</span> {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={service.href} 
                  className="mt-auto group flex items-center justify-between text-sm font-medium text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors pt-4 border-t border-neutral-200 dark:border-neutral-800"
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify the component is valid**
  - Run linter: `npx eslint components/portfolio/drone-services-section.tsx`
  - Expected: No errors.

- [ ] **Step 3: Commit**
```bash
git add components/portfolio/drone-services-section.tsx
git commit -m "feat(portfolio): create DroneServicesSection component"
```

---

### Task 2: Restructure the Drone Portfolio Page

**Files:**
- Modify: `app/drone-portfolio/page.tsx`

**Interfaces:**
- Consumes: `DroneServicesSection` (from Task 1)

- [ ] **Step 1: Edit `app/drone-portfolio/page.tsx`**
  - Import the new component at the top:
    `import { DroneServicesSection } from "@/components/portfolio/drone-services-section"`
  - Locate the `VideoGallery` section.
  - Insert `<DroneServicesSection />` immediately *after* the `VideoGallery` section.
  - Ensure the `Equipment` section is *after* the `DroneServicesSection`. (It is already after `VideoGallery`, so just inserting `DroneServicesSection` before `Equipment` is sufficient.)

- [ ] **Step 2: Build and verify**
  - Run build: `npm run build`
  - Expected: Build passes without errors.

- [ ] **Step 3: Commit**
```bash
git add app/drone-portfolio/page.tsx
git commit -m "refactor(portfolio): insert Drone Services section and update flow"
```

---

### Task 3: Refactor the Homepage FPV Teaser Section

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: The `t.archives*` variables for English/Indonesian text.

- [ ] **Step 1: Simplify the section content in `app/page.tsx`**
  - Locate the `<Section divider tone="soft" ...>` containing the `BackgroundVideoPlaylist`.
  - Replace the complex title/description with the simplified teaser structure.
  
```tsx
// Inside the background video section in app/page.tsx, replace the Reveal block containing t.archivesTitle and t.archivesDesc with:

<Reveal>
  <div className="relative group inline-block mb-4">
    <h2 className="display-title text-3xl text-ink md:text-5xl relative z-10">{t.archivesTitle}</h2>
  </div>
</Reveal>

<Reveal delay={0.1}>
  <div className="max-w-xl text-center md:text-left">
    <p className="text-lg font-medium text-ink mb-2">Want aerial footage for your project?</p>
    <p className="text-body mb-6">Drone filming for property, events, tourism, and commercial content.</p>
    <Link href="/drone-portfolio" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium transition-transform hover:scale-105" style={{ color: 'var(--canvas)' }}>
      View Drone Portfolio &rarr;
    </Link>
  </div>
</Reveal>

// Then keep the `<Stagger>` block containing the droneMedia video cards below this text, or move them above the text based on the design requirement. The requirement was:
// Latest FPV Flights -> [ video showcase ] -> Want aerial footage? -> [ View Drone Portfolio ]

// Let's adjust the layout to match the required flow exactly:
```

*Revised plan for Step 1 layout logic:*
1. Section Header: "Latest FPV Flights" (`t.archivesTitle`)
2. Video Showcase (`<Stagger>` block with `droneMedia`)
3. Teaser Text & CTA: "Want aerial footage for your project? ..." -> "View Drone Portfolio ->"

- [ ] **Step 2: Apply the exact structural edit to `app/page.tsx`**
  - Edit the section to put the title first, then the video cards, then a centered CTA block below the videos.

- [ ] **Step 3: Build and verify**
  - Run build: `npm run build`
  - Expected: Build passes without errors.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx
git commit -m "refactor(home): simplify FPV section into a portfolio teaser CTA"
```

---

### Summary Checklist

- [ ] Task 1: Create `DroneServicesSection` component
- [ ] Task 2: Insert into Drone Portfolio page
- [ ] Task 3: Refactor Homepage teaser section
