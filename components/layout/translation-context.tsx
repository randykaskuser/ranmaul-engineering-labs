"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/site";

// Article path -> translated article path, built at build time in the root layout.
// Passing it down (instead of setting it from the article page in an effect) keeps
// the language toggle correct in the static HTML, before any JS runs.
const TranslationContext = createContext<Record<string, string>>({});

export function TranslationProvider({
  translations,
  children,
}: {
  translations: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <TranslationContext.Provider value={translations}>
      <HtmlLang />
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}

// The root layout is shared by both locales, so it always renders lang="en".
// scripts/set-html-lang.mjs fixes the static HTML; this keeps it right after
// client-side navigation between locales.
function HtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = getLocaleFromPathname(pathname);
  }, [pathname]);

  return null;
}
