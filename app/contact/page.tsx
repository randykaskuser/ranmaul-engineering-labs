import Link from "next/link";
import { InstagramIcon, WhatsappIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

export const metadata = createPageMetadata(
  "Contact",
  "Reach Randy on Instagram for collaboration, FPV shooting, aerial documentation, and drone cinematic work.",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hi on Instagram"
        description="Instagram is the fastest way to reach me for collaboration, questions about an article, or drone work. You can also see my latest flights there."
      />
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
            <p className="mt-3 text-sm leading-7 text-body">
              Send a DM. Tell me what you need and, for drone work, the location and date.
            </p>
            <p className="mt-4 text-sm font-medium text-ink">Open Instagram &rarr;</p>
          </a>

          <article className="rounded-2xl border border-hairline bg-surface-card p-6">
            <WhatsappIcon className="size-6 text-ink" />
            <h2 className="mt-4 text-lg font-medium text-ink">Drone booking</h2>
            <p className="mt-3 text-sm leading-7 text-body">
              Ready to book aerial or FPV filming? Pick a service on the{" "}
              <Link href="/en/drone-portfolio" className="underline underline-offset-4">
                Drone Portfolio
              </Link>{" "}
              page to request a quote, or{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                message me on WhatsApp
              </a>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
