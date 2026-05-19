import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Tools",
  "Future utility space for technical calculators, validation helpers, and repeat-use engineering tools.",
);

export default function ToolsPage() {
  return (
    <PageHero
      eyebrow="Tools"
      title="Utility layer for practical engineering workflows"
      description="Placeholder for lightweight tools that support QA diagnostics, FPV planning, and system validation routines."
    />
  );
}
