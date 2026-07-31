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
      </main>
    </div>
  );
}