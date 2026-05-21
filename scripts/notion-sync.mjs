/**
 * Notion → MDX sync (Phase 3.5)
 *
 * Goals:
 * - filesystem-first output under content/{locale}/{domain}/{slug}.mdx
 * - publish only when Draft=false
 * - fail-fast on contract violations (locale/domain/slug/etc)
 * - download images to public/media/notion/ to avoid expiring Notion URLs
 *
 * Environment:
 * - NOTION_TOKEN
 * - NOTION_DATABASE_ID
 */

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_DIR = path.join(ROOT, "public", "media", "notion");

const LOCALES = new Set(["en", "id"]);
const DOMAINS = new Set(["qa", "fpv", "fishkeeping"]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function parseArgs(argv) {
  const args = new Set(argv);
  return {
    dryRun: args.has("--dry-run"),
    write: args.has("--write"),
    check: args.has("--check"),
    verbose: args.has("--verbose"),
  };
}

async function notionFetch(pathname, init) {
  const token = requiredEnv("NOTION_TOKEN");

  const res = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API error ${res.status} ${res.statusText}: ${body}`);
  }

  return res.json();
}

function getProperty(page, name) {
  return page.properties?.[name];
}

function normalizePropName(value) {
  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .trim()
    .toLowerCase();
}

function getPropertyLoose(page, expectedName) {
  const exact = getProperty(page, expectedName);
  if (exact) return exact;

  const props = page.properties ?? {};
  const wanted = normalizePropName(expectedName);
  for (const [key, value] of Object.entries(props)) {
    if (normalizePropName(key) === wanted) {
      return value;
    }
  }
  return undefined;
}

function getFirstTitlePropertyName(page) {
  const entries = Object.entries(page.properties ?? {});
  const hit = entries.find(([, value]) => value?.type === "title");
  return hit?.[0] ?? null;
}

function summarizeProperties(page) {
  const props = page.properties ?? {};
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, value?.type ?? "unknown"]),
  );
}

function getTitleText(page, name) {
  const fallbackName = getFirstTitlePropertyName(page);
  const prop = getPropertyLoose(page, name) ?? (fallbackName ? getProperty(page, fallbackName) : undefined);
  const parts = prop?.title ?? [];
  return parts.map((p) => p.plain_text).join("").trim();
}

function getRichText(page, name) {
  const prop = getPropertyLoose(page, name);
  const parts = prop?.rich_text ?? [];
  return parts.map((p) => p.plain_text).join("").trim();
}

function getSelect(page, name) {
  const prop = getPropertyLoose(page, name);
  return prop?.select?.name ?? "";
}

function getMultiSelect(page, name) {
  const prop = getPropertyLoose(page, name);
  const items = prop?.multi_select ?? [];
  return items.map((i) => i.name).filter(Boolean);
}

function getCheckbox(page, name) {
  const prop = getPropertyLoose(page, name);
  return Boolean(prop?.checkbox);
}

function getDate(page, name) {
  const prop = getPropertyLoose(page, name);
  // Notion date can have start/end; we use start.
  return prop?.date?.start ?? "";
}

function getFilesFirstUrl(page, name) {
  const prop = getPropertyLoose(page, name);
  const files = prop?.files ?? [];
  const first = files[0];
  if (!first) return "";
  if (first.type === "external") return first.external?.url ?? "";
  if (first.type === "file") return first.file?.url ?? "";
  return "";
}

function assertNonEmpty(value, label) {
  const str = String(value ?? "").trim();
  if (!str) {
    throw new Error(`Missing required field: ${label}`);
  }
  return str;
}

function assertSlug(value) {
  if (!SLUG_RE.test(value)) {
    throw new Error(`Invalid slug: "${value}" (expected lowercase hyphen-separated)`);
  }
}

function assertDate(value, label) {
  const raw = assertNonEmpty(value, label);
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) {
    throw new Error(`Invalid date for ${label}: "${raw}"`);
  }
  return raw;
}

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function toYamlArray(values) {
  return `[${values.map((v) => yamlQuote(v)).join(", ")}]`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function hashString(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

async function downloadToPublic(url, filenameBase) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download media: ${url} (${res.status})`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  const contentType = res.headers.get("content-type") ?? "";
  const ext = contentType.includes("png")
    ? ".png"
    : contentType.includes("jpeg")
      ? ".jpg"
      : contentType.includes("webp")
        ? ".webp"
        : contentType.includes("gif")
          ? ".gif"
          : "";

  const safeExt = ext || path.extname(new URL(url).pathname) || ".bin";
  const fileName = `${filenameBase}${safeExt}`;
  const outPath = path.join(MEDIA_DIR, fileName);
  await ensureDir(MEDIA_DIR);
  await fs.writeFile(outPath, buf);
  return `/media/notion/${fileName}`;
}

function mdxEscapeText(value) {
  return String(value ?? "");
}

function mdxLink(text, href) {
  const label = mdxEscapeText(text);
  return `[${label}](${href})`;
}

function renderRichText(richText) {
  // Minimal: keep plain text + links.
  return richText
    .map((part) => {
      const text = part.plain_text ?? "";
      const href = part.href;
      if (href) {
        return mdxLink(text || href, href);
      }
      return text;
    })
    .join("");
}

async function listBlocks(blockId) {
  const results = [];
  let cursor = undefined;
  do {
    const data = await notionFetch(`/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`);
    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

async function blockToMdx(block, ctx) {
  const type = block.type;
  const value = block[type];

  switch (type) {
    case "paragraph": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `${txt}\n` : "";
    }

    case "heading_1": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `# ${txt}\n` : "";
    }
    case "heading_2": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `## ${txt}\n` : "";
    }
    case "heading_3": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `### ${txt}\n` : "";
    }

    case "bulleted_list_item": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `- ${txt}\n` : "";
    }

    case "numbered_list_item": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt ? `1. ${txt}\n` : "";
    }

    case "quote": {
      const txt = renderRichText(value.rich_text ?? []);
      return txt
        ? txt
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n") + "\n"
        : "";
    }

    case "code": {
      const code = renderRichText(value.rich_text ?? []);
      const lang = value.language ? String(value.language) : "";
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }

    case "divider": {
      return "\n---\n";
    }

    case "image": {
      const img = value;
      const src = img.type === "external" ? img.external?.url : img.file?.url;
      const caption = renderRichText(img.caption ?? []);
      if (!src) return "";

      const filenameBase = `${ctx.slug}-${hashString(src)}`;
      const localSrc = await downloadToPublic(src, filenameBase);
      const alt = caption || "";
      if (localSrc) {
        return `\n![${alt}](${localSrc})\n`;
      }

      // Fallback to original URL if download disabled/failed (should be rare)
      return `\n![${alt}](${src})\n`;
    }

    case "callout": {
      // Map Notion callout → MDX <Note/> by default.
      const txt = renderRichText(value.rich_text ?? []);
      if (!txt) return "";
      return `\n<Note>\n\n${txt}\n\n</Note>\n`;
    }

    default: {
      // Skip unsupported blocks silently for now (safe rollout).
      return "";
    }
  }
}

async function pageToArticle(page) {
  const title = assertNonEmpty(getTitleText(page, "Title"), "Title");
  const description = assertNonEmpty(getRichText(page, "Description"), "Description");
  const locale = assertNonEmpty(getSelect(page, "Locale"), "Locale");
  const domain = assertNonEmpty(getSelect(page, "Domain"), "Domain");
  const slug = assertNonEmpty(getRichText(page, "Slug"), "Slug");
  const canonicalGroup = assertNonEmpty(getRichText(page, "CanonicalGroup"), "CanonicalGroup");
  const draft = getCheckbox(page, "Draft");
  const featured = getCheckbox(page, "Featured");
  const tags = getMultiSelect(page, "Tags");
  const coverImageUrl = getFilesFirstUrl(page, "CoverImage");
  const coverAlt = getRichText(page, "CoverAlt");
  const series = getSelect(page, "Series");
  const translationOf = getRichText(page, "TranslationOf");
  const relatedCanonicalGroups = getMultiSelect(page, "RelatedCanonicalGroups");
  const publishedAt = assertDate(getDate(page, "PublishedAt"), "PublishedAt");
  const updatedAt = assertDate(getDate(page, "UpdatedAt"), "UpdatedAt");

  if (!LOCALES.has(locale)) {
    throw new Error(`Invalid Locale: ${locale}`);
  }
  if (!DOMAINS.has(domain)) {
    throw new Error(`Invalid Domain: ${domain}`);
  }
  assertSlug(slug);
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error("Tags must be a non-empty multi-select");
  }

  const frontmatterLines = [
    "---",
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    `locale: ${yamlQuote(locale)}`,
    `domain: ${yamlQuote(domain)}`,
    `slug: ${yamlQuote(slug)}`,
    `canonicalGroup: ${yamlQuote(canonicalGroup)}`,
    `publishedAt: ${yamlQuote(publishedAt)}`,
    `updatedAt: ${yamlQuote(updatedAt)}`,
    `tags: ${toYamlArray(tags)}`,
    `featured: ${featured ? "true" : "false"}`,
    `draft: ${draft ? "true" : "false"}`,
  ];

  if (coverImageUrl) {
    const filenameBase = `${slug}-cover-${hashString(coverImageUrl)}`;
    const localCover = await downloadToPublic(coverImageUrl, filenameBase);
    if (localCover) {
      frontmatterLines.push(`coverImage: ${yamlQuote(localCover)}`);
    }
  }
  if (coverAlt) frontmatterLines.push(`coverAlt: ${yamlQuote(coverAlt)}`);
  if (series) frontmatterLines.push(`series: ${yamlQuote(series)}`);
  if (translationOf) frontmatterLines.push(`translationOf: ${yamlQuote(translationOf)}`);
  if (relatedCanonicalGroups?.length) {
    frontmatterLines.push(`relatedCanonicalGroups: ${toYamlArray(relatedCanonicalGroups)}`);
  }

  frontmatterLines.push("---", "");

  const blocks = await listBlocks(page.id);
  const ctx = { slug };

  // Handle basic list grouping by preserving order; we already emit markdown list items.
  let body = "";
  for (const block of blocks) {
    body += await blockToMdx(block, ctx);
    if (body && !body.endsWith("\n")) body += "\n";
    if (!body.endsWith("\n\n")) body += "\n";
  }

  const mdx = `${frontmatterLines.join("\n")}${body.trim()}\n`;

  return { locale, domain, slug, draft, mdx };
}

async function writeArticleFile(article, options) {
  const outDir = path.join(CONTENT_DIR, article.locale, article.domain);
  const outPath = path.join(outDir, `${article.slug}.mdx`);
  await ensureDir(outDir);

  const existing = (await fileExists(outPath)) ? await fs.readFile(outPath, "utf8") : null;

  if (existing === article.mdx) {
    return { changed: false, outPath };
  }

  if (options.check || options.dryRun) {
    return { changed: true, outPath };
  }

  await fs.writeFile(outPath, article.mdx, "utf8");
  return { changed: true, outPath };
}

async function queryPublishedPages(databaseId) {
  const results = [];
  let cursor = undefined;
  do {
    const payload = {
      page_size: 100,
      start_cursor: cursor,
      filter: {
        property: "Draft",
        checkbox: {
          equals: false,
        },
      },
    };

    const data = await notionFetch(`/databases/${databaseId}/query`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const databaseId = requiredEnv("NOTION_DATABASE_ID");

  if (!options.dryRun && !options.write && !options.check) {
    // default safe mode
    options.dryRun = true;
  }

  const pages = await queryPublishedPages(databaseId);

  let changedCount = 0;
  for (const page of pages) {
    let article;
    try {
      article = await pageToArticle(page);
    } catch (err) {
      const url = page?.url ?? `https://www.notion.so/${String(page?.id ?? "")}`;
      const message = err instanceof Error ? err.message : String(err);
      const titleProp = getFirstTitlePropertyName(page);
      const propsSummary = summarizeProperties(page);
      throw new Error(
        [
          `Notion page failed validation: ${url}`,
          `pageId: ${String(page?.id ?? "")}`,
          `detectedTitleProperty: ${titleProp ?? "(none)"}`,
          `properties: ${JSON.stringify(propsSummary)}`,
          message,
        ].join("\n"),
      );
    }

    // Enforced: only publish when Draft=false.
    if (article.draft) continue;

    const result = await writeArticleFile(article, options);
    if (result.changed) {
      changedCount += 1;
      if (options.verbose) {
        console.log(`${options.check ? "CHECK" : options.dryRun ? "DRY" : "WRITE"}: ${result.outPath}`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: options.check ? "check" : options.dryRun ? "dry-run" : "write",
        pages: pages.length,
        changed: changedCount,
      },
      null,
      2,
    ),
  );

  if (options.check && changedCount > 0) {
    // In check mode, signal that repo is out of sync.
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
