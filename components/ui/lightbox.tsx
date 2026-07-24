"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioItem } from "@/lib/portfolio";

interface LightboxProps {
  items: PortfolioItem[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const currentItem = items[currentIndex];

  const navigate = useCallback((direction: "next" | "prev") => {
    if (items.length <= 1) return;

    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, navigate]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 p-2 text-white/50 transition-colors hover:text-white"
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8" />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("prev");
            }}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 p-4 text-white/50 transition-colors hover:text-white sm:left-8"
            aria-label="Previous item"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("next");
            }}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 p-4 text-white/50 transition-colors hover:text-white sm:right-8"
            aria-label="Next item"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        </>
      )}

      <div className="relative flex h-full w-full max-w-[90vw] flex-col items-center justify-center py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full w-full items-center justify-center"
          >
            {currentItem.mediaType === "video" && currentItem.embedUrl ? (
              <div className="relative w-full max-w-4xl aspect-[9/16] sm:aspect-video bg-black rounded-lg overflow-hidden ring-1 ring-white/10">
                <iframe
                  src={currentItem.embedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-full w-full max-h-[75vh]">
                {currentItem.image && (
                  <Image
                    src={currentItem.image}
                    alt={currentItem.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 left-0 right-0 z-40 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto inline-flex flex-col items-center pointer-events-auto bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl"
            >
              <h2 className="text-xl font-medium sm:text-2xl">{currentItem.title}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-400">
                {currentItem.location && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">📍</span> {currentItem.location}
                  </span>
                )}
                {currentItem.aircraft && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">🚁</span> {currentItem.aircraft}
                  </span>
                )}
                {currentItem.date && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">📅</span> {currentItem.date.split('-')[0]}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>,
    document.body
  );
}
