import { createPageMetadata } from "@/lib/page-metadata";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

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
      <Section space="lg" divider orb>
        <div className="container">
          <Stack gap="md">
            <p className="type-kicker">Drone Portfolio</p>
            <h1 className="display-title max-w-4xl text-4xl text-ink md:text-6xl">
              Flight case notes for cinematic work under real technical constraints
            </h1>
            <p className="type-lede max-w-[68ch]">
              A documentation-first portfolio covering project objective, aircraft setup, flight conditions, and decision-making patterns.
            </p>
          </Stack>
        </div>
      </Section>

      {portfolioRows.map((row) => (
        <Section
          key={row.label}
          divider
          tone="soft"
          className="even:bg-canvas"
        >
          <div className="container">
            <h2 className="display-title text-3xl text-ink md:text-5xl">{row.label}</h2>
            <div className="mt-8">
              <Grid columns={3} gap="md">
                {row.items.map((item) => (
                  <article key={item} className="editorial-card p-4 md:p-5">
                    <div className="aspect-[16/10] rounded-2xl border border-hairline bg-surface-card-soft" />
                    <h3 className="mt-4 text-xl text-ink">{item}</h3>
                    <p className="mt-2 text-sm leading-7 text-body">
                      Preview row for objective, technical challenge, weather/terrain context, and execution notes.
                    </p>
                  </article>
                ))}
              </Grid>
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
