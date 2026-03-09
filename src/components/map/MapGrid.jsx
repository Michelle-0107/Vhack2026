"use client";
import { useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Layers, Wifi, Users, Activity, Crosshair, RefreshCw } from "lucide-react";
import { useFleetStore } from "@/store/useFleetStore";
import TopoGrid from "./TopoGrid";
import ThermalZone from "./ThermalZone";
import DroneMapIcon from "./DroneMapIcon";
import OverrideCursor from "./OverrideCursor";
import RelayLink from "./RelayLink";
import { AI_CYAN, HUMAN_MAG, OK_GREEN, WARN_AMB } from "@/lib/constants";

export default function MapGrid() {
    const drones = useFleetStore(s => s.drones);
    const activeDrone = useFleetStore(s => s.activeDrone);
    const setActiveDrone = useFleetStore(s => s.setActiveDrone);
    const toggleMode = useFleetStore(s => s.toggleMode); // Added: Logic to switch modes
    const tick_update = useFleetStore(s => s.tick_update);
    const recalling = useFleetStore(s => s.recalling);
    const getMeshEdges = useFleetStore(s => s.getMeshEdges);

    const mapRef = useRef(null);

    // Heartbeat: The physics loop that makes drones drift
    useEffect(() => {
        let handle;
        let lastTime = 0;
        const loop = (time) => {
            if (time - lastTime >= 100) {
                tick_update();
                lastTime = time;
            }
            handle = requestAnimationFrame(loop);
        };
        handle = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(handle);
    }, [tick_update]);

    // Click Logic: This is the 'Navigate' part you wanted
    const handleMapClick = useCallback((e) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;

        let closest = null, minD = 8;
        drones.forEach(d => {
            const d2 = Math.sqrt((d.x - px) ** 2 + (d.y - py) ** 2);
            if (d2 < minD) { minD = d2; closest = d.id; }
        });
        setActiveDrone(closest);
    }, [drones, setActiveDrone]);

    const edges = getMeshEdges();
    const activeD = drones.find(d => d.id === activeDrone);

    return (
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <style>{`
                @keyframes sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>

            {/* Tactical Header (Dynamic Data) */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 12, display: "flex", alignItems: "center", padding: "7px 13px", background: "rgba(0,3,12,0.85)", borderBottom: `1px solid ${AI_CYAN}14` }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: AI_CYAN, letterSpacing: 3 }}>
                    COMMANDER VIEW: SECTOR 7G
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", gap: 16, fontSize: 16, color: AI_CYAN }}>
                    <Activity size={16} /> {drones.length} UNITS ONLINE
                </div>
            </div>

            <div ref={mapRef} onClick={handleMapClick} style={{ position: "absolute", inset: 0, top: 46, cursor: "crosshair", background: "radial-gradient(ellipse at 46% 50%,#010d1c 0%,#02080f 100%)" }}>
                <TopoGrid />

                {/* The Radar Sweep (Visual Flair) */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2, pointerEvents: "none" }} viewBox="0 0 900 540">
                    <g style={{ transformOrigin: "450px 270px", animation: "sweep 7s linear infinite" }}>
                        <path d="M450 270 L850 270 A400 400 0 0 0 450 -130 Z" fill={`url(#swpG)`} />
                    </g>
                    <defs>
                        <linearGradient id="swpG"><stop offset="0%" stopColor={AI_CYAN} stopOpacity="0.8" /><stop offset="100%" stopColor={AI_CYAN} stopOpacity="0" /></linearGradient>
                    </defs>
                </svg>

                {/* Drone Visuals (The Real Work) */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    {edges.map((edge, i) => <RelayLink key={edge.key} edge={edge} idx={i} />)}
                </svg>

                <AnimatePresence>
                    {drones.map(d => (
                        <DroneMapIcon key={d.id} drone={d} isActive={activeDrone === d.id} onClick={setActiveDrone} />
                    ))}
                </AnimatePresence>

                {activeD && <OverrideCursor x={activeD.x} y={activeD.y} isManual={activeD.mode === "MANUAL"} />}
            </div>

            {/* INTERACTIVE BUTTONS: Now they actually do things! */}
            <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 20 }}>

                {/* 1. OVERRIDE: Switches selected drone to Manual */}
                <button
                    onClick={() => activeDrone && toggleMode(activeDrone)}
                    disabled={!activeDrone}
                    style={{
                        background: activeDrone ? `rgba(255,0,204,0.15)` : "rgba(255,255,255,0.05)",
                        border: `1px solid ${activeDrone ? HUMAN_MAG : "#444"}`,
                        color: activeDrone ? HUMAN_MAG : "#666",
                        padding: "8px 20px", borderRadius: 4, cursor: activeDrone ? "pointer" : "not-allowed",
                        fontFamily: "'Share Tech Mono', monospace", display: "flex", alignItems: "center", gap: 8
                    }}
                >
                    <Crosshair size={14} /> {activeDrone ? `OVERRIDE ${activeDrone}` : "SELECT DRONE"}
                </button>

                {/* 2. SYNC: Just a visual pulse for now, simulating data fetch */}
                <button
                    onClick={() => console.log("Syncing with Local Llama 3.1...")}
                    style={{
                        background: AI_CYAN, color: "#000", fontWeight: 700,
                        padding: "8px 20px", borderRadius: 4, cursor: "pointer",
                        fontFamily: "'Orbitron', sans-serif", display: "flex", alignItems: "center", gap: 8,
                        boxShadow: `0 0 15px ${AI_CYAN}55`
                    }}
                >
                    <RefreshCw size={14} /> SYNC NODES
                </button>
            </div>
        </div>
    );
}