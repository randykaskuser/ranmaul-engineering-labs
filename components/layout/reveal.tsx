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
    // Reduced motion: leave content visible, no fade or slide.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    const tween = gsap.fromTo(
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
          // Play once: content never fades out again when scrolling back up,
          // and a fast scroll or anchor jump past the element still plays it.
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "opacity,visibility,transform" });
    };
  }, [direction, delay, duration, distance]);

  return (
    <Component ref={elemRef} className={className}>
      {children}
    </Component>
  );
}
