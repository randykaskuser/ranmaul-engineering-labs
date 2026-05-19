import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "About",
  "Background, engineering philosophy, and creator-operator direction behind Engineering Labs.",
);

export default function AboutPage() {
  return (
    <PageHero
      eyebrow="About"
      title="Creator-engineer profile with systems-first thinking"
      description="Placeholder for professional background, QA/SDET focus, and the technical storytelling approach behind this platform."
    />
  );
}
