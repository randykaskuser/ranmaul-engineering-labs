import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { GITHUB_URL, isSiteLocale, pick, type Localized } from "@/lib/site";

type Params = { locale: string };

type Tool = {
  name: string;
  tagline: Localized;
  description: Localized;
  points: Localized[];
  stack: string;
  links: { label: Localized; href: string }[];
  install?: string;
};

const COPY = {
  title: { en: "Tools", id: "Tools" },
  metaDescription: {
    en: "Free tools I built and use: DevSpace, a disk cleaner for developers, and QA skills for coding agents.",
    id: "Tools gratis yang saya buat dan pakai: DevSpace, pembersih disk untuk developer, dan skill QA untuk coding agent.",
  },
  heroTitle: { en: "Free tools I built and use every day", id: "Tools gratis yang saya buat dan pakai setiap hari" },
  heroDescription: {
    en: "Small, practical software for developers and QA engineers. Both are open source.",
    id: "Software kecil dan praktis untuk developer dan QA engineer. Keduanya open source.",
  },
};

const TOOLS: Tool[] = [
  {
    name: "DevSpace",
    tagline: { en: "A disk cleaner built for developers", id: "Pembersih disk khusus developer" },
    description: {
      en: "Finds what is eating your disk on a dev machine and cleans it safely: node_modules in old projects, package manager caches, and Docker/WSL2 virtual disks that never shrink.",
      id: "Mencari apa yang menghabiskan disk di laptop developer dan membersihkannya dengan aman: node_modules di project lama, cache package manager, dan virtual disk Docker/WSL2 yang tidak pernah mengecil.",
    },
    points: [
      {
        en: "Scores each repo by recent Git and file activity, so active projects are never touched",
        id: "Menilai setiap repo dari aktivitas Git dan file terakhir, jadi project aktif tidak akan tersentuh",
      },
      {
        en: "One-click cleanup of npm, pip/uv, Cargo, Gradle, Maven and Playwright caches",
        id: "Bersihkan cache npm, pip/uv, Cargo, Gradle, Maven, dan Playwright dengan satu klik",
      },
      {
        en: "Compacts the Docker Desktop WSL2 disk to give space back to Windows",
        id: "Memadatkan disk WSL2 Docker Desktop agar ruang kembali ke Windows",
      },
    ],
    stack: "Python · PySide6 · PyInstaller",
    links: [
      {
        label: { en: "Download for Windows", id: "Download untuk Windows" },
        href: `${GITHUB_URL}/devspace-storage-analyzer/releases/latest/download/DevSpace.exe`,
      },
      {
        label: { en: "Download for macOS (untested)", id: "Download untuk macOS (belum dites)" },
        href: `${GITHUB_URL}/devspace-storage-analyzer/releases/latest/download/DevSpace.dmg`,
      },
      {
        label: { en: "Source on GitHub", id: "Source code di GitHub" },
        href: `${GITHUB_URL}/devspace-storage-analyzer`,
      },
    ],
  },
  {
    name: "QA Agent Skills",
    tagline: { en: "QA workflows for coding agents", id: "Alur kerja QA untuk coding agent" },
    description: {
      en: "Skills that teach Claude Code (or any agent that reads SKILL.md) to do QA properly: verify a ticket in the right place, explore a site with no spec, or turn a spec into test cases.",
      id: "Skill yang mengajari Claude Code (atau agent lain yang membaca SKILL.md) melakukan QA dengan benar: verifikasi tiket di tempat yang tepat, eksplorasi situs tanpa spec, atau mengubah spec menjadi test case.",
    },
    points: [
      {
        en: "ticket-driven-qa: verify a change where users actually see it, then file reproducible bug reports",
        id: "ticket-driven-qa: verifikasi perubahan di tempat user benar-benar melihatnya, lalu buat bug report yang bisa direproduksi",
      },
      {
        en: "exploratory-web-testing: from a URL to a behaviour spec, test cases and a Qase-ready CSV",
        id: "exploratory-web-testing: dari URL menjadi spec perilaku, test case, dan CSV siap impor ke Qase",
      },
      {
        en: "casely: from a spec or user story to review-ready test cases and a Postman collection",
        id: "casely: dari spec atau user story menjadi test case siap review dan Postman collection",
      },
    ],
    stack: "Claude Code plugin · Markdown skills · Playwright MCP",
    install: "/plugin marketplace add randykaskuser/qa-agent-skills\n/plugin install qa-agent-skills",
    links: [{ label: { en: "Source on GitHub", id: "Source code di GitHub" }, href: `${GITHUB_URL}/qa-agent-skills` }],
  },
];

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...createPageMetadata(pick(COPY.title, locale), pick(COPY.metaDescription, locale)),
    alternates: { canonical: `/${locale}/tools`, languages: { en: "/en/tools", id: "/id/tools" } },
  };
}

export default async function ToolsPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();

  return (
    <>
      <PageHero eyebrow={pick(COPY.title, locale)} title={pick(COPY.heroTitle, locale)} description={pick(COPY.heroDescription, locale)} />
      <section className="section-space">
        <div className="site-container grid gap-6 lg:grid-cols-2">
          {TOOLS.map((tool) => (
            <article key={tool.name} className="flex min-w-0 flex-col rounded-2xl border border-hairline bg-surface-card p-6 md:p-8">
              <p className="type-kicker">{pick(tool.tagline, locale)}</p>
              <h2 className="mt-3 text-2xl font-medium text-ink">{tool.name}</h2>
              <p className="mt-4 text-sm leading-7 text-body">{pick(tool.description, locale)}</p>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-body">
                {tool.points.map((point) => (
                  <li key={point.en} className="flex gap-2">
                    <span aria-hidden="true" className="text-muted">•</span>
                    <span>{pick(point, locale)}</span>
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
                    {pick(link.label, locale)}
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
