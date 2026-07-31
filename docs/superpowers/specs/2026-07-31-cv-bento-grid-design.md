# Private CV Page Design Specification

**Date**: 2026-07-31
**Topic**: CV Randy Maulana (Bento Grid Portfolio)

## 1. Overview and Purpose
Create a private, unindexed resume/CV page for Randy Maulana (`/cv-randy-maulana`). The design must strictly follow a **Bento Grid Dashboard** aesthetic, explicitly modeled after the provided reference (`docs/design-cv/Design-preview.png`). The page should feel like a premium, modern SaaS dashboard or high-end engineering portfolio—emphasizing structure, rounded cards, high information density without clutter, and measurable impact.

## 2. Scope & Constraints
- **Privacy First**: The page must not be linked from any global navigation (Header/Footer must be hidden on this route).
- **SEO Blocking**: Must include `robots: { index: false, follow: false }` metadata and be added to the `disallow` list in `robots.ts`.
- **Static Data**: Data will be hardcoded in the component using a structured JSON object (`CV_DATA`) since no external CMS/Notion sync is needed for this specific page.
- **Stack**: Next.js App Router (React), Tailwind CSS, Lucide React (for icons), and Framer Motion/GSAP (for subtle entrance animations).

## 3. Architecture & Components

The page will be built as a single Client Component (`CvClient.tsx`) inside the `/app/cv-randy-maulana/` directory.

### 3.1. Layout Structure (12-Column CSS Grid)
The layout will use CSS Grid with Tailwind (`grid-cols-1` on mobile, `lg:grid-cols-12` on desktop) to position the Bento Cards.

*   **Hero Bento (Top Row)**
    *   **Left Card (`col-span-12 lg:col-span-8`)**: Contains the massive Name ("Randy Maulana"), Role ("Senior QA Engineer — Merchant Experience"), a short summary paragraph, and a row of action buttons (Download CV, Email, LinkedIn, Location).
    *   **Right Card (`col-span-12 lg:col-span-4`)**: The visual card featuring a dark background/gradient, the portrait image (placeholder for now), and a floating "8+ Years Experience" badge.
*   **Main Content Grid (Middle Row)**
    *   **Left Column (`col-span-12 lg:col-span-8`)**:
        *   **Experience Card**: A unified card containing a vertical timeline of roles (Grab, KUDO, Grab Helpdesk). Each role includes the company, dates, title, impact-driven bullet points, and tech stack pills.
    *   **Right Column (`col-span-12 lg:col-span-4`)**:
        *   **Expertise Card**: A list of core skills (e.g., Mobile Test Automation, Playwright) with right-aligned "Level" badges (EXPERT, ADVANCED).
        *   **Highlights Card**: A stacked list of key metrics (e.g., "15m → 3m", "0% → 100%") with small green icons.
*   **Featured Projects (Bottom Row)**
    *   Three equal-width cards (`col-span-12 md:col-span-4` each) displaying "Playwright Robot", "AI UI Testing", and "Automation Framework". Each contains an icon, title, category badge, description, and footer links.
*   **CTA Banner (Footer)**
    *   A full-width, dark navy card (`col-span-12`) with a bold headline ("Ready to scale quality?") and a prominent green CTA button ("Schedule a Call").

### 3.2. Visual Styling & CSS Tokens
- **Bento Card Style**: 
  - Background: White (`#FFFFFF`).
  - Border: 1px solid very light gray (`#E5E7EB` or `slate-200`).
  - Radius: Large rounded corners (`rounded-3xl` / `24px`).
  - Shadow: Soft, subtle shadow.
  - Hover State: `transform translateY(-4px) scale(1.01)` with a slightly darker border and expanded shadow.
- **Background**: Very light gray (`#F8FAFC` or `slate-50`) to make the white cards pop.
- **Typography**: Clean Sans-Serif (`var(--font-inter)`). Headings will use bold weights (`font-bold`, `tracking-tight`), while metadata and tags will use monospace (`font-mono`, `uppercase`, `tracking-widest`).
- **Colors**:
  - Text: Slate 900 for headings, Slate 600 for body.
  - Accents: Green (`#16A34A` / `green-600`) for success metrics, badges, and primary CTA. Blue (`#2563EB`) for secondary highlights.

## 4. Animation & Interaction
- **Entrance**: A very fast, subtle `stagger` fade-in or slide-up on load (using GSAP or Framer Motion). No slow or heavy animations.
- **Hover**: CSS-only transitions on the Bento Cards for a tactile, responsive feel.

## 5. Security & Fallbacks
- The page contains PII (Personally Identifiable Information). It must remain strictly unindexed.
- If the portrait image is missing, the layout must gracefully handle a fallback colored box without breaking the grid.