"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { SiteContainer } from "./site-container";
import { NavLink } from "./nav-link";
import { useTranslationContext } from "./translation-context";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
  const localeSwitchHref = alternateUrl ?? (() => {
    if (!pathname || pathname === "/") {
      return `/${otherLocale}`;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (segments[0] === "en" || segments[0] === "id")) {
      segments[0] = otherLocale;
      return `/${segments.join("/")}`;
    }

    return `/${otherLocale}${pathname}`;
  })();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/92 backdrop-blur">
      <SiteContainer>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
          <Link href="/" className="display-title text-xl tracking-tight text-ink">
            Engineering Labs
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full border border-hairline bg-surface-card/60 px-3 py-1.5 text-sm font-medium text-body md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <nav aria-label="Primary">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink href={getLocalizedHref(link.href)}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href={localeSwitchHref}
              className="inline-flex items-center rounded-full border border-hairline bg-surface-card/70 px-3 py-1 text-xs font-medium text-body transition hover:border-hairline-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hairline-strong"
            >
              {locale.toUpperCase()} → {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-hairline py-4 md:hidden" aria-label="Mobile">
            <ul className="grid gap-2 text-[0.95rem] text-body">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalizedHref(link.href)}
                    className="block rounded-2xl border border-transparent px-3 py-2.5 font-medium transition-colors hover:border-hairline hover:bg-surface-card/60 hover:text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href={localeSwitchHref}
                className="inline-flex items-center rounded-full border border-hairline bg-surface-card/70 px-3 py-1 text-xs font-medium text-body transition hover:border-hairline-strong hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {locale.toUpperCase()} → {otherLocale.toUpperCase()}
              </Link>
            </div>
          </nav>
        ) : null}
      </SiteContainer>
    </header>
  );
}
