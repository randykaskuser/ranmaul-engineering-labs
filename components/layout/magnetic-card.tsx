"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  /** Primary brand border color on hover */
  hoverColor?: string;
}

export function MagneticCard({
  children,
  className = "",
  intensity = 0.3,
  hoverColor = "var(--hairline-strong)"
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Elastic motion matches UI UX Pro Max 'Complex' tier for focal interaction
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "elastic.out(1,0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "elastic.out(1,0.4)" });

    const hoverTl = gsap.to(el, {
      scale: 1.02,
      borderColor: hoverColor,
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
      duration: 0.25,
      ease: "power2.out",
      paused: true,
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xTo(x * intensity);
      yTo(y * intensity);
    };

    const onMouseEnter = () => hoverTl.play();
    const onMouseLeave = () => {
      xTo(0);
      yTo(0);
      hoverTl.reverse();
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      hoverTl.kill();
    };
  }, [intensity, hoverColor]);

  return (
    <div
      ref={cardRef}
      className={`transition-colors ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
