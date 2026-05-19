import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "FPV Lab",
  "FPV engineering content, tuning workflows, flight experiments, and cinematic production notes.",
);

export default function FPVLabPage() {
  return (
    <PageHero
      eyebrow="FPV Lab"
      title="Flight systems, tuning frameworks, and cinematic process breakdowns"
      description="Placeholder for quad builds, component testing, tuning profiles, and practical FPV field engineering insights."
    />
  );
}
