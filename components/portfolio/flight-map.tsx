"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Crosshair } from "lucide-react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Lightbox } from "@/components/ui/lightbox";
import type { FlightType, PortfolioItem } from "@/lib/portfolio";
import { pick } from "@/lib/site";

export type MapItem = PortfolioItem & { coordinates: [number, number] };

type Filter = "all" | FlightType;

const ESRI = "https://ibasemaps-api.arcgis.com/arcgis/rest/services";
const ATTRIBUTION =
  'Powered by <a href="https://www.esri.com">Esri</a> | Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';
// Pin labels next to markers only from this zoom; below it they overlap.
const LABEL_MIN_ZOOM = 7;

const COPY = {
  all: { en: "All", id: "Semua" },
  aerial: { en: "Aerial", id: "Aerial" },
  fpv: { en: "FPV", id: "FPV" },
  locations: { en: "locations", id: "lokasi" },
  recenter: { en: "Show all locations", id: "Tampilkan semua lokasi" },
  open: { en: "Open", id: "Buka" },
  mapLabel: { en: "Satellite map of flight locations", id: "Peta satelit lokasi penerbangan" },
  filter: { en: "Filter by flight type", id: "Filter jenis penerbangan" },
};

function monthYear(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { month: "short", year: "numeric" });
}

function cover(item: PortfolioItem): string | undefined {
  return item.image ?? item.thumbnail;
}

export function FlightMap({ items, locale, apiKey }: { items: MapItem[]; locale: string; apiKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const pendingPopup = useRef<(() => void) | null>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.flightType === filter)),
    [items, filter],
  );
  const hasBothTypes = new Set(items.map((item) => item.flightType)).size > 1;

  const fitAll = useCallback(() => {
    const map = mapRef.current;
    if (!map || visible.length === 0) return;
    if (visible.length === 1) map.setView(visible[0].coordinates, 10);
    else map.fitBounds(visible.map((item) => item.coordinates), { padding: [48, 48] });
  }, [visible]);

  // Leaflet JS and tiles load only once the section is near the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !containerRef.current) return;
    let cancelled = false;
    let map: LeafletMap | undefined;
    const token = encodeURIComponent(apiKey);
    const markers = markersRef.current;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: false, worldCopyJump: true });
      map.attributionControl.setPrefix(false);
      L.tileLayer(`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${token}`, {
        maxZoom: 18,
        attribution: ATTRIBUTION,
      }).addTo(map);
      L.tileLayer(`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}?token=${token}`, {
        maxZoom: 18,
      }).addTo(map);
      L.control.zoom({ position: "bottomleft" }).addTo(map);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      // Page scroll must never get trapped: wheel zoom only after the visitor engages the map.
      const m = map;
      const container = m.getContainer();
      m.on("click focus", () => m.scrollWheelZoom.enable());
      container.addEventListener("mouseleave", () => m.scrollWheelZoom.disable());
      container.addEventListener("blur", () => m.scrollWheelZoom.disable());

      const toggleLabels = () => container.classList.toggle("fm-hide-labels", m.getZoom() < LABEL_MIN_ZOOM);
      m.on("zoomend", toggleLabels);
      m.setView([-2.5, 118], 5);
      toggleLabels();

      mapRef.current = m;
      setReady(true);
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markers.clear();
      setReady(false);
    };
  }, [inView, apiKey]);

  // Rebuild markers whenever the filter changes, then refit the view.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled) return;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      visible.forEach((item) => {
        const icon = L.divIcon({
          className: "fm-pin-wrap",
          html: `<span class="fm-pin fm-pin-${item.flightType}"></span>`,
          iconSize: [26, 34],
          iconAnchor: [13, 34],
          popupAnchor: [0, -30],
          tooltipAnchor: [12, -18],
        });
        const marker = L.marker(item.coordinates, { icon, title: item.location, alt: item.location })
          .bindTooltip(item.location ?? "", { permanent: true, direction: "right", className: "fm-label" })
          .bindPopup(() => popupContent(item), { className: "fm-popup", maxWidth: 280, minWidth: 240 })
          .on("click", () => {
            setActive(item.slug);
            document.getElementById(`fm-item-${item.slug}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          })
          .addTo(map);
        markersRef.current.set(item.slug, marker);
      });
      fitAll();
    });

    function popupContent(item: MapItem): HTMLElement {
      // Built with textContent, never innerHTML: frontmatter text is not trusted markup.
      const root = document.createElement("div");
      root.className = "flex gap-3 items-center";
      const src = cover(item);
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.className = "h-16 w-16 shrink-0 rounded-md object-cover";
        root.append(img);
      }
      const text = document.createElement("div");
      text.className = "min-w-0 flex-1";
      const title = document.createElement("p");
      title.className = "font-semibold text-sm text-white leading-tight";
      title.textContent = item.location ?? item.title;
      const meta = document.createElement("p");
      meta.className = "mt-1 text-xs text-neutral-400";
      meta.textContent = `${pick(COPY[item.flightType], locale)} · ${monthYear(item.date, locale)}`;
      const desc = document.createElement("p");
      desc.className = "mt-1 text-xs text-neutral-300 line-clamp-1";
      desc.textContent = item.description;
      text.append(title, meta, desc);
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "shrink-0 grid h-8 w-8 place-items-center rounded-full bg-white text-black text-lg leading-none hover:bg-neutral-200";
      button.setAttribute("aria-label", `${pick(COPY.open, locale)}: ${item.title}`);
      button.textContent = "›";
      button.addEventListener("click", () => setLightbox(items.indexOf(item)));
      root.append(text, button);
      return root;
    }

    return () => {
      cancelled = true;
    };
  }, [ready, visible, items, locale, fitAll]);

  const focusItem = (item: MapItem) => {
    setActive(item.slug);
    const map = mapRef.current;
    const marker = markersRef.current.get(item.slug);
    if (!map || !marker) return;
    // A fast second click cancels the first flight; drop its pending popup so only the latest opens.
    if (pendingPopup.current) map.off("moveend", pendingPopup.current);
    const open = () => {
      pendingPopup.current = null;
      marker.openPopup();
    };
    pendingPopup.current = open;
    map.once("moveend", open);
    map.flyTo(item.coordinates, Math.max(map.getZoom(), 10), { duration: 0.8 });
  };

  return (
    <div>
      {hasBothTypes && (
        <div role="group" aria-label={pick(COPY.filter, locale)} className="mb-4 flex flex-wrap gap-2">
          {(["all", "aerial", "fpv"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === value
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              {pick(COPY[value], locale)}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:h-[560px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 lg:aspect-auto lg:h-full">
          <div
            ref={containerRef}
            role="region"
            aria-label={pick(COPY.mapLabel, locale)}
            className="flight-map absolute inset-0"
            data-testid="flight-map"
          />
          <button
            type="button"
            onClick={fitAll}
            aria-label={pick(COPY.recenter, locale)}
            title={pick(COPY.recenter, locale)}
            className="absolute right-3 top-3 z-[1000] grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-md hover:bg-neutral-100"
          >
            <Crosshair className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
          <p className="border-b border-neutral-200 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-800" data-testid="flight-map-count">
            {visible.length} {pick(COPY.locations, locale)}
          </p>
          <ul className="max-h-80 overflow-y-auto lg:max-h-none lg:flex-1">
            {visible.map((item) => {
              const src = cover(item);
              return (
                <li key={item.slug} id={`fm-item-${item.slug}`}>
                  <button
                    type="button"
                    onClick={() => focusItem(item)}
                    aria-current={active === item.slug}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                      active === item.slug ? "bg-neutral-100 dark:bg-neutral-900" : ""
                    }`}
                  >
                    {src && (
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800">
                        <Image src={src} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-black dark:text-white">{item.location}</span>
                      <span className="block truncate text-xs text-neutral-500">
                        {item.title} · {monthYear(item.date, locale)}
                      </span>
                    </span>
                    <span className={`fm-dot fm-pin-${item.flightType}`} aria-label={pick(COPY[item.flightType], locale)} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {lightbox !== null && <Lightbox items={items} initialIndex={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
