"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PortfolioItem } from "@/lib/portfolio"
import { ConicHoverCard } from "@/components/layout/conic-hover-card"

interface VideoGalleryProps {
  videos: PortfolioItem[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-[96%] lg:max-w-2xl mx-auto">
        {videos.map((video, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={video.slug}
          >
            <ConicHoverCard>
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-hairline bg-surface-card relative group-hover:shadow-teal-500/20 group-hover:shadow-2xl transition-all duration-500">
                <iframe
                  src={video.embedUrl}
                  className="h-full w-full border-none scale-[1.02] group-hover:scale-100 transition-transform duration-700"
                  scrolling="no"
                  allow="encrypted-media"
                />
              </div>
              <div className="flex-1 mt-5 relative z-20">
                <p className="type-kicker tracking-[0.14em] relative inline-block text-body group-hover:text-white transition-colors duration-300">
                  <span className="relative z-10 px-2 py-0.5">
                    <span className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    <span className="relative">Instagram Reel</span>
                  </span>
                  <span className="absolute inset-0 z-0 bg-[#0D9488] clip-path-0 group-hover:clip-path-full transition-all duration-400 ease-out origin-center rounded-sm"></span>
                </p>
                <h3 className="mt-2 text-lg text-ink font-semibold relative group-hover:text-teal-600 transition-colors duration-300">{video.title}</h3>
              </div>
            </ConicHoverCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
