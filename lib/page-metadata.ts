import type { Metadata } from "next";
import { SITE_NAME } from "./site";

export function createPageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
    },
  };
}
