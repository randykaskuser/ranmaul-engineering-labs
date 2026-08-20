import { createPageMetadata } from "@/lib/page-metadata"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/layout/reveal"
import { HeroSlideshow } from "@/components/portfolio/hero-slideshow"
import { PhotoGallery } from "@/components/portfolio/photo-gallery"
import { VideoGallery } from "@/components/portfolio/video-gallery"
import { DroneServicesSection } from "@/components/portfolio/drone-services-section"
import { getPortfolioItems } from "@/lib/portfolio"
import { getRecentArticles, type Locale } from "@/lib/content"
import Link from "next/link"

export const metadata = createPageMetadata(
  "Drone Portfolio",
  "Aerial photography portfolio covering landscapes, cityscapes, and cinematic drone flights."
)

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function DronePortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const items = await getPortfolioItems(locale as Locale)
  const stories = await getRecentArticles(locale as Locale, 3)
  
  // Need to ensure featured arrays filter correctly based on boolean
  const featured = items.filter(item => item.featured === true)
  const photos = items.filter(item => item.mediaType !== "video")
  const videos = items.filter(item => item.mediaType === "video")

  return (
    <>
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
            <div className="max-w-3xl mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Cinematography</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight">
                Recent Reels
              </h3>
            </div>
            <VideoGallery videos={videos} />
          </Reveal>
        </div>
      </Section>

      <DroneServicesSection />

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
              {['DJI Mavic 3 Pro', 'DJI Mini 3 Pro', 'GoPro Hero 11', 'Custom FPV 5"'].map((gear) => (
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
                  <div className="aspect-[3/2] w-full bg-neutral-100 dark:bg-neutral-900 relative mb-4 overflow-hidden">
                     {/* Mocked thumbnail image placeholder */}
                     <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 group-hover:scale-105 transition-transform duration-500" />
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
