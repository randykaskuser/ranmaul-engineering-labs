import {
  ShieldCheck,
  FolderGit2,
  Wrench,
  Plane,
  Video,
  Fish,
  type LucideIcon,
} from "lucide-react";

export const SITE_NAME = "Randy M. Portfolio";
export const SITE_DESCRIPTION =
  "Drone projects, engineering notes, and fishkeeping journals from a QA Engineer who enjoys building, flying, and learning.";
export const SITE_URL = "https://ranmaul.com";

export const INSTAGRAM_HANDLE = "newbie.drone";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
export const WHATSAPP_URL = "https://wa.me/6285887775179";
export const GITHUB_URL = "https://github.com/randykaskuser";

/** WhatsApp chat link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavGroup = {
  label: string;
  children: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

export const NAV_LINKS: NavEntry[] = [
  { href: "/", label: "Home" },
  {
    label: "Engineering",
    children: [
      {
        href: "/qa",
        label: "QA Engineering",
        description: "Automation, testing & SDET",
        icon: ShieldCheck,
      },
      {
        href: "/projects",
        label: "Projects",
        description: "Things I'm building and experimenting with",
        icon: FolderGit2,
      },
      {
        href: "/tools",
        label: "Tools",
        description: "Useful tools, utilities & setups",
        icon: Wrench,
      },
    ],
  },
  {
    label: "Explore",
    children: [
      {
        href: "/fpv",
        label: "FPV & Drone",
        description: "Flights, builds, tuning & lessons",
        icon: Plane,
      },
      {
        href: "/drone-portfolio",
        label: "Drone Portfolio",
        description: "Cinematic flights & selected reels",
        icon: Video,
      },
      {
        href: "/fishkeeping",
        label: "Fishkeeping",
        description: "Predator fish & aquarium keeping",
        icon: Fish,
      },
    ],
  },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export type SiteLocale = "en" | "id";

/** A string in both site languages. */
export type Localized = { en: string; id: string };

export function pick(copy: Localized, locale: string): string {
  return locale === "id" ? copy.id : copy.en;
}

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "en" || value === "id";
}

// Sections that only exist under /{locale}/... Plain links to them must be prefixed.
const LOCALIZED_PATHS = ["/qa", "/fpv", "/fishkeeping", "/notes", "/drone-portfolio", "/tools", "/projects", "/contact"];

export function getLocaleFromPathname(pathname: string | null): SiteLocale {
  return pathname === "/id" || pathname?.startsWith("/id/") ? "id" : "en";
}

export function localizeHref(href: string, locale: SiteLocale): string {
  return LOCALIZED_PATHS.includes(href) ? `/${locale}${href}` : href;
}

/**
 * Target of the EN/ID toggle. `translations` maps an article path to its
 * translated path. Never returns a route that does not exist.
 */
export function getLocaleSwitchHref(
  pathname: string | null,
  translations: Record<string, string>,
): string {
  const otherLocale: SiteLocale = getLocaleFromPathname(pathname) === "en" ? "id" : "en";
  const path = pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : "/";

  if (translations[path]) return translations[path];

  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "en" && segments[0] !== "id") {
    // English-only page (about, cv, create): no localized version exists.
    return `/${otherLocale}`;
  }
  if (segments.length <= 2) {
    // Home, section index, tags index, drone portfolio, tools, projects, contact: exist in both locales.
    return `/${[otherLocale, ...segments.slice(1)].join("/")}`;
  }
  // Untranslated article or localized tag: fall back to the section index.
  return `/${otherLocale}/${segments[1]}`;
}

export const getFlatNavLinks = (): NavItem[] => {
  return NAV_LINKS.flatMap((entry) => {
    if ("children" in entry) {
      return entry.children;
    }
    return entry;
  });
};

import { Home, BookOpen, User, Mail } from "lucide-react";

export const MOBILE_NAV_GROUPS: NavEntry[] = [
  {
    label: "Engineering",
    children: [
      { href: "/qa", label: "QA Engineering", icon: ShieldCheck },
      { href: "/projects", label: "Projects", icon: FolderGit2 },
      { href: "/tools", label: "Tools", icon: Wrench },
    ],
  },
  {
    label: "Explore",
    children: [
      { href: "/fpv", label: "FPV & Drone", icon: Plane },
      { href: "/drone-portfolio", label: "Drone Portfolio", icon: Video },
      { href: "/fishkeeping", label: "Fishkeeping", icon: Fish },
    ],
  },
  {
    label: "Elsewhere",
    children: [
      { href: "/", label: "Home", icon: Home },
      { href: "/notes", label: "Notes", icon: BookOpen },
      { href: "/about", label: "About", icon: User },
    ],
  },
  {
    label: "Connect",
    children: [
      { href: "/contact", label: "Contact", icon: Mail },
    ],
  },
];
