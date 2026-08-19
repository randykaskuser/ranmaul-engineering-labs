"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavGroup } from "@/lib/site";

type NavDropdownProps = {
  group: NavGroup;
  getLocalizedHref: (href: string) => string;
};

export function NavDropdown({ group, getLocalizedHref }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={[
          "flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.9375rem] font-medium text-body transition",
          "hover:bg-surface-card hover:text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hairline-strong",
          isOpen ? "bg-surface-card text-ink" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {group.label}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-hairline bg-surface-card p-2 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              {group.children.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={getLocalizedHref(item.href)}
                    className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-canvas/50"
                    onClick={() => setIsOpen(false)}
                  >
                    {Icon && (
                      <div className="flex shrink-0 items-center justify-center rounded-lg border border-hairline bg-canvas p-2 text-muted transition-colors group-hover:border-hairline-strong group-hover:text-ink">
                        <Icon className="size-4" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 text-xs text-muted leading-relaxed">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
