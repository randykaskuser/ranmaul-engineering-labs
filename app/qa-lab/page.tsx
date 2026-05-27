import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "QA Lab",
  "QA automation engineering notes, experimentation logs, and practical reliability documentation.",
);

export default function QALabPage() {
  redirect("/en/qa");
}
