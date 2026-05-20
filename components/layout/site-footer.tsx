import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { SiteContainer } from "./site-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas-soft">
      <SiteContainer className="section-space-sm">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <div className="space-y-4">
            <p className="display-title text-2xl text-ink md:text-3xl">Engineering Labs</p>
            <p className="max-w-lg text-sm leading-7 text-body md:text-[0.95rem]">
              A technical editorial platform documenting QA automation, FPV systems,
              fishkeeping engineering, and cinematic drone field work.
            </p>
            <p className="text-xs tracking-[0.12em] text-muted">
              Premium engineering editorial · Minimal by default · Built for long-form readability
            </p>
          </div>

          <nav aria-label="Footer" className="md:justify-self-end">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-body">
              {NAV_LINKS.map((link) => (
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
          <p>© {new Date().getFullYear()} Engineering Labs. All notes are published for learning and reuse.</p>
          <p>Built with Next.js · Content-first architecture</p>
        </div>
      </SiteContainer>
    </footer>
  );
}
