import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Fishkeeping",
  "Fishkeeping through an engineering lens: systems design, monitoring, and troubleshooting documentation.",
);

export default function FishkeepingPage() {
  redirect("/en/fishkeeping");
}
