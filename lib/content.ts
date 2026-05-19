import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

export const LOCALES = ["en", "id"] as const;
export const DOMAINS = ["qa", "fpv", "fishkeeping"] as const;

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

  return {
    title: String(data.title),
    description: String(data.description),
    locale,
    domain,
    slug: String(data.slug),
    canonicalGroup: String(data.canonicalGroup),
    publishedAt: String(data.publishedAt),
    updatedAt: String(data.updatedAt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
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

export async function getAllArticles(): Promise<Article[]> {
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
}

export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((article) => !article.draft);
}

export async function getArticleByRoute(locale: Locale, domain: Domain, slug: string): Promise<Article | null> {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.locale === locale && article.domain === domain && article.slug === slug) ?? null;
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
