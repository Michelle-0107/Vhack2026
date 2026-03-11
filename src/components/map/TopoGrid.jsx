"use client";
import { AI_CYAN } from "@/lib/constants";

/**
 * TopoGrid — High-Contrast Tactical Radar Grid
 * Refactored with a SVG Glow Filter and thicker strokes for maximum 
 * visibility on dark backgrounds.
 */
export default function TopoGrid() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 900 580"
      preserveAspectRatio="none"
    >
      <defs>
        {/* The Secret Sauce: A Neon Glow filter that makes lines "emit" light */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <pattern id="tgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* Thicker stroke (1.0) and using the vibrant AI_CYAN constant */}
          <path 
            d="M 40 0 L 0 0 0 40" 
            fill="none" 
            stroke={AI_CYAN} 
            strokeWidth="1.2" 
            strokeOpacity="0.7" 
          />
        </pattern>

        <radialGradient id="tglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={AI_CYAN} stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000"    stopOpacity="0"   />
        </radialGradient>
      </defs>

      {/* Background Radial Glow */}
      <rect width="900" height="580" fill="url(#tglow)" />

      {/* Main Tactical Grid with Neon Glow applied */}
      <rect 
        width="900" 
        height="580" 
        fill="url(#tgrid)" 
        filter="url(#neonGlow)"
        opacity="0.4" 
      />

      {/* Primary Sweep Rings - Thickened and Glowed */}
      {[1, 2, 3, 4, 5].map(i => (
        <ellipse 
          key={i} 
          cx="450" cy="290" 
          rx={65 * i} ry={46 * i}
          fill="none" 
          stroke={AI_CYAN} 
          strokeWidth="1.0" 
          opacity={0.7 - i * 0.1}
          filter="url(#neonGlow)"
        />
      ))}

      {/* Coordinate Center Point */}
      <circle cx="450" cy="290" r="3" fill={AI_CYAN} filter="url(#neonGlow)" opacity="0.8" />
    </svg>
  );
}
