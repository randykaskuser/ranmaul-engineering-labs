import { createPageMetadata } from "@/lib/page-metadata";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { Stagger } from "@/components/layout/stagger";
import Image from "next/image";

export const metadata = createPageMetadata(
  "Drone Portfolio",
  "Aerial photography portfolio covering landscapes, cityscapes, and cinematic drone flights.",
);

const portfolioItems = [
  {
    title: "Batang Rest Area KM 371",
    subtitle: "Batang, Central Java",
    description: "An aerial perspective highlighting the geometric alignment of the Trans-Java Toll Road as it approaches the coastal rest area near KM 371.",
    location: "Batang, Central Java",
    aircraft: "DJI Air 3",
    year: "2025",
    image: "/images/portfolio/coastal-topdown-web.jpg", // Using coastal image for this
    href: "/drone-portfolio/batang-rest-area",
  },
  {
    title: "Pandawa Beach",
    subtitle: "South Kuta, Bali",
    description: "Turquoise water, limestone cliffs, and a narrow coastline viewed from above during calm coastal conditions.",
    location: "South Kuta, Bali",
    aircraft: "DJI Air 3",
    year: "2025",
    image: "/images/portfolio/merapi-crater-web.jpg", // Using crater image for this placeholder
    href: "/drone-portfolio/pandawa-beach",
  },
  {
    title: "Ciwidey Highlands",
    subtitle: "Bandung Regency, West Java",
    description: "Low clouds drifting across the green hills surrounding the Ciwidey highlands shortly after sunrise.",
    location: "Ciwidey, West Java",
    aircraft: "DJI Air 3",
    year: "2025",
    image: "/images/portfolio/mountain-valley-web.jpg",
    href: "/drone-portfolio/ciwidey-highlands",
  },
  {
    title: "South Quarter",
    subtitle: "Jakarta",
    description: "A nighttime aerial composition capturing the illuminated office towers of South Quarter against the Jakarta skyline.",
    location: "Jakarta",
    aircraft: "DJI Air 3",
    year: "2025",
    image: "/images/portfolio/night-cityscape-web.jpg",
    href: "/drone-portfolio/south-quarter",
  },
  {
    title: "Apex 5",
    subtitle: "Custom FPV Cinematic Drone",
    description: "A close-up documentation of my custom-built 5-inch FPV drone configured for cinematic freestyle and aerial filmmaking.",
    location: "Personal Build",
    aircraft: "Apex 5",
    year: "2025",
    image: "/images/portfolio/drone-setup-web.jpg",
    href: "/drone-portfolio/apex-5",
  },
];

export default function DronePortfolioPage() {
  return (
    <>
      <Section space="xl" className="pt-24 pb-12">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl md:text-7xl font-normal text-ink tracking-tight leading-[1.1]">
                Aerial Photography
              </h1>
              <p className="mt-6 text-lg md:text-xl text-body leading-relaxed">
                A collection of landscapes, cityscapes, and structural geometry captured from the sky.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section space="default" className="pb-32">
        <div className="container-wide">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-12 md:gap-y-20" stagger={0.15}>
            {portfolioItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group block cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-canvas-soft relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={750}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={true}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(0,0,0,0.15)]" />
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-medium text-ink tracking-tight group-hover:text-ink/80 transition-colors">
                      {item.title}
                    </h2>
                    <span className="text-xs text-muted tracking-wider uppercase">
                      {item.year}
                    </span>
                  </div>

                  <p className="text-sm text-body/80 mt-1 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="text-[0.95rem] leading-relaxed text-body line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden="true">📍</span> {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden="true">🚁</span> {item.aircraft}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </Stagger>
        </div>
      </Section>
    </>
  );
}
