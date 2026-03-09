"use client";
import React from "react";
import { CRIT_RED, AI_CYAN } from "@/lib/constants";

/**
 * ThermalZone
 * - When x/y are provided: renders a drone-mounted thermal scanning footprint
 * - When x/y are omitted: renders a legacy bottom-left "thermal widget"
 */
export default function ThermalZone({ x, y, color = AI_CYAN, isActive = false }) {
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

  // No coordinates => legacy bottom-left widget position
  const isWidget = x === undefined || y === undefined;

  const containerStyle = isWidget 
    ? {
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
      }
    : {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 1, // Ensures pulses stay underneath drone icons
      };

  return (
    <div style={containerStyle}>
      {/* Header Label - Only shown in Widget mode */}
      {isWidget && (
        <div style={{
          fontSize: 7, color: "#ff7755", fontFamily: "'Share Tech Mono', monospace",
          padding: "3px 6px", borderBottom: `1px solid ${CRIT_RED}22`, letterSpacing: 1,
        }}>
          THERMAL_ZONE_ACTIVE
        </div>
      )}

      <div style={{ 
        position: "relative", 
        width: isWidget ? "100%" : 120, 
        height: isWidget ? 60 : 120, 
        background: isWidget ? "#040410" : "transparent" 
      }}>
        
        {/* Core heat signature (pulsing hotspot) */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: isActive ? 40 : 24, 
          height: isActive ? 40 : 24,
          background: `radial-gradient(circle, ${color}66 0%, ${color}11 60%, transparent 80%)`,
          borderRadius: "50%",
          animation: "thermalPulse 2s ease-in-out infinite",
          boxShadow: isActive ? `0 0 20px ${color}44` : `0 0 12px ${color}22`,
          transition: "all 0.5s ease",
        }} />

        {/* Scanning rings (expanding thermal sweep) */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            width: (isWidget ? 8 : 20) + i * (isWidget ? 12 : 30),
            height: (isWidget ? 8 : 20) + i * (isWidget ? 12 : 30),
            borderRadius: "50%",
            border: `1px solid ${hexToRgba(color, isActive ? 0.55 / i : 0.28 / i)}`,
            opacity: 1,
            animation: `thermalRing 2.2s ease-in-out ${i * 0.42}s infinite`,
          }} />
        ))}

        {/* 3. Grid Coordinates Label */}
        {isWidget && (
          <div style={{ 
            position: "absolute", bottom: 3, left: 4, fontSize: 7, 
            color: "#ff9966", fontFamily: "'Share Tech Mono', monospace" 
          }}>
            HEAT SIG: GRID_42-X
          </div>
        )}
      </div>
    </div>
  );
}
