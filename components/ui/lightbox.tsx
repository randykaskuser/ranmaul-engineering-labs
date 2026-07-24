"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

export type LightboxMedia = {
  src: string;
  type: "image" | "video";
  alt?: string;
};

interface LightboxProps {
  items: LightboxMedia[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange?: (newIndex: number) => void;
}

export function Lightbox({ items, initialIndex, onClose, onIndexChange }: LightboxProps) {
  const currentIndex = initialIndex;

  const navigate = useCallback((direction: "next" | "prev") => {
    if (!onIndexChange || items.length <= 1) return;

    let newIndex = currentIndex;
    if (direction === "next") {
      newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }

    onIndexChange(newIndex);
  }, [currentIndex, items.length, onIndexChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") navigate("next");
    if (e.key === "ArrowLeft") navigate("prev");
  }, [onClose, navigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("prev");
            }}
            className="absolute left-6 z-50 p-3 text-white/50 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("next");
            }}
            className="absolute right-6 z-50 p-3 text-white/50 hover:text-white transition-colors"
            aria-label="Next"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      <div
        className="relative w-[90vw] h-[85vh] max-w-7xl mx-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === "image" ? (
          <Image
            src={currentItem.src}
            alt={currentItem.alt || "Portfolio image"}
            fill
            className="object-contain"
            sizes="90vw"
            priority
            unoptimized={currentItem.src.endsWith('.gif')}
          />
        ) : (
          <iframe
            src={currentItem.src}
            className="w-full h-full max-h-[80vh] rounded-xl bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );

  // Use portal if document is defined, otherwise render null (for SSR)
  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return null;
}