import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Projects",
  "Technical project archive spanning QA systems, FPV builds, and cross-domain engineering experiments.",
);

export default function ProjectsPage() {
  return (
    <PageHero
      eyebrow="Projects"
      title="A curated archive of practical engineering projects"
      description="Placeholder for implementation case studies, architecture snapshots, and results-driven project documentation."
    />
  );
}
