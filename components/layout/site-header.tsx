"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";




import { ChevronDown, Plus, Minus } from "lucide-react";
import { NAV_LINKS, MOBILE_NAV_GROUPS } from "@/lib/site";

import { SiteContainer } from "./site-container";
import { LinkedinIcon, InstagramIcon } from "@/components/icons/social-icons";
import { NavLink } from "./nav-link";
import { NavDropdown } from "./nav-dropdown";
import { useTranslationContext } from "./translation-context";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const pathname = usePathname();
  const { alternateUrl } = useTranslationContext();

  const locale = pathname?.startsWith("/id") ? "id" : "en";
  const localizedDomains = ["/qa", "/fpv", "/fishkeeping", "/notes"];

  const getLocalizedHref = (href: string) => {
    if (localizedDomains.includes(href)) {
      return `/${locale}${href}`;
    }
    return href;
  };

  const otherLocale = locale === "en" ? "id" : "en";
  const localeSwitchHref =
    alternateUrl ??
    (() => {
      if (!pathname || pathname === "/") {
        return `/${otherLocale}`;
      }

      const segments = pathname.split("/").filter(Boolean);
      if (
        segments.length > 0 &&
        (segments[0] === "en" || segments[0] === "id")
      ) {
        segments[0] = otherLocale;
        return `/${segments.join("/")}`;
      }

      return `/${otherLocale}${pathname}`;
    })();

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/92 backdrop-blur">
      <SiteContainer>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
          <Link
            href="/"
            className="display-title text-xl tracking-tight text-ink"
          >
            Engineering Labs
          </Link>

          {/* Mobile Right Section */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={localeSwitchHref}
              className="inline-flex h-8 items-center rounded-full border border-hairline bg-surface-card/70 px-3 text-xs font-medium text-body transition hover:border-hairline-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hairline-strong"
            >
              {locale.toUpperCase()}
            </Link>

            <ThemeToggle />

            <button
              type="button"
              aria-label="Toggle menu"
              className="ml-1 rounded-full border border-hairline bg-surface-card/60 px-3 py-1.5 text-sm font-medium text-body"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </button>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-3 md:flex">
            <nav aria-label="Primary">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((entry) => {
                  if ("children" in entry) {
                    return (
                      <li key={entry.label}>
                        <NavDropdown
                          group={entry}
                          getLocalizedHref={getLocalizedHref}
                        />
                      </li>
                    );
                  }
                  return (
                    <li key={entry.href}>
                      <NavLink href={getLocalizedHref(entry.href)}>
                        {entry.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-2 flex items-center gap-2 border-l border-hairline pl-4">
              <Link
                href={localeSwitchHref}
                className="inline-flex h-8 items-center rounded-full border border-hairline bg-surface-card/70 px-3 text-xs font-medium text-body transition hover:border-hairline-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hairline-strong"
              >
                {locale.toUpperCase()} → {otherLocale.toUpperCase()}
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden border-t border-hairline md:hidden"
              aria-label="Mobile"
            >
              <div className="mx-4 my-6 overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-sm">
                <ul className="divide-y divide-hairline">
                  {MOBILE_NAV_GROUPS.map((entry) => {
                    if ("children" in entry) {
                      const isExpanded = expandedGroups.includes(entry.label);
                      return (
                        <li key={entry.label} className="bg-canvas">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-surface-card/60"
                            onClick={() => toggleGroup(entry.label)}
                          >
                            <span className="font-medium text-ink">{entry.label}</span>
                            {isExpanded ? (
                              <Minus className="size-4 text-muted" />
                            ) : (
                              <Plus className="size-4 text-muted" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-surface-card/30"
                              >
                                <ul className="flex flex-col gap-1 px-3 py-2">
                                  {entry.children.map((child) => {
                                    const Icon = child.icon;
                                    return (
                                      <li key={child.href}>
                                        <Link
                                          href={getLocalizedHref(child.href)}
                                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-body transition-colors hover:bg-canvas/80 hover:text-ink"
                                          onClick={() => setOpen(false)}
                                        >
                                          {Icon && <Icon className="size-4 text-muted" />}
                                          {child.label}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>

                {/* Brand Info & Socials inside mobile card */}
                <div className="bg-canvas p-5 pt-6">
                  <div>
                    <h3 className="font-serif text-[1.15rem] font-medium tracking-tight text-ink">
                      Engineering Labs
                    </h3>
                    <p className="mt-1 text-xs font-medium tracking-[0.02em] text-muted">
                      QA Engineer · FPV Pilot · Tech Enthusiast
                    </p>
                  </div>

                  <div className="mt-6 text-[0.7rem] font-medium tracking-[0.02em] text-muted uppercase">
                    <p>© {new Date().getFullYear()} Randy Maulana.</p>
                    <p className="mt-0.5">All rights reserved.</p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <a
                      href="https://www.linkedin.com/in/randymaulana/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-ink"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="size-5" />
                    </a>
                    <a
                      href="https://instagram.com/newbie.drone"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-ink"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="size-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </SiteContainer>
    </header>
  );
}
