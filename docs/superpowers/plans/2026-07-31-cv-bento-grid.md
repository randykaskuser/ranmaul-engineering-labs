# CV Randy Maulana (Bento Grid Portfolio) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a private, unindexed resume/CV page for Randy Maulana using a Bento Grid Dashboard aesthetic.

**Architecture:** A single Next.js Client Component (`CvClient.tsx`) inside the `/app/cv-randy-maulana/` directory, using Tailwind CSS Grid for the 12-column bento layout and GSAP for entrance animations. Hardcoded data, hidden from global layout components, and excluded from search engines.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Lucide React, GSAP / Framer Motion.

## Global Constraints

- **Privacy First**: Header/Footer must be hidden on this route.
- **SEO Blocking**: Must include `robots: { index: false, follow: false }` metadata and be added to the `disallow` list in `robots.ts`.
- **Static Data**: Data hardcoded in `CV_DATA` object.

---

### Task 1: Route Setup and SEO Blocking

**Files:**
- Create: `app/cv-randy-maulana/page.tsx`
- Modify: `app/robots.ts`

**Interfaces:**
- Produces: An unindexed Next.js page route that renders a placeholder client component.

- [ ] **Step 1: Write the unindexed page with metadata**

```tsx
// app/cv-randy-maulana/page.tsx
import { Metadata } from 'next';
import CvClient from './CvClient';

export const metadata: Metadata = {
  title: 'CV - Randy Maulana',
  description: 'Senior QA Engineer specializing in the Merchant Experience domain.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function CVPage() {
  return <CvClient />;
}
```

- [ ] **Step 2: Create placeholder client component**

```tsx
// app/cv-randy-maulana/CvClient.tsx
'use client';

export default function CvClient() {
  return <div data-testid="cv-client">CV Client</div>;
}
```

- [ ] **Step 3: Update robots.ts to disallow the route**

Modify `app/robots.ts` (assuming it exists, adjust accordingly if not) to include the disallow rule:

```typescript
// app/robots.ts (ensure this matches existing structure or create if missing)
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cv-randy-maulana'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Verify build (No specific unit test needed for Next.js metadata/robots in this context, just build check)**

Run: `npx next build`
Expected: Successful build without errors.

- [ ] **Step 5: Commit**

```bash
git add app/cv-randy-maulana/page.tsx app/cv-randy-maulana/CvClient.tsx app/robots.ts
git commit -m "feat: setup private cv route with SEO blocking"
```

---

### Task 2: Bento Grid Layout Structure and Base Styling

**Files:**
- Modify: `app/cv-randy-maulana/CvClient.tsx`

**Interfaces:**
- Consumes: The placeholder `CvClient.tsx` created in Task 1.
- Produces: The main CSS Grid structure for the Bento Dashboard and the `CV_DATA` constant.

- [ ] **Step 1: Define CV_DATA and base Layout**

```tsx
// app/cv-randy-maulana/CvClient.tsx
'use client';

import { Mail, ArrowUpRight, Code2, PlaySquare, Workflow, Github, FileText } from 'lucide-react';

const CV_DATA = {
  name: "Randy\nMaulana",
  title: "SENIOR QA ENGINEER",
  domain: "MERCHANT EXPERIENCE",
  contact: {
    location: "Depok, Indonesia",
    email: "randy.maulana91@gmail.com",
    linkedin: "https://linkedin.com/in/randymaulana",
    github: "https://github.com/randymaulana"
  },
  summary: "Senior QA Engineer specializing in the Merchant Experience domain, with a track record of scaling quality for high-impact platforms. I bridge the gap between testing and engineering by building stable, AI-driven automation frameworks that accelerate delivery.",
  experience: [
    {
      company: "Grab",
      role: "Senior QA Engineer, Merchant Experience",
      period: "APR 2017 - MAY 2026",
      bullets: [
        "Cut down test execution time from 15m to just 3m per scenario by optimizing the framework and handling dynamic UI elements more efficiently.",
        "Migrated unstable E2E UI tests to stable Go UAT (Medium Tests), making the CI pipeline much more reliable and reducing technical debt.",
        "Tidied up the UAT codebase by restructuring feature files and breaking down huge monoliths—like reducing a 1,000-line file by ~50%—into clean, service-specific modules.",
        "Boosted negative-path coverage from 0% to 100% automated and added security checks for RBAC.",
      ]
    },
    {
      company: "PT Kudo Teknologi Indonesia (KUDO)",
      role: "QA Engineer",
      period: "JUL 2017 - OCT 2019",
      bullets: [
        "Developed and maintained automated test suites for the GrabKiosk (Kudo) mobile app using Robot Framework and Python.",
        "Built and executed Backend (BE) automation using Postman to ensure API reliability.",
        "Performed end-to-end testing for core transaction flows, ensuring a seamless experience for thousands of agents.",
      ]
    },
    {
      company: "Grab",
      role: "IT Helpdesk",
      period: "NOV 2016 - JUL 2017",
      bullets: [
        "Handled complex technical issues escalated from the L1 support team.",
        "Analyzed system logs and databases to identify the root cause of product errors.",
        "Reproduced and verified reported bugs.",
      ]
    }
  ],
  expertise: [
    { name: "Mobile Test Automation", level: "EXPERT" },
    { name: "Mobile Testing", level: "EXPERT" },
    { name: "XCUITest", level: "ADVANCED" },
    { name: "LLM-assisted Testing", level: "ADVANCED" },
    { name: "Playwright", level: "ADVANCED" },
    { name: "n8n", level: "INTERMEDIATE" },
    { name: "Docker", level: "INTERMEDIATE" }
  ],
  highlights: [
    { metric: "15m → 3m", desc: "Test execution time reduced" },
    { metric: "0% → 100%", desc: "Negative-path coverage automated" },
    { metric: "50%", desc: "Reduction in UAT monolith size" },
    { metric: "High Impact", desc: "Trusted across critical products" }
  ],
  projects: [
    {
      title: "Playwright Robot",
      badge: "OPEN SOURCE",
      desc: "A production-ready test automation framework with AI-powered helpers, reporting, and CI/CD integration."
    },
    {
      title: "AI UI Testing",
      badge: "ARTICLE",
      desc: "In-depth articles on leveraging LLMs to write better tests, analyze results, and reduce maintenance."
    },
    {
      title: "Automation Framework",
      badge: "CASE STUDY",
      desc: "End-to-end automation ecosystem built for the Merchant Experience domain at scale."
    }
  ]
};

export default function CvClient() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#09090B] font-sans selection:bg-[#2563EB] selection:text-white pb-24">
      {/* Hide global nav */}
      <style dangerouslySetInnerHTML={{__html: `
        header, footer { display: none !important; }
        body > div { min-height: 100vh; }
        main { flex: 1; padding: 0 !important; }
        .bento-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .bento-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
          border-color: #D4D4D8;
        }
      `}} />

      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 md:px-12">
         <div data-testid="bento-container" className="space-y-6">
            {/* Grid will be populated in next tasks */}
         </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify Build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/cv-randy-maulana/CvClient.tsx
git commit -m "feat: add cv data and base bento layout wrapper"
```

---

### Task 3: Hero and Profile Cards (Top Row)

**Files:**
- Modify: `app/cv-randy-maulana/CvClient.tsx`

**Interfaces:**
- Consumes: The `CV_DATA` object and `.bento-card` styles from Task 2.
- Produces: The top row of the Bento grid (Name card + Contact/Portrait card).

- [ ] **Step 1: Implement Hero Grid**

Update the `main` tag content in `CvClient.tsx` to include the first grid row:

```tsx
// Inside main tag of app/cv-randy-maulana/CvClient.tsx
        {/* HERO BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <section className="bento-card lg:col-span-8 p-10 md:p-14 relative overflow-hidden flex flex-col justify-end min-h-[360px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-bl-[100px] -z-10 opacity-50 blur-3xl pointer-events-none" />

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-[#18181B] mb-6 whitespace-pre-line">
              {CV_DATA.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-[#64748B] mb-4">
              {CV_DATA.title} <span className="mx-2 text-slate-300">|</span> <span className="text-[#2563EB]">{CV_DATA.domain}</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-700 font-medium max-w-2xl mt-4">
               {CV_DATA.summary}
            </p>
          </section>

          <section className="bento-card lg:col-span-4 p-8 flex flex-col justify-between min-h-[360px] bg-[#18181B] text-white border-none relative overflow-hidden">
             {/* 8+ Years Badge */}
            <div className="absolute top-8 right-8 z-20 bg-white/10 backdrop-blur-md text-white p-4 rounded-xl flex flex-col items-center border border-white/20">
              <span className="text-2xl font-bold mb-0.5">8<span className="text-[#65A30D]">+</span></span>
              <span className="text-[9px] font-mono tracking-widest text-slate-300 uppercase">Years</span>
            </div>

            <div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Let's Connect</h3>
            </div>

            <div className="space-y-3 font-mono text-sm z-10">
              <a href={`mailto:${CV_DATA.contact.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                 {CV_DATA.contact.email}
              </a>
              <div className="flex items-center gap-3 text-slate-300">
                 {CV_DATA.contact.location}
              </div>
              <a href={CV_DATA.contact.linkedin} className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors mt-4">
                 LinkedIn <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
             {/* Portrait Placeholder (Background) */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
             {/* Note: Add <img src="/assets/profile.png" /> here later if needed, absolutely positioned bottom-right */}
          </section>
        </div>
```

- [ ] **Step 2: Verify Build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/cv-randy-maulana/CvClient.tsx
git commit -m "feat: implement hero and contact bento cards"
```

---

### Task 4: Experience, Expertise, and Highlights Grid

**Files:**
- Modify: `app/cv-randy-maulana/CvClient.tsx`

**Interfaces:**
- Consumes: `CV_DATA` object arrays (`experience`, `expertise`, `highlights`).

- [ ] **Step 1: Implement Middle Grid Sections**

Append this below the Hero Grid inside `main`:

```tsx
// Inside main tag, below the first grid
        {/* MIDDLE GRID: EXPERIENCE (Left) & EXPERTISE/HIGHLIGHTS (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
           {/* Experience List (8 cols) */}
           <section className="bento-card lg:col-span-8 p-8 md:p-10">
              <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-slate-400 mb-8">Work Experience</h3>
              <div className="space-y-10">
                {CV_DATA.experience.map((job, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
                      <div>
                        <h4 className="text-xl font-bold tracking-tight text-[#18181B]">{job.company}</h4>
                        <h5 className="text-md font-medium text-[#2563EB]">{job.role}</h5>
                      </div>
                      <div className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold font-mono uppercase tracking-widest rounded-full shrink-0 border border-slate-200">
                        {job.period}
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {job.bullets.map((bullet, i) => (
                        <li key={i} className="text-slate-600 text-[14px] leading-relaxed pl-5 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[#2563EB] before:rounded-full">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
           </section>

           {/* Expertise & Highlights (4 cols) */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Expertise */}
              <section className="bento-card p-8 flex-1">
                 <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-slate-400 mb-6">Core Expertise</h3>
                 <div className="flex flex-col gap-3">
                    {CV_DATA.expertise.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <span className="font-semibold text-slate-700 text-sm">{skill.name}</span>
                        <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded">
                           {skill.level}
                        </span>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Highlights */}
              <section className="bento-card p-8 bg-slate-50 border-none">
                 <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-slate-400 mb-6">Highlights</h3>
                 <div className="flex flex-col gap-5">
                    {CV_DATA.highlights.map((highlight, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="text-lg font-bold text-[#18181B]">{highlight.metric}</div>
                        <div className="text-xs text-slate-500">{highlight.desc}</div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>
        </div>
```

- [ ] **Step 2: Verify Build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/cv-randy-maulana/CvClient.tsx
git commit -m "feat: implement experience and expertise bento grids"
```

---

### Task 5: Featured Projects and Footer CTA

**Files:**
- Modify: `app/cv-randy-maulana/CvClient.tsx`

**Interfaces:**
- Consumes: `CV_DATA.projects`.

- [ ] **Step 1: Implement Projects and Footer**

Append this below the Middle Grid:

```tsx
// Inside main tag, below middle grid
        {/* FEATURED PROJECTS (Bottom Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {CV_DATA.projects.map((project, index) => (
              <section key={index} className="bento-card p-6 flex flex-col">
                 <div className="mb-4">
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#65A30D] bg-green-50 px-2 py-1 rounded border border-green-100">
                      {project.badge}
                    </span>
                 </div>
                 <h4 className="text-lg font-bold text-[#18181B] mb-2">{project.title}</h4>
                 <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    {project.desc}
                 </p>
              </section>
           ))}
        </div>

        {/* CTA FOOTER */}
        <section className="bg-[#111827] rounded-[24px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Ready to scale quality?</h2>
            <p className="text-[#94A3B8] text-sm">Let's connect and build reliable products together.</p>
          </div>

          <div className="relative z-10 shrink-0">
             <a href={`mailto:${CV_DATA.contact.email}`} className="flex items-center gap-2 bg-[#16A34A] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#15803d] transition-colors shadow-lg">
                <Mail className="w-4 h-4" /> Schedule a Call
             </a>
          </div>
        </section>
```

- [ ] **Step 2: Verify Build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/cv-randy-maulana/CvClient.tsx
git commit -m "feat: implement featured projects and CTA footer"
```

---

### Task 6: Add GSAP Animations

**Files:**
- Modify: `app/cv-randy-maulana/CvClient.tsx`

**Interfaces:**
- Consumes: The rendered HTML nodes with `.bento-card` classes.

- [ ] **Step 1: Apply GSAP Stagger Animation**

Wrap the imports and add the GSAP hook at the top of the component:

```tsx
// app/cv-randy-maulana/CvClient.tsx (add to imports)
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ... existing code ...
gsap.registerPlugin(useGSAP);

export default function CvClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Subtle, fast UI reveal typical of modern SaaS dashboards
    gsap.from('.bento-card', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.1
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFDFD] text-[#09090B] font-sans selection:bg-[#2563EB] selection:text-white pb-24">
// ... rest of component ...
```

- [ ] **Step 2: Verify Build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/cv-randy-maulana/CvClient.tsx
git commit -m "feat: add subtle gsap stagger entrance animation to bento cards"
```
