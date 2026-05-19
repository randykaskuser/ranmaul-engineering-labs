import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Contact page for collaboration, FPV shooting, aerial documentation, and drone cinematic service inquiries.",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Professional collaboration for technical and cinematic drone work"
        description="Placeholder for future inquiry workflows and contact options across engineering collaboration and aerial media projects."
      />
      <section className="section-space">
        <div className="site-container grid gap-4 md:grid-cols-2">
          {[
            "Drone cinematic services",
            "FPV shooting sessions",
            "Aerial documentation",
            "Collaboration inquiries",
          ].map((item) => (
            <article key={item} className="rounded-2xl border border-hairline bg-surface-card p-6">
              <h2 className="text-lg font-medium text-ink">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-body">
                Placeholder section prepared for structured inquiry forms and project scoping details.
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
