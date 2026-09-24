import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { GITHUB_URL, isSiteLocale, pick, type Localized } from "@/lib/site";

type Params = { locale: string };

type Project = {
  name: Localized;
  summary: Localized;
  problem: Localized;
  approach: Localized[];
  stack: string;
  links: { label: Localized; href: string; external?: boolean }[];
};

const COPY = {
  title: { en: "Projects", id: "Projects" },
  metaDescription: {
    en: "Things I built: an AI work assistant, a Notion-to-MDX publishing pipeline, and this bilingual engineering journal.",
    id: "Hal-hal yang saya buat: asisten AI untuk kerja, pipeline publikasi Notion ke MDX, dan jurnal engineering dua bahasa ini.",
  },
  heroTitle: { en: "Things I built, and why", id: "Yang saya buat, dan alasannya" },
  heroDescription: {
    en: "Each project starts with a problem I had. For downloadable tools, see the Tools page.",
    id: "Setiap project berawal dari masalah yang saya alami. Untuk tools yang bisa diunduh, lihat halaman Tools.",
  },
  problem: { en: "Problem", id: "Masalah" },
  howItWorks: { en: "How it works", id: "Cara kerja" },
};

const PROJECTS: Project[] = [
  {
    // Built for work. Keep this generic: no company, tool, channel or colleague names,
    // no screenshots of real data, no repo link.
    name: { en: "Personal Butler", id: "Personal Butler" },
    summary: {
      en: "An AI assistant I built for my daily work at a tech company.",
      id: "Asisten AI yang saya buat untuk pekerjaan sehari-hari di sebuah perusahaan teknologi.",
    },
    problem: {
      en: "Too much of the day went to small, repeated tasks: looking up answers in internal docs, writing tickets, and labeling them the same way every time.",
      id: "Terlalu banyak waktu habis untuk tugas kecil yang berulang: mencari jawaban di dokumen internal, menulis tiket, dan memberi label yang sama setiap kali.",
    },
    approach: [
      {
        en: "Answers questions by searching a knowledge base first, instead of guessing",
        id: "Menjawab pertanyaan dengan mencari di knowledge base dulu, bukan menebak",
      },
      {
        en: "Writes tickets in a fixed format for each ticket type",
        id: "Menulis tiket dengan format tetap untuk setiap jenis tiket",
      },
      {
        en: "Suggests labels automatically from the ticket content",
        id: "Menyarankan label secara otomatis dari isi tiket",
      },
      {
        en: "Runs in the cloud behind an LLM proxy, so the model can change without code changes",
        id: "Berjalan di cloud lewat LLM proxy, jadi model bisa diganti tanpa mengubah kode",
      },
    ],
    stack: "LLM agent · Knowledge search · LLM proxy · Built with Claude Code",
    links: [],
  },
  {
    name: { en: "Notion → MDX publishing pipeline", id: "Pipeline publikasi Notion → MDX" },
    summary: {
      en: "Write in Notion, publish to this site without touching Git.",
      id: "Menulis di Notion, terbit di situs ini tanpa menyentuh Git.",
    },
    problem: {
      en: "Writing in a code editor is slow, but a CMS adds a server, a database and a login to maintain. I wanted Notion's editor and a static site.",
      id: "Menulis di code editor itu lambat, tapi CMS butuh server, database, dan login yang harus dirawat. Saya ingin editor Notion dengan situs statis.",
    },
    approach: [
      {
        en: "A GitHub Action checks the Notion database every 15 minutes and converts pages with Draft = false into MDX files",
        id: "GitHub Action mengecek database Notion setiap 15 menit dan mengubah halaman dengan Draft = false menjadi file MDX",
      },
      {
        en: "Changes arrive as a pull request, so nothing goes live without review",
        id: "Perubahan masuk sebagai pull request, jadi tidak ada yang tayang tanpa dicek",
      },
      {
        en: "When an Indonesian article has no English version yet, an LLM drafts the translation back into Notion",
        id: "Jika artikel bahasa Indonesia belum punya versi Inggris, LLM membuat draf terjemahannya kembali ke Notion",
      },
      {
        en: "Images are downloaded into the repo, with guards against unsafe URLs",
        id: "Gambar diunduh ke repo, dengan pengaman terhadap URL yang tidak aman",
      },
    ],
    stack: "Node.js · Notion API · GitHub Actions · OpenRouter",
    links: [
      { label: { en: "How to publish", id: "Cara publikasi" }, href: "/create" },
      {
        label: { en: "Sync script", id: "Script sync" },
        href: `${GITHUB_URL}/ranmaul-engineering-labs/blob/main/scripts/notion-sync.mjs`,
        external: true,
      },
    ],
  },
  {
    name: { en: "Engineering Labs (this site)", id: "Engineering Labs (situs ini)" },
    summary: {
      en: "A bilingual technical journal for QA, FPV and fishkeeping.",
      id: "Jurnal teknis dua bahasa tentang QA, FPV, dan fishkeeping.",
    },
    problem: {
      en: "I wanted one place for engineering notes and drone work that is fast, cheap to host and needs no maintenance.",
      id: "Saya ingin satu tempat untuk catatan engineering dan karya drone yang cepat, murah di-hosting, dan tidak perlu perawatan.",
    },
    approach: [
      {
        en: "Fully static Next.js export on Cloudflare Pages: no server, no database",
        id: "Export Next.js yang sepenuhnya statis di Cloudflare Pages: tanpa server, tanpa database",
      },
      {
        en: "English and Indonesian versions of each article, linked so the language toggle opens the translated article",
        id: "Setiap artikel punya versi Inggris dan Indonesia, terhubung sehingga tombol bahasa membuka artikel terjemahannya",
      },
      {
        en: "Content is plain MDX files in Git with a strict frontmatter contract",
        id: "Konten berupa file MDX biasa di Git dengan aturan frontmatter yang ketat",
      },
      {
        en: "Built and maintained with coding agents, with checks and progress logs kept in the repo",
        id: "Dibangun dan dirawat dengan coding agent, dengan pengecekan dan log progres di dalam repo",
      },
    ],
    stack: "Next.js · TypeScript · Tailwind CSS · MDX · Cloudflare Pages",
    links: [
      {
        label: { en: "Source on GitHub", id: "Source code di GitHub" },
        href: `${GITHUB_URL}/ranmaul-engineering-labs`,
        external: true,
      },
    ],
  },
];

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(pick(COPY.title, locale), pick(COPY.metaDescription, locale), {
    path: `/${locale}/projects`,
    locale,
    localizedPath: "/{locale}/projects",
  });
}

export default async function ProjectsPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();

  return (
    <>
      <PageHero eyebrow={pick(COPY.title, locale)} title={pick(COPY.heroTitle, locale)} description={pick(COPY.heroDescription, locale)} />
      <section className="section-space">
        <div className="site-container space-y-6">
          {PROJECTS.map((project) => (
            <article key={project.name.en} className="rounded-2xl border border-hairline bg-surface-card p-6 md:p-8">
              <h2 className="text-2xl font-medium text-ink">{pick(project.name, locale)}</h2>
              <p className="mt-2 text-body">{pick(project.summary, locale)}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <p className="type-kicker">{pick(COPY.problem, locale)}</p>
                  <p className="mt-2 text-sm leading-7 text-body">{pick(project.problem, locale)}</p>
                </div>
                <div>
                  <p className="type-kicker">{pick(COPY.howItWorks, locale)}</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-body">
                    {project.approach.map((item) => (
                      <li key={item.en} className="flex gap-2">
                        <span aria-hidden="true" className="text-muted">•</span>
                        <span>{pick(item, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-xs text-muted">{project.stack}</p>
              {project.links.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="rounded-full border border-hairline-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card-soft"
                    >
                      {pick(link.label, locale)}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
