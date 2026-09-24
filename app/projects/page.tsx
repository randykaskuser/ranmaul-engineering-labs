import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { GITHUB_URL } from "@/lib/site";

export const metadata = createPageMetadata(
  "Projects",
  "Things I built: this bilingual engineering journal and its Notion-to-MDX publishing pipeline.",
);

type Project = {
  name: string;
  summary: string;
  problem: string;
  approach: string[];
  stack: string;
  links: { label: string; href: string; external?: boolean }[];
};

const PROJECTS: Project[] = [
  {
    name: "Notion → MDX publishing pipeline",
    summary: "Write in Notion, publish to this site without touching Git.",
    problem:
      "Writing in a code editor is slow, but a CMS adds a server, a database and a login to maintain. I wanted Notion's editor and a static site.",
    approach: [
      "A GitHub Action checks the Notion database every 15 minutes and converts pages with Draft = false into MDX files",
      "Changes arrive as a pull request, so nothing goes live without review",
      "When an Indonesian article has no English version yet, an LLM drafts the translation back into Notion",
      "Images are downloaded into the repo, with guards against unsafe URLs",
    ],
    stack: "Node.js · Notion API · GitHub Actions · OpenRouter",
    links: [
      { label: "How to publish", href: "/create" },
      { label: "Sync script", href: `${GITHUB_URL}/ranmaul-engineering-labs/blob/main/scripts/notion-sync.mjs`, external: true },
    ],
  },
  {
    name: "Engineering Labs (this site)",
    summary: "A bilingual technical journal for QA, FPV and fishkeeping.",
    problem:
      "I wanted one place for engineering notes and drone work that is fast, cheap to host and needs no maintenance.",
    approach: [
      "Fully static Next.js export on Cloudflare Pages: no server, no database",
      "English and Indonesian versions of each article, linked so the language toggle opens the translated article",
      "Content is plain MDX files in Git with a strict frontmatter contract",
      "Built and maintained with coding agents, with checks and progress logs kept in the repo",
    ],
    stack: "Next.js · TypeScript · Tailwind CSS · MDX · Cloudflare Pages",
    links: [{ label: "Source on GitHub", href: `${GITHUB_URL}/ranmaul-engineering-labs`, external: true }],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Things I built, and why"
        description="Each project starts with a problem I had. For downloadable tools, see the Tools page."
      />
      <section className="section-space">
        <div className="site-container space-y-6">
          {PROJECTS.map((project) => (
            <article key={project.name} className="rounded-2xl border border-hairline bg-surface-card p-6 md:p-8">
              <h2 className="text-2xl font-medium text-ink">{project.name}</h2>
              <p className="mt-2 text-body">{project.summary}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <p className="type-kicker">Problem</p>
                  <p className="mt-2 text-sm leading-7 text-body">{project.problem}</p>
                </div>
                <div>
                  <p className="type-kicker">How it works</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-body">
                    {project.approach.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-muted">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-xs text-muted">{project.stack}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="rounded-full border border-hairline-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card-soft"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
