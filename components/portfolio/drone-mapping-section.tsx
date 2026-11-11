import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { pick, whatsappLink, type Localized } from "@/lib/site";
import { MappingExamples } from "@/components/portfolio/mapping-examples";

// Aerial mapping with the Air 3S. No GCP/RTK: maps are visual, not survey grade.
// Example images are small WebP exports; full GeoTIFF/KMZ/GLB files stay out of the repo.

type MappingPackage = {
  name: Localized;
  price: string;
  pricePrefix?: Localized;
  unit: Localized;
  badge?: Localized;
  features: Localized[];
};

export const MAPPING_PACKAGES: MappingPackage[] = [
  {
    name: { en: "Basic Map", id: "Peta Dasar" },
    price: "Rp1.500.000",
    pricePrefix: { en: "from", id: "mulai" },
    unit: { en: "up to 2 ha, all in", id: "sampai 2 ha, all in" },
    badge: { en: "Main package", id: "Paket utama" },
    features: [
      { en: "1 battery flight, automatic grid mission at 70 m", id: "Terbang 1 baterai, misi otomatis grid 70 m" },
      {
        en: "Orthophoto GeoTIFF (QGIS/ArcGIS/AutoCAD) + KMZ (Google Earth)",
        id: "Orthophoto GeoTIFF (QGIS/ArcGIS/AutoCAD) + KMZ (Google Earth)",
      },
      { en: "Resolution about 3 cm/pixel", id: "Resolusi sekitar 3 cm/pixel" },
      { en: "Transport within Jabodetabek included", id: "Transport Jabodetabek termasuk" },
      { en: "Delivered in 1 to 2 working days", id: "Hasil 1 sampai 2 hari kerja" },
    ],
  },
  {
    name: { en: "Map + Elevation", id: "Peta + Elevasi" },
    price: "Rp2.250.000",
    unit: { en: "up to 5 ha", id: "sampai 5 ha" },
    features: [
      { en: "Everything in Basic Map", id: "Semua isi Peta Dasar" },
      { en: "DSM (elevation model)", id: "DSM (model ketinggian)" },
      { en: "Quality report (PDF)", id: "Laporan kualitas PDF" },
    ],
  },
  {
    name: { en: "Map + 3D", id: "Peta + 3D" },
    price: "Rp3.500.000",
    unit: { en: "up to 5 ha", id: "sampai 5 ha" },
    features: [
      { en: "Everything in Map + Elevation", id: "Semua isi Peta + Elevasi" },
      { en: "Oblique flight (2nd battery)", id: "Terbang miring (baterai ke-2)" },
      { en: "3D model (.glb)", id: "Model 3D (.glb)" },
    ],
  },
];

const AREA_PRICING: Localized[] = [
  { en: "Basic Map, 2 to 5 ha: Rp1.750.000 to Rp2.000.000", id: "Peta Dasar 2 sampai 5 ha: Rp1.750.000 sampai Rp2.000.000" },
  { en: "Above 5 ha: +Rp200.000 per ha", id: "Di atas 5 ha: +Rp200.000 per ha" },
];

const ADD_ONS: Localized[] = [
  { en: "Clip the map to your land boundary: +Rp150.000", id: "Potong peta sesuai batas lahan: +Rp150.000" },
  { en: "Print-ready map layout A3/PDF: +Rp250.000", id: "Layout peta siap cetak A3/PDF: +Rp250.000" },
  { en: "Express 24 hours: +25%", id: "Kilat 24 jam: +25%" },
];

const DELIVERABLES: Localized[] = [
  { en: "orthophoto.tif + .tfw", id: "orthophoto.tif + .tfw" },
  { en: "orthophoto.kmz", id: "orthophoto.kmz" },
  { en: "Preview image", id: "Gambar preview" },
  {
    en: "BACA_SAYA.txt (coordinate system WGS 84 / UTM 48S, resolution, accuracy notes)",
    id: "BACA_SAYA.txt (sistem koordinat WGS 84 / UTM 48S, resolusi, catatan akurasi)",
  },
];

const EXAMPLE_CAPTION: Localized = {
  en: "Example: housing area, 1.3 ha, 63 photos, 70 m",
  id: "Contoh: perumahan, 1,3 ha, 63 foto, 70 m",
};

// neutral-600 on light (>= 7:1) and neutral-400 on dark (>= 7:1) both pass WCAG AA for small text.
const MUTED = "text-neutral-600 dark:text-neutral-400";

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
      <h4 className={`text-sm font-semibold uppercase tracking-wider ${MUTED}`}>{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DroneMappingSection({ locale = "en" }: { locale?: string }) {
  const isId = locale === "id";

  return (
    <Section space="lg" className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container-wide">
        <Reveal>
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <h2 className={`text-sm font-semibold tracking-widest uppercase mb-4 ${MUTED}`}>
              {isId ? "Pemetaan Udara" : "Drone Mapping"}
            </h2>
            <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight mb-6">
              {isId ? "Peta udara lahan Anda, siap dibuka di QGIS dan Google Earth" : "An aerial map of your site, ready for QGIS and Google Earth"}
            </h3>
            <p className={`text-lg ${MUTED}`}>
              {isId
                ? "Untuk perumahan, kebun, proyek konstruksi, dan perencanaan lahan di Jabodetabek. Ratusan foto digabung jadi satu peta tajam."
                : "For housing, plantations, construction sites, and land planning in Jabodetabek. Hundreds of photos stitched into one sharp map."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <figure className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 dark:border-neutral-800 dark:bg-black">
            <MappingExamples
              caption={pick(EXAMPLE_CAPTION, locale)}
              openLabel={isId ? "Lihat besar" : "View full size"}
              closeLabel={isId ? "Tutup" : "Close"}
              prevLabel={isId ? "Sebelumnya" : "Previous"}
              nextLabel={isId ? "Berikutnya" : "Next"}
              items={[
                {
                  label: isId ? "Peta lengkap" : "Full map",
                  alt: isId ? "Orthophoto lengkap sebuah perumahan" : "Full orthophoto of a housing area",
                  image: "/images/drone-mapping/contoh-orthophoto.webp",
                  fit: "contain",
                },
                {
                  label: isId ? "Zoom penuh, sekitar 3 cm/pixel" : "Full zoom, about 3 cm/pixel",
                  alt: isId ? "Detail orthophoto pada resolusi penuh, sekitar 3 cm per pixel" : "Orthophoto detail at full resolution, about 3 cm per pixel",
                  image: "/images/drone-mapping/contoh-detail.webp",
                },
                {
                  label: isId ? "Model 3D (paket Peta + 3D)" : "3D model (Map + 3D package)",
                  alt: isId ? "Animasi model 3D perumahan yang berputar" : "Rotating 3D model of the housing area",
                  video: {
                    src: "/images/drone-mapping/contoh-3d-orbit.mp4",
                    poster: "/images/drone-mapping/contoh-3d-orbit-poster.webp",
                  },
                },
              ]}
            />
            <figcaption className="mt-4 border-t border-neutral-200 pt-4 text-sm font-medium text-black dark:border-neutral-800 dark:text-white">
              {pick(EXAMPLE_CAPTION, locale)}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
            {MAPPING_PACKAGES.map((pkg) => (
              <div
                key={pkg.name.en}
                className={`flex flex-col rounded-2xl border bg-white p-6 dark:bg-black ${
                  pkg.badge ? "border-black dark:border-white" : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <h4 className={`text-sm font-semibold uppercase tracking-wider ${MUTED}`}>{pick(pkg.name, locale)}</h4>
                  {pkg.badge ? (
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
                      {pick(pkg.badge, locale)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-black dark:text-white">
                  {pkg.pricePrefix ? <span className={`mr-1.5 text-sm ${MUTED}`}>{pick(pkg.pricePrefix, locale)}</span> : null}
                  <span className="whitespace-nowrap text-3xl font-medium tracking-tight">{pkg.price}</span>
                </p>
                <p className={`mt-1 text-sm ${MUTED}`}>{pick(pkg.unit, locale)}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {pkg.features.map((feature) => (
                    <li key={feature.en} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-500">•</span>
                      <span className="min-w-0 break-words">{pick(feature, locale)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(
                    isId
                      ? `Halo Randy, saya tertarik Drone Mapping - ${pick(pkg.name, locale)}. Lokasi: ... Luas area (ha): ... Tanggal: ... Kebutuhan: ...`
                      : `Hi Randy, I'm interested in Drone Mapping - ${pick(pkg.name, locale)}. Location: ... Area (ha): ... Date: ... Details: ...`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isId ? `Pesan ${pick(pkg.name, locale)} via WhatsApp` : `Book ${pick(pkg.name, locale)} on WhatsApp`}
                  className="group mt-6 flex min-h-11 items-center justify-between rounded-sm border-t border-neutral-200 pt-4 text-sm font-medium text-black transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:border-neutral-800 dark:text-white dark:hover:text-neutral-300 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
                >
                  {isId ? "Pesan via WhatsApp" : "Book on WhatsApp"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-6 grid max-w-6xl gap-6 md:grid-cols-3">
            <InfoCard title={isId ? "Luas area" : "Area size"} items={AREA_PRICING.map((item) => pick(item, locale))} />
            <InfoCard title={isId ? "Tambahan" : "Add-ons"} items={ADD_ONS.map((item) => pick(item, locale))} />
            <InfoCard
              title={isId ? "Yang Anda terima" : "What you receive"}
              items={[
                ...DELIVERABLES.map((item) => pick(item, locale)),
                isId ? "Dikirim lewat link Google Drive" : "Sent via a Google Drive link",
              ]}
            />
          </div>
          <p className={`mx-auto mt-6 max-w-6xl text-xs leading-relaxed ${MUTED}`}>
            {isId
              ? "Tanpa GCP/RTK. Bentuk dan ukuran dalam peta konsisten, tetapi posisi bisa bergeser beberapa meter. Untuk visual dan perencanaan, bukan untuk batas tanah atau pengukuran legal."
              : "No GCP/RTK. Shapes and sizes in the map are consistent, but the position can shift by a few meters. For visuals and planning, not for land boundaries or legal surveys."}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

