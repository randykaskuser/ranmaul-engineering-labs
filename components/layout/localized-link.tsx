"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, localizeHref } from "@/lib/site";

// Link that prefixes locale-only sections (/qa, /fpv, ...) with the current locale.
// Lets server components such as the footer use plain nav hrefs.
export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const locale = getLocaleFromPathname(usePathname());
  return <Link href={localizeHref(href, locale)} {...props} />;
}
