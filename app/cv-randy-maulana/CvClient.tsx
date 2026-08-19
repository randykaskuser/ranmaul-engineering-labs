'use client';

import { Mail, ArrowUpRight, MapPin } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function LinkedinIcon({className="w-4 h-4"}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }

import Image from 'next/image';

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

          <section className="bento-card lg:col-span-4 p-8 flex flex-col justify-between min-h-[360px] bg-[#18181B] text-white border-none relative overflow-hidden group">
             {/* Background glow behind portrait */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 z-0"></div>
             <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl z-0 transition-transform duration-700 group-hover:scale-110"></div>

             {/* 8+ Years Badge */}
            <div className="absolute top-6 right-6 z-30 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-2xl flex flex-col items-center border border-white/10 shadow-xl">
              <span className="text-2xl font-bold mb-0.5 leading-none">8<span className="text-[#65A30D]">+</span></span>
              <span className="text-[9px] font-mono tracking-widest text-slate-300 uppercase mt-1">Years</span>
            </div>

             {/* Actual Portrait - Scaled to fill the bottom area and masked to blend perfectly */}
             <div className="absolute inset-x-0 bottom-0 top-[15%] z-10 pointer-events-none flex items-end justify-center">
               <Image
                 src="/assets/profile.png"
                 alt="Randy Maulana"
                 fill
                 className="object-cover object-bottom drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 opacity-90"
                 style={{
                   maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                   WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                 }}
               />
               {/* Dark gradient overlay at the very bottom to ensure text readability */}
               <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#18181B] via-[#18181B]/80 to-transparent pointer-events-none"></div>
             </div>

            {/* Header Content */}
            <div className="relative z-20 pointer-events-none">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/5 shadow-lg">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 drop-shadow-lg">Let's Connect</h3>
            </div>

            {/* Contact Pills - Placed nicely within glass panel */}
            <div className="space-y-3 font-mono text-sm z-30 relative bg-slate-900/40 p-5 rounded-xl backdrop-blur-md border border-white/10 mt-auto shadow-2xl pointer-events-auto">
              <a href={`mailto:${CV_DATA.contact.email}`} className="flex items-center gap-3 text-slate-100 hover:text-white transition-colors drop-shadow-md font-bold relative z-40">
                 <Mail className="w-4 h-4 shrink-0 text-blue-400" />
                 {CV_DATA.contact.email}
              </a>
              <div className="flex items-center gap-3 text-slate-200 drop-shadow-md relative z-40">
                 <MapPin className="w-4 h-4 shrink-0 text-blue-400" />
                 {CV_DATA.contact.location}
              </div>
              <a href={CV_DATA.contact.linkedin} className="flex items-center gap-3 text-blue-300 hover:text-blue-200 transition-colors mt-4 drop-shadow-md relative z-40">
                 <LinkedinIcon className="w-4 h-4 shrink-0" />
                 LinkedIn <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </section>
        </div>

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
      </main>

    </div>
  );
}