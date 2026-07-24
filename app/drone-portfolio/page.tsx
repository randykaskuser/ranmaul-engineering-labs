import { createPageMetadata } from "@/lib/page-metadata";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { getPortfolioItems } from "@/lib/portfolio";

export const metadata = createPageMetadata(
  "Drone Portfolio",
  "Aerial photography portfolio covering landscapes, cityscapes, and cinematic drone flights."
);

export default async function DronePortfolioPage() {
  const items = await getPortfolioItems("en");

  const featuredItem = items.find((item) => item.featured);

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

      {/* Featured Video / Item */}
      {featuredItem && (
        <Section space="default" className="pb-16">
          <div className="container-wide">
            <Reveal delay={0.1}>
              <div className="aspect-[21/9] md:aspect-[2.35/1] overflow-hidden rounded-3xl bg-black relative shadow-2xl">
                {featuredItem.mediaType === "video" && featuredItem.embedUrl ? (
                  <iframe
                    src={featuredItem.embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : featuredItem.image ? (
                  <img
                    src={featuredItem.image}
                    alt={featuredItem.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

                {/* Optional gradient overlay and text if we want to show title over image */}
                {(!featuredItem.mediaType || featuredItem.mediaType === "image") && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12 pointer-events-none">
                    <h2 className="text-3xl md:text-4xl text-white font-medium mb-2">{featuredItem.title}</h2>
                    {featuredItem.location && (
                      <p className="text-white/80 flex items-center gap-2 text-sm">
                        <span aria-hidden="true">📍</span> {featuredItem.location}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </Section>
      )}

      <Section space="default" className="pb-32">
        <div className="container-wide">
          <Reveal delay={0.2}>
            <PortfolioGallery items={items} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}