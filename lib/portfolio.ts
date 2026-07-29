import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { type Locale } from "./content";

export const PORTFOLIO_ROOT = typeof process !== 'undefined' && process.cwd
  ? path.join(process.cwd(), "content", "portfolio")
  : "";

export type PortfolioFrontmatter = {
  title: string;
  description: string;
  locale: Locale;
  slug: string;
  date: string;
  featured: boolean;
  draft: boolean;
  image?: string;
  embedUrl?: string;
  location?: string;
  category?: string;
  mediaType?: "video" | "image";
  objective?: string;
  constraint?: string;
  aircraft?: string;
};

export type PortfolioItem = PortfolioFrontmatter & {
  body: string;
};

function assertNonEmptyString(value: unknown, key: string, filePath: string): string {
  const str = String(value ?? "").trim();
  if (!str) {
    throw new Error(`Invalid frontmatter "${key}" (empty) in ${filePath}`);
  }
  return str;
}

function assertFrontmatter(data: Record<string, unknown>, filePath: string): PortfolioFrontmatter {
  const required = [
    "title",
    "description",
    "locale",
    "slug",
    "date",
    "featured",
    "draft",
  ] as const;

  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      throw new Error(`Missing required frontmatter "${key}" in ${filePath}`);
    }
  }

  const locale = String(data.locale) as Locale;

  return {
    title: assertNonEmptyString(data.title, "title", filePath),
    description: assertNonEmptyString(data.description, "description", filePath),
    locale,
    slug: assertNonEmptyString(data.slug, "slug", filePath),
    date: assertNonEmptyString(data.date, "date", filePath),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    image: data.image ? String(data.image) : undefined,
    embedUrl: data.embedUrl ? String(data.embedUrl) : undefined,
    location: data.location ? String(data.location) : undefined,
    category: data.category ? String(data.category) : undefined,
    mediaType: data.mediaType as "video" | "image" | undefined,
    objective: data.objective ? String(data.objective) : undefined,
    constraint: data.constraint ? String(data.constraint) : undefined,
    aircraft: data.aircraft ? String(data.aircraft) : undefined,
  };
}

async function getPortfolioFilePaths(locale: Locale): Promise<string[]> {
  const files: string[] = [];
  const dir = path.join(PORTFOLIO_ROOT, locale);

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(path.join(dir, entry.name));
      }
    }
  } catch {
    // Missing directory is acceptable.
  }

  return files;
}

export const getPortfolioItems = cache(async (locale: Locale): Promise<PortfolioItem[]> => {
  const filePaths = await getPortfolioFilePaths(locale);
  const items: PortfolioItem[] = [];

  for (const filePath of filePaths) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const frontmatter = assertFrontmatter(parsed.data, filePath);

    if (!frontmatter.draft) {
      items.push({
        ...frontmatter,
        body: parsed.content,
      });
    }
  }

  return items.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});