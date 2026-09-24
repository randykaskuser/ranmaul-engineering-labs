import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { pick, whatsappLink, type Localized } from "@/lib/site";

// Air 3S is priced per battery (the common model in Jabodetabek); Neo 2 per visit.
// To show a real drone photo, put it in public/images/drones/ and set `image`.

type Package = {
  name: Localized;
  price: string;
  unit: Localized;
  badge?: Localized;
  features: Localized[];
};

export type Drone = {
  id: string;
  model: string;
  image?: string;
  tagline: Localized;
  packages: Package[];
};

const RAW_FILES: Localized = { en: "All raw files included", id: "Semua file mentah" };
const TRANSPORT: Localized = { en: "Transport within Jabodetabek included", id: "Transport Jabodetabek termasuk" };

export const DRONES: Drone[] = [
  {
    id: "air-3s",
    model: "DJI Air 3S",
    tagline: {
      en: "Main camera. 1-inch sensor for sharp aerial photos and video.",
      id: "Kamera utama. Sensor 1 inci untuk foto dan video udara yang tajam.",
    },
    packages: [
      {
        name: { en: "Per battery", id: "Per baterai" },
        price: "Rp900.000",
        unit: { en: "/ battery", id: "/ baterai" },
        features: [
          { en: "Flight until the battery reaches ~30%", id: "Terbang sampai baterai ±30%" },
          { en: "About 20–25 minutes of flight time", id: "Sekitar 20–25 menit waktu terbang" },
          RAW_FILES,
          TRANSPORT,
        ],
      },
      {
        name: { en: "3-battery package", id: "Paket 3 baterai" },
        price: "Rp2.500.000",
        unit: { en: "/ package", id: "/ paket" },
        badge: { en: "Best value", id: "Paling hemat" },
        features: [
          { en: "Save Rp200.000 vs. 3 single batteries", id: "Hemat Rp200.000 dibanding ambil satuan" },
          { en: "Enough for a full property or event session", id: "Cukup untuk satu sesi properti atau acara" },
          RAW_FILES,
          TRANSPORT,
        ],
      },
    ],
  },
  {
    id: "neo-2",
    model: "DJI Neo 2",
    tagline: {
      en: "Small, light drone for follow shots, small businesses and social media content.",
      id: "Drone kecil dan ringan untuk shot follow, dokumentasi UMKM, dan konten media sosial.",
    },
    packages: [
      {
        name: { en: "Per visit", id: "Per kunjungan" },
        price: "Rp650.000",
        unit: { en: "/ visit", id: "/ kunjungan" },
        features: [
          { en: "2 batteries, about 16–20 minutes of flight in total", id: "2 baterai, total sekitar 16–20 menit terbang" },
          { en: "Pilot on site for up to 3 hours", id: "Pilot standby di lokasi maks. 3 jam" },
          RAW_FILES,
          TRANSPORT,
        ],
      },
      {
        name: { en: "3-battery package", id: "Paket 3 baterai" },
        price: "Rp850.000",
        unit: { en: "/ package", id: "/ paket" },
        badge: { en: "Best value", id: "Paling hemat" },
        features: [
          { en: "3 batteries in one visit, about 24–30 minutes of flight in total", id: "3 baterai dalam 1 kunjungan, total sekitar 24–30 menit terbang" },
          { en: "The 3rd battery for only Rp200.000 more", id: "Baterai ke-3 hanya tambah Rp200.000" },
          { en: "Pilot on site for up to 3 hours", id: "Pilot standby di lokasi maks. 3 jam" },
          RAW_FILES,
          TRANSPORT,
        ],
      },
    ],
  },
];

function DroneImage({ drone, locale }: { drone: Drone; locale: string }) {
  if (drone.image) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image src={drone.image} alt={drone.model} fill className="object-cover" sizes="(min-width: 1024px) 560px, 100vw" />
      </div>
    );
  }
  return (
    <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
      <Camera className="h-6 w-6" aria-hidden="true" />
      <span className="text-xs font-medium uppercase tracking-widest">
        {locale === "id" ? `Foto ${drone.model}` : `${drone.model} photo`}
      </span>
    </div>
  );
}

export function DroneServicesSection({ locale = "en" }: { locale?: string }) {
  const isId = locale === "id";

  return (
    <Section space="xl" className="py-24 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
      <div className="container-wide">
        <Reveal>
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">
              {isId ? "Jasa Drone" : "Drone Services"}
            </h2>
            <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight mb-6">
              {isId ? "Harga jelas, tanpa biaya tersembunyi" : "Clear pricing, no hidden fees"}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              {isId
                ? "Foto dan video udara untuk properti, acara, wisata, dan konten komersial di Jabodetabek."
                : "Aerial photo and video for property, events, tourism, and commercial content in Jabodetabek."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {DRONES.map((drone) => (
              <div
                key={drone.id}
                className="flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-neutral-50 p-6 md:p-8 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <DroneImage drone={drone} locale={locale} />
                <h4 className="mt-6 text-2xl font-medium text-black dark:text-white">{drone.model}</h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{pick(drone.tagline, locale)}</p>

                <div className="mt-6 grid flex-1 gap-4">
                  {drone.packages.map((pkg) => (
                    <div
                      key={pkg.name.en}
                      className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{pick(pkg.name, locale)}</p>
                        {pkg.badge ? (
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
                            {pick(pkg.badge, locale)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-2xl font-medium text-black dark:text-white">
                        {pkg.price} <span className="text-sm font-normal text-neutral-500">{pick(pkg.unit, locale)}</span>
                      </p>
                      <ul className="mt-4 space-y-2">
                        {pkg.features.map((feature) => (
                          <li key={feature.en} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">•</span>
                            {pick(feature, locale)}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={whatsappLink(
                          isId
                            ? `Halo Randy, saya tertarik ${drone.model} - ${pick(pkg.name, locale)}. Lokasi: ... Tanggal: ... Kebutuhan: ...`
                            : `Hi Randy, I'm interested in ${drone.model} - ${pick(pkg.name, locale)}. Location: ... Date: ... Details: ...`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm font-medium text-black transition-colors hover:text-neutral-600 dark:border-neutral-800 dark:text-white dark:hover:text-neutral-400"
                      >
                        {isId ? "Pesan via WhatsApp" : "Book on WhatsApp"}
                        <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-8 grid max-w-6xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                {isId ? "Tambahan editing" : "Editing add-on"}
              </p>
              <p className="mt-2 text-xl font-medium text-black dark:text-white">
                Rp300.000 – Rp500.000{" "}
                <span className="text-sm font-normal text-neutral-500">{isId ? "/ klip" : "/ clip"}</span>
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {isId
                  ? "1 klip hasil edit (±30 detik). Harga tergantung tingkat kerumitan."
                  : "1 edited clip (~30 seconds). Price depends on complexity."}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                {isId ? "Catatan" : "Notes"}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  {isId
                    ? "Di luar Jabodetabek: biaya transport dihitung terpisah."
                    : "Outside Jabodetabek: transport is quoted separately."}
                </li>
                <li>
                  {isId
                    ? "Jadwal bisa digeser jika cuaca tidak aman untuk terbang (hujan, angin kencang)."
                    : "Flights may be rescheduled if weather is unsafe (rain, strong wind)."}
                </li>
                <li>
                  {isId
                    ? "Durasi terbang adalah estimasi kondisi nyata (angin, merekam video), mendarat di ±30% baterai: Air 3S ±20–25 menit dan Neo 2 ±8–10 menit per baterai. Spesifikasi DJI: 45 dan 19 menit."
                    : "Flight times are real-world estimates (wind, recording video), landing at ~30% battery: Air 3S ~20–25 min and Neo 2 ~8–10 min per battery. DJI specs: 45 and 19 min."}
                </li>
                <li>
                  {isId
                    ? "Izin untuk area terbatas (dekat bandara, objek vital) tidak termasuk."
                    : "Permits for restricted areas (near airports, protected sites) are not included."}
                </li>
                <li>
                  <a
                    href={whatsappLink(
                      isId
                        ? "Halo Randy, saya punya kebutuhan khusus. Detail: ..."
                        : "Hi Randy, I have a custom request. Details: ...",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {isId ? "Kebutuhan khusus? Tanya di WhatsApp." : "Custom request? Ask on WhatsApp."}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
