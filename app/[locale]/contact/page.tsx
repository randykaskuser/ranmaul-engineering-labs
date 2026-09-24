import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstagramIcon, WhatsappIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL, isSiteLocale, pick } from "@/lib/site";

type Params = { locale: string };

const COPY = {
  title: { en: "Contact", id: "Kontak" },
  metaDescription: {
    en: "Reach Randy on Instagram for collaboration, questions, and drone work.",
    id: "Hubungi Randy lewat Instagram untuk kolaborasi, pertanyaan, dan jasa drone.",
  },
  heroTitle: { en: "Say hi on Instagram", id: "Sapa saya di Instagram" },
  heroDescription: {
    en: "Instagram is the fastest way to reach me for collaboration, questions about an article, or drone work. You can also see my latest flights there.",
    id: "Instagram adalah cara tercepat menghubungi saya untuk kolaborasi, pertanyaan soal artikel, atau jasa drone. Hasil terbang terbaru saya juga ada di sana.",
  },
  igBody: {
    en: "Send a DM. Tell me what you need and, for drone work, the location and date.",
    id: "Kirim DM. Ceritakan kebutuhanmu, dan untuk jasa drone, sertakan lokasi dan tanggalnya.",
  },
  igCta: { en: "Open Instagram", id: "Buka Instagram" },
  droneTitle: { en: "Drone booking", id: "Pesan jasa drone" },
  droneBefore: {
    en: "Ready to book aerial filming? Pick a package on the",
    id: "Siap pesan foto/video udara? Pilih paket di halaman",
  },
  droneLink: { en: "Drone Portfolio", id: "Drone Portfolio" },
  droneMiddle: { en: "page to request a quote, or", id: "untuk minta penawaran, atau" },
  droneWa: { en: "message me on WhatsApp", id: "chat saya di WhatsApp" },
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(pick(COPY.title, locale), pick(COPY.metaDescription, locale), {
    path: `/${locale}/contact`,
    locale,
    localizedPath: "/{locale}/contact",
  });
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();

  return (
    <>
      <PageHero eyebrow={pick(COPY.title, locale)} title={pick(COPY.heroTitle, locale)} description={pick(COPY.heroDescription, locale)} />
      <section className="section-space">
        <div className="site-container grid gap-4 md:grid-cols-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-hairline bg-surface-card p-6 transition-colors hover:bg-surface-card-soft"
          >
            <InstagramIcon className="size-6 text-ink" />
            <h2 className="mt-4 text-lg font-medium text-ink">@{INSTAGRAM_HANDLE}</h2>
            <p className="mt-3 text-sm leading-7 text-body">{pick(COPY.igBody, locale)}</p>
            <p className="mt-4 text-sm font-medium text-ink">{pick(COPY.igCta, locale)} &rarr;</p>
          </a>

          <article className="rounded-2xl border border-hairline bg-surface-card p-6">
            <WhatsappIcon className="size-6 text-ink" />
            <h2 className="mt-4 text-lg font-medium text-ink">{pick(COPY.droneTitle, locale)}</h2>
            <p className="mt-3 text-sm leading-7 text-body">
              {pick(COPY.droneBefore, locale)}{" "}
              <Link href={`/${locale}/drone-portfolio`} className="underline underline-offset-4">
                {pick(COPY.droneLink, locale)}
              </Link>{" "}
              {pick(COPY.droneMiddle, locale)}{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {pick(COPY.droneWa, locale)}
              </a>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
