// Post-build: set <html lang="id"> on Indonesian pages in the static export.
// The root layout is shared by both locales and cannot read the route in a
// static export, so it always renders lang="en". Runs automatically after
// `npm run build` (npm "postbuild" hook).
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

const files = [path.join(OUT, "id.html"), ...htmlFiles(path.join(OUT, "id"))].filter((f) =>
  fs.existsSync(f),
);

let updated = 0;
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const next = html.replace(/<html([^>]*?)\blang="en"/, '<html$1lang="id"');
  if (next !== html) {
    fs.writeFileSync(file, next);
    updated++;
  }
}

console.log(`set-html-lang: lang="id" on ${updated}/${files.length} Indonesian pages`);
