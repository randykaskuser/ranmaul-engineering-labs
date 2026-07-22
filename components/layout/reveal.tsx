"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  as?: React.ElementType;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 30,
  className = "",
  as: Component = "div",
}: RevealProps) {
  const elemRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = elemRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case "up":
        y = distance;
        break;
      case "down":
        y = -distance;
        break;
      case "left":
        x = distance;
        break;
      case "right":
        x = -distance;
        break;
    }

    gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        x,
        y,
      },
      {
        duration,
        delay,
        autoAlpha: 1,
        x: 0,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [direction, delay, duration, distance]);

  return (
    <Component ref={elemRef} className={className}>
      {children}
    </Component>
  );
}
