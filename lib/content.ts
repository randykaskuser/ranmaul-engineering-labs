// Node's FS and Path aren't supported on Edge. We'll use Next.js' unstable_readDir / unstable_readFile if available, or just mock it since these files are pre-rendered at build time.
// actually wait, getMdxFilePaths is running on Edge during SSR? Let's check where it's used.
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

// For Edge runtime compatibility when not running generation
export const CONTENT_ROOT = typeof process !== 'undefined' && process.cwd
  ? path.join(process.cwd(), "content")
  : "";

export const LOCALES = ["en", "id"] as const;
export const DOMAINS = ["qa", "fpv", "fishkeeping", "notes"] as const;

export type Locale = (typeof LOCALES)[number];
export type Domain = (typeof DOMAINS)[number];

export type ArticleFrontmatter = {
  title: string;
  description: string;
  locale: Locale;
  domain: Domain;
  slug: string;
  canonicalGroup: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  coverImage?: string;
  coverAlt?: string;
  series?: string;
  translationOf?: string;
  relatedCanonicalGroups?: string[];
};

export type Article = ArticleFrontmatter & {
  body: string;
  readingMinutes: number;
};

function assertSlug(value: string, filePath: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(
      `Invalid slug "${value}" in ${filePath}. Expected: lowercase, hyphen-separated, no spaces/dates.`,
    );
  }
}

function assertNonEmptyString(value: unknown, key: string, filePath: string): string {
  const str = String(value ?? "").trim();
  if (!str) {
    throw new Error(`Invalid frontmatter "${key}" (empty) in ${filePath}`);
  }
  return str;
}

function assertIsoDate(value: unknown, key: string, filePath: string): string {
  const raw = assertNonEmptyString(value, key, filePath);
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid frontmatter "${key}" (not a date: ${raw}) in ${filePath}`);
  }
  return raw;
}

function assertFrontmatter(data: Record<string, unknown>, filePath: string): ArticleFrontmatter {
  const required = [
    "title",
    "description",
    "locale",
    "domain",
    "slug",
    "canonicalGroup",
    "publishedAt",
    "updatedAt",
    "tags",
    "featured",
    "draft",
  ] as const;

  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(`Missing required frontmatter \"${key}\" in ${filePath}`);
    }
  }

  const locale = String(data.locale) as Locale;
  const domain = String(data.domain) as Domain;

  if (!LOCALES.includes(locale)) {
    throw new Error(`Invalid locale \"${locale}\" in ${filePath}`);
  }

  if (!DOMAINS.includes(domain)) {
    throw new Error(`Invalid domain \"${domain}\" in ${filePath}`);
  }

  const slug = assertNonEmptyString(data.slug, "slug", filePath);
  assertSlug(slug, filePath);

  const canonicalGroup = assertNonEmptyString(data.canonicalGroup, "canonicalGroup", filePath);
  const publishedAt = assertIsoDate(data.publishedAt, "publishedAt", filePath);
  const updatedAt = assertIsoDate(data.updatedAt, "updatedAt", filePath);

  const tags = Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [];
  if (tags.length === 0) {
    throw new Error(`Invalid frontmatter "tags" (must be a non-empty array) in ${filePath}`);
  }

  const coverImage = data.coverImage ? String(data.coverImage) : undefined;
  if (coverImage && !coverImage.startsWith("/") && !coverImage.startsWith("http")) {
    throw new Error(`Invalid frontmatter "coverImage" (must start with "/" or "http") in ${filePath}`);
  }

  return {
    title: assertNonEmptyString(data.title, "title", filePath),
    description: assertNonEmptyString(data.description, "description", filePath),
    locale,
    domain,
    slug,
    canonicalGroup,
    publishedAt,
    updatedAt,
    tags,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    coverImage,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    series: data.series ? String(data.series) : undefined,
    translationOf: data.translationOf ? String(data.translationOf) : undefined,
    relatedCanonicalGroups: Array.isArray(data.relatedCanonicalGroups)
      ? data.relatedCanonicalGroups.map(String)
      : undefined,
  };
}

function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

async function getMdxFilePaths(): Promise<string[]> {
  const files: string[] = [];

  for (const locale of LOCALES) {
    for (const domain of DOMAINS) {
      const dir = path.join(CONTENT_ROOT, locale, domain);
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && entry.name.endsWith(".mdx")) {
            files.push(path.join(dir, entry.name));
          }
        }
      } catch {
        // Missing directory is acceptable during early content population.
      }
    }
  }

  return files;
}

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const filePaths = await getMdxFilePaths();
  const articles: Article[] = [];

  for (const filePath of filePaths) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const frontmatter = assertFrontmatter(parsed.data, filePath);

    articles.push({
      ...frontmatter,
      body: parsed.content,
      readingMinutes: estimateReadingMinutes(parsed.content),
    });
  }

  return articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
});

export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((article) => !article.draft);
}

export async function getArticleByRoute(locale: Locale, domain: Domain, slug: string): Promise<Article | null> {
  // Fast path: read a single file without scanning everything.
  const filePath = path.join(CONTENT_ROOT, locale, domain, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const frontmatter = assertFrontmatter(parsed.data, filePath);
    if (frontmatter.draft) {
      return null;
    }

    return {
      ...frontmatter,
      body: parsed.content,
      readingMinutes: estimateReadingMinutes(parsed.content),
    };
  } catch {
    return null;
  }
}

export async function getRelatedArticles(target: Article, limit = 3): Promise<Article[]> {
  const articles = await getPublishedArticles();

  return articles
    .filter((article) => !(article.locale === target.locale && article.domain === target.domain && article.slug === target.slug))
    .map((article) => {
      const sharedTags = article.tags.filter((tag) => target.tags.includes(tag)).length;
      const sameDomainBonus = article.domain === target.domain ? 1 : 0;
      return { article, score: sharedTags + sameDomainBonus };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.article);
}

export async function getRecentArticles(locale: Locale, limit = 4): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.locale === locale).slice(0, limit);
}

export async function getFeaturedArticles(locale: Locale, limit = 4): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.locale === locale && article.featured).slice(0, limit);
}

export async function getTranslationsForArticle(target: Article): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter(
    (article) => article.canonicalGroup === target.canonicalGroup && article.locale !== target.locale,
  );
}

export type TagInfo = {
  tag: string;
  count: number;
};

export async function getArticlesByDomain(locale: Locale, domain: Domain): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.locale === locale && article.domain === domain);
}

export async function getAllTags(locale: Locale): Promise<TagInfo[]> {
  const articles = await getPublishedArticles();
  const counts = new Map<string, number>();

  for (const article of articles) {
    if (article.locale !== locale) continue;
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getArticlesByTag(locale: Locale, tag: string): Promise<Article[]> {
  const normalized = tag.trim();
  if (!normalized) return [];

  const articles = await getPublishedArticles();
  return articles.filter((article) => article.locale === locale && article.tags.includes(normalized));
}
