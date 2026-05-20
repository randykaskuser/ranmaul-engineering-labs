import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  /**
   * Vertical rhythm preset.
   * - "default": editorial section spacing
   * - "lg": larger hero-ish spacing
   * - "xl": biggest spacing (rare)
   * - "tight": compact band
   */
  space?: "default" | "lg" | "xl" | "tight";
  /** Add a subtle divider line at the bottom. */
  divider?: boolean;
  /** Use alternate canvas band for pacing. */
  tone?: "default" | "soft";
  /** Enable background orbs (subtle cinematic atmosphere). */
  orb?: boolean;
};

const spaceMap = {
  default: "section-space",
  lg: "section-space-lg",
  xl: "section-space-xl",
  tight: "section-tight",
} as const;

const toneMap = {
  default: "",
  soft: "bg-canvas-soft",
} as const;

export function Section({
  children,
  className,
  space = "default",
  divider = false,
  tone = "default",
  orb = false,
}: SectionProps) {
  const classes = [
    spaceMap[space],
    toneMap[tone],
    divider ? "section-divider" : "",
    orb ? "orb-surface" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <section className={classes}>{children}</section>;
}
