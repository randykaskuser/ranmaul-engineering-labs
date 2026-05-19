import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "reading";
};

const sizeClassMap = {
  default: "container",
  wide: "container-wide",
  reading: "container-reading",
} as const;

export function SiteContainer({ children, className, size = "default" }: SiteContainerProps) {
  return <div className={`${sizeClassMap[size]} ${className ?? ""}`.trim()}>{children}</div>;
}
