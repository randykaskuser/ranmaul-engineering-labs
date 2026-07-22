"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export function Stagger({
  children,
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
  className = "",
  as: Component = "div",
}: StaggerProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const children = el.children;

    gsap.fromTo(
      children,
      {
        autoAlpha: 0,
        y: 20,
      },
      {
        duration,
        delay,
        autoAlpha: 1,
        y: 0,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [stagger, duration, delay]);

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
}
