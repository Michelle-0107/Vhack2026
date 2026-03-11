"use client";
import { useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Activity, Crosshair, RefreshCw, Radio } from "lucide-react";
import { useFleetStore, SENSOR_COLOR, SENSOR_MODES } from "@/store/useFleetStore";
import TopoGrid    from "./TopoGrid";
import ThermalZone from "./ThermalZone";
import CommanderView from "./CommanderView";
import DroneMapIcon  from "./DroneMapIcon";
import OverrideCursor from "./OverrideCursor";
import RelayLink      from "./RelayLink";
import { AI_CYAN, HUMAN_MAG, OK_GREEN } from "@/lib/constants";

// ── Sensor overlay layer ──────────────────────────────────────────────────────
// Refactored: Full-Spectrum Sensor Suite
// Every drone projects ALL FOUR sensor modes simultaneously for maximum situational awareness.
// Uses pure SVG animations and optical blending to create a high-intensity fusion effect.
function SensorOverlayLayer({ drones }) {
  return (
    <svg
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        mixBlendMode: "plus-lighter",
        zIndex: 3,
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {SENSOR_MODES.map((mode) => (
          <radialGradient key={`grad-${mode}`} id={`grad-${mode}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={SENSOR_COLOR[mode]} stopOpacity="0.45" />
            <stop offset="100%" stopColor={SENSOR_COLOR[mode]} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {drones.map((d) => (
        <DroneSensor key={d.id} drone={d} />
      ))}
    </svg>
  );
}

// ── Sensor Sub-components ─────────────────────────────────────────────────────

function DroneSensor({ drone }) {
  const { x, y, isScanning, scanPhase } = drone;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Render specific tactical animations for SIGNAL and THERMAL modes */}
      {/* CV box is intentionally removed to declutter the view */}
      <SensorThermal />
      <SensorSignal color={SENSOR_COLOR.SIGNAL} />
    </g>
  );
}

function SensorThermal() {
  // A soft, organic radial pulse (Cyan)
  // Uses gradient fill for smooth, non-geometric look
  return (
    <circle r="9" fill={`url(#grad-THERMAL)`}>
      <animate attributeName="r" values="8;11;8" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
    </circle>
  );
}

function SensorSignal({ color }) {
  // Expanding hexagonal rings (radio waves) (Magenta)
  // Hexagon approximation points for r=1
  const hexPoints = "0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5";
  return (
    <g>
      {[0, 1].map((i) => (
        <polygon key={i} points={hexPoints} fill="none" stroke={color} strokeWidth="0.12">
          <animateTransform attributeName="transform" type="scale" values="1;12" dur="3s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="3s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
        </polygon>
      ))}
    </g>
  );
}


// ── Sensor mode HUD legend ────────────────────────────────────────────────────
// Displays which sensor modes are currently active across the fleet.
function SensorModeLegend({ drones }) {
  // Count how many drones are running each mode
  const counts = SENSOR_MODES.reduce((acc, m) => {
    acc[m] = drones.filter((d) => d.sensorMode === m).length;
    return acc;
  }, {});

  const modeLabels = {
    THERMAL: "THERMAL",
    CV:      "COMP-VIS",
    SIGNAL:  "RF-SIG",
  };

  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "center",
      fontSize: 8, fontFamily: "'Share Tech Mono',monospace",
    }}>
      {SENSOR_MODES.map((mode) => {
        const c     = SENSOR_COLOR[mode];
        const count = counts[mode];
        return (
          <div key={mode} style={{
            display: "flex", alignItems: "center", gap: 4,
            opacity: count > 0 ? 1 : 0.3,
            transition: "opacity 0.3s",
          }}>
            {/* Colour swatch */}
            <div style={{
              width: 8, height: 8, borderRadius: 1,
              background: c,
              boxShadow: count > 0 ? `0 0 5px ${c}` : "none",
            }} />
            <span style={{ color: c }}>
              {modeLabels[mode]}: {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MapGrid() {
  const drones          = useFleetStore((s) => s.drones);
  const activeDrone     = useFleetStore((s) => s.activeDrone);
  const setActiveDrone  = useFleetStore((s) => s.setActiveDrone);
  const toggleMode      = useFleetStore((s) => s.toggleMode);
  const cycleSensorMode = useFleetStore((s) => s.cycleSensorMode);
  const tick_update     = useFleetStore((s) => s.tick_update);
  const getMeshEdges    = useFleetStore((s) => s.getMeshEdges);
  const startScanSequence = useFleetStore((s) => s.startScanSequence);
  const startScanAll      = useFleetStore((s) => s.startScanAll);

  const mapRef = useRef(null);

  // Physics heartbeat — drives drone drift via requestAnimationFrame.
  // Throttled to one store write per 100 ms to avoid thrashing React.
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

  // Click-to-select: converts pixel coords to map-percentage coords and finds
  // the nearest drone within 8 percentage-units of the click point.
  const handleMapClick = useCallback((e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const px   = ((e.clientX - rect.left) / rect.width)  * 100;
    const py   = ((e.clientY - rect.top)  / rect.height) * 100;

    let closest = null;
    let minD    = 8; // selection radius in map-percentage units

    drones.forEach((d) => {
      const dist = Math.sqrt((d.x - px) ** 2 + (d.y - py) ** 2);
      if (dist < minD) { minD = dist; closest = d.id; }
    });

    // Clicking empty space deselects; clicking a drone selects it
    setActiveDrone(closest);
  }, [drones, setActiveDrone]);

  const edges  = getMeshEdges();
  const activeD = drones.find((d) => d.id === activeDrone);

  // Pass the active drone's sensor mode to ThermalZone; fall back to THERMAL
  const activeSensorMode = activeD?.sensorMode ?? "THERMAL";
  const activeSensorColor = SENSOR_COLOR[activeSensorMode] ?? AI_CYAN;

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>

      {/* ── Tactical header ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 12,
        display: "flex", alignItems: "center",
        padding: "7px 13px",
        background: "rgba(0,3,12,0.88)",
        borderBottom: `1px solid ${AI_CYAN}18`,
      }}>
        <div style={{
          fontFamily: "'Orbitron',sans-serif", fontSize: 12,
          fontWeight: 700, color: AI_CYAN, letterSpacing: 3,
        }}>
          COMMANDER VIEW: SECTOR 7G
        </div>

        <div style={{ flex: 1 }} />

        {/* Live sensor-mode distribution legend */}
        <SensorModeLegend drones={drones} />

        <div style={{ width: 1, background: `${AI_CYAN}22`, height: 16, margin: "0 12px" }} />

        {/* Fleet count */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: AI_CYAN,
        }}>
          <Activity size={14} />
          <span>{drones.length} UNITS ONLINE</span>
        </div>
      </div>

      {/* ── Map canvas ──────────────────────────────────────────────────── */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          position: "absolute", inset: 0, top: 46,
          cursor: "crosshair",
          background: "radial-gradient(ellipse at 46% 50%, #010d1c 0%, #02080f 100%)",
        }}
      >
        {/* Layer 1 — Topographic grid (lowest, no blend mode) */}
        <TopoGrid />

        {/* Layer 2 — Radar sweep (decorative, normal blend) */}
        <svg
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            opacity: 0.18, pointerEvents: "none",
          }}
          viewBox="0 0 900 540"
        >
          <defs>
            <linearGradient id="swpG">
              <stop offset="0%"   stopColor={AI_CYAN} stopOpacity="0.8" />
              <stop offset="100%" stopColor={AI_CYAN} stopOpacity="0"   />
            </linearGradient>
          </defs>
          <g style={{ transformOrigin: "450px 270px", animation: "sweep 7s linear infinite" }}>
            <path d="M450 270 L850 270 A400 400 0 0 0 450 -130 Z" fill="url(#swpG)" />
          </g>
        </svg>

        {/* Layer 3 — Sensor footprint overlay (mix-blend-mode: plus-lighter) */}
        <SensorOverlayLayer drones={drones} />

        {/* Layer 4 — Relay mesh links */}
        <svg style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 4,
        }}>
          {edges.map((edge, i) => (
            <RelayLink key={edge.key} edge={edge} idx={i} />
          ))}
        </svg>

        {/* Layer 5 — Drone icons (mix-blend-mode: plus-lighter keeps them bright over overlays) */}
        <div style={{ mixBlendMode: "plus-lighter", position: "absolute", inset: 0, zIndex: 5 }}>
          <AnimatePresence>
            {drones.map((d) => (
              <DroneMapIcon
                key={d.id}
                drone={d}
                isActive={activeDrone === d.id}
                onClick={setActiveDrone}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Layer 5.5 — Commander HUD overlayer (hex · ripples · shutter) */}
        <CommanderView drones={drones} showEdges={false} showCounts={false} showGlobalRadar={false} />

        {/* Layer 6 — Manual-override cursor ring */}
        {activeD && (
          <OverrideCursor
            x={activeD.x}
            y={activeD.y}
            isManual={activeD.mode === "MANUAL"}
          />
        )}

        {/* Layer 7 — ThermalZone widget (bottom-left sensor display) */}
        <ThermalZone sensorMode={activeSensorMode} />

        {/* Map bottom status strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "5px 13px",
          background: "rgba(0,0,0,0.55)",
          borderTop: `1px solid ${AI_CYAN}0f`,
          display: "flex", gap: 18,
          fontSize: 8, fontFamily: "'Share Tech Mono',monospace",
          color: `${AI_CYAN}44`, zIndex: 10,
        }}>
          <span>
            <span style={{ color: OK_GREEN }}>●</span> SIGNAL RELAY: GRID_7G-NORTH
          </span>
          {activeD && (
            <span>
              ACTIVE: <span style={{ color: activeSensorColor }}>{activeD.id}</span>
              {" · SENSOR: "}
              <span style={{ color: activeSensorColor }}>{activeSensorMode}</span>
            </span>
          )}
          <span style={{ marginLeft: "auto" }}>
            MESH LINKS: <span style={{ color: OK_GREEN }}>{edges.length}</span>
          </span>
        </div>
      </div>

      {/* ── Bottom control bar ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 22,
        left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 10, zIndex: 20,
      }}>
        {/* OVERRIDE: Toggle selected drone between AUTO and MANUAL control */}
        <button
          onClick={() => activeDrone && toggleMode(activeDrone)}
          disabled={!activeDrone}
          style={{
            background: activeDrone ? "rgba(255,0,204,0.15)" : "rgba(255,255,255,0.04)",
            border:     `1px solid ${activeDrone ? HUMAN_MAG : "#333"}`,
            color:      activeDrone ? HUMAN_MAG : "#555",
            padding: "8px 18px", borderRadius: 4,
            cursor: activeDrone ? "pointer" : "not-allowed",
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 11,
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s",
          }}
        >
          <Crosshair size={13} />
          {activeDrone ? `OVERRIDE ${activeDrone}` : "SELECT DRONE"}
        </button>

        {/* SENSOR: Cycle the active drone's detection mode */}
        <button
          onClick={() => activeDrone && cycleSensorMode(activeDrone)}
          disabled={!activeDrone}
          style={{
            background: activeDrone ? `${activeSensorColor}18` : "rgba(255,255,255,0.04)",
            border:     `1px solid ${activeDrone ? activeSensorColor : "#333"}`,
            color:      activeDrone ? activeSensorColor : "#555",
            padding: "8px 18px", borderRadius: 4,
            cursor: activeDrone ? "pointer" : "not-allowed",
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 11,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: activeDrone ? `0 0 10px ${activeSensorColor}33` : "none",
            transition: "all 0.3s",
          }}
        >
          <Radio size={13} />
          {activeDrone
            ? `SENSOR: ${activeSensorMode}`
            : "SELECT DRONE"}
        </button>

        {/* SYNC: Trigger a mesh re-sync with the local Llama node */}
        <button
          onClick={() => {
            if (activeDrone) {
              startScanSequence(activeDrone);
            } else {
              startScanAll();
            }
          }}
          style={{
            background: AI_CYAN,
            color: "#000", fontWeight: 700,
            padding: "8px 18px", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Orbitron',sans-serif", fontSize: 11,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 0 14px ${AI_CYAN}55`,
          }}
        >
          <RefreshCw size={13} /> SYNC NODES
        </button>
      </div>
    </div>
  );
}
