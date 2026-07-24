"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { PortfolioItem } from "@/lib/portfolio"
import { Lightbox } from "@/components/ui/lightbox"

interface PhotoGalleryProps {
  photos: PortfolioItem[]
}

const CATEGORIES = ["All", "Landscape", "City", "Nature", "Architecture"]

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [filter, setFilter] = useState("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredPhotos = filter === "All"
    ? photos
    : photos.filter(p => p.category === filter)

  return (
    <div className="w-full">
      <div className="mb-12 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={photo.slug}
              className="group relative mb-6 break-inside-avoid cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-900"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="relative" style={{ paddingBottom: '100%' }}>
                {photo.image && (
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-6">
                <motion.div
                  initial={{ y: 20 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-medium text-white">{photo.title}</h3>
                  {photo.location && (
                    <p className="text-sm text-neutral-300 mt-1">{photo.location}</p>
                  )}
                  <p className="mt-4 text-sm font-medium text-white flex items-center gap-2">
                    View Full Screen <span aria-hidden="true">&rarr;</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filteredPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
