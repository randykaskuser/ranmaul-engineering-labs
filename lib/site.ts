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

export const getFlatNavLinks = (): NavItem[] => {
  return NAV_LINKS.flatMap((entry) => {
    if ("children" in entry) {
      return entry.children;
    }
    return entry;
  });
};
