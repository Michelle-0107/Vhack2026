/**
 * page.jsx — BEACON-NET HITL Command Interface
 *
 * This file is intentionally thin. All state lives in useFleetStore (Zustand).
 * All layout sections are imported from their domain-specific component folders.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │               SystemStatusBar (header)              │
 *   ├──────────────────┬──────────────────┬───────────────┤
 *   │  SwarmRegistry   │     MapGrid      │ AIIntelHub    │
 *   │  (fleet/left)    │   (map/center)   │ (logs/right)  │
 *   ├──────────────────┴──────────────────┴───────────────┤
 *   │                  SystemFooter                       │
 *   └─────────────────────────────────────────────────────┘
 *
 * WebSocket integration point: swap SimLoop for a ws-backed hook.
 * See /src/components/system/SimLoop.jsx for instructions.
 */
import SimLoop           from "@/components/system/SimLoop";
import SystemStatusBar   from "@/components/system/SystemStatusBar";
import SystemFooter      from "@/components/system/SystemFooter";
import SwarmRegistry     from "@/components/fleet/SwarmRegistry";
import MapGrid           from "@/components/map/MapGrid";
import AIIntelligenceHub from "@/components/logs/AIIntelligenceHub";

export default function BeaconNetPage() {
  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#02080f",
      fontFamily: "'Share Tech Mono', monospace",
      color: "#00f5ff",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Physics / WebSocket simulation driver — renders nothing */}
      <SimLoop />

      {/* ── Header ── */}
      <SystemStatusBar />

      {/* ── Body (three-column) ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <SwarmRegistry />
        <MapGrid />
        <AIIntelligenceHub />
      </div>

      {/* ── Footer ── */}
      <SystemFooter />
    </div>
  );
}
