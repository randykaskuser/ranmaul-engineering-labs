#!/usr/bin/env node
// Smoke check for the static export in out/. Run after `npm run build`.
// Checks: key routes exist, internal links resolve, /id pages have lang="id".
// Exits 1 and lists every failure. No dependencies.

import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'out');
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
  required.push(`/${locale}/drone-portfolio`);
  for (const domain of DOMAINS) required.push(`/${locale}/${domain}`);
}
for (const route of required) {
  if (!resolveUrl(route)) failures.push(`missing route: ${route}`);
}

// At least one article per locale (/{locale}/{domain}/{slug}).
for (const locale of LOCALES) {
  const articles = htmlFiles.filter((f) => {
    const parts = path.relative(OUT, f).split(path.sep);
    return parts.length === 3 && parts[0] === locale && DOMAINS.includes(parts[1]);
  });
  if (articles.length === 0) failures.push(`no articles found for locale: ${locale}`);
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
