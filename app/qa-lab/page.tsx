import { PageHero } from "@/components/sections/page-hero";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "QA Lab",
  "QA automation engineering notes, experimentation logs, and practical reliability documentation.",
);

export default function QALabPage() {
  return (
    <PageHero
      eyebrow="QA Lab"
      title="Automation engineering, reliability, and troubleshooting systems"
      description="Placeholder for test framework architecture, debugging workflows, CI diagnostics, and quality engineering experiments."
    />
  );
}
