import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Engineering Labs is a systems-oriented technical journal documenting automation reliability, FPV flight engineering, fishkeeping infrastructure, and real-world troubleshooting workflows.",
};

const categories = [
  {
    title: "QA Lab",
    description: "Automation architecture, reliability experiments, and test engineering notes.",
    href: "/qa-lab",
  },
  {
    title: "FPV Lab",
    description: "Build logs, tuning frameworks, and cinematic flight engineering workflows.",
    href: "/fpv-lab",
  },
  {
    title: "Fishkeeping Systems",
    description: "Water parameter systems, habitat troubleshooting, and data-backed maintenance.",
    href: "/fishkeeping",
  },
] as const;

const droneMedia = [
  { title: "Coastal Ridge Pass", type: "FPV Cinematic Reel" },
  { title: "Industrial Roof Survey", type: "Aerial Documentation" },
  { title: "Forest Descent", type: "Cinematic Thumbnail Set" },
  { title: "Riverline Orbit", type: "Aerial Photography" },
] as const;

export default function Home() {
  return (
    <>
      <section className="section-space-lg orb-surface section-divider">
        <div className="container space-y-8 md:space-y-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Engineering Platform</p>
          <h1 className="display-title max-w-5xl text-4xl text-ink md:text-7xl">
            Experiments, systems, and technical workflows — documented in public.
          </h1>
          <p className="max-w-[70ch] text-base leading-8 text-body md:text-lg">
            A long-term engineering journal focused on automation reliability, FPV flight systems, fishkeeping infrastructure,
            and practical troubleshooting logs that explain decisions, trade-offs, and outcomes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/drone-portfolio" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">
              Review Flight Case Notes
            </Link>
            <Link href="/qa-lab" className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink">
              Read QA Reliability Logs
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space section-divider">
        <div className="container">
          <h2 className="display-title text-3xl text-ink md:text-5xl">Featured Categories</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className="editorial-card p-6 transition hover:border-hairline-strong">
                <h3 className="text-lg font-medium text-ink">{category.title}</h3>
                <p className="mt-3 text-sm leading-7 text-body">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space section-divider bg-canvas-soft">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="display-title text-3xl text-ink md:text-5xl">Drone Portfolio Preview</h2>
            <Link href="/drone-portfolio" className="text-sm text-body hover:text-ink">
              Open technical flight archive
            </Link>
          </div>
          <p className="mb-6 max-w-[70ch] text-sm leading-7 text-body md:text-base">
            Selected flight documentation with objective, field constraints, and technical decisions behind each shot.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {droneMedia.map((item) => (
              <article key={item.title} className="editorial-card p-4 md:p-5">
                <div className="aspect-[16/10] rounded-2xl border border-hairline bg-surface-card-soft" />
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">{item.type}</p>
                <h3 className="mt-2 text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-body">Objective, aircraft setup, and flight-condition notes prepared for future full case studies.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space section-divider">
        <div className="container grid gap-6 md:grid-cols-2 md:gap-8">
          <article className="editorial-card p-6">
            <h2 className="display-title text-3xl text-ink">Featured Projects</h2>
            <p className="mt-4 text-sm leading-7 text-body">
              Ongoing implementation notes spanning QA frameworks, tooling experiments, and creator-engineer system builds.
            </p>
          </article>
          <article className="editorial-card p-6">
            <h2 className="display-title text-3xl text-ink">Latest Articles</h2>
            <p className="mt-4 text-sm leading-7 text-body">
              Recent field notes and troubleshooting logs focused on reproducible workflows, constraints, and iteration outcomes.
            </p>
          </article>
        </div>
      </section>

      <section className="section-space">
        <div className="container-reading text-center">
          <h2 className="display-title text-3xl text-ink md:text-5xl">Build useful systems. Document the process.</h2>
          <p className="mx-auto mt-4 text-sm leading-7 text-body">
            This journal exists to publish real engineering thinking across domains — not just results, but the reasoning behind them.
          </p>
        </div>
      </section>
    </>
  );
}
