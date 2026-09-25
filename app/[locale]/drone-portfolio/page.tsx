import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/page-metadata"
import { JsonLd, PERSON_SCHEMA } from "@/components/seo/json-ld"
import { SITE_URL, pick } from "@/lib/site"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/layout/reveal"
import { HeroSlideshow } from "@/components/portfolio/hero-slideshow"
import { PhotoGallery } from "@/components/portfolio/photo-gallery"
import { VideoGallery } from "@/components/portfolio/video-gallery"
import { DRONES, DroneServicesSection } from "@/components/portfolio/drone-services-section"
import { getPortfolioItems } from "@/lib/portfolio"
import { getRecentArticles, type Locale } from "@/lib/content"
import Link from "next/link"
import Image from "next/image"

const SEO = {
  title: {
    en: "Drone Services in Jabodetabek – Aerial Photo & Video",
    id: "Jasa Drone Jabodetabek – Foto & Video Udara",
  },
  description: {
    en: "Aerial photo and video with DJI Air 3S and DJI Neo 2 across Jabodetabek. Clear per-battery pricing, raw files and transport included. Book on WhatsApp.",
    id: "Jasa foto dan video udara dengan DJI Air 3S dan DJI Neo 2 di Jabodetabek. Harga per baterai yang jelas, file mentah dan transport termasuk. Pesan via WhatsApp.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return createPageMetadata(pick(SEO.title, locale), pick(SEO.description, locale), {
    path: `/${locale}/drone-portfolio`,
    locale,
    localizedPath: "/{locale}/drone-portfolio",
  })
}

/** "Rp2.500.000" -> 2500000 */
function rupiah(price: string): number {
  return Number(price.replace(/\D/g, ""))
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function DronePortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const items = await getPortfolioItems(locale as Locale)
  const stories = await getRecentArticles(locale as Locale, 3)
  
  // The hero shows still images only; featured video items have no image and render blank.
  const featured = items.filter(item => item.featured === true && Boolean(item.image))
  const photos = items.filter(item => item.mediaType !== "video")
  const videos = items.filter(item => item.mediaType === "video")

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: pick(SEO.title, locale),
          description: pick(SEO.description, locale),
          serviceType: "Aerial photography and videography",
          url: `${SITE_URL}/${locale}/drone-portfolio`,
          provider: PERSON_SCHEMA,
          areaServed: { "@type": "Place", name: "Jabodetabek, Indonesia" },
          offers: DRONES.flatMap((drone) =>
            drone.packages.map((pkg) => ({
              "@type": "Offer",
              name: `${drone.model} – ${pick(pkg.name, locale)}`,
              price: rupiah(pkg.price),
              priceCurrency: "IDR",
            })),
          ),
        }}
      />
      <HeroSlideshow featured={featured} />

      <Section space="xl" className="pt-24 pb-12 bg-white dark:bg-black">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Photography</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                Aerial Stills
              </h3>
            </div>
            <PhotoGallery photos={photos} />
          </Reveal>
        </div>
      </Section>

      <Section space="xl" className="py-24 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-800">
        <div className="container-wide">
          <Reveal>
            <div className="mb-12 flex items-end justify-between gap-6">
              <div className="max-w-3xl">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Cinematography</h2>
                <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                  Recent Reels
                </h3>
              </div>
              <a
                href="https://instagram.com/newbie.drone"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 pb-2 text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              >
                View all reels &rarr;
              </a>
            </div>
            <VideoGallery videos={videos} />
          </Reveal>
        </div>
      </Section>

      <DroneServicesSection locale={locale} />

      <Section space="xl" className="py-24 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Arsenal</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                Equipment
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['DJI Air 3S', 'DJI Neo 2'].map((gear) => (
                <div key={gear} className="p-6 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-center h-32 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{gear}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section space="xl" className="py-24 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Locations</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                Flight Map
              </h3>
            </div>
            <div className="w-full aspect-[21/9] bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden flex items-center justify-center">
              {/* Placeholder for actual map */}
              <p className="text-neutral-500 dark:text-neutral-400 font-medium tracking-widest uppercase">Interactive Map Coming Soon</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section space="xl" className="py-24 bg-white dark:bg-black">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Journal</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                Latest Stories
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.map(story => (
                <Link key={story.slug} href={`/${locale}/${story.domain}/${story.slug}`} className="group block">
                  <div className="aspect-[3/2] w-full bg-neutral-100 dark:bg-neutral-900 relative mb-4 overflow-hidden rounded-xl border border-hairline">
                     {story.coverImage ? (
                       <Image 
                         src={story.coverImage} 
                         alt={story.coverAlt || story.title} 
                         fill 
                         className="object-cover group-hover:scale-105 transition-transform duration-500"
                         sizes="(max-width: 768px) 100vw, 33vw"
                       />
                     ) : (
                       <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 group-hover:scale-105 transition-transform duration-500" />
                     )}
                  </div>
                  <h4 className="text-lg font-medium group-hover:underline">{story.title}</h4>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">{new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
