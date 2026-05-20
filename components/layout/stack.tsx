import type { ReactNode } from "react";

type StackProps = {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
};

const gapMap = {
  sm: "space-y-4",
  md: "space-y-6",
  lg: "space-y-8 md:space-y-10",
} as const;

export function Stack({ children, className, gap = "md" }: StackProps) {
  const classes = [gapMap[gap], className ?? ""].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
