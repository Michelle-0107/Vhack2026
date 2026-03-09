"use client";
import { AI_CYAN } from "@/lib/constants";

/**
 * TopoGrid — decorative topographic / radar grid SVG background layer.
 * Rendered at absolute fill within the map container.
 */
export default function TopoGrid() {
  return (
    <svg
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.14 }}
      viewBox="0 0 900 580"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="tgrid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#00c0a0" strokeWidth="0.4" />
        </pattern>
        <radialGradient id="tglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={AI_CYAN} stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000"    stopOpacity="0"   />
        </radialGradient>
      </defs>

      <rect width="900" height="580" fill="url(#tgrid)" />
      <rect width="900" height="580" fill="url(#tglow)" />

      {/* Primary sweep rings */}
      {[1,2,3,4,5].map(i => (
        <ellipse key={i} cx="450" cy="290" rx={65*i} ry={46*i}
          fill="none" stroke={AI_CYAN} strokeWidth="0.3" opacity={0.5 - i*0.07} />
      ))}
      {/* Secondary cluster */}
      {[1,2,3].map(i => (
        <ellipse key={i+10} cx="190" cy="160" rx={52*i} ry={36*i}
          fill="none" stroke="#0066ff" strokeWidth="0.28" opacity={0.42 - i*0.1} />
      ))}
      {/* Tertiary cluster */}
      {[1,2].map(i => (
        <ellipse key={i+20} cx="720" cy="440" rx={44*i} ry={30*i}
          fill="none" stroke={AI_CYAN} strokeWidth="0.28" opacity={0.32} />
      ))}
    </svg>
  );
}
