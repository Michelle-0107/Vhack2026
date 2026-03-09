"use client";
import { AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import DroneCard from "./DroneCard";
import { useFleetStore } from "@/store/useFleetStore";
import { AI_CYAN, HUMAN_MAG, OK_GREEN, CRIT_RED, MAX_FLEET } from "@/lib/constants";

/**
 * SwarmRegistry — Left-column fleet management panel.
 * Connects to the global store to display and manage the drone list.
 */
export default function SwarmRegistry() {
  // Global Store Selectors
  const drones = useFleetStore(s => s.drones);
  const recalling = useFleetStore(s => s.recalling);
  const newIds = useFleetStore(s => s.newIds);
  const deployCount = useFleetStore(s => s.deployCount);
  const flashDeploy = useFleetStore(s => s.flashDeploy);
  const deployUnit = useFleetStore(s => s.deployUnit);
  const recallUnit = useFleetStore(s => s.recallUnit);
  const toggleMode = useFleetStore(s => s.toggleMode);
  const activeDrone = useFleetStore(s => s.activeDrone); // Standardized name
  const setActiveDrone = useFleetStore(s => s.setActiveDrone);

  const atCap = deployCount >= MAX_FLEET;

  return (
    <div style={{
      width: 274, background: "rgba(0,5,16,0.75)", borderRight: `1px solid ${AI_CYAN}18`,
      display: "flex", flexDirection: "column", backdropFilter: "blur(12px)", flexShrink: 0,
    }}>
      {/* Sidebar Header and Deploy Control */}
      <div style={{ padding: "10px 12px 9px", borderBottom: `1px solid ${AI_CYAN}14` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, letterSpacing: 3, color: AI_CYAN }}>SWARM REGISTRY</span>
          <span style={{ fontSize: 8, color: `${AI_CYAN}55` }}>{drones.length}/{MAX_FLEET} UNITS</span>
        </div>

        {/* Manual Deployment Button */}
        <button
          onClick={deployUnit}
          disabled={atCap}
          style={{
            width: "100%", padding: "9px 0", marginBottom: 6,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: flashDeploy ? `rgba(0,255,136,0.22)` : atCap ? `rgba(0,255,136,0.03)` : `rgba(0,255,136,0.09)`,
            border: `1px solid ${atCap ? OK_GREEN + "22" : OK_GREEN}`,
            borderRadius: 5, cursor: atCap ? "not-allowed" : "pointer",
            color: atCap ? `${OK_GREEN}33` : OK_GREEN,
            fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3,
            boxShadow: flashDeploy ? `0 0 32px ${OK_GREEN}88, 0 0 64px ${OK_GREEN}44` : atCap ? "none" : `0 0 10px ${OK_GREEN}28`,
            transition: "all 0.25s",
            animation: flashDeploy ? "deployBurst 0.8s ease-out" : "none",
          }}
        >
          <PlusCircle size={16} />
          <span>DEPLOY UNIT</span>
        </button>

        {/* Control Mode Legend */}
        <div style={{ display: "flex", gap: 10, fontSize: 7, color: `${AI_CYAN}44`, padding: "2px 2px" }}>
          {[
            { color: AI_CYAN, label: "AI-CYAN = AUTONOMOUS" },
            { color: HUMAN_MAG, label: "MAGENTA = MANUAL" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 12, height: 1.5, background: color, borderRadius: 1 }} />
              <span style={{ color: `${color}99` }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Drone List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 11px" }}>
        <AnimatePresence>
          {drones.map(d => (
            <DroneCard
              key={d.id}
              drone={d}
              // This prop triggers the highlight and Auto-Scroll inside DroneCard
              active={activeDrone === d.id}
              isNew={newIds.has(d.id)}
              isRecalling={recalling.has(d.id)}
              onSelect={setActiveDrone}
              onToggleMode={toggleMode}
              onRecall={recallUnit}
            />
          ))}
        </AnimatePresence>

        {/* Fleet Capacity Warning */}
        {atCap && (
          <div style={{ textAlign: "center", fontSize: 8, color: CRIT_RED, letterSpacing: 1, padding: "6px 0", animation: "blink 1.5s infinite" }}>
            ⚠ MAX FLEET CAPACITY REACHED
          </div>
        )}
      </div>
    </div>
  );
}