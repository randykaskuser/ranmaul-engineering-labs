import { WhatsappIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/social-icons";
import { MonitorPlay, Settings, Navigation, Code2 } from "lucide-react";
import Image from "next/image";

interface CollaborateSectionProps {
  kicker: string;
  title: string;
  body: string;
  btnWa: string;
  btnLi: string;
  btnIg: string;
}

export function CollaborateSection({
  kicker,
  title,
  body,
  btnWa,
  btnLi,
  btnIg,
}: CollaborateSectionProps) {
  return (
    <div className="editorial-card overflow-hidden bg-canvas rounded-2xl md:rounded-3xl border border-hairline relative">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6">

        {/* Left side: Content */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 text-center md:text-left z-10">
          <p className="type-kicker mb-4">{kicker}</p>
          <h2 className="display-title text-[2.25rem] md:text-5xl lg:text-[3.5rem] text-ink leading-[1.1] tracking-tight">
            {title}
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-[1.8] text-body max-w-[42ch] mx-auto md:mx-0">
            {body}
          </p>

          {/* Buttons Group */}
          <div className="mt-8 flex flex-col md:flex-row flex-wrap gap-3 w-full max-w-[28rem] mx-auto md:mx-0">
            {/* WhatsApp (Primary) */}
            <a
              href="https://wa.me/6285887775179"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[0.9rem] font-medium transition-transform hover:scale-[1.02] md:flex-auto"
              style={{ color: 'var(--canvas)' }}
            >
              <WhatsappIcon className="size-[1.15rem]" />
              {btnWa}
            </a>

            {/* LinkedIn (Secondary) */}
            <a
              href="https://www.linkedin.com/in/randymaulana/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-full border border-hairline-strong px-6 py-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:bg-surface-card-soft md:flex-1 md:min-w-fit"
            >
              <LinkedinIcon className="size-[1.15rem]" />
              {btnLi}
            </a>

            {/* Instagram (Tertiary, icon-only on mobile if needed, but text shown as per mockup) */}
            <a
              href="https://instagram.com/newbie.drone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-full border border-hairline-strong px-6 py-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:bg-surface-card-soft md:flex-none"
            >
              <InstagramIcon className="size-[1.15rem]" />
              <span className="md:hidden lg:inline">{btnIg}</span>
            </a>
          </div>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-3 text-[0.8125rem] font-medium text-muted">
            <span className="flex items-center gap-2"><MonitorPlay className="size-4 opacity-70" /> QA Engineering</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-2"><Settings className="size-4 opacity-70" /> Automation</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-2"><Navigation className="size-4 opacity-70" /> FPV Pilot</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-2"><Code2 className="size-4 opacity-70" /> Technology</span>
          </div>
        </div>

        {/* Right side: Illustration (Desktop only) */}
        <div className="hidden md:flex items-center justify-center relative min-h-[320px]">
          {/* Subtle gradient background for the right side */}
          <div className="absolute inset-0 bg-gradient-to-l from-surface-card-soft/30 to-transparent pointer-events-none" />

          <div className="relative w-full max-w-[280px] aspect-square">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-muted opacity-[0.15]">
              {/* Target / Radar circles */}
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" />
              <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" />

              {/* Radar lines */}
              <path d="M20 200 H380 M200 20 V380" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />
              <path d="M72.7 72.7 L327.3 327.3 M72.7 327.3 L327.3 72.7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" />

              {/* Trajectory dashed path */}
              <path
                d="M150 150 C 200 180, 250 250, 180 300 C 120 340, 50 250, 100 200 C 120 180, 140 180, 150 150"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeDasharray="6 8"
                fill="none"
                className="opacity-40"
              />

              {/* Dots / Nodes */}
              <circle cx="320" cy="120" r="3" fill="currentColor" />
              <circle cx="280" cy="220" r="2" fill="currentColor" />
              <circle cx="100" cy="350" r="2" fill="currentColor" />
              <circle cx="360" cy="330" r="3" fill="currentColor" />
              <circle cx="220" cy="80" r="2" fill="currentColor" />
            </svg>

            {/* 3D Paper Plane Representation */}
            <div className="absolute top-[10%] left-[10%] transform -rotate-12 scale-[0.8] lg:scale-100">
              <svg width="180" height="140" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                {/* Left wing (shadowed) */}
                <path d="M10 20 L160 60 L60 130 Z" fill="var(--surface-card-soft)" stroke="var(--hairline-strong)" strokeWidth="1" />
                {/* Right wing (bright) */}
                <path d="M160 60 L60 130 L90 80 Z" fill="white" stroke="var(--hairline-strong)" strokeWidth="1" />
                {/* Body/Fold (darkest) */}
                <path d="M90 80 L60 130 L75 145 Z" fill="var(--muted)" className="opacity-20" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
