import type { SVGProps } from "react";

export function PaperPlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Background circles / spiral effect */}
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="opacity-10" />
      <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="opacity-20" />
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="opacity-30" />
      
      {/* Spiral dotted path */}
      <path 
        d="M200 200 C 180 150, 100 150, 100 250 C 100 350, 250 350, 300 200 C 350 50, 150 50, 50 150" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeDasharray="6 8" 
        fill="none" 
        className="opacity-20"
      />
      
      {/* Paper Plane - simplified geometric version */}
      <g transform="translate(40, 60) rotate(-15) scale(1.2)" className="text-ink drop-shadow-xl">
        <path d="M10 10 L100 40 L10 90 L30 50 Z" fill="currentColor" className="opacity-100" />
        <path d="M100 40 L30 50 L40 70 Z" fill="currentColor" className="opacity-80" />
        <path d="M40 70 L30 50 L50 45 Z" fill="currentColor" className="opacity-60" />
      </g>
    </svg>
  );
}
