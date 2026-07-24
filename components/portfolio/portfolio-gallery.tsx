"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { type PortfolioItem } from "@/lib/portfolio";
import { Lightbox, type LightboxMedia } from "@/components/ui/lightbox";

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

const CATEGORIES = ["All", "Landscape", "City", "Architecture", "FPV", "Gear"];

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [items, activeCategory]);

  const lightboxMedia: LightboxMedia[] = useMemo(() => {
    return filteredItems.map((item) => ({
      src: item.mediaType === "video" && item.embedUrl ? item.embedUrl : (item.image || ""),
      type: item.mediaType === "video" && item.embedUrl ? "video" : "image",
      alt: item.title,
    }));
  }, [filteredItems]);

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              activeCategory === category
                ? "bg-ink text-canvas"
                : "bg-canvas-soft text-body hover:bg-canvas-subtle hover:text-ink"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.slug}
            className="group block cursor-pointer break-inside-avoid"
            onClick={() => setLightboxIndex(index)}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl bg-canvas-soft mb-4">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={item.mediaType === 'video' ? 450 : 600}
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              {item.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(0,0,0,0.15)]" />
            </div>

            {/* Meta */}
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-medium text-ink tracking-tight group-hover:text-ink/80 transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {item.location && (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true">📍</span> {item.location}
                  </span>
                )}
                {item.aircraft && (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true">🚁</span> {item.aircraft}
                  </span>
                )}
                {item.date && (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true">📅</span> {new Date(item.date).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-24 text-center text-muted">
          No items found in this category.
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxMedia}
          initialIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}