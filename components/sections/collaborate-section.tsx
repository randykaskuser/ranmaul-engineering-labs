import { WhatsappIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/social-icons";
import { PaperPlaneIcon } from "@/components/icons/paper-plane";
import { MonitorPlay, Settings, Navigation, Code2 } from "lucide-react";

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
    <div className="editorial-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left side: Content */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 text-center md:text-left">
          <p className="type-kicker">{kicker}</p>
          <h2 className="display-title mt-4 text-4xl text-ink md:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-6 text-sm leading-7 text-body max-w-[42ch] mx-auto md:mx-0">
            {body}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:w-80 mx-auto md:mx-0">
            <a 
              href="https://wa.me/6285887775179" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas transition-transform hover:scale-[1.02]"
            >
              <WhatsappIcon className="size-5" />
              {btnWa}
            </a>
            <a 
              href="https://www.linkedin.com/in/randymaulana/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-hairline-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-card-soft"
            >
              <LinkedinIcon className="size-5" />
              {btnLi}
            </a>
            <a 
              href="https://instagram.com/newbie.drone" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-hairline-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-card-soft md:w-fit"
            >
              <InstagramIcon className="size-5" />
              {btnIg}
            </a>
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-xs font-medium text-muted">
            <span className="flex items-center gap-1.5"><MonitorPlay className="size-3.5" /> QA Engineering</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-1.5"><Settings className="size-3.5" /> Automation</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-1.5"><Navigation className="size-3.5" /> FPV Pilot</span>
            <span className="hidden sm:inline text-hairline-strong">•</span>
            <span className="flex items-center gap-1.5"><Code2 className="size-3.5" /> Technology</span>
          </div>
        </div>

        {/* Right side: Illustration (Desktop only) */}
        <div className="hidden md:flex items-center justify-center bg-surface-card-soft/50 p-8">
          <div className="relative w-full max-w-[400px] aspect-square">
            <PaperPlaneIcon className="w-full h-full text-hairline-strong" />
          </div>
        </div>
      </div>
    </div>
  );
}
