import type { Metadata } from "next";
import Link from "next/link";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Engineering Labs is a systems-oriented technical journal documenting automation reliability, FPV flight engineering, fishkeeping infrastructure, and real-world troubleshooting workflows.",
};

const getCategories = (locale: string) => [
  {
    title: "QA Lab",
    description: "Automation architecture, reliability experiments, and test engineering notes.",
    href: `/${locale}/qa`,
    detail: "Automation reliability, experiment logs, and decision trade-offs.",
  },
  {
    title: "FPV Lab",
    description: "Build logs, tuning frameworks, and cinematic flight engineering workflows.",
    href: `/${locale}/fpv`,
    detail: "Flight constraints, tuning baselines, and engineering checklists.",
  },
  {
    title: "Fishkeeping Systems",
    description: "Water parameter systems, habitat troubleshooting, and data-backed maintenance.",
    href: `/${locale}/fishkeeping`,
    detail: "Infrastructure notes, maintenance loops, and measurement discipline.",
  },
];

const droneMedia = [
  {
    title: "Coastal Ridge Pass",
    type: "FPV Case Note",
    objective: "Lock a clean ridge reveal without over-rotating the horizon.",
    constraint: "Variable wind + narrow recovery zone.",
  },
  {
    title: "Industrial Roof Survey",
    type: "Documentation Case Note",
    objective: "Capture reference angles for inspection while staying legal and stable.",
    constraint: "RF noise + controlled altitude ceiling.",
  },
  {
    title: "Forest Descent",
    type: "Cinematic Case Note",
    objective: "Hold consistent exposure during canopy-to-open transitions.",
    constraint: "High dynamic range + tight pathing.",
  },
  {
    title: "Riverline Orbit",
    type: "Aerial Case Note",
    objective: "Maintain orbit geometry and subject framing at mid-speed.",
    constraint: "Reflective highlights + limited GPS lock.",
  },
] as const;

const projects = [
  {
    title: "Notion → MDX Publishing Pipeline",
    description: "A filesystem-first workflow that keeps content reproducible, reviewable, and deployable without a CMS.",
    href: "/create",
    tag: "Automation",
  },
  {
    title: "MDX Components + Editorial Code Blocks",
    description: "Readable technical content primitives with consistent typography, spacing, and code presentation.",
    href: "/en/qa/notion-sync-smoke-test",
    tag: "Content System",
  },
] as const;

const latest = [
  {
    title: "Notion Sync Smoke Test",
    description: "A minimal published entry used to validate the content contract, routing, and rendering constraints.",
    href: "/en/qa/notion-sync-smoke-test",
    meta: "QA · Contract validation",
  },
  {
    title: "Channa Andrao — Field Notes",
    description: "Fishkeeping system notes captured as a long-form, reproducible log (parameters, constraints, decisions).",
    href: "/id/fishkeeping/channa-andrao",
    meta: "Fishkeeping · Systems",
  },
] as const;

export default function Home({ locale = "en" }: { locale?: string }) {
  const currentCategories = getCategories(locale);

  return (
    <>
      <Section space="xl" divider orb>
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <Stack gap="lg">
              <p className="type-kicker">Engineering Platform</p>
              <h1 className="display-title max-w-5xl text-4xl text-ink md:text-7xl">
                Experiments, systems, and field constraints — documented in public.
              </h1>
              <p className="type-lede max-w-[72ch]">
                A long-term technical journal focused on automation reliability, FPV flight systems, fishkeeping infrastructure,
                and reproducible troubleshooting logs that preserve the reasoning behind decisions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/drone-portfolio" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">
                  Review Flight Case Notes
                </Link>
                <Link href={`/${locale}/qa`} className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink">
                  Read QA Reliability Logs
                </Link>
              </div>
            </Stack>

            <aside className="editorial-card-soft p-5 md:p-6">
              <p className="type-kicker">Editorial Contract</p>
              <p className="mt-4 text-sm leading-7 text-body">
                Every entry aims to record: objective → constraints → trade-offs → outcome. The goal is reuse, not hype.
              </p>
              <p className="mt-4 text-xs tracking-[0.12em] text-muted">
                Systems-first · Calm spacing · Long-form ready
              </p>
            </aside>
          </div>
        </div>
      </Section>

      <Section divider>
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="display-title text-3xl text-ink md:text-5xl">Featured Categories</h2>
            <Link href="/projects" className="text-sm text-body hover:text-ink">
              Browse platform notes
            </Link>
          </div>
          <Grid columns={3} gap="md">
            {currentCategories.map((category) => (
              <Link key={category.title} href={category.href} className="editorial-card p-6">
                <p className="type-kicker">Domain</p>
                <h3 className="mt-3 type-title text-ink">{category.title}</h3>
                <p className="mt-3 text-sm leading-7 text-body">{category.description}</p>
                <p className="mt-4 text-xs leading-6 text-muted">{category.detail}</p>
              </Link>
            ))}
          </Grid>
        </div>
      </Section>

      <Section divider tone="soft">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="display-title text-3xl text-ink md:text-5xl">Drone Portfolio Preview</h2>
            <Link href="/drone-portfolio" className="text-sm text-body hover:text-ink">
              Open technical flight archive
            </Link>
          </div>
          <p className="mb-6 max-w-[68ch] text-sm leading-7 text-body md:text-base">
            Selected flight documentation with objective, field constraints, and technical decisions behind each shot.
          </p>
          <Grid columns={2} gap="md">
            {droneMedia.map((item) => (
              <article key={item.title} className="editorial-card p-4 md:p-5">
                <div className="aspect-[16/10] rounded-2xl border border-hairline bg-surface-card-soft" />
                <p className="type-kicker mt-4 tracking-[0.14em]">{item.type}</p>
                <h3 className="mt-2 text-xl text-ink">{item.title}</h3>
                <dl className="mt-3 space-y-2 text-sm leading-7 text-body">
                  <div className="grid gap-1">
                    <dt className="text-xs tracking-[0.12em] text-muted">Objective</dt>
                    <dd>{item.objective}</dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="text-xs tracking-[0.12em] text-muted">Constraint</dt>
                    <dd>{item.constraint}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </Grid>
        </div>
      </Section>

      <Section divider>
        <div className="container">
          <Grid columns={2} gap="md">
            <article className="editorial-card p-6">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="display-title text-3xl text-ink">Featured Projects</h2>
                <Link href="/projects" className="text-sm text-body hover:text-ink">
                  View all
                </Link>
              </div>
              <Stack gap="sm">
                {projects.map((project) => (
                  <Link key={project.title} href={project.href} className="block rounded-2xl border border-hairline p-4">
                    <p className="type-kicker">{project.tag}</p>
                    <h3 className="mt-2 text-lg text-ink">{project.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-body">{project.description}</p>
                  </Link>
                ))}
              </Stack>
            </article>

            <article className="editorial-card p-6">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="display-title text-3xl text-ink">Latest Articles</h2>
                <Link href="/en/qa/notion-sync-smoke-test" className="text-sm text-body hover:text-ink">
                  Open index sample
                </Link>
              </div>
              <Stack gap="sm">
                {latest.map((entry) => (
                  <Link key={entry.title} href={entry.href} className="block rounded-2xl border border-hairline p-4">
                    <p className="type-kicker">{entry.meta}</p>
                    <h3 className="mt-2 text-lg text-ink">{entry.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-body">{entry.description}</p>
                  </Link>
                ))}
              </Stack>
            </article>
          </Grid>
        </div>
      </Section>

      <Section>
        <div className="container-reading">
          <div className="editorial-card p-8 text-center md:p-10">
            <p className="type-kicker">Call to Practice</p>
            <h2 className="display-title mt-5 text-3xl text-ink md:text-5xl">Build useful systems. Document the process.</h2>
            <p className="mx-auto mt-4 max-w-[68ch] text-sm leading-7 text-body">
              This journal exists to publish real engineering thinking across domains — not just results, but the reasoning,
              constraints, and iteration paths that make outcomes reproducible.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/create" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">
                Publishing workflow
              </Link>
              <Link href="/projects" className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink">
                Platform projects
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
