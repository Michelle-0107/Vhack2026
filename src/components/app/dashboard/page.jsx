"use client";

/**
 * BEACON-NET MISSION CONTROL v4.2
 * Finalized JSX Assembly with /src directory routing.
 */

// Core Logic Engine
import SimLoop from "../src/components/system/SimLoop";

// UI Components (Routed through /src/components)
import SystemStatusBar from "../src/components/system/SystemStatusBar";
import SystemFooter from "../src/components/system/SystemFooter";
import MapGrid from "../src/components/map/MapGrid";
import SwarmRegistry from "../src/components/fleet/SwarmRegistry";
import AIIntelligenceHub from "../src/components/logs/AIIntelligenceHub";

export default function Home() {
  return (
    // Root container: Full viewport width/height, tactical font, and no text-selection
    <main className="flex h-screen w-screen flex-col bg-[#02080f] text-cyan-400 overflow-hidden font-mono select-none">
      
      {/* Invisible driver for Physics and WebSocket updates */}
      <SimLoop />

      {/* ── HEADER: System Telemetry ── */}
      <SystemStatusBar />

      {/* ── CORE: Three-Column Split View ── */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* LEFT: Swarm Asset Registry (Fixed Width) */}
        <aside className="w-80 flex-shrink-0 border-r border-cyan-900/30">
          <SwarmRegistry />
        </aside>

        {/* CENTER: Tactical Map (Dynamic Expansion) */}
        {/* 'flex-1' ensures the map stretches to fill all available space */}
        <section className="flex-1 relative">
          <MapGrid />
        </section>

        {/* RIGHT: AI Intelligence & Logs (Fixed Width) */}
        <aside className="w-96 flex-shrink-0 border-l border-cyan-900/30">
          <AIIntelligenceHub />
        </aside>
      </div>

      {/* ── FOOTER: Navigation & Diagnostics ── */}
      <SystemFooter />
    </main>
  );
}