import { createPageMetadata } from "@/lib/page-metadata";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Reveal } from "@/components/layout/reveal";
import { Stagger } from "@/components/layout/stagger";
import Image from "next/image";

export const metadata = createPageMetadata(
  "Drone Portfolio",
  "Technical flight documentation covering FPV and aerial projects with objectives, constraints, and engineering decisions.",
);

const portfolioRows = [
  {
    label: "Aerial Photography",
    items: [
      {
        title: "Mountain Valley Top-down",
        image: "/images/portfolio/mountain-valley-web.jpg",
        objective: "Capture geometric patterns of terraced mountain farms",
        constraint: "High altitude wind currents and varying light exposures",
      },
      {
        title: "Coastal Breakwater",
        image: "/images/portfolio/coastal-topdown-web.jpg",
        objective: "Top-down view of wave breaks against coastal structures",
        constraint: "Maintaining altitude while avoiding sea spray and glare",
      },
      {
        title: "Merapi Crater Edge",
        image: "/images/portfolio/merapi-crater-web.jpg",
        objective: "Proximity flight capturing the active crater ridge",
        constraint: "Sulphur gasses affecting sensors and unpredictable thermals",
      },
      {
        title: "Heritage Nightscape",
        image: "/images/portfolio/night-cityscape-web.jpg",
        objective: "Long exposure of city traffic at night",
        constraint: "Low light noise management and keeping the drone perfectly still",
      },
      {
        title: "Flight Setup & Gear",
        image: "/images/portfolio/drone-setup-web.jpg",
        objective: "Documenting the FPV and cinematic drone fleet",
        constraint: "Studio lighting and macro focus on carbon frames",
      }
    ],
  },
  {
    label: "FPV Cinematic Videos",
    items: [
      {
        title: "Warehouse Pursuit",
        image: null,
        objective: "High-speed tracking indoors",
        constraint: "Signal penetration through concrete walls",
      },
      {
        title: "Forest Valley Dive",
        image: null,
        objective: "Proximity flying through dense canopy",
        constraint: "Video signal multipathing from tree trunks",
      },
      {
        title: "Cliffside Threading Run",
        image: null,
        objective: "Diving down a narrow cliff gap",
        constraint: "Managing momentum and throttle recovery at the bottom",
      }
    ],
  },
];

export default function DronePortfolioPage() {
  return (
    <>
      <Section space="lg" divider orb>
        <div className="container">
          <Reveal>
            <Stack gap="md">
              <p className="type-kicker">Drone Portfolio</p>
              <h1 className="display-title max-w-4xl text-4xl text-ink md:text-6xl">
                Flight case notes for cinematic work under real technical constraints
              </h1>
              <p className="type-lede max-w-[68ch]">
                A documentation-first portfolio covering project objective, aircraft setup, flight conditions, and decision-making patterns.
              </p>
            </Stack>
          </Reveal>
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
            <Reveal>
              <h2 className="display-title text-3xl text-ink md:text-5xl">{row.label}</h2>
            </Reveal>
            <div className="mt-8">
              <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.15}>
                {row.items.map((item) => (
                  <article key={item.title} className="editorial-card p-4 md:p-5 transition-shadow hover:shadow-lg">
                    {item.image ? (
                      <div className="aspect-[16/10] overflow-hidden rounded-xl border border-hairline bg-surface-card-soft">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={800}
                          height={500}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] rounded-xl border border-hairline bg-surface-card-soft flex items-center justify-center text-muted">
                        <span className="text-xs uppercase tracking-widest">Video Pending</span>
                      </div>
                    )}
                    <h3 className="mt-5 text-xl text-ink font-medium">{item.title}</h3>
                    <dl className="mt-4 space-y-3 text-sm leading-6 text-body">
                      <div className="grid gap-1">
                        <dt className="text-[11px] tracking-[0.1em] text-ink font-bold uppercase">Objective</dt>
                        <dd>{item.objective}</dd>
                      </div>
                      <div className="grid gap-1">
                        <dt className="text-[11px] tracking-[0.1em] text-ink font-bold uppercase">Constraint</dt>
                        <dd>{item.constraint}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </Stagger>
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
