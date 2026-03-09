"use client";
import React from "react";
import { CRIT_RED, AI_CYAN, HUMAN_MAG } from "@/lib/constants";

/**
 * ThermalZone
 * - When x/y are provided: renders a drone-mounted thermal scanning footprint
 * - When x/y are omitted: renders a legacy bottom-left "thermal widget"
 */
export default function ThermalZone({ drones, activeId }) {
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const hexToRgba = (hex, alpha) => {
    const h = String(hex || "").replace("#", "").trim();
    const a = clamp01(alpha);
    if (h.length !== 6) return `rgba(0,245,255,${a})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  // If no drones provided, render the legacy widget panel
  if (!Array.isArray(drones)) {
    const containerStyle = {
      position: "absolute",
      bottom: 32,
      left: 14,
      width: 108,
      height: 80,
      background: "rgba(0,0,0,0.9)",
      border: `1px solid ${CRIT_RED}66`,
      borderRadius: 4,
      overflow: "hidden",
      boxShadow: `0 0 14px ${CRIT_RED}22`,
      zIndex: 10,
    };
    return (
      <div style={containerStyle}>
        <div style={{
          fontSize: 7, color: "#ff7755", fontFamily: "'Share Tech Mono', monospace",
          padding: "3px 6px", borderBottom: `1px solid ${CRIT_RED}22`, letterSpacing: 1,
        }}>
          THERMAL_ZONE_ACTIVE
        </div>
        <div style={{ position:"relative", width:"100%", height:60, background:"#040410" }} />
      </div>
    );
  }

  // Global overlay container sits above the grid and below drone icons.
  // We use CSS blending ("screen") so overlapping circles brighten naturally.
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        mixBlendMode: "plus-lighter",
      }}
    >
      {drones.map((d) => {
        const c = d.mode === "MANUAL" ? HUMAN_MAG : AI_CYAN;
        const radius = Math.max(18, Math.min(64, d.sensorRadius || 34));
        const size = radius * 2;
        const isActive = d.id === activeId;
        return (
          <div
            key={`tz-${d.id}`}
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "translate(-50%,-50%)",
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${hexToRgba(c, 0.34)} 0%, ${hexToRgba(c, 0.14)} 55%, transparent 82%)`,
              opacity: isActive ? 0.9 : 0.6,
              filter: `blur(10px) drop-shadow(0 0 ${isActive ? 16 : 10}px ${hexToRgba(c, 0.35)})`,
            }}
          />
        );
      })}
    </div>
  );
}
