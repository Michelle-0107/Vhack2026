"use client";
import React, { useEffect } from "react";
import { useFleetStore } from "@/store/useFleetStore";
import { AI_CYAN, HUMAN_MAG } from "@/lib/constants";

/**
 * DroneThermalOverlay
 * Renders a tactical map with:
 * 1) Topographic grid (800x800, 40px spacing)
 * 2) Global thermal coverage overlay (mix-blend-mode heatmap)
 * 3) Drone icons
 * 4) Flight trails
 *
 * Thermal blending:
 * - Each drone draws a radial-gradient circle
 * - The overlay container uses mix-blend-mode: "screen"
 * - Overlapping circles brighten, visually indicating stronger coverage
 *
 * Update cadence:
 * - Uses setInterval(100ms) to drive the store's tick_update (10Hz)
 * - Drones move slowly; trails accumulate recent positions
 */
export default function DroneThermalOverlay() {
  const drones = useFleetStore((s) => s.drones);
  const deployUnit = useFleetStore((s) => s.deployUnit);
  const tick_update = useFleetStore((s) => s.tick_update);

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

  // Ensure we have at least 6 drones for the demo
  useEffect(() => {
    if (drones.length < 6) {
      const need = 6 - drones.length;
      for (let i = 0; i < need; i++) deployUnit();
    }
  }, [drones.length, deployUnit]);

  // 10Hz simulation heartbeat via setInterval
  useEffect(() => {
    const id = setInterval(() => tick_update(), 100);
    return () => clearInterval(id);
  }, [tick_update]);

  const W = 800;
  const H = 800;
  const toPxX = (pct) => (pct / 100) * W;
  const toPxY = (pct) => (pct / 100) * H;

  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        backgroundColor: "#02080f",
        background:
          "repeating-linear-gradient(0deg, rgba(0,245,255,0.04), rgba(0,245,255,0.04) 1px, transparent 1px, transparent 40px)," +
          "repeating-linear-gradient(90deg, rgba(0,245,255,0.04), rgba(0,245,255,0.04) 1px, transparent 1px, transparent 40px)",
        border: "1px solid rgba(0,245,255,0.15)",
        boxShadow: "0 0 20px rgba(0,245,255,0.1) inset",
        overflow: "hidden",
      }}
    >
      {/* 2) Global thermal overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "plus-lighter",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        {drones.map((d) => {
          const isManual = d.mode === "MANUAL" || d.mode === "Manual";
          const isAI = d.mode === "AUTO" || d.mode === "AI";
          const color = isManual ? HUMAN_MAG : isAI ? AI_CYAN : AI_CYAN;
          const r = Math.max(16, Math.min(60, d.sensorRadius || 26));
          const size = r * 2;
          const x = toPxX(d.x);
          const y = toPxY(d.y);
          return (
            <div
              key={`heat-${d.id}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%,-50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${hexToRgba(color, 0.3)} 0%, ${hexToRgba(color, 0.12)} 55%, transparent 80%)`,
                opacity: 0.8,
                filter: `drop-shadow(0 0 14px ${hexToRgba(color, 0.35)})`,
              }}
            />
          );
        })}
      </div>

      {/* 3) Drone icons */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          pointerEvents: "none",
        }}
      >
        {drones.map((d) => {
          const isManual = d.mode === "MANUAL" || d.mode === "Manual";
          const isAI = d.mode === "AUTO" || d.mode === "AI";
          const color = isManual ? HUMAN_MAG : isAI ? AI_CYAN : AI_CYAN;
          const x = toPxX(d.x);
          const y = toPxY(d.y);
          return (
            <div
              key={`dr-${d.id}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%,-50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 14px ${hexToRgba(color, 0.6)}`,
              }}
            />
          );
        })}
      </div>

      {/* 4) Flight trails (SVG lines connecting recent positions) */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none" }}
      >
        {drones.map((d) => {
          const isManual = d.mode === "MANUAL" || d.mode === "Manual";
          const isAI = d.mode === "AUTO" || d.mode === "AI";
          const color = isManual ? HUMAN_MAG : isAI ? AI_CYAN : AI_CYAN;
          const pts = d.trail || [];
          const points = pts.map((pt) => `${toPxX(pt.x)},${toPxY(pt.y)}`);
          if (points.length < 2) return null;
          return (
            <g key={`tr-${d.id}`}>
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                opacity="0.28"
              />
              {pts.map((pt, idx) => (
                <circle
                  key={`trpt-${d.id}-${idx}`}
                  cx={toPxX(pt.x)}
                  cy={toPxY(pt.y)}
                  r={Math.max(0.8, 2.4 - idx * 0.22)}
                  fill={color}
                  opacity={Math.max(0.06, 0.28 - idx * 0.03)}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
