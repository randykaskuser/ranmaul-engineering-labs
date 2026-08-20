import Link from "next/link";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { NAV_LINKS, type NavGroup, type NavItem } from "@/lib/site";
import { SiteContainer } from "./site-container";
import { LinkedinIcon, InstagramIcon, WhatsappIcon } from "@/components/icons/social-icons";

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
      <SiteContainer className="pt-12 pb-16 lg:pt-16 lg:pb-20">

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col pr-6">
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
              <a
                href="https://wa.me/6285887775179"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
                aria-label="WhatsApp Contact"
              >
                <WhatsappIcon className="size-5" />
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

        {/* MOBILE VIEW */}
        <div className="flex flex-col lg:hidden">
          {/* Accordions */}
          <div className="divide-y divide-hairline border-b border-hairline pb-8">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between py-5 text-[1.15rem] font-medium text-ink transition-colors hover:text-ink/80 focus:outline-none">
                Engineering
                <span className="relative size-5 flex items-center justify-center">
                  <Plus className="absolute size-5 transition-opacity group-open:opacity-0" />
                  <Minus className="absolute size-5 opacity-0 transition-opacity group-open:opacity-100" />
                </span>
              </summary>
              <ul className="flex flex-col gap-4 pb-6 pt-2">
                {engineeringGroup?.children.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between py-5 text-[1.15rem] font-medium text-ink transition-colors hover:text-ink/80 focus:outline-none">
                Explore
                <span className="relative size-5 flex items-center justify-center">
                  <Plus className="absolute size-5 transition-opacity group-open:opacity-0" />
                  <Minus className="absolute size-5 opacity-0 transition-opacity group-open:opacity-100" />
                </span>
              </summary>
              <ul className="flex flex-col gap-4 pb-6 pt-2">
                {exploreGroup?.children.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between py-5 text-[1.15rem] font-medium text-ink transition-colors hover:text-ink/80 focus:outline-none">
                Elsewhere
                <span className="relative size-5 flex items-center justify-center">
                  <Plus className="absolute size-5 transition-opacity group-open:opacity-0" />
                  <Minus className="absolute size-5 opacity-0 transition-opacity group-open:opacity-100" />
                </span>
              </summary>
              <ul className="flex flex-col gap-4 pb-6 pt-2">
                {elsewhereLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-body transition-colors hover:text-ink focus-visible:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            {/* Mobile Contact Link (Non-Accordion) */}
            <div className="py-5">
              <Link
                href="/contact"
                className="flex cursor-pointer items-center justify-between text-[1.15rem] font-medium text-ink transition-colors hover:text-ink/80"
              >
                Connect
                <Plus className="size-5 opacity-0" /> {/* Spacer to align text with accordions */}
              </Link>
            </div>
          </div>

          {/* Mobile Brand & Info */}
          <div className="mt-8 flex flex-col">
            <h3 className="font-serif text-xl text-ink">
              Engineering Labs
            </h3>

            <p className="mt-4 text-sm font-medium tracking-[0.05em] text-muted">
              QA Engineer · FPV Pilot · Tech Enthusiast
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8 text-xs text-muted lg:mt-16">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 lg:hidden">
            <p>© {new Date().getFullYear()} Randy Maulana.</p>
            <p>All rights reserved.</p>
          </div>
          <p className="hidden lg:block">© {new Date().getFullYear()} Randy Maulana. All rights reserved.</p>

          {/* Mobile Socials */}
          <div className="flex items-center gap-6 lg:hidden order-last w-full mt-4">
            <a
              href="https://www.linkedin.com/in/randymaulana/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="size-[22px]" />
            </a>
            <a
              href="https://instagram.com/newbie.drone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
              aria-label="Instagram Profile"
            >
              <InstagramIcon className="size-[22px]" />
            </a>
            <a
              href="https://wa.me/6285887775179"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
              aria-label="WhatsApp Contact"
            >
              <WhatsappIcon className="size-[22px]" />
            </a>
          </div>

          <p className="flex items-center gap-1.5 lg:order-last">
            Built with Next.js <span className="text-[10px]">♡</span>
          </p>
        </div>
      </SiteContainer>
    </footer>
  );
}
