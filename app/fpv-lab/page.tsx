import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "FPV Lab",
  "FPV engineering content, tuning workflows, flight experiments, and cinematic production notes.",
);

export default function FPVLabPage() {
  redirect("/en/fpv");
}
