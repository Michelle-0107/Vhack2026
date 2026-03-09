"use client";
import React from "react";
import { AI_CYAN } from "@/lib/constants";

/**
 * TopoGrid
 * Renders a high-contrast, glowing tactical radar background.
 * Uses SVG filters and layered opacity to create depth and visibility
 * against the dark dashboard backdrop.
 */
export default function TopoGrid() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.65, // Increased from 0.14 for high-contrast visibility
      }}
      viewBox="0 0 900 580"
      preserveAspectRatio="none"
    >
      <defs>
        {/* 
          1. Neon Glow Filter 
          Applies a Gaussian blur to create a glowing "nuclear" effect around grid lines.
        */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* 
          2. Main Grid Pattern (tgrid)
          Thickened stroke (0.8) and higher opacity (0.6) for visibility.
        */}
        <pattern
          id="tgrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={AI_CYAN}
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
        </pattern>

        {/* 
          3. Background Radial Glow (tglow)
          Central ambient light source. Opacity increased to 0.25 for depth.
        */}
        <radialGradient id="tglow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={AI_CYAN} stopOpacity="0.25" />
          <stop offset="100%" stopColor={AI_CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1: Ambient Background Glow */}
      <rect width="900" height="580" fill="url(#tglow)" />

      {/* Layer 2: Main Tactical Grid with Neon Filter */}
      <rect
        width="900"
        height="580"
        fill="url(#tgrid)"
        filter="url(#neonGlow)"
        opacity="0.8"
      />

      {/* 
        Layer 3: Primary Sweep Rings (Central Cluster)
        High opacity, solid lines, intense glow.
      */}
      {[1, 2, 3].map((i) => (
        <ellipse
          key={`prim-${i}`}
          cx="450"
          cy="290"
          rx={65 * i}
          ry={46 * i}
          fill="none"
          stroke={AI_CYAN}
          strokeWidth="1.2"
          opacity={0.9 - i * 0.15}
          filter="url(#neonGlow)"
        />
      ))}

      {/* 
        Layer 4: Secondary Sweep Rings (Mid-Range)
        Thinner, dashed lines for orbital context.
      */}
      {[4, 5, 6].map((i) => (
        <ellipse
          key={`sec-${i}`}
          cx="450"
          cy="290"
          rx={65 * i}
          ry={46 * i}
          fill="none"
          stroke={AI_CYAN}
          strokeWidth="0.8"
          strokeDasharray="4 4"
          opacity={0.5 - (i - 3) * 0.1}
        />
      ))}

      {/* 
        Layer 5: Tertiary Outer Boundary
        Thick, distinct boundary line.
      */}
      <ellipse
        cx="450"
        cy="290"
        rx={65 * 7}
        ry={46 * 7}
        fill="none"
        stroke={AI_CYAN}
        strokeWidth="1.8"
        strokeDasharray="10 5"
        opacity="0.8"
        filter="url(#neonGlow)"
      />

      {/* Coordinate Center Point */}
      <circle
        cx="450"
        cy="290"
        r="4"
        fill={AI_CYAN}
        filter="url(#neonGlow)"
        opacity="1"
      />

      {/* Crosshair Lines */}
      <line
        x1="0"
        y1="290"
        x2="900"
        y2="290"
        stroke={AI_CYAN}
        strokeWidth="0.5"
        opacity="0.4"
      />
      <line
        x1="450"
        y1="0"
        x2="450"
        y2="580"
        stroke={AI_CYAN}
        strokeWidth="0.5"
        opacity="0.4"
      />
    </svg>
  );
}
