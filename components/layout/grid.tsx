import type { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
  gap?: "sm" | "md" | "lg";
};

const columnMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
} as const;

const gapMap = {
  sm: "gap-4 md:gap-5",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-10",
} as const;

export function Grid({ children, className, columns = 2, gap = "sm" }: GridProps) {
  const classes = ["grid", gapMap[gap], columnMap[columns], className ?? ""]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
