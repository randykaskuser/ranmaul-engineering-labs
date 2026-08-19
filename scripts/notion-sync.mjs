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
import { readFileSync } from "node:fs";

const ROOT = process.cwd();

// Auto-load .env file into process.env to ensure local changes are picked up
try {
  const envContent = readFileSync(path.join(ROOT, ".env"), "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
} catch {
  // Ignore if .env does not exist
}

const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_DIR = path.join(ROOT, "public", "media", "notion");

const LOCALES = new Set(["en", "id"]);
const DOMAINS = new Set(["qa", "fpv", "fishkeeping", "notes"]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Notion API compatibility
// - Older API versions fail on databases that have multiple data sources.
// - Newer API expects querying via /v1/data_sources/{id}/query.
// Ref: Notion error: multiple_data_sources_for_database, minimum_api_version=2025-09-03
const NOTION_API_VERSION = "2025-09-03";

// OpenRouter (Translation automation)
// NOTE: Used to auto-generate EN entries from ID after a successful sync.
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_DEFAULT_MODEL = "google/gemini-3-flash-preview";
const OPENROUTER_MAX_RETRIES = 3;
const OPENROUTER_RETRY_DELAY_MS = 1000;
const OPENROUTER_TIMEOUT_MS = 30_000;

const NOTION_RICH_TEXT_MAX = 2000;

function chunkString(value, maxLen) {
  const str = String(value ?? "");
  if (str.length <= maxLen) return [str];
  const out = [];
  for (let i = 0; i < str.length; i += maxLen) {
    out.push(str.slice(i, i + maxLen));
  }
  return out;
}

function toNotionRichText(value) {
  const chunks = chunkString(value, NOTION_RICH_TEXT_MAX);
  return chunks.map((content) => ({ type: "text", text: { content } }));
}

function mdxBodyToNotionBlocks(body) {
  const content = String(body ?? "").trim();
  if (!content) return [];

  const blocks = [];
  const lines = content.split('\n');
  let currentBlockType = null;
  let currentBlockLines = [];
  let inCodeBlock = false;
  let codeLang = '';

  function flushBlock() {
    if (currentBlockLines.length === 0) return;
    const text = currentBlockLines.join('\n');

    if (currentBlockType === 'code') {
      let safeLang = codeLang.toLowerCase();
      if (!['abap', 'arduino', 'bash', 'basic', 'c', 'clojure', 'coffeescript', 'c++', 'c#', 'css', 'dart', 'diff', 'docker', 'elixir', 'elm', 'erlang', 'flow', 'fortran', 'f#', 'gherkin', 'glsl', 'go', 'graphql', 'groovy', 'haskell', 'html', 'java', 'javascript', 'json', 'julia', 'kotlin', 'latex', 'less', 'lisp', 'livescript', 'lua', 'makefile', 'markdown', 'markup', 'matlab', 'mermaid', 'nix', 'objective-c', 'ocaml', 'pascal', 'perl', 'php', 'plain text', 'powershell', 'prolog', 'protobuf', 'python', 'r', 'reason', 'ruby', 'rust', 'sass', 'scala', 'scheme', 'scss', 'shell', 'sql', 'swift', 'typescript', 'vb.net', 'verilog', 'vhdl', 'visual basic', 'webassembly', 'xml', 'yaml', 'java/c/c++/c#'].includes(safeLang)) {
        safeLang = 'plain text';
      }
      blocks.push({
        object: 'block',
        type: 'code',
        code: { language: safeLang, rich_text: toNotionRichText(text) }
      });
    } else if (currentBlockType === 'heading_1') {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: toNotionRichText(text.replace(/^#\s+/, '')) } });
    } else if (currentBlockType === 'heading_2') {
      blocks.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: toNotionRichText(text.replace(/^##\s+/, '')) } });
    } else if (currentBlockType === 'heading_3') {
      blocks.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: toNotionRichText(text.replace(/^###\s+/, '')) } });
    } else if (currentBlockType === 'quote') {
      blocks.push({ object: 'block', type: 'quote', quote: { rich_text: toNotionRichText(text.replace(/^>\s?/gm, '')) } });
    } else if (currentBlockType === 'bulleted_list_item') {
      blocks.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: toNotionRichText(text.replace(/^-\s+/, '')) } });
    } else if (currentBlockType === 'numbered_list_item') {
      blocks.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: toNotionRichText(text.replace(/^\d+\.\s+/, '')) } });
    } else if (currentBlockType === 'divider') {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
    } else {
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: toNotionRichText(text) } });
    }
    currentBlockLines = [];
    currentBlockType = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inCodeBlock) {
      if (line.trim() === '```') {
        flushBlock();
        inCodeBlock = false;
      } else {
        currentBlockLines.push(line);
      }
      continue;
    }

    if (line.trim().startsWith('```')) {
      flushBlock();
      inCodeBlock = true;
      codeLang = line.trim().slice(3).trim();
      currentBlockType = 'code';
      continue;
    }

    if (line.trim() === '---') {
      flushBlock();
      currentBlockType = 'divider';
      currentBlockLines.push(line);
      flushBlock();
      continue;
    }

    if (line.trim() === '') {
      flushBlock();
      continue;
    }

    if (currentBlockLines.length === 0) {
      if (line.startsWith('# ')) currentBlockType = 'heading_1';
      else if (line.startsWith('## ')) currentBlockType = 'heading_2';
      else if (line.startsWith('### ')) currentBlockType = 'heading_3';
      else if (line.startsWith('> ')) currentBlockType = 'quote';
      else if (line.match(/^-\s+/)) currentBlockType = 'bulleted_list_item';
      else if (line.match(/^\d+\.\s+/)) currentBlockType = 'numbered_list_item';
      else currentBlockType = 'paragraph';
    } else {
      if (currentBlockType === 'bulleted_list_item' && line.match(/^-\s+/)) {
        flushBlock();
        currentBlockType = 'bulleted_list_item';
      } else if (currentBlockType === 'numbered_list_item' && line.match(/^\d+\.\s+/)) {
        flushBlock();
        currentBlockType = 'numbered_list_item';
      }
    }
    currentBlockLines.push(line);
  }

  flushBlock();

  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "Auto-translated by AI during Notion→MDX sync. Review/edit if needed." },
          annotations: { italic: true, color: "gray" }
        }
      ]
    }
  });

  return blocks;
}

async function queryPagesByFilter(databaseId, dataSourceId, filter) {
  const payload = {
    page_size: 1,
    filter,
  };
  const queryPath = dataSourceId ? `/data_sources/${dataSourceId}/query` : `/databases/${databaseId}/query`;
  const data = await notionFetch(queryPath, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (data?.results ?? [])[0] ?? null;
}

async function findAnyPageByLocaleAndCanonicalGroup(databaseId, dataSourceId, locale, canonicalGroup, options) {
  // keep options param for signature symmetry (verbose logging hook in future)
  void options;
  const filter = {
    and: [
      { property: "Locale", select: { equals: locale } },
      { property: "CanonicalGroup", rich_text: { equals: canonicalGroup } },
    ],
  };
  return queryPagesByFilter(databaseId, dataSourceId, filter);
}

async function createNotionPageInDatabase({ databaseId, dataSourceId, properties, children }) {
  // Notion databases may be backed by multiple data sources.
  // In that case, Notion requires create to use parent.data_source_id.
  const parent = dataSourceId
    ? { data_source_id: dataSourceId }
    : { database_id: databaseId };

  return notionFetch(`/pages`, {
    method: "POST",
    body: JSON.stringify({
      parent,
      properties,
      ...(children?.length ? { children } : {}),
    }),
  });
}

async function updateNotionPageProperties(pageId, properties) {
  return notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}

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
    translate: !args.has("--no-translate"),
    autofill: !args.has("--no-autofill"),
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractFirstJsonObject(text) {
  const raw = String(text ?? "");
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
  const slice = raw.slice(firstBrace, lastBrace + 1);
  return safeJsonParse(slice);
}

function normalizeSlugCandidate(value) {
  const lower = String(value ?? "")
    .trim()
    .toLowerCase();
  const normalized = lower
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized;
}

function deterministicSlugFromCanonicalGroup(canonicalGroup) {
  // canonicalGroup may contain mixed chars; normalize to safe slug-ish.
  const normalized = normalizeSlugCandidate(canonicalGroup);
  if (normalized) return normalized;
  return `entry-${hashString(String(canonicalGroup ?? ""))}`;
}

function buildTranslationSystemPrompt() {
  return [
    "You are an expert bilingual technical editor and translator.",
    "Translate Indonesian technical editorial content to English.",
    "Maintain technical accuracy and preserve code/config blocks exactly.",
    "", 
    "OUTPUT FORMAT (MANDATORY):", 
    "Return ONLY valid JSON (no markdown fences, no commentary) with keys:",
    "- title (string)",
    "- description (string; 1-2 sentences)",
    "- slug (string; lowercase-hyphen; no dates)",
    "- tags (string[]; stable short tags, prefer existing tag intent)",
    "- body (string; Markdown/MDX body without frontmatter)",
    "", 
    "RULES:",
    "- Do not add marketing fluff.",
    "- Keep code blocks unchanged.",
    "- Keep headings structure.",
    "- Slug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/.",
  ].join("\n");
}

function buildAutoFillSystemPrompt() {
  return [
    "You are an expert technical SEO editor for a multilingual engineering blog.",
    "Given article body content, title, and optionally locale/domain, generate metadata.",
    "",
    "OUTPUT FORMAT (MANDATORY):",
    "Return ONLY valid JSON (no markdown fences, no commentary) with keys:",
    "- title (string; ONLY return if not provided by user, extract from content)",
    "- description (string; 1-2 concise sentences, SEO-optimized, no fluff/marketing)",
    "- slug (string; SEO-friendly, localized to the article locale)",
    "- canonicalGroup (string; stable English-based ID, domain-prefixed, e.g. 'fpv-gyro-jitter-o4')",
    "- tags (string[]; 3-7 flat tags, short, lowercase, relevant to the content)",
    "- coverAlt (string; concise alt text for the cover image if one exists, or empty string)",
    "- locale (string; ONLY return 'id' or 'en' based on the text language. Omit if already provided by user)",
    "- domain (string; ONLY return 'qa', 'fpv', 'fishkeeping', or 'notes' based on the topic. Omit if already provided by user)",
    "",
    "RULES:",
    "- Slug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/.",
    "- For Indonesian (id) articles: slug uses Indonesian keywords for local SEO.",
    "- For English (en) articles: slug uses English keywords.",
    "- CanonicalGroup is ALWAYS English-based regardless of article locale.",
    "- CanonicalGroup should start with the domain prefix (e.g. 'qa-...', 'fpv-...', 'fishkeeping-...', 'notes-...').",
    "- Description should accurately summarize the technical content.",
    "- Tags should be stable, reusable across articles (not unique per article).",
    "- Do not add marketing fluff or exaggerated claims.",
    "- Keep everything technical and precise.",
  ].join("\n");
}

async function openRouterTranslateIdToEn(input, options) {
  const apiKey = requiredEnv("OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;

  const payload = {
    model,
    messages: [
      { role: "system", content: buildTranslationSystemPrompt() },
      {
        role: "user",
        content: JSON.stringify(
          {
            sourceLocale: "id",
            targetLocale: "en",
            domain: input.domain,
            canonicalGroup: input.canonicalGroup,
            title: input.title,
            description: input.description,
            slug: input.slug,
            tags: input.tags,
            body: input.body,
          },
          null,
          2,
        ),
      },
    ],
    temperature: 0.2,
  };

  let lastErr;
  for (let attempt = 1; attempt <= OPENROUTER_MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(
        OPENROUTER_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        },
        OPENROUTER_TIMEOUT_MS,
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`OpenRouter error ${res.status}: ${text}`);
      }

      const json = safeJsonParse(text);
      const content = json?.choices?.[0]?.message?.content;
      const parsed = safeJsonParse(content) ?? extractFirstJsonObject(content);
      if (!parsed) {
        throw new Error(`OpenRouter returned non-JSON content: ${String(content ?? "").slice(0, 240)}...`);
      }

      return {
        model,
        title: String(parsed.title ?? "").trim(),
        description: String(parsed.description ?? "").trim(),
        slug: String(parsed.slug ?? "").trim(),
        tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => String(t).trim()).filter(Boolean) : [],
        body: String(parsed.body ?? "").trim(),
      };
    } catch {
      lastErr = err;
      if (options?.verbose) {
        console.log(`OpenRouter translate attempt ${attempt}/${OPENROUTER_MAX_RETRIES} failed:`, err);
      }
      if (attempt < OPENROUTER_MAX_RETRIES) {
        const delay = OPENROUTER_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

async function openRouterAutoFillMetadata(input, options) {
  const apiKey = requiredEnv("OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;

  const payload = {
    model,
    messages: [
      { role: "system", content: buildAutoFillSystemPrompt() },
      {
        role: "user",
        content: JSON.stringify(
          {
            locale: input.locale,
            domain: input.domain,
            title: input.title,
            body: input.body,
            hasCoverImage: input.hasCoverImage,
          },
          null,
          2,
        ),
      },
    ],
    temperature: 0.2,
  };

  let lastErr;
  for (let attempt = 1; attempt <= OPENROUTER_MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(
        OPENROUTER_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        },
        OPENROUTER_TIMEOUT_MS,
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`OpenRouter error ${res.status}: ${text}`);
      }

      const json = safeJsonParse(text);
      const content = json?.choices?.[0]?.message?.content;
      const parsed = safeJsonParse(content) ?? extractFirstJsonObject(content);
      if (!parsed) {
        throw new Error(`OpenRouter returned non-JSON content: ${String(content ?? "").slice(0, 240)}...`);
      }

      return {
        model,
        title: parsed.title ? String(parsed.title).trim() : null,
        description: String(parsed.description ?? "").trim(),
        slug: String(parsed.slug ?? "").trim(),
        canonicalGroup: String(parsed.canonicalGroup ?? "").trim(),
        tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => String(t).trim()).filter(Boolean) : [],
        coverAlt: String(parsed.coverAlt ?? "").trim(),
        locale: parsed.locale ? String(parsed.locale).trim() : null,
        domain: parsed.domain ? String(parsed.domain).trim() : null,
      };
    } catch {
      lastErr = err;
      if (options?.verbose) {
        console.log(`OpenRouter autofill attempt ${attempt}/${OPENROUTER_MAX_RETRIES} failed:`, err);
      }
      if (attempt < OPENROUTER_MAX_RETRIES) {
        const delay = OPENROUTER_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

async function notionFetch(pathname, init) {
  const token = requiredEnv("NOTION_TOKEN");

  const res = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_API_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Notion API error ${res.status} ${res.statusText}: ${body}`);
    // Attach parsed Notion error payload when possible so callers can branch on it.
    try {
      // @ts-expect-error - attach parsed Notion error payload for branching (internal script-only).
      err.notion = JSON.parse(body);
    } catch {
      // ignore
    }
    throw err;
  }

  return res.json();
}

function getNotionErrorType(err) {
  // @ts-expect-error - custom property attached in notionFetch for branching.
  const notion = err?.notion;
  return notion?.additional_data?.error_type ?? notion?.code ?? null;
}

function getNotionChildDataSourceIdsFromError(err) {
  // @ts-expect-error - custom property attached in notionFetch for branching.
  const notion = err?.notion;
  const ids = notion?.additional_data?.child_data_source_ids;
  return Array.isArray(ids) ? ids : [];
}

function normalizeNotionId(value, label) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  // Accept raw id, UUID (with hyphens), or full Notion URL.
  // Strategy: extract all hex chars and use the first 32.
  const hexOnly = raw.replace(/[^0-9a-fA-F]/g, "");
  const hex = hexOnly.length >= 32 ? hexOnly.slice(0, 32).toLowerCase() : null;
  if (!hex) {
    throw new Error(
      `Invalid ${label}: expected a Notion id (32 hex chars) or a Notion URL containing an id. Got: ${raw}`,
    );
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function getDatabase(databaseId) {
  return notionFetch(`/databases/${databaseId}`, { method: "GET" });
}

function extractChildDataSourceIds(database) {
  const ids = database?.data_sources ?? database?.child_data_sources ?? [];
  return Array.isArray(ids)
    ? ids
        .map((d) => (typeof d === "string" ? d : d?.id))
        .filter(Boolean)
    : [];
}

function scorePageContract(page) {
  const required = [
    "Title",
    "Description",
    "Locale",
    "Domain",
    "Slug",
    "CanonicalGroup",
    "Tags",
    "PublishedAt",
    "UpdatedAt",
  ];
  let score = 0;
  for (const key of required) {
    const prop = getPropertyLoose(page, key);
    if (!prop) continue;
    // Count as present if it has the expected type container.
    if (key === "Title" && prop.type === "title" && (prop.title?.length ?? 0) > 0) score += 1;
    else if (key === "Description" && prop.type === "rich_text" && (prop.rich_text?.length ?? 0) > 0) score += 1;
    else if (["Locale", "Domain"].includes(key) && prop.type === "select" && prop.select?.name) score += 1;
    else if (["Slug", "CanonicalGroup"].includes(key) && prop.type === "rich_text" && (prop.rich_text?.length ?? 0) > 0)
      score += 1;
    else if (key === "Tags" && prop.type === "multi_select" && (prop.multi_select?.length ?? 0) > 0) score += 1;
    else if (["PublishedAt", "UpdatedAt"].includes(key) && prop.type === "date" && prop.date?.start) score += 1;
  }
  return score;
}

async function tryQueryOnePublishedPage(dataSourceId) {
    const payload = {
      page_size: 1,
    };
  const data = await notionFetch(`/data_sources/${dataSourceId}/query`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const page = (data?.results ?? [])[0];
  return page ?? null;
}

async function autoPickDataSourceId(childIds, options) {
  // Heuristic: pick the data source whose first published page best matches our content contract.
  // This avoids having the user guess which data source is the “real” one.
  const scored = [];
  for (const id of childIds) {
    try {
      const page = await tryQueryOnePublishedPage(id);
      const score = page ? scorePageContract(page) : 0;
      scored.push({ id, score, sampleUrl: page?.url ?? null });
    } catch {
      scored.push({ id, score: -1, sampleUrl: null, error: err instanceof Error ? err.message : String(err) });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const second = scored[1];

  if (options.verbose) {
    console.log(
      `Auto-picked data source candidate scores: ${JSON.stringify(
        scored.map((s) => ({ id: s.id, score: s.score, sampleUrl: s.sampleUrl })),
        null,
        2,
      )}`,
    );
  }

  if (!best || best.score < 0) return null;

  // If multiple are tied, ask user to set env to be explicit.
  if (second && second.score === best.score) {
    throw new Error(
      [
        `Notion database has multiple data sources with similar scores. Please set NOTION_DATA_SOURCE_ID explicitly.`,
        `candidates: ${JSON.stringify(scored.map((s) => ({ id: s.id, score: s.score })))}`,
      ].join("\n"),
    );
  }

  return best.id;
}

async function resolveDataSourceId(databaseId, options) {
  const explicit = process.env.NOTION_DATA_SOURCE_ID;
  if (explicit) {
    const id = normalizeNotionId(explicit, "NOTION_DATA_SOURCE_ID");
    if (options.verbose) console.log(`Using NOTION_DATA_SOURCE_ID=${id}`);
    return id;
  }

  // Try to auto-detect for multi-data-source databases.
  const db = await getDatabase(databaseId);
  const children = extractChildDataSourceIds(db).map((id) => normalizeNotionId(id, "data_source_id"));

  if (children.length === 1) {
    if (options.verbose) console.log(`Auto-detected data source id: ${children[0]}`);
    return children[0];
  }

  if (children.length > 1) {
    const picked = await autoPickDataSourceId(children, options);
    if (picked) {
      if (options.verbose) console.log(`Auto-picked NOTION_DATA_SOURCE_ID=${picked}`);
      return picked;
    }

    throw new Error(
      [
        `Notion database has multiple data sources. Please set NOTION_DATA_SOURCE_ID.`,
        `databaseId: ${databaseId}`,
        `childDataSourceIds: ${JSON.stringify(children)}`,
      ].join("\n"),
    );
  }

  // Fallback: in some older workspaces, querying a database id may still work.
  return null;
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

  // Security hardening (Phase 3.7)
  // Prevent SSRF by allowing only HTTPS and limiting hosts to Notion-controlled domains.
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new Error(`Blocked media download (non-https): ${parsed.protocol}`);
  }

  const host = parsed.hostname.toLowerCase();
  const allowedHosts = [
    // Notion signed file hosting / images
    "s3.us-west-2.amazonaws.com",
    "s3.us-east-1.amazonaws.com",
    "s3.eu-central-1.amazonaws.com",
    "prod-files-secure.s3.us-west-2.amazonaws.com",
    "secure.notion-static.com",
    "www.notion.so",
  ];
  const isAllowed = allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  if (!isAllowed) {
    throw new Error(`Blocked media download (untrusted host): ${host}`);
  }

  const MAX_MEDIA_BYTES = 12 * 1024 * 1024; // 12 MiB (defense-in-depth)
  const DOWNLOAD_TIMEOUT_MS = 15_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  const res = await fetch(parsed, { signal: controller.signal });
  clearTimeout(timeout);
  if (!res.ok) {
    throw new Error(`Failed to download media: ${url} (${res.status})`);
  }

  // Hardening: enforce a size cap to reduce DoS / oversized payload risk.
  const contentLengthRaw = res.headers.get("content-length");
  if (contentLengthRaw) {
    const len = Number(contentLengthRaw);
    if (Number.isFinite(len) && len > MAX_MEDIA_BYTES) {
      throw new Error(`Blocked media download (too large: ${len} bytes)`);
    }
  }

  const arrayBuffer = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  // Hardening: if content-length is missing or wrong, enforce a post-download cap too.
  if (buf.length > MAX_MEDIA_BYTES) {
    throw new Error(`Blocked media download (too large after download: ${buf.length} bytes)`);
  }

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

  // Hardening: only accept common image types to reduce risk of HTML/SVG/script payloads.
  // If you need video/PDF later, expand with explicit review.
  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const isAllowedType = allowedTypes.some((t) => contentType.includes(t));
  if (!isAllowedType) {
    throw new Error(`Blocked media download (content-type not allowed): ${contentType || "(missing)"}`);
  }
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

function indentPrefix(level) {
  return "  ".repeat(Math.max(0, level));
}

function isWarningCallout(icon, titleText) {
  const t = String(titleText ?? "").toLowerCase();
  const emoji = icon?.type === "emoji" ? icon.emoji : "";

  if (["⚠️", "🚨", "❗", "❌", "🛑", "⛔"].includes(emoji)) return true;
  if (t.startsWith("warning")) return true;
  if (t.startsWith("caution")) return true;
  if (t.startsWith("danger")) return true;
  if (t.startsWith("pitfall")) return true;
  return false;
}

async function renderChildBlocks(blockId, ctx) {
  const children = await listBlocks(blockId);
  let out = "";
  for (const child of children) {
    out += await blockToMdx(child, ctx);
    if (out && !out.endsWith("\n")) out += "\n";
    if (!out.endsWith("\n\n")) out += "\n";
  }
  return out.trim();
}

async function blockToMdx(block, ctx) {
  const type = block.type;
  const value = block[type];

  const nextCtx = { ...ctx };

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
      if (!txt) return "";
      const prefix = `${indentPrefix(ctx.indent ?? 0)}- `;
      let out = `${prefix}${txt}\n`;
      if (block.has_children) {
        const child = await renderChildBlocks(block.id, { ...nextCtx, indent: (ctx.indent ?? 0) + 1 });
        if (child) out += `${child}\n`;
      }
      return out;
    }

    case "numbered_list_item": {
      const txt = renderRichText(value.rich_text ?? []);
      if (!txt) return "";
      const prefix = `${indentPrefix(ctx.indent ?? 0)}1. `;
      let out = `${prefix}${txt}\n`;
      if (block.has_children) {
        const child = await renderChildBlocks(block.id, { ...nextCtx, indent: (ctx.indent ?? 0) + 1 });
        if (child) out += `${child}\n`;
      }
      return out;
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

    case "toggle": {
      const summary = renderRichText(value.rich_text ?? []);
      const inner = block.has_children
        ? await renderChildBlocks(block.id, { ...nextCtx, indent: ctx.indent ?? 0 })
        : "";

      if (!summary && !inner) return "";

      // Use HTML details/summary for broad Markdown compatibility.
      return `\n<details>\n<summary>${summary || "Details"}</summary>\n\n${inner}\n\n</details>\n`;
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
      const txt = renderRichText(value.rich_text ?? []);
      if (!txt) return "";

      const tone = isWarningCallout(value.icon, txt) ? "Warning" : "Note";
      return `\n<${tone}>\n\n${txt}\n\n</${tone}>\n`;
    }

    default: {
      // Skip unsupported blocks silently for now (safe rollout).
      return "";
    }
  }
}

// ---------------------------------------------------------------------------
// Auto-fill metadata via AI
// ---------------------------------------------------------------------------

function blocksToPlainText(blocks) {
  const lines = [];
  for (const block of blocks) {
    const type = block.type;
    const value = block[type];
    if (!value) continue;
    const richText = value.rich_text ?? value.title ?? [];
    const text = richText.map((p) => p.plain_text ?? "").join("");
    if (text) lines.push(text);
  }
  return lines.join("\n");
}

function needsAutoFill(page) {
  const title = getTitleText(page, "Title");
  const locale = getSelect(page, "Locale");
  const domain = getSelect(page, "Domain");
  const description = getRichText(page, "Description");
  const slug = getRichText(page, "Slug");
  const tags = getMultiSelect(page, "Tags");
  const canonicalGroup = getRichText(page, "CanonicalGroup");

  // Trigger auto-fill if ANY of these fields are missing.
  return !title || !locale || !domain || !description || !slug || tags.length === 0 || !canonicalGroup;
}

async function maybeAutoFillMetadata(page, databaseId, options) {
  if (!options.autofill) return { filled: false, page };
  if (options.check) return { filled: false, page };
  if (!needsAutoFill(page)) return { filled: false, page };

  // Gracefully skip if OPENROUTER_API_KEY is not configured (e.g. in CI).
  if (!process.env.OPENROUTER_API_KEY) {
    if (options.verbose) {
      console.log("SKIP autofill: OPENROUTER_API_KEY not set");
    }
    return { filled: false, page };
  }

  // Read the body content for AI context.
  const blocks = await listBlocks(page.id);
  const bodyText = blocksToPlainText(blocks);

  if (!bodyText.trim()) {
    if (options.verbose) {
      console.log(`SKIP autofill: page has no body content → ${page.url ?? page.id}`);
    }
    return { filled: false, page };
  }

  const title = getTitleText(page, "Title");
  const locale = getSelect(page, "Locale");
  const domain = getSelect(page, "Domain");
  const coverImageUrl = getFilesFirstUrl(page, "CoverImage");

  if (options.verbose) {
    console.log(`AUTOFILL: generating metadata for "${title}" (${locale}/${domain}) → ${page.url ?? page.id}`);
  }

  // Truncate body to limit token usage (first ~4000 chars is enough for metadata).
  const truncatedBody = bodyText.length > 4000 ? bodyText.slice(0, 4000) + "\n[...truncated]" : bodyText;

  const generated = await openRouterAutoFillMetadata(
    {
      locale,
      domain,
      title,
      body: truncatedBody,
      hasCoverImage: Boolean(coverImageUrl),
    },
    options,
  );

  // Build PATCH payload — only fill fields that are currently empty.
  const properties = {};

  const titlePropName = getFirstTitlePropertyName(page) || "Title";
  if (!title && generated.title) {
    properties[titlePropName] = { title: toNotionRichText(generated.title) };
  }

  const currentDescription = getRichText(page, "Description");
  if (!currentDescription && generated.description) {
    properties.Description = { rich_text: toNotionRichText(generated.description) };
  }

  const currentSlug = getRichText(page, "Slug");
  if (!currentSlug && generated.slug) {
    const slugCandidate = normalizeSlugCandidate(generated.slug);
    const validSlug = SLUG_RE.test(slugCandidate) ? slugCandidate : normalizeSlugCandidate(title);
    if (validSlug) {
      properties.Slug = { rich_text: toNotionRichText(validSlug) };
    }
  }

  const currentCanonicalGroup = getRichText(page, "CanonicalGroup");
  if (!currentCanonicalGroup && generated.canonicalGroup) {
    const cgCandidate = normalizeSlugCandidate(generated.canonicalGroup);
    if (cgCandidate) {
      properties.CanonicalGroup = { rich_text: toNotionRichText(cgCandidate) };
    }
  }

  const currentTags = getMultiSelect(page, "Tags");
  if (currentTags.length === 0 && generated.tags.length > 0) {
    properties.Tags = { multi_select: generated.tags.map((name) => ({ name })) };
  }

  const currentCoverAlt = getRichText(page, "CoverAlt");
  if (!currentCoverAlt && coverImageUrl && generated.coverAlt) {
    properties.CoverAlt = { rich_text: toNotionRichText(generated.coverAlt) };
  }

  if (!locale && generated.locale) {
    properties.Locale = { select: { name: generated.locale } };
  }

  if (!domain && generated.domain) {
    properties.Domain = { select: { name: generated.domain } };
  }

  // Auto-fill dates if missing (deterministic, no AI needed).
  const currentPublishedAt = getDate(page, "PublishedAt");
  const currentUpdatedAt = getDate(page, "UpdatedAt");
  const nowISO = new Date().toISOString();
  if (!currentPublishedAt) {
    properties.PublishedAt = { date: { start: nowISO } };
  }
  if (!currentUpdatedAt) {
    properties.UpdatedAt = { date: { start: nowISO } };
  }

  if (Object.keys(properties).length === 0) {
    return { filled: false, page };
  }

  if (options.verbose) {
    console.log(`AUTOFILL: will set fields: [${Object.keys(properties).join(", ")}] model=${generated.model}`);
  }

  if (options.dryRun) {
    if (options.verbose) {
      console.log(`DRY autofill: would update Notion page → ${page.url ?? page.id}`);
      console.log(`  description: ${generated.description}`);
      console.log(`  slug: ${properties.Slug ? generated.slug : "(already set)"}`);
      console.log(`  canonicalGroup: ${properties.CanonicalGroup ? generated.canonicalGroup : "(already set)"}`);
      console.log(`  tags: ${generated.tags.join(", ")}`);
    }
    return { filled: true, page, dryRun: true };
  }

  // Write back to Notion.
  const updatedPage = await updateNotionPageProperties(page.id, properties);
  if (options.verbose) {
    console.log(`AUTOFILL: updated Notion page → ${updatedPage?.url ?? page.id}`);
  }

  return { filled: true, page: updatedPage };
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

  return {
    locale,
    domain,
    slug,
    canonicalGroup,
    title,
    description,
    tags,
    draft,
    featured,
    publishedAt,
    updatedAt,
    mdx,
  };
}

function stripFrontmatter(mdx) {
  const raw = String(mdx ?? "");
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return raw;
  // remove frontmatter block plus trailing newline(s)
  return raw.slice(end + "\n---".length).replace(/^\s*\n/, "");
}

async function maybeAutoTranslateIdToEn(sourceArticle, databaseId, options) {
  if (!options.translate) return { created: false };
  if (options.check) return { created: false };
  if (sourceArticle.locale !== "id") return { created: false };

  const dataSourceId = await resolveDataSourceId(databaseId, options);
  const existingEn = await findAnyPageByLocaleAndCanonicalGroup(
    databaseId,
    dataSourceId,
    "en",
    sourceArticle.canonicalGroup,
    options,
  );
  if (existingEn) {
    if (options.verbose) {
      console.log(
        `SKIP translate: EN already exists for canonicalGroup=${sourceArticle.canonicalGroup} -> ${existingEn.url ?? existingEn.id}`,
      );
    }
    return { created: false, reason: "en-exists" };
  }

  const translation = await openRouterTranslateIdToEn(
    {
      domain: sourceArticle.domain,
      canonicalGroup: sourceArticle.canonicalGroup,
      title: sourceArticle.title,
      description: sourceArticle.description,
      slug: sourceArticle.slug,
      tags: sourceArticle.tags,
      body: stripFrontmatter(sourceArticle.mdx),
    },
    options,
  );

  const slugCandidate = normalizeSlugCandidate(translation.slug);
  const slug = SLUG_RE.test(slugCandidate)
    ? slugCandidate
    : deterministicSlugFromCanonicalGroup(sourceArticle.canonicalGroup);

  const tags = translation.tags.length > 0 ? translation.tags : sourceArticle.tags;

  const properties = {
    Title: {
      title: [{ type: "text", text: { content: translation.title || sourceArticle.title } }],
    },
    Description: {
      rich_text: toNotionRichText(translation.description || sourceArticle.description),
    },
    Locale: {
      select: { name: "en" },
    },
    Domain: {
      select: { name: sourceArticle.domain },
    },
    Slug: {
      rich_text: toNotionRichText(slug),
    },
    CanonicalGroup: {
      rich_text: toNotionRichText(sourceArticle.canonicalGroup),
    },
    Tags: {
      multi_select: tags.map((name) => ({ name })),
    },
    Featured: {
      checkbox: Boolean(sourceArticle.featured),
    },
    Draft: {
      // As requested: translated by AI and auto-published.
      checkbox: false,
    },
    PublishedAt: {
      date: { start: sourceArticle.publishedAt },
    },
    UpdatedAt: {
      date: { start: sourceArticle.updatedAt },
    },
    TranslationOf: {
      rich_text: toNotionRichText(sourceArticle.canonicalGroup),
    },
  };

  const children = mdxBodyToNotionBlocks(translation.body);

  if (options.dryRun) {
    if (options.verbose) {
      console.log(
        `DRY translate: would create EN page canonicalGroup=${sourceArticle.canonicalGroup} slug=${slug} model=${translation.model}`,
      );
    }
    return { created: true, dryRun: true, slug };
  }

  const created = await createNotionPageInDatabase({
    databaseId,
    dataSourceId,
    properties,
    children,
  });
  if (options.verbose) {
    console.log(
      `CREATE translate: created EN page canonicalGroup=${sourceArticle.canonicalGroup} slug=${slug} model=${translation.model} -> ${created?.url ?? created?.id}`,
    );
  }
  return { created: true, slug, url: created?.url ?? null };
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

async function queryPublishedPages(databaseId, options) {
  const results = [];
  let cursor = undefined;

  const dataSourceId = await resolveDataSourceId(databaseId, options);

  do {
    const payload = {
      page_size: 100,
      start_cursor: cursor,
    };

    const queryPath = dataSourceId ? `/data_sources/${dataSourceId}/query` : `/databases/${databaseId}/query`;

    let data;
    try {
      data = await notionFetch(queryPath, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // Safety fallback: if Notion rejects database query because DB has multiple data sources,
      // parse child ids from the error payload and retry using /data_sources/{id}/query.
      if (!dataSourceId && getNotionErrorType(err) === "multiple_data_sources_for_database") {
        const childIds = getNotionChildDataSourceIdsFromError(err).map((id) => normalizeNotionId(id, "data_source_id"));
        if (childIds.length > 0) {
          const picked = await autoPickDataSourceId(childIds, options);
          if (picked) {
            if (options.verbose) console.log(`Retrying via data source (from error payload): ${picked}`);
            data = await notionFetch(`/data_sources/${picked}/query`, {
              method: "POST",
              body: JSON.stringify(payload),
            });
          }
        }
      }
      if (!data) throw err;
    }

    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const databaseId = normalizeNotionId(requiredEnv("NOTION_DATABASE_ID"), "NOTION_DATABASE_ID");

  if (!options.dryRun && !options.write && !options.check) {
    // default safe mode
    options.dryRun = true;
  }

  const pages = await queryPublishedPages(databaseId, options);

  let changedCount = 0;
  for (const page of pages) {
    // Auto-fill empty metadata fields via AI before validation.
    let activePage = page;
    try {
      const fillResult = await maybeAutoFillMetadata(page, databaseId, options);
      if (fillResult.filled && fillResult.page) {
        activePage = fillResult.page;
      }
    } catch (fillErr) {
      // Auto-fill failure is non-fatal; continue with the original page.
      if (options.verbose) {
        console.log(`AUTOFILL error (skipping): ${fillErr instanceof Error ? fillErr.message : String(fillErr)}`);
      }
    }

    let article;
    try {
      article = await pageToArticle(activePage);
    } catch {
      const url = activePage?.url ?? `https://www.notion.so/${String(activePage?.id ?? "")}`;
      const message = err instanceof Error ? err.message : String(err);
      const titleProp = getFirstTitlePropertyName(activePage);
      const propsSummary = summarizeProperties(activePage);
      
      if (options.verbose) {
        console.warn(
          [
            `[WARN] Notion page failed validation (skipping): ${url}`,
            `       pageId: ${String(activePage?.id ?? "")}`,
            `       detectedTitleProperty: ${titleProp ?? "(none)"}`,
            `       properties: ${JSON.stringify(propsSummary)}`,
            `       message: ${message}`,
          ].join("\n"),
        );
      } else {
        console.warn(`[WARN] Skipping Notion page ${url}: ${message}`);
      }
      continue;
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

    // After a successful ID sync, auto-create EN translation (Notion-first).
    // This runs only in --write mode (not in --check).
    if (options.write || options.dryRun) {
      await maybeAutoTranslateIdToEn(article, databaseId, options);
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
