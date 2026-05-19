import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Drone Portfolio",
  "Technical flight documentation covering FPV and aerial projects with objectives, constraints, and engineering decisions.",
);

const portfolioRows = [
  {
    label: "Aerial Photography",
    items: ["Coastal Survey Dawn", "Urban Geometry Study", "Reservoir Linework"],
  },
  {
    label: "FPV Cinematic Videos",
    items: ["Warehouse Pursuit", "Forest Valley Dive", "Cliffside Threading Run"],
  },
  {
    label: "Drone Reels & Showcases",
    items: ["Reel Vol. 01", "Client Documentation Cut", "Terrain Motion Collection"],
  },
] as const;

export default function DronePortfolioPage() {
  return (
    <>
      <section className="section-space orb-surface section-divider">
        <div className="container space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Drone Portfolio</p>
          <h1 className="display-title max-w-4xl text-4xl text-ink md:text-6xl">
            Flight case notes for cinematic work under real technical constraints
          </h1>
          <p className="max-w-[70ch] text-base leading-8 text-body md:text-lg">
            A documentation-first portfolio covering project objective, aircraft setup, flight conditions, and decision-making patterns.
          </p>
        </div>
      </section>

      {portfolioRows.map((row) => (
        <section key={row.label} className="section-space section-divider bg-canvas-soft even:bg-canvas">
          <div className="container">
            <h2 className="display-title text-3xl text-ink md:text-5xl">{row.label}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {row.items.map((item) => (
                <article key={item} className="editorial-card p-4 md:p-5">
                  <div className="aspect-[16/10] rounded-2xl border border-hairline bg-surface-card-soft" />
                  <h3 className="mt-4 text-xl text-ink">{item}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">Preview row for objective, technical challenge, weather/terrain context, and execution notes.</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
