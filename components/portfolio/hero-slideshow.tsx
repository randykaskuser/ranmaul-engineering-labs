"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PortfolioItem } from "@/lib/portfolio"

interface HeroSlideshowProps {
  featured: PortfolioItem[]
}

export function HeroSlideshow({ featured }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (featured.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (!featured.length) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length)
  }

  return (
    <div className="relative h-screen min-h-screen w-full overflow-hidden bg-black text-white">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {featured[currentIndex].image && (
            <Image
              src={featured[currentIndex].image!}
              alt={featured[currentIndex].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Building cinematic aerial stories through Indonesia.
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl">
            Explore Portfolio ↓
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between p-6 sm:p-12 pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                {featured[currentIndex].title}
              </h2>
              {featured[currentIndex].location && (
                <p className="text-neutral-400 mt-1">
                  {featured[currentIndex].location}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex items-center gap-4 text-sm font-medium tracking-widest text-neutral-400">
          <button
            onClick={handlePrevious}
            className="p-2 transition-colors hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span>
            {currentIndex + 1} / {featured.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 transition-colors hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
