"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { PortfolioItem } from "@/lib/portfolio"
import { Lightbox } from "@/components/ui/lightbox"

interface VideoGalleryProps {
  videos: PortfolioItem[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={video.slug}
            className="group cursor-pointer"
            onClick={() => setLightboxIndex(index)}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {video.image && (
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-6 w-6 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium group-hover:underline">{video.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Instagram Reel</p>
            </div>
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={videos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
