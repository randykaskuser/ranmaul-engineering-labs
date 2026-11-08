import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getPublishedArticles, LOCALES, type Locale } from "@/lib/content";

// Static export: written to out/{locale}/feed.xml at build time.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const CHANNEL: Record<Locale, { title: string; description: string }> = {
  en: {
    title: `${SITE_NAME} – Articles`,
    description: "Articles on QA automation, FPV drones, fishkeeping, and engineering notes by Randy Maulana.",
  },
  id: {
    title: `${SITE_NAME} – Artikel`,
    description: "Artikel tentang QA automation, drone FPV, fishkeeping, dan catatan engineering oleh Randy Maulana.",
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(date: string): string {
  return new Date(date).toUTCString();
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const articles = (await getPublishedArticles()).filter((a) => a.locale === locale);

  const homeUrl = locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
  const feedUrl = `${SITE_URL}/${locale}/feed.xml`;
  // Newest content change, not build time: unchanged content gives an unchanged file.
  const lastUpdated = articles.reduce<string | undefined>(
    (latest, a) => (!latest || Date.parse(a.updatedAt) > Date.parse(latest) ? a.updatedAt : latest),
    undefined,
  );

  const items = articles.map((article) => {
    const link = `${SITE_URL}/${article.locale}/${article.domain}/${article.slug}`;
    const categories = article.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n");
    return [
      "    <item>",
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${rfc822(article.publishedAt)}</pubDate>`,
      `      <description>${escapeXml(article.description)}</description>`,
      categories,
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(CHANNEL[locale].title)}</title>`,
    `    <link>${homeUrl}</link>`,
    `    <description>${escapeXml(CHANNEL[locale].description)}</description>`,
    `    <language>${locale}</language>`,
    lastUpdated ? `    <lastBuildDate>${rfc822(lastUpdated)}</lastBuildDate>` : "",
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return new Response(xml + "\n", {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
