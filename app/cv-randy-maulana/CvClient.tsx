'use client';

import { Mail, ArrowUpRight, Code2, PlaySquare, Workflow, FileText } from 'lucide-react';

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