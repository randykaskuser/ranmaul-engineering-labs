import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";
export const PERSON_NAME = "Randy Maulana";

type PageMetadataOptions = {
  /** Path of this page, e.g. "/en/tools". Sets the canonical URL. */
  path?: string;
  locale?: string;
  /**
   * Path with a {locale} placeholder when the page exists in both languages,
   * e.g. "/{locale}/tools". Emits hreflang en/id + x-default (English).
   */
  localizedPath?: string;
  /** Explicit hreflang map, for pages whose paths don't follow /{locale}/... (home). */
  languages?: Record<string, string>;
  /** Share image; absolute URL or site path. Falls back to the default image. */
  image?: string;
  /** Title without the " | site name" suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
};

/** Resolve a site path or absolute URL to an absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_URL).toString();
}

/** Social networks cannot render SVG share images, so fall back for those. */
export function shareImage(image?: string): string {
  return image && !image.toLowerCase().endsWith(".svg") ? image : DEFAULT_OG_IMAGE;
}

/**
 * Complete metadata for a page. Next.js merges metadata shallowly, so a page that
 * sets `openGraph` loses the root layout's Open Graph fields: build all of them here.
 */
export function createPageMetadata(
  title: string,
  description: string,
  options: PageMetadataOptions = {},
): Metadata {
  const { path, locale = "en", localizedPath, absoluteTitle, noindex, type = "website" } = options;
  const image = shareImage(options.image);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  const languages = options.languages ?? (localizedPath
    ? {
        en: localizedPath.replace("{locale}", "en"),
        id: localizedPath.replace("{locale}", "id"),
        "x-default": localizedPath.replace("{locale}", "en"),
      }
    : undefined);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: path || languages ? { canonical: path, languages } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: path,
      siteName: SITE_NAME,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: languages ? (locale === "id" ? "en_US" : "id_ID") : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
