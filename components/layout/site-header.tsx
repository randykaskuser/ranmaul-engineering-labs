"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { SiteContainer } from "./site-container";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"ID" | "EN">("EN");

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur">
      <SiteContainer>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
          <Link href="/" className="display-title text-xl tracking-tight text-ink">
            Engineering Labs
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full border border-hairline px-3 py-1.5 text-sm text-body md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>

          <div className="hidden items-center gap-4 md:flex">
            <nav aria-label="Primary">
              <ul className="flex items-center gap-6 text-sm font-medium text-body">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-ink focus-visible:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="inline-flex items-center rounded-full border border-hairline bg-surface-card p-1 text-xs">
              {(["ID", "EN"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={language === lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-2.5 py-1 font-medium transition ${
                    language === lang
                      ? "bg-primary text-on-primary"
                      : "text-body hover:text-ink"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-hairline py-4 md:hidden" aria-label="Mobile">
            <ul className="grid gap-2 text-sm text-body">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-hairline hover:text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-flex items-center rounded-full border border-hairline bg-surface-card p-1 text-xs">
              {(["ID", "EN"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={language === lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-2.5 py-1 font-medium transition ${
                    language === lang
                      ? "bg-primary text-on-primary"
                      : "text-body hover:text-ink"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </nav>
        ) : null}
      </SiteContainer>
    </header>
  );
}
