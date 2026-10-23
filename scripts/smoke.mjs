#!/usr/bin/env node
// Smoke check for the static export in out/. Run after `npm run build`.
// Checks: key routes exist, internal links resolve, /id pages have lang="id",
// each locale's RSS feed lists its articles with resolvable links,
// MDX filenames match their frontmatter slugs, every published article has a
// real output page, and no article page is a Next.js error fallback.
// Exits 1 and lists every failure. No dependencies.

import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'out');
const CONTENT_ROOT = path.resolve(process.cwd(), 'content');
const LOCALES = ['en', 'id'];
const DOMAINS = ['qa', 'fpv', 'fishkeeping', 'notes'];

if (!fs.existsSync(OUT)) {
  console.error('smoke: out/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// Maps a URL path to a file the static host would serve, or null.
function resolveUrl(urlPath) {
  const clean = urlPath.replace(/\/+$/, '') || '/';
  const rel = decodeURIComponent(clean).replace(/^\//, '');
  const candidates = clean === '/'
    ? ['index.html']
    : [rel, `${rel}.html`, path.join(rel, 'index.html')];
  return candidates.find((c) => {
    const f = path.join(OUT, c);
    return fs.existsSync(f) && fs.statSync(f).isFile();
  }) ?? null;
}

// Sources of Cloudflare Pages redirects count as valid link targets.
const redirectSources = new Set(
  fs.readFileSync(path.join(OUT, '_redirects'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/)[0]),
);

const failures = [];
const htmlFiles = walk(OUT).filter((f) => f.endsWith('.html'));

// 1. Key routes exist.
const required = ['/', '/en', '/id', '/sitemap.xml', '/robots.txt'];
for (const locale of LOCALES) {
  required.push(`/${locale}/drone-portfolio`, `/${locale}/feed.xml`);
  for (const domain of DOMAINS) required.push(`/${locale}/${domain}`);
}
for (const route of required) {
  if (!resolveUrl(route)) failures.push(`missing route: ${route}`);
}

// 1b. Article source guard. Incident 2026-10-23: PR #54 shipped MDX files named
// `en-…`/`id-…` while the page renderer resolves `${slug}.mdx`, so both article
// pages prerendered as Next.js 404 fallbacks while the build exited 0. The
// filename must always match the frontmatter slug exactly.
const articleMeta = new Map(); // "locale/domain/slug" -> { file, title }
if (fs.existsSync(CONTENT_ROOT)) {
  for (const file of walk(CONTENT_ROOT).filter((f) => f.endsWith('.mdx'))) {
    const rel = path.relative(CONTENT_ROOT, file);
    const parts = rel.split(path.sep);
    if (parts.length !== 3) continue;
    const [locale, domain, name] = parts;
    if (!LOCALES.includes(locale) || !DOMAINS.includes(domain)) continue;
    const fm = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const field = (key) => fm && fm[1].match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))?.[1];
    const slug = field('slug');
    if (!slug) {
      failures.push(`mdx missing slug frontmatter: ${rel}`);
      continue;
    }
    if (name !== `${slug}.mdx`) {
      failures.push(`mdx filename does not match slug "${slug}": ${rel} (rename to ${locale}/${domain}/${slug}.mdx)`);
    }
    articleMeta.set(`${locale}/${domain}/${slug}`, { file: rel, title: field('title') });
  }
}

// Every published article must have a real output page. Catches the mismatch
// between route enumeration (which reads slugs from frontmatter) and the page
// renderer's `${slug}.mdx` lookup.
for (const key of articleMeta.keys()) {
  if (!resolveUrl(`/${key}`)) failures.push(`article page missing from out/: ${key}`);
}

// At least one article per locale (/{locale}/{domain}/{slug}).
for (const locale of LOCALES) {
  const articles = htmlFiles.filter((f) => {
    const parts = path.relative(OUT, f).split(path.sep);
    return parts.length === 3 && parts[0] === locale && DOMAINS.includes(parts[1]);
  });
  if (articles.length === 0) failures.push(`no articles found for locale: ${locale}`);
}

// RSS feeds: one item per published article of the locale, links resolve.
for (const locale of LOCALES) {
  const feedFile = path.join(OUT, locale, 'feed.xml');
  if (!fs.existsSync(feedFile)) continue; // already reported as a missing route
  const xml = fs.readFileSync(feedFile, 'utf8');
  if (!/^<\?xml[^>]*\?>\s*<rss version="2\.0"/.test(xml)) failures.push(`feed is not RSS 2.0: ${locale}/feed.xml`);
  if (!xml.includes(`<language>${locale}</language>`)) failures.push(`feed language is not ${locale}: ${locale}/feed.xml`);
  const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => new URL(m[1]).pathname);
  const pages = htmlFiles.filter((f) => {
    const parts = path.relative(OUT, f).split(path.sep);
    return parts.length === 3 && parts[0] === locale && DOMAINS.includes(parts[1]);
  });
  if (links.length !== pages.length) {
    failures.push(`feed ${locale}/feed.xml has ${links.length} items, expected ${pages.length} articles`);
  }
  for (const link of links) {
    if (!link.startsWith(`/${locale}/`) || !resolveUrl(link)) failures.push(`feed ${locale}/feed.xml links to missing page: ${link}`);
  }
}

// 2. Internal links resolve. 3. /id pages have lang="id".
const ATTR = /\s(?:href|src)="([^"]*)"/g;
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
const broken = new Map(); // target -> first page that links to it
let linkCount = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relPage = path.relative(OUT, file);
  const pageUrl = '/' + relPage.replace(/(?:index)?\.html$/, '');
  const parts = relPage.split(path.sep);
  const isArticle = parts.length === 3 && LOCALES.includes(parts[0]) && DOMAINS.includes(parts[1]);

  for (const [, raw] of html.matchAll(ATTR)) {
    const value = raw.replace(/&amp;/g, '&').trim();
    if (!value || EXTERNAL.test(value)) continue;
    const target = new URL(value, `https://smoke.local${pageUrl}`).pathname;
    linkCount++;
    if (resolveUrl(target) || redirectSources.has(target.replace(/\/+$/, ''))) continue;
    if (!broken.has(target)) broken.set(target, relPage);
  }

  if (relPage.startsWith(`id${path.sep}`) && !/<html[^>]*\slang="id"/.test(html)) {
    failures.push(`lang is not "id": ${relPage}`);
  }

  // 4. No article page may be a silent Next.js error fallback. next build
  // exits 0 when a static page renders notFound(), emitting a 404 fallback
  // page at the article path; the lang check alone is not enough to catch it.
  if (isArticle) {
    if (/<html[^>]*\sid="__next_error__"/.test(html) || html.includes('NEXT_HTTP_ERROR_FALLBACK')) {
      failures.push(`error fallback page instead of article: ${relPage}`);
    } else {
      const meta = articleMeta.get(relPage.replace(/\.html$/, ''));
      const pageTitle = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
      if (meta?.title && !pageTitle.includes(meta.title)) {
        failures.push(`article title mismatch: ${relPage} (expected "${meta.title}")`);
      }
    }
  }
}

for (const [target, page] of broken) {
  failures.push(`broken link: ${target} (first seen in ${page})`);
}

console.log(
  `smoke: ${htmlFiles.length} pages, ${linkCount} internal links, ${required.length} key routes checked`,
);
if (failures.length) {
  console.error(`smoke: FAILED (${failures.length})`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('smoke: OK');
