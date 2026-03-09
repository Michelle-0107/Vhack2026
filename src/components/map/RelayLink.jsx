"use client";
import { AI_CYAN, HUMAN_MAG, OK_GREEN } from "@/lib/constants";

/**
 * RelayLink — renders a single mesh edge between two drones.
 *
 * Props (from getMeshEdges())
 *   edge        — { key, a, b, isHuman, isHighlit }
 *   isHealLink  — true when one endpoint is in a self-heal transit
 *   idx         — integer index for staggered animation offset
 */
export default function RelayLink({ edge, isHealLink, idx }) {
  const { a, b, isHuman, isHighlit } = edge;
  const stroke  = isHealLink ? OK_GREEN : isHuman ? HUMAN_MAG : AI_CYAN;
  const width   = isHighlit ? 2.2 : isHealLink ? 1.8 : isHuman ? 1.2 : 0.8;
  const opacity = isHighlit ? 0.95 : isHealLink ? 0.9 : isHuman ? 0.7 : 0.35;
  const dash    = isHighlit || isHealLink ? "none" : isHuman ? "none" : "5 6";
  const filter  = isHighlit
    ? (isHuman ? "url(#magGlow)" : "url(#cyanGlow)")
    : isHealLink ? "url(#healGlow)" : "none";

  return (
    <line
      x1={`${a.x}%`} y1={`${a.y}%`}
      x2={`${b.x}%`} y2={`${b.y}%`}
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dash}
      opacity={opacity}
      filter={filter}
      style={{ animation: isHealLink
        ? "healPulse 1.2s ease-in-out infinite"
        : `meshPulse 3.2s ease-in-out ${idx * 0.25}s infinite`
      }}
    />
  );
}
