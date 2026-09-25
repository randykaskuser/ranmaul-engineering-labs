"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { PortfolioItem } from "@/lib/portfolio"
import { Lightbox } from "@/components/ui/lightbox"

interface VideoGalleryProps {
  videos: PortfolioItem[]
  label?: string
}

export function VideoGallery({ videos, label = "Instagram Reel" }: VideoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video, index) => (
          <button
            key={video.slug}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Play ${video.title}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <div className="relative aspect-[16/15] w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
              {video.thumbnail && (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
              </span>
            </div>
            <div className="flex-1 px-5 pb-6 pt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{video.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox items={videos} initialIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
