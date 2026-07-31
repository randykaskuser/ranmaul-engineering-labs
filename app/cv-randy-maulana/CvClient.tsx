'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, Download, FileText, Code2, PlaySquare, Workflow, MapPin } from 'lucide-react';

const CV_DATA = {
  name: "Randy\nMaulana",
  title: "SENIOR QA ENGINEER",
  domain: "MERCHANT EXPERIENCE",
  contact: {
    location: "Depok, Indonesia",
    email: "randy.maulana91@gmail.com",
    linkedin: "linkedin.com/in/randymaulana",
    github: "github.com/randymaulana"
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
    { name: "Mobile Test Automation", level: "EXPERT", icon: <SmartphoneIcon /> },
    { name: "Mobile Testing", level: "EXPERT", icon: <MobileIcon /> },
    { name: "XCUITest", level: "ADVANCED", icon: <AppleIcon /> },
    { name: "LLM-assisted Testing", level: "ADVANCED", icon: <BrainIcon /> },
    { name: "Playwright", level: "ADVANCED", icon: <PlayIcon /> },
    { name: "n8n", level: "INTERMEDIATE", icon: <WorkflowIcon /> },
    { name: "Docker", level: "INTERMEDIATE", icon: <DockerIcon /> }
  ],
  highlights: [
    { metric: "15m → 3m", desc: "Test execution time reduced", icon: <TimerIcon /> },
    { metric: "0% → 100%", desc: "Negative-path coverage automated", icon: <TargetIcon /> },
    { metric: "50%", desc: "Reduction in UAT monolith size", icon: <FileMinusIcon /> },
    { metric: "High Impact", desc: "Trusted across critical products", icon: <ShieldIcon /> }
  ],
  projects: [
    {
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      title: "Playwright Robot",
      badge: "OPEN SOURCE",
      desc: "A production-ready test automation framework with AI-powered helpers, reporting, and CI/CD integration.",
      links: [
        { label: "GitHub", icon: <GithubSvg className="w-4 h-4" /> },
        { label: "Docs", icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      icon: <BrainIcon className="w-5 h-5 text-purple-600" />,
      title: "AI UI Testing",
      badge: "ARTICLE",
      desc: "In-depth articles on leveraging LLMs to write better tests, analyze results, and reduce maintenance.",
      links: [
        { label: "Read Article", icon: <FileText className="w-4 h-4" /> },
        { label: "See Video", icon: <PlaySquare className="w-4 h-4" /> }
      ]
    },
    {
      icon: <TerminalIcon className="w-5 h-5 text-slate-800" />,
      title: "Automation Framework",
      badge: "CASE STUDY",
      desc: "End-to-end automation ecosystem built for the Merchant Experience domain at scale.",
      links: [
        { label: "Case Study", icon: <FileText className="w-4 h-4" /> },
        { label: "Architecture", icon: <Workflow className="w-4 h-4" /> }
      ]
    }
  ]
};

// Minimalist SVG Icons
function SmartphoneIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="M12 18h.01"/></svg> }
function MobileIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="1" strokeWidth="2"/></svg> }
function AppleIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44S8.22 5 6 5a4.9 4.9 0 0 0-5 4.78C1 14 4 22 7 22c1.25 0 2.5-1.06 4-1.06Z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 2c1 .5 2 2 2 5"/></svg> }
function BrainIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4 4.5 4.5 0 0 1 3 4 4.5 4.5 0 0 1 3-4Z"/></svg> }
function PlayIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" strokeWidth="2" strokeLinejoin="round"/></svg> }
function WorkflowIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="6" height="6" rx="1" strokeWidth="2"/><rect x="15" y="3" width="6" height="6" rx="1" strokeWidth="2"/><rect x="9" y="15" width="6" height="6" rx="1" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="M6 9v3a2 2 0 0 0 2 2h4M18 9v3a2 2 0 0 1-2 2h-4"/></svg> }
function DockerIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 12.5c0-2.5-2-4.5-4.5-4.5h-10c-2.5 0-4.5 2-4.5 4.5M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><rect x="2" y="12.5" width="20" height="7" rx="2" strokeWidth="2"/></svg> }
function TimerIcon({className="w-5 h-5 text-green-600"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/><path strokeWidth="2" strokeLinecap="round" d="M12 2v0"/></svg> }
function TargetIcon({className="w-5 h-5 text-green-600"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><circle cx="12" cy="12" r="6" strokeWidth="2"/><circle cx="12" cy="12" r="2" strokeWidth="2"/></svg> }
function FileMinusIcon({className="w-5 h-5 text-green-600"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M9 15h6"/></svg> }
function ShieldIcon({className="w-5 h-5 text-green-600"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4"/></svg> }
function TerminalIcon({className="w-5 h-5"}: {className?: string}) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="19" x2="20" y2="19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function GithubSvg({className="w-5 h-5"}: {className?: string}) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.18-.35 6.5-1.59 6.5-7.18 0-1.57-.56-2.86-1.5-3.87.15-.37.65-1.83-.15-3.81 0 0-1.2-.38-3.9 1.45a13.3 13.3 0 0 0-7 0C6.2 1.58 5 1.96 5 1.96c-.8 1.98-.3 3.44-.15 3.81-.94 1.01-1.5 2.3-1.5 3.87 0 5.58 3.32 6.83 6.49 7.18-.8.7-1.02 1.92-1.02 3.84V22"/><path d="M9 20c-4.5 1.5-5-2.5-7-3"/></svg> }

gsap.registerPlugin(useGSAP);

export default function CvClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Subtle, quick, linear fades typical of high-end editorial
    gsap.from('.reveal', {
      y: 10,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power1.out',
      delay: 0.1
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] text-[#475569] font-sans selection:bg-[#111827] selection:text-white pb-24">
      {/* Hide the default global navigation for this specific CV page */}
      <style dangerouslySetInnerHTML={{__html: `
        header, footer { display: none !important; }
        body > div { min-height: 100vh; }
        main { flex: 1; padding: 0 !important; }
      `}} />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E5E7EB] pt-16 md:pt-24 pb-8 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-end relative z-10">

          <div className="md:col-span-7 lg:col-span-8 pb-8 md:pb-12 reveal">
            <h1 className="text-[clamp(48px,8vw,96px)] font-bold text-[#111827] leading-[0.95] tracking-tight font-serif mb-6 whitespace-pre-line">
              {CV_DATA.name}
            </h1>
            <div className="flex items-center gap-3 text-xs font-mono font-medium tracking-[0.2em] text-[#94A3B8] mb-8">
              <span className="text-[#111827]">{CV_DATA.title}</span>
              <span className="w-4 h-px bg-[#E5E7EB]"></span>
              <span>{CV_DATA.domain}</span>
              <span className="w-8 h-px bg-[#65A30D]"></span>
            </div>
            <p className="text-lg md:text-[20px] leading-[1.8] text-[#475569] max-w-[600px] mb-12">
              {CV_DATA.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#475569]">
              <button className="flex items-center gap-2 bg-[#111827] text-white px-5 py-2.5 rounded-[14px] hover:bg-[#1f2937] transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Download CV
              </button>
              <a href={`mailto:${CV_DATA.contact.email}`} className="flex items-center gap-2 hover:text-[#111827] transition-colors">
                <Mail className="w-4 h-4" /> {CV_DATA.contact.email}
              </a>
              <a href={`https://${CV_DATA.contact.linkedin}`} className="flex items-center gap-2 hover:text-[#111827] transition-colors">
                <LinkedinIcon className="w-4 h-4" /> {CV_DATA.contact.linkedin}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {CV_DATA.contact.location}
              </span>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 relative reveal flex justify-end h-full">
            {/* 8+ Years Badge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-1/2 z-20 bg-[#111827] text-white p-6 rounded-2xl shadow-xl flex flex-col items-center border border-slate-800">
              <span className="text-3xl font-serif mb-1">8<span className="text-[#65A30D]">+</span></span>
              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase">Years</span>
              <span className="text-[11px] font-medium">Experience</span>
            </div>

            {/* Portrait Image (Using the AI-generated background as a placeholder for now, you can replace with your own transparent PNG) */}
            <div className="w-full max-w-[400px] aspect-[3/4] rounded-[36px] overflow-hidden flex items-end justify-center relative" style={{background: 'linear-gradient(135deg, #16203a, #0f172a)'}}>
               <div className="absolute inset-0" style={{background: 'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 60%)'}}></div>
               <img src="/assets/profile.png" alt="Profile" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[95%] object-contain mix-blend-screen opacity-50" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* LEFT COLUMN: EXPERIENCE */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center gap-4 mb-12 reveal">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111827]">Experience</h3>
              <div className="h-px bg-[#E5E7EB] flex-1"></div>
            </div>

            <div className="space-y-12">
              {CV_DATA.experience.map((job, index) => (
                <div key={index} className="relative pl-8 reveal">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-[#65A30D]"></div>
                  {index !== CV_DATA.experience.length - 1 && (
                    <div className="absolute left-[4px] top-6 bottom-[-32px] w-[1px] bg-[#E5E7EB]"></div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-2">
                    <h4 className="text-[22px] font-bold text-[#111827] font-serif">{job.company}</h4>
                    <span className="text-[11px] font-mono font-medium tracking-widest text-[#94A3B8]">{job.period}</span>
                  </div>
                  <h5 className="text-[15px] font-medium text-[#65A30D] mb-4">{job.role}</h5>

                  <ul className="space-y-3 mb-6">
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className="text-[15px] leading-[1.8] text-[#475569] flex items-start">
                        <span className="mr-3 mt-[9px] w-1 h-1 rounded-full bg-[#94A3B8] shrink-0"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 reveal">
              <button className="text-[13px] font-medium text-[#475569] hover:text-[#111827] flex items-center gap-2 transition-colors">
                View Full Experience →
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: EXPERTISE & HIGHLIGHTS */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-12">

            {/* Expertise */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 reveal">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111827] mb-8">Expertise</h3>
              <div className="space-y-1 divide-y divide-[#F8FAFC]">
                {CV_DATA.expertise.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-[#475569]">{skill.icon}</div>
                      <span className="text-[14px] font-medium text-[#111827]">{skill.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-8 reveal">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111827] mb-8">Highlights</h3>
              <div className="space-y-6">
                {CV_DATA.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="mt-1 bg-white p-2 rounded-lg border border-[#E5E7EB] shadow-sm">
                      {highlight.icon}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-[#111827] mb-0.5">{highlight.metric}</div>
                      <div className="text-[13px] text-[#475569] leading-snug">{highlight.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* FEATURED PROJECTS */}
        <div className="mt-24 pt-16 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-10 reveal">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111827]">Featured Projects</h3>
            <button className="text-[13px] font-medium text-[#475569] hover:text-[#111827] flex items-center gap-2 transition-colors">
                View All Projects →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CV_DATA.projects.map((project, index) => (
              <div key={index} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#94A3B8] transition-colors reveal flex flex-col h-full">
                <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-center mb-5">
                  {project.icon}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-[16px] font-bold text-[#111827]">{project.title}</h4>
                </div>
                <div className="mb-4">
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#65A30D] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    {project.badge}
                  </span>
                </div>
                <p className="text-[14px] text-[#475569] leading-relaxed mb-6 flex-1">
                  {project.desc}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[#F8FAFC]">
                  {project.links.map((link, i) => (
                    <a key={i} href="#" className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569] hover:text-[#111827]">
                      {link.icon} {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA FOOTER */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 mt-12">
        <section className="bg-[#111827] rounded-[28px] p-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 reveal overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Ready to scale quality?</h2>
            <p className="text-[#94A3B8] text-[15px]">Let's connect and build reliable products together.</p>
          </div>

          <div className="relative z-10 shrink-0">
             <button className="flex items-center gap-2 bg-[#65A30D] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#4d7c0f] transition-colors shadow-lg">
                <Mail className="w-4 h-4" /> Schedule a Call
             </button>
          </div>
        </section>
      </div>

    </div>
  );
}

function LinkedinIcon({className="w-4 h-4"}: {className?: string}) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}