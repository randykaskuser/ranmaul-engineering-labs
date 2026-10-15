"use client";

import { Rss } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/site";

// Plain <a>, not next/link: the feed is an XML file, not a page.
export function FeedLink({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const locale = getLocaleFromPathname(usePathname());
  return (
    <a href={`/${locale}/feed.xml`} className={className} aria-label="RSS feed">
      <Rss className={iconClassName} />
    </a>
  );
}
