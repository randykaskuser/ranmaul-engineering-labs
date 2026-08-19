import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
try {
  const envContent = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
} catch {}

// Extract hex for normalize
// function normalizeNotionId(value) {
//   const hexOnly = String(value).replace(/[^0-9a-fA-F]/g, "");
//   const hex = hexOnly.slice(0, 32).toLowerCase();
//   return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
// }

async function notionFetch(pathname, init) {
  const token = process.env.NOTION_TOKEN;
  const res = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2025-09-03", // Use the correct version
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function fix() {
  // const dbId = normalizeNotionId(process.env.NOTION_DATABASE_ID);
  // From previous log: Using NOTION_DATA_SOURCE_ID=36552ebc-a28d-8056-8c30-000ba81c965f
  const dsId = "36552ebc-a28d-8056-8c30-000ba81c965f";
  
  const payload = {
    filter: {
      and: [
        { property: "Locale", select: { equals: "en" } },
        { property: "TranslationOf", rich_text: { is_not_empty: true } }
      ]
    }
  };
  
  console.log("Querying EN translations...");
  const data = await notionFetch(`/data_sources/${dsId}/query`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  
  const pages = data.results ?? [];
  console.log(`Found ${pages.length} translated pages.`);
  
  for (const page of pages) {
    console.log(`Archiving page ${page.id}...`);
    await notionFetch(`/pages/${page.id}`, {
      method: "PATCH",
      body: JSON.stringify({ archived: true })
    });
  }
  console.log("Done.");
}

fix().catch(console.error);
