import type { Metadata } from "next";
import Link from "next/link";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { getRecentArticles, type Locale } from "@/lib/content";
import { Reveal } from "@/components/layout/reveal";
import { Stagger } from "@/components/layout/stagger";
import { ConicHoverCard } from "@/components/layout/conic-hover-card";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Engineering Labs is a systems-oriented technical journal documenting automation reliability, FPV flight engineering, fishkeeping infrastructure, and real-world troubleshooting workflows.",
};

const contentDict = {
  en: {
    heroKicker: "Certified Drone Pilot & QA Engineer",
    heroTitle: "FPV Cinematic Pilot & QA Engineer.",
    heroLede: "I spend most of my time building test automation, flying FPV drones, and experimenting with new technology. This website is where I share projects, lessons learned, and things I'm currently working on.",
    btnCollaborate: "Let's Collaborate",
    btnPortfolio: "View Portfolio",
    aboutKicker: "Hi, I'm Randy.",
    aboutBody: "I'm a QA Engineer who enjoys building automation, flying FPV drones, and maintaining predator fish aquariums. Whether I'm tuning a drone for a smooth cinematic shot or debugging a flaky automation test, I enjoy solving problems and understanding how things work. This space is where I document my projects, lessons learned, and hobbies that keep me curious.",
    aboutTags: "QA Engineer · FPV Pilot · Tech Enthusiast",
    featuredTitle: "Notes",
    featuredLink: "Browse all notes",
    archivesTitle: "Recent Drone Flights",
    archivesLink: "View video archives",
    archivesDesc: "A collection of commercial and personal flights, ranging from cinematic FPV runs to aerial footage captured with DJI drones.",
    projectsTitle: "Personal Projects",
    projectsLink: "View all",
    latestTitle: "Latest Articles",
    noEntries: "No entries yet.",
    connectKicker: "Get in Touch",
    connectTitle: "Let's Collaborate",
    connectBody: "Need a drone pilot for a project? Interested in QA, automation, FPV, or technology in general? Feel free to reach out.",
    btnWa: "WhatsApp Me",
    btnLi: "Connect on LinkedIn",
    btnIg: "Instagram",
    obj: "Objective",
    constraint: "Constraint",
    domain: "Category",
  },
  id: {
    heroKicker: "Certified Drone Pilot & QA Engineer",
    heroTitle: "FPV Cinematic Pilot & QA Engineer.",
    heroLede: "Saya menghabiskan banyak waktu membangun test automation, menerbangkan FPV drone, dan bereksperimen dengan teknologi baru. Website ini berisi project, pengalaman, dan berbagai hal yang sedang saya pelajari atau kerjakan.",
    btnCollaborate: "Mari Berkolaborasi",
    btnPortfolio: "Lihat Portofolio",
    aboutKicker: "Halo, saya Randy.",
    aboutBody: "Saya seorang QA Engineer yang suka membangun test automation, menerbangkan FPV drone, dan merawat aquarium ikan predator. Entah itu tuning drone untuk cinematic shot yang mulus atau debugging flaky test automation, saya suka memecahkan masalah dan mencari tahu cara kerja suatu sistem. Website ini adalah tempat saya mendokumentasikan project, pengalaman, dan hobi yang membuat saya selalu penasaran.",
    aboutTags: "QA Engineer · FPV Pilot · Tech Enthusiast",
    featuredTitle: "Catatan",
    featuredLink: "Lihat semua tulisan",
    archivesTitle: "Penerbangan Drone Terbaru",
    archivesLink: "Lihat arsip video",
    archivesDesc: "Kumpulan penerbangan komersial dan personal, mulai dari FPV cinematic hingga aerial footage menggunakan drone DJI.",
    projectsTitle: "Personal Projects",
    projectsLink: "Lihat semua",
    latestTitle: "Artikel Terbaru",
    noEntries: "Belum ada tulisan.",
    connectKicker: "Kontak Saya",
    connectTitle: "Mari Berkolaborasi",
    connectBody: "Butuh drone pilot untuk project Anda? Tertarik ngobrol tentang QA, automation, FPV, atau teknologi pada umumnya? Jangan ragu untuk reach out.",
    btnWa: "Chat via WhatsApp",
    btnLi: "Connect di LinkedIn",
    btnIg: "Instagram",
    obj: "Tujuan",
    constraint: "Batasan",
    domain: "Kategori",
  }
};

const getCategories = (locale: string) => {
  const isId = locale === "id";
  return [
    {
      title: "FPV & Drone Work",
      description: isId ? "Project drone komersial, penerbangan FPV, dan cerita di balik setiap penerbangan." : "Commercial drone work, FPV flights, and the stories behind each flight.",
      href: `/${locale}/fpv`,
      detail: isId ? "Setup alat, kondisi penerbangan, dan pengalaman di lapangan." : "Gear setups, flight conditions, and lessons learned.",
    },
    {
      title: "QA Engineering",
      description: isId ? "Catatan dari pengalaman membangun automation framework, improve CI/CD pipeline, investigasi production issue, dan meningkatkan reliability software." : "Notes from my experience building automation frameworks, improving CI/CD pipelines, investigating production issues, and increasing software reliability.",
      href: `/${locale}/qa`,
      detail: isId ? "Test automation, system design, dan engineering logs." : "Test automation, system design, and engineering logs.",
    },
    {
      title: "Fishkeeping",
      description: isId ? "Catatan seputar ikan predator, kualitas air, maintenance aquarium, dan berbagai hal yang saya pelajari selama memeliharanya." : "Notes on predator fish, water quality, aquarium maintenance, and everything I've learned from keeping them.",
      href: `/${locale}/fishkeeping`,
      detail: isId ? "Setup aquarium, parameter air, dan jadwal maintenance." : "Tank setups, water parameters, and maintenance logs.",
    },
  ];
};

const getDroneMedia = (locale: string) => {
  const isId = locale === "id";
  return [
    {
      title: "Pulau Merah Banyuwangi",
      type: "Cinematic FPV",
      objective: isId ? "Menyusuri pantai pasir merah dan merekam momen sunset." : "Fly along the red sand coast and capture the sunset.",
      constraint: isId ? "Angin laut yang kuat dan harus menjaga line of sight." : "Heavy ocean winds and maintaining line of sight.",
      embedUrl: "https://www.instagram.com/p/DWU4P5AkmYE/embed/",
    },
    {
      title: "Natarasa Heritage Nightscape",
      type: "Night Aerial Photography",
      objective: isId ? "Merekam lanskap heritage di malam hari." : "Showcase the heritage landscape at night.",
      constraint: isId ? "Mengatur noise di tempat minim cahaya dan menyeimbangkan dynamic range." : "Managing low-light noise and balancing dynamic range.",
      embedUrl: "https://www.instagram.com/p/DFmsdEtywD0/embed/",
    },
    {
      title: "Anyer Coastal Flight",
      type: "Coastal Aerial",
      objective: isId ? "Tracking garis pantai Anyer dan merekam ombak pecah." : "Track the Anyer shoreline and capture the breaking waves.",
      constraint: isId ? "Pantulan silau (glare) dari air dan angin laut yang kencang." : "Reflective water glare and strong sea breezes.",
      embedUrl: "https://www.instagram.com/p/DOhepMZkppV/embed/",
    },
    {
      title: "Commercial Real Estate Showcase",
      type: "Aerial Property Showcase",
      objective: isId ? "Menonjolkan layout properti, fasilitas, dan desain arsitektur." : "Showcase the property layout, facilities, and architectural design.",
      constraint: isId ? "Menjaga panning tetap mulus dan framing presisi." : "Keeping pans smooth and framing precise for a professional look.",
      embedUrl: "https://www.instagram.com/p/DF4irx0Sspp/embed/",
    },
  ];
};

const getProjects = (locale: string) => {
  const isId = locale === "id";
  return [
    {
      title: "Notion → MDX Publishing Pipeline",
      description: isId ? "Sistem simpel untuk menulis artikel di Notion dan otomatis publish ke website." : "A simple workflow that lets me write in Notion and publish directly to my site.",
      href: "/create",
      tag: "Project",
    },
    {
      title: "MDX Components",
      description: isId ? "Custom UI component agar artikel teknis dan code snippet lebih enak dibaca." : "Custom UI components to make technical content and code snippets easier to read.",
      href: `/${locale}/qa/notion-sync-smoke-test`,
      tag: "Project",
    },
  ];
};

export default async function Home({ locale = "en" }: { locale?: string }) {
  const t = locale === "id" ? contentDict.id : contentDict.en;
  const currentCategories = getCategories(locale);
  const droneMedia = getDroneMedia(locale);
  const projects = getProjects(locale);
  const latestArticles = await getRecentArticles(locale as Locale, 2);

  return (
    <>
      <Section space="xl" divider orb>
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <Stack gap="lg">
              <p className="type-kicker">{t.heroKicker}</p>
              <h1 className="display-title max-w-5xl text-4xl text-ink md:text-7xl">
                {t.heroTitle}
              </h1>
              <p className="type-lede max-w-[72ch]">
                {t.heroLede}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#connect" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium" style={{ color: 'var(--on-primary)' }}>
                  {t.btnCollaborate}
                </a>
                <Link href="/projects" className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink">
                  {t.btnPortfolio}
                </Link>
              </div>
            </Stack>

            <aside className="editorial-card-soft p-5 md:p-6">
              <p className="type-kicker">{t.aboutKicker}</p>
              <p className="mt-4 text-sm leading-7 text-body">
                {t.aboutBody}
              </p>
              <p className="mt-4 text-xs tracking-[0.12em] text-muted">
                {t.aboutTags}
              </p>
            </aside>
          </div>
        </div>
      </Section>

      <Section divider>
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <h2 className="display-title text-3xl text-ink md:text-5xl">{t.featuredTitle}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/projects" className="text-sm text-body hover:text-ink">
                {t.featuredLink}
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.15}>
            {currentCategories.map((category) => (
              <Link key={category.title} href={category.href} className="editorial-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="type-kicker">{t.domain}</p>
                <h3 className="mt-3 type-title text-ink">{category.title}</h3>
                <p className="mt-3 text-sm leading-7 text-body">{category.description}</p>
                <p className="mt-4 text-xs leading-6 text-muted">{category.detail}</p>
              </Link>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section divider tone="soft" className="relative overflow-hidden">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="/images/drone-bg-poster.jpg"
          >
            <source src="/videos/drone-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container relative z-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <h2 className="display-title text-3xl text-ink md:text-5xl">{t.archivesTitle}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/drone-portfolio" className="text-sm text-body hover:text-ink">
                {t.archivesLink}
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="mb-6 max-w-[68ch] text-sm leading-7 text-body md:text-base">
              {t.archivesDesc}
            </p>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.15}>
            {droneMedia.map((item) => (
              <ConicHoverCard key={item.title}>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-hairline bg-surface-card-soft">
                  <iframe
                    src={item.embedUrl}
                    className="h-full w-full border-none pointer-events-none"
                    scrolling="no"
                    allow="encrypted-media"
                    tabIndex={-1}
                  />
                </div>
                <div className="flex-1 mt-4">
                  <p className="type-kicker tracking-[0.14em] relative inline-block group-hover:text-white z-10 transition-colors duration-300">
                    <span className="relative z-10 px-1">{item.type}</span>
                    <span className="absolute inset-0 z-0 bg-[#0D9488] clip-path-0 group-hover:clip-path-full transition-all duration-400 ease-out origin-center"></span>
                  </p>
                  <h3 className="mt-2 text-xl text-ink">{item.title}</h3>
                  <dl className="mt-3 space-y-2 text-sm leading-7 text-body">
                    <div className="grid gap-1">
                      <dt className="text-xs tracking-[0.12em] text-muted">{t.obj}</dt>
                      <dd>{item.objective}</dd>
                    </div>
                    <div className="grid gap-1">
                      <dt className="text-xs tracking-[0.12em] text-muted">{t.constraint}</dt>
                      <dd>{item.constraint}</dd>
                    </div>
                  </dl>
                </div>
              </ConicHoverCard>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section divider>
        <div className="container">
          <Grid columns={2} gap="md">
            <Reveal direction="left">
              <article className="editorial-card p-6 h-full transition-shadow hover:shadow-lg">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 className="display-title text-3xl text-ink">{t.projectsTitle}</h2>
                  <Link href="/projects" className="text-sm text-body hover:text-ink">
                    {t.projectsLink}
                  </Link>
                </div>
                <Stack gap="sm">
                  {projects.map((project) => (
                    <Link key={project.title} href={project.href} className="block rounded-2xl border border-hairline p-4 transition-colors hover:bg-surface-card-soft">
                      <p className="type-kicker">{project.tag}</p>
                      <h3 className="mt-2 text-lg text-ink">{project.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-body">{project.description}</p>
                    </Link>
                  ))}
                </Stack>
              </article>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <article className="editorial-card p-6 h-full transition-shadow hover:shadow-lg">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 className="display-title text-3xl text-ink">{t.latestTitle}</h2>
                </div>
                <Stack gap="sm">
                  {latestArticles.length > 0 ? (
                    latestArticles.map((article) => (
                      <Link key={article.slug} href={`/${article.locale}/${article.domain}/${article.slug}`} className="block rounded-2xl border border-hairline p-4 transition-colors hover:bg-surface-card-soft">
                        <p className="type-kicker uppercase">{article.domain}</p>
                        <h3 className="mt-2 text-lg text-ink">{article.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-body">{article.description}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-body">{t.noEntries}</p>
                  )}
                </Stack>
              </article>
            </Reveal>
          </Grid>
        </div>
      </Section>

      <Section>
        <div id="connect" className="container-reading">
          <Reveal direction="up" distance={40}>
            <div className="editorial-card p-8 text-center md:p-10 transition-shadow hover:shadow-xl">
              <p className="type-kicker">{t.connectKicker}</p>
              <h2 className="display-title mt-5 text-3xl text-ink md:text-5xl">{t.connectTitle}</h2>
              <p className="mx-auto mt-4 max-w-[68ch] text-sm leading-7 text-body">
                {t.connectBody}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href="#" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium transition-transform hover:scale-105" style={{ color: 'var(--on-primary)' }}>
                  {t.btnWa}
                </a>
                <a href="#" className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-ink hover:scale-105">
                  {t.btnLi}
                </a>
                <a href="#" className="rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-ink transition-all hover:border-ink hover:scale-105">
                  {t.btnIg}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
