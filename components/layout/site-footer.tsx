import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, type NavGroup, type NavItem } from "@/lib/site";
import { SiteContainer } from "./site-container";
import { LinkedinIcon, InstagramIcon } from "@/components/icons/social-icons";

export function SiteFooter() {
  // Extract groups safely
  const engineeringGroup = NAV_LINKS.find(
    (item): item is NavGroup => "children" in item && item.label === "Engineering"
  );

  const exploreGroup = NAV_LINKS.find(
    (item): item is NavGroup => "children" in item && item.label === "Explore"
  );

  const elsewhereLinks: NavItem[] = [
    { href: "/notes", label: "Notes" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-hairline bg-canvas">
      <SiteContainer className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col lg:col-span-1 lg:max-w-[16rem]">
            <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">
              Engineering Labs
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-[0.95rem] leading-relaxed text-body">
              <p>Personal corner of Randy Maulana.</p>
              <p>Engineering, FPV, fishkeeping, and things I&apos;m building along the way.</p>
            </div>

            <p className="mt-6 text-xs font-medium tracking-[0.05em] text-muted">
              QA Engineer · FPV Pilot · Tech Enthusiast
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/randymaulana/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="size-5" />
              </a>
              <a
                href="https://instagram.com/newbie.drone"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Engineering */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Engineering
            </h4>
            <ul className="flex flex-col gap-3">
              {engineeringGroup?.children.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {exploreGroup?.children.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Elsewhere */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Elsewhere
            </h4>
            <ul className="flex flex-col gap-3">
              {elsewhereLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8 text-xs text-muted">
          <p>© {new Date().getFullYear()} Randy Maulana. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with Next.js <span className="text-[10px]">♡</span>
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}
