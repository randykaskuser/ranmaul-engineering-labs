"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { LoopVideo } from "@/components/portfolio/loop-video";

export type MappingExample = {
  label: string;
  alt: string;
  image?: string;
  /** Tile fit: whole map (contain) or filled crop (cover). */
  fit?: "contain" | "cover";
  video?: { src: string; poster: string };
};

const MUTED = "text-neutral-600 dark:text-neutral-400";

// Example tiles that open a full-size viewer. Native <dialog> gives Esc to close,
// focus containment and a top layer without a dependency.
export function MappingExamples({ items, caption, openLabel, closeLabel, prevLabel, nextLabel }: {
  items: MappingExample[];
  caption: string;
  openLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step]);

  // Lock page scroll while the viewer is open.
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "";
    };
  }, [isOpen]);

  const current = index === null ? null : items[index];
  const iconButton =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.label}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`${openLabel}: ${item.label}`}
              className={`group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-black ${
                item.video ? "bg-white" : item.fit === "contain" ? "bg-neutral-100 dark:bg-neutral-900" : ""
              }`}
            >
              {item.video ? (
                <LoopVideo
                  src={item.video.src}
                  poster={item.video.poster}
                  label={item.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className={`transition-transform duration-500 group-hover:scale-[1.03] ${item.fit === "contain" ? "object-contain p-2" : "object-cover"}`}
                  sizes="(min-width: 1152px) 370px, (min-width: 640px) 33vw, 100vw"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-80 transition-opacity group-hover:opacity-100"
              >
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
            <p className={`mt-2 text-sm ${MUTED}`}>{item.label}</p>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current?.label}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/95"
      >
        {current ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="relative flex h-[75dvh] w-full max-w-6xl items-center justify-center">
              {current.video ? (
                <video
                  key={current.video.src}
                  src={current.video.src}
                  poster={current.video.poster}
                  className="aspect-[4/3] w-full max-w-[calc(75dvh*4/3)]"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={current.alt}
                />
              ) : current.image ? (
                <Image src={current.image} alt={current.alt} fill className="object-contain" sizes="100vw" />
              ) : null}
            </div>
            <p className="text-center text-sm text-neutral-300">
              {current.label} · {caption}
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label={prevLabel} className={iconButton}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-12 text-center text-sm tabular-nums text-neutral-300">
                {(index ?? 0) + 1} / {items.length}
              </span>
              <button type="button" onClick={() => step(1)} aria-label={nextLabel} className={iconButton}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button type="button" onClick={close} aria-label={closeLabel} className={`${iconButton} absolute right-4 top-4`}>
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
