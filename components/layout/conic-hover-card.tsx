"use client";

import { useRef, MouseEvent } from "react";

interface ConicHoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ConicHoverCard({ 
  children, 
  className = "", 
}: ConicHoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    cardRef.current.style.setProperty("--rotation", `${angle}rad`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-2xl p-[3px] overflow-hidden group cursor-pointer ${className}`}
      style={{
        "--rotation": "0rad",
      } as React.CSSProperties}
    >
      {/* Border layer: conic gradient reacting to mouse angle */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "conic-gradient(from var(--rotation), var(--ink) 0deg, var(--ink) 90deg, var(--hairline) 90deg, var(--hairline) 360deg)"
        }}
      />
      
      {/* Inner content container masking the center of the gradient */}
      <div className="relative z-10 h-full w-full rounded-[calc(1rem-3px)] bg-surface-card p-4 md:p-5 flex flex-col">
        {children}
      </div>
    </div>
  );
}
