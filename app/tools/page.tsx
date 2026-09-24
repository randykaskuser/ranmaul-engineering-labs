import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { GITHUB_URL } from "@/lib/site";

export const metadata = createPageMetadata(
  "Tools",
  "Free tools I built and use: DevSpace, a disk cleaner for developers, and QA skills for coding agents.",
);

type Tool = {
  name: string;
  tagline: string;
  description: string;
  points: string[];
  stack: string;
  links: { label: string; href: string }[];
  install?: string;
};

const TOOLS: Tool[] = [
  {
    name: "DevSpace",
    tagline: "A disk cleaner built for developers",
    description:
      "Finds what is eating your disk on a dev machine and cleans it safely: node_modules in old projects, package manager caches, and Docker/WSL2 virtual disks that never shrink.",
    points: [
      "Scores each repo by recent Git and file activity, so active projects are never touched",
      "One-click cleanup of npm, pip/uv, Cargo, Gradle, Maven and Playwright caches",
      "Compacts the Docker Desktop WSL2 disk to give space back to Windows",
    ],
    stack: "Python · PySide6 · PyInstaller",
    links: [
      {
        label: "Download for Windows",
        href: `${GITHUB_URL}/devspace-storage-analyzer/releases/latest/download/DevSpace.exe`,
      },
      {
        label: "Download for macOS (untested)",
        href: `${GITHUB_URL}/devspace-storage-analyzer/releases/latest/download/DevSpace.dmg`,
      },
      { label: "Source on GitHub", href: `${GITHUB_URL}/devspace-storage-analyzer` },
    ],
  },
  {
    name: "QA Agent Skills",
    tagline: "QA workflows for coding agents",
    description:
      "Skills that teach Claude Code (or any agent that reads SKILL.md) to do QA properly: verify a ticket in the right place, explore a site with no spec, or turn a spec into test cases.",
    points: [
      "ticket-driven-qa: verify a change where users actually see it, then file reproducible bug reports",
      "exploratory-web-testing: from a URL to a behaviour spec, test cases and a Qase-ready CSV",
      "casely: from a spec or user story to review-ready test cases and a Postman collection",
    ],
    stack: "Claude Code plugin · Markdown skills · Playwright MCP",
    install: "/plugin marketplace add randykaskuser/qa-agent-skills\n/plugin install qa-agent-skills",
    links: [{ label: "Source on GitHub", href: `${GITHUB_URL}/qa-agent-skills` }],
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Free tools I built and use every day"
        description="Small, practical software for developers and QA engineers. Both are open source."
      />
      <section className="section-space">
        <div className="site-container grid gap-6 lg:grid-cols-2">
          {TOOLS.map((tool) => (
            <article key={tool.name} className="flex min-w-0 flex-col rounded-2xl border border-hairline bg-surface-card p-6 md:p-8">
              <p className="type-kicker">{tool.tagline}</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">{tool.name}</h2>
              <p className="mt-4 text-sm leading-7 text-body">{tool.description}</p>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-body">
                {tool.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true" className="text-muted">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {tool.install ? (
                <pre className="mt-5 overflow-x-auto rounded-xl border border-hairline bg-canvas p-4 text-xs leading-6 text-ink">
                  <code>{tool.install}</code>
                </pre>
              ) : null}
              <p className="mt-5 text-xs text-muted">{tool.stack}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {tool.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
