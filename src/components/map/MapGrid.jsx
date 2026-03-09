"use client";
import React, { useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Crosshair, RefreshCw } from "lucide-react";
import { useFleetStore } from "@/store/useFleetStore";
import TopoGrid from "./TopoGrid";
import ThermalZone from "./ThermalZone";
import DroneMapIcon from "./DroneMapIcon";
import OverrideCursor from "./OverrideCursor";
import RelayLink from "./RelayLink";
import { AI_CYAN, HUMAN_MAG, OK_GREEN, WARN_AMB, CRIT_RED, MAX_FLEET, MISSION } from "@/lib/constants";

/**
 * MapGrid
 * - Renders the tactical map (grid + radar sweep + mesh links)
 * - Hosts the 10Hz simulation loop (physics + battery + trails) via the store
 * - Visualizes drone-mounted thermal scanning zones + selection cursor
 */
export default function MapGrid() {
  const drones = useFleetStore(s => s.drones);
  const activeDrone = useFleetStore(s => s.activeDrone);
  const setActiveDrone = useFleetStore(s => s.setActiveDrone);
  const toggleMode = useFleetStore(s => s.toggleMode);
  const getMeshEdges = useFleetStore(s => s.getMeshEdges);
  const healingLinks = useFleetStore(s => s.healingLinks); 

  const mapRef = useRef(null);

  // Target selection: pick the nearest drone to the click point
  const handleMapClick = useCallback((e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    let closest = null, minD = 8;
    drones.forEach(d => {
      const dist = Math.sqrt((d.x - px) ** 2 + (d.y - py) ** 2);
      if (dist < minD) { minD = dist; closest = d.id; }
    });
    setActiveDrone(closest);
  }, [drones, setActiveDrone]);

  const edges = getMeshEdges();
  const activeD = drones.find(d => d.id === activeDrone);
  const aiLinks = edges.filter((e) => !e.isHuman).length;
  const humanLinks = edges.filter((e) => e.isHuman).length;
  const meshStatus =
    drones.length < 2 ? "OFFLINE" : healingLinks.size > 0 ? "HEALING" : edges.length >= Math.max(0, drones.length - 1) ? "OPTIMAL" : "DEGRADED";
  const meshColor = meshStatus === "OPTIMAL" ? OK_GREEN : meshStatus === "OFFLINE" ? CRIT_RED : WARN_AMB;
  const sectorLabel = `SECTOR ${MISSION?.sector ?? "7G"}`;

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#02080f" }}>
      
      {/* Tactical Header Bar (Real-time Telemetry) */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 12,
        height: 54,
        display: "flex",
        alignItems: "center",
        padding: "7px 12px",
        background: "linear-gradient(180deg, rgba(0,10,22,0.92) 0%, rgba(0,6,16,0.82) 100%)",
        borderBottom: `1px solid ${AI_CYAN}22`,
        boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          width: 96,
          height: 34,
          border: `1px solid ${AI_CYAN}22`,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 10px",
          background: "rgba(0,0,0,0.35)",
          gap: 2,
        }}>
          <div style={{ fontSize: 9, color: `${AI_CYAN}77`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>MESH</div>
          <div style={{ fontSize: 9, color: `${AI_CYAN}55`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>PROTOCOL v4.2</div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              fontSize: 9,
              color: `${AI_CYAN}66`,
              fontFamily: "'Share Tech Mono'",
              letterSpacing: 2,
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              COMMANDER VIEW · {sectorLabel}
            </div>
            <div style={{
              fontFamily: "'Orbitron',sans-serif",
              fontSize: 18,
              fontWeight: 900,
              color: AI_CYAN,
              letterSpacing: 3,
              lineHeight: 1.02,
              textTransform: "uppercase",
              textAlign: "center",
            }}>
              <div>DECENTRALIZED</div>
              <div>SWARM ALPHA</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, marginTop: 2 }}>
            <div style={{ fontSize: 9, color: `${AI_CYAN}66`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>NODES</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 900, color: AI_CYAN, letterSpacing: 2 }}>
              {drones.length}/{MAX_FLEET}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 54 }}>
              <div style={{ fontSize: 9, color: `${AI_CYAN}66`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>AI</div>
              <div style={{ fontSize: 9, color: `${AI_CYAN}55`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>LINKS</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 900, color: AI_CYAN, letterSpacing: 2 }}>{aiLinks}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 70 }}>
              <div style={{ fontSize: 9, color: `${HUMAN_MAG}88`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>HUMAN</div>
              <div style={{ fontSize: 9, color: `${HUMAN_MAG}66`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>LINKS</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 900, color: HUMAN_MAG, letterSpacing: 2 }}>{humanLinks}</div>
            </div>
          </div>

          <div style={{
            height: 34,
            padding: "0 10px",
            borderRadius: 4,
            border: `1px solid ${meshColor}44`,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 2,
            minWidth: 98,
          }}>
            <div style={{ fontSize: 9, color: `${AI_CYAN}55`, fontFamily: "'Share Tech Mono'", letterSpacing: 2 }}>MESH</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: meshColor, letterSpacing: 2 }}>{meshStatus}</div>
          </div>
        </div>
      </div>

      <div ref={mapRef} onClick={handleMapClick} style={{ position: "absolute", inset: 0, top: 54, cursor: "crosshair" }}>
        
        {/* Background Layer: Topographical Grid Lines */}
        <TopoGrid />

        {/* Legacy Thermal Zone Widget */}
        <ThermalZone />

        {/* 1. Radar Scanning Layer (SVG Overlay) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }} viewBox="0 0 900 540">
          <g style={{ transformOrigin: "450px 270px", animation: "sweep 7s linear infinite" }}>
            <path d="M450 270 L850 270 A400 400 0 0 0 450 -130 Z" fill="url(#swpG)" />
          </g>
          <defs>
            <linearGradient id="swpG">
              <stop offset="0%" stopColor={AI_CYAN} stopOpacity="0.8" />
              <stop offset="100%" stopColor={AI_CYAN} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* 2. Dynamic Mesh Layer (SVG): Trails, Relay Links, and Self-Healing Guides */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          
          {/* Render Flight Trails (Historical Movement Path) */}
          {drones.map(d => d.trail?.map((pt, idx) => (
            <circle key={`tr-${d.id}-${idx}`} cx={`${pt.x}%`} cy={`${pt.y}%`}
              r={1.5 - idx * 0.15} fill={d.color || AI_CYAN} opacity={0.05 + idx * 0.04} />
          )))}

          {/* Render Mesh Relay Edges (Communication Links) */}
          {edges.map((edge, i) => <RelayLink key={edge.key} edge={edge} idx={i} />)}

          {/* Render Self-Healing Navigation (Gap Recovery Waypoints) */}
          {drones.filter(d => d.healTarget).map(d => (
            <g key={`heal-${d.id}`}>
              <circle cx={`${d.healTarget.x}%`} cy={`${d.healTarget.y}%`} r="8" fill="none"
                stroke={OK_GREEN} strokeWidth="1" strokeDasharray="3 4" style={{ animation: "blink 1s infinite" }} />
              <line x1={`${d.x}%`} y1={`${d.y}%`} x2={`${d.healTarget.x}%`} y2={`${d.healTarget.y}%`}
                stroke={OK_GREEN} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.6" />
            </g>
          ))}
        </svg>

        {/* 3. Drone Thermal Signatures & Icon Layer */}
        <AnimatePresence>
          {drones.map(d => (
            <React.Fragment key={d.id}>
              {/* Thermal Scan Area (SAR Detection Range) */}
              <ThermalZone x={d.x} y={d.y} color={d.color} isActive={activeDrone === d.id} />
              
              {/* Drone Hardware Representation */}
              <DroneMapIcon 
                drone={d} 
                isActive={activeDrone === d.id} 
                onClick={setActiveDrone} 
              />
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* 4. Targeting Reticle (Active Target Cursor) */}
        {activeD && <OverrideCursor x={activeD.x} y={activeD.y} isManual={activeD.mode === "MANUAL"} />}
      </div>

      {/* Footer Interaction Controls (Mission Overrides) */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, zIndex: 20 }}>
        <button
          onClick={() => activeDrone && toggleMode(activeDrone)}
          disabled={!activeDrone}
          style={{
            background: activeDrone ? "rgba(255,0,204,0.12)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${activeDrone ? HUMAN_MAG : "#333"}`,
            color: activeDrone ? HUMAN_MAG : "#555",
            padding: "8px 24px", borderRadius: 4, cursor: activeDrone ? "pointer" : "not-allowed",
            fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 8, transition: "all 0.3s"
          }}
        >
          <Crosshair size={14} /> {activeDrone ? `OVERRIDE ${activeDrone}` : "AWAITING SELECTION"}
        </button>

        <button
          style={{
            background: AI_CYAN, color: "#000", fontWeight: 900,
            padding: "8px 24px", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Orbitron'", fontSize: 11, letterSpacing: 2, display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 0 20px ${AI_CYAN}66`
          }}
        >
          <RefreshCw size={14} /> SYNC MESH
        </button>
      </div>
    </div>
  );
}
