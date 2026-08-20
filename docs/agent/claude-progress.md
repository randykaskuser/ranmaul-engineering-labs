# Session Progress

## 2026-08-19
- Added `next-themes` and `lucide-react` dependencies.
- Added `<ThemeProvider>` in `app/layout.tsx`.
- Updated `styles/tokens.css` with `[data-theme='dark']` block to support manual dark mode toggle.
- Created `<ThemeToggle>` component in `components/layout/theme-toggle.tsx`.
- Refactored `<SiteHeader>` in `components/layout/site-header.tsx`:
  - Added new `<ThemeToggle>` component.
  - Moved translation toggle outside the mobile dropdown menu.
  - Restructured mobile and desktop layouts for clearer accessibility.
- Fixed React warnings related to `useTheme` hydration and unescaped entities in CV component.
- Added `eslint-plugin-react` to fix CI linting errors caused by missing dependencies.
- Fixed 11 ESLint warnings across components and scripts.
- Cleaned up root directory by moving script files to temporary/scripts/ and removing unused directories.

- Refactored header navigation:
  - Replaced flat `NAV_LINKS` with grouped structure in `lib/site.ts`.
  - Built custom mega-dropdown component (`<NavDropdown>`) using `framer-motion`.
  - Grouped navigation into "Engineering" and "Explore" dropdowns on desktop.
  - Implemented accordion-style collapsible groups in mobile menu.
  - Added Lucide icons to dropdown items.

- Refactored footer layout:
  - Implemented 4-column responsive CSS grid layout matching the main navigation groups (Engineering, Explore, Elsewhere).
  - Built custom `<LinkedinIcon>` and `<InstagramIcon>` inline SVG components.
  - Added subtle hover interactions with `<ArrowUpRight>` on links.
  - Simplified bottom bar.

## 2026-08-20
- Completed Drone Services Refactor (Issue #26):
  - Created `<DroneServicesSection>` component displaying 3 service tiers.
  - Inserted new section into `app/drone-portfolio/page.tsx` above Equipment.
  - Refactored `app/page.tsx` home page FPV teaser to act as a CTA funnel.
  - Fixed hardcoded string bug in `app/page.tsx` by restoring `contentDict` translation keys for English and Indonesian.
- Fixed Drone Portfolio issues:
  - Added proper localized routing (`app/[locale]/drone-portfolio/page.tsx`) wrapping the base page, so `/en/drone-portfolio` and `/id/drone-portfolio` work properly.
  - Adjusted `app/drone-portfolio/page.tsx` to handle route params resolution safely.
  - Duplicated the english drone content into `content/portfolio/id/` so the indonesian version of the site has data to show.
  - Fixed location metadata mismatches in `content/portfolio/en/` portfolio mdx files (Batang Rest Area KM 371, Pandawa Beach, and Ciwidey Highlands now show correct locations).
  - Updated `<VideoGallery>` in `components/portfolio/video-gallery.tsx` to use the `<ConicHoverCard>` component so Instagram Reel thumbnails and styling match the homepage.
  - Fixed Journal "Latest Stories" in `app/[locale]/drone-portfolio/page.tsx` missing thumbnails by adding proper Next.js `<Image>` mapping to `story.coverImage`.
