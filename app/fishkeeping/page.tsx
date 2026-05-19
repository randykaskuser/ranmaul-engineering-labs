import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Fishkeeping",
  "Fishkeeping through an engineering lens: systems design, monitoring, and troubleshooting documentation.",
);

export default function FishkeepingPage() {
  return (
    <PageHero
      eyebrow="Fishkeeping"
      title="Aquatic systems engineering and practical habitat operations"
      description="Placeholder for filtration strategy, water parameter control, maintenance SOPs, and long-term ecosystem reliability logs."
    />
  );
}
