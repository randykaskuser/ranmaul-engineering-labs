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
      {/* Ambient glow behind the card (pulse) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-teal-500/0 blur-xl opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 z-0"></div>

      {/* Border layer: conic gradient reacting to mouse angle */}
      <div
        className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "conic-gradient(from var(--rotation), #0D9488 0deg, #0D9488 90deg, var(--hairline) 90deg, var(--hairline) 360deg)"
        }}
      />
      
      {/* Inner content container masking the center of the gradient */}
      <div className="relative z-10 h-full w-full rounded-[calc(1rem-3px)] bg-canvas-soft border border-white/10 p-4 md:p-5 flex flex-col transition-all duration-500">
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[calc(1rem-3px)] pointer-events-none"></div>
        {children}
      </div>
    </div>
  );
}
