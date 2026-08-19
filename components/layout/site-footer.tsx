import Link from "next/link";
import { getFlatNavLinks } from "@/lib/site";
import { SiteContainer } from "./site-container";

export function SiteFooter() {
  const flatLinks = getFlatNavLinks();

  return (
    <footer className="border-t border-hairline bg-canvas-soft">
      <SiteContainer className="section-space-sm">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <div className="flex flex-col gap-4 max-w-sm sm:max-w-md">
            <h3 className="text-xl font-bold tracking-tight">Randy M. Portfolio</h3>
            <p className="max-w-lg text-sm leading-7 text-body md:text-[0.95rem]">
              Drone projects, engineering notes, and fishkeeping journals from a QA Engineer who enjoys building, flying, and learning.
            </p>
            <p className="text-xs tracking-[0.12em] text-muted">
              QA Engineer · FPV Pilot · Tech Enthusiast
            </p>
          </div>

          <nav aria-label="Footer" className="md:justify-self-end">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-body">
              {flatLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-ink focus-visible:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} Randy M. All rights reserved.</p>
          <p>Built with Next.js</p>
        </div>
      </SiteContainer>
    </footer>
  );
}
