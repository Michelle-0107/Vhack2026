/**
 * src/components/SwarmRegistry.tsx
 */

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AI_CYAN, OK_GREEN, WARN_AMB, CRIT_RED, HUMAN_MAG,
  LABEL_PRIMARY, LABEL_SECONDARY, LABEL_GLOW,
  MAX_FLEET, SENSOR_SHORT, SENSOR_COLOR,
} from "../tokens";
import { batteryColor, sigColor, sigStrength, getDroneBehavior, knotsToKmh, clamp } from "../utils";
import type { Drone } from "../types";
import type { FleetState } from "../hooks/useFleet";

function BatteryBar({ value }: { value: number }) {
  const safeValue = value ?? 100;
  const color = batteryColor(safeValue);
  return (
    <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", width: "100%", marginTop: 4 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ height: "100%", background: color, borderRadius: 4, boxShadow: `0 0 6px ${color}88`, animation: safeValue <= 20 ? "batteryPulse 0.9s ease-in-out infinite" : "none" }}
      />
    </div>
  );
}

function SignalBars({ sig }: { sig: string }) {
  const safeSig = sig || "UNKNOWN";
  const strength = sigStrength(safeSig);
  const color = sigColor(safeSig);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ width: 5, height: Math.round(16 * ((i + 1) / 4)), borderRadius: 2, background: i < strength ? color : `${color}22`, boxShadow: i < strength ? `0 0 4px ${color}88` : "none", transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

function DroneCard({ drone, active, isNew, isRecalling, onSelect, onRecall, onCycleSensor }: {
  drone: Drone; active: boolean; isNew: boolean; isRecalling: boolean;
  onSelect: (id: string) => void; onRecall: (id: string) => void; onCycleSensor: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isCharging = drone.status === "CHARGING";
  const c = isCharging ? "#556677" : (drone.colour || AI_CYAN);
  const borderCol = isCharging
    ? "rgba(80,100,120,0.30)"
    : isRecalling ? CRIT_RED : active ? c : isNew ? c : drone.outOfBounds ? CRIT_RED : `${c}28`;

  const safeBattery = drone.battery ?? 100;
  const batColor = batteryColor(safeBattery);
  const batCrit = safeBattery <= 20;
  const batWarn = !batCrit && safeBattery <= 40;

  const speedKmh = knotsToKmh(drone.spd ?? drone.speed ?? 0);
  const behavior = getDroneBehavior(drone);
  const safeSensorMode = drone.sensorMode || "RF";

  const sensorPhases = [
    { key: "RF", color: HUMAN_MAG, isActive: drone.isScanning && drone.scanPhase >= 1 },
    { key: "THER", color: "#ff4400", isActive: drone.isScanning && drone.scanPhase >= 2 },
    { key: "CV", color: OK_GREEN, isActive: drone.isScanning && drone.scanPhase >= 3 },
  ];

  const safeSig = drone.sig || drone.signal || "UNKNOWN";

  return (
    <motion.div
      ref={ref} layout
      initial={isNew ? { opacity: 0, x: -40, scale: 0.9 } : false}
      animate={
        drone.recalibrating ? { opacity: [1, 0.3, 1, 0.3, 1], scale: [1, 0.97, 1, 0.97, 1] }
          : isRecalling ? { opacity: 0.42, scale: 0.97 }
            : isCharging ? { opacity: 0.55, x: 0, scale: 0.98 }
              : { opacity: 1, x: 0, scale: 1 }
      }
      exit={{ opacity: 0, x: -50, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      onClick={() => !isRecalling && !isCharging && onSelect(drone.id)}
      style={{
        cursor: isRecalling || isCharging ? "default" : "pointer",
        background: isCharging ? "rgba(20,30,40,0.55)" : active ? `${c}10` : "rgba(0,0,0,0.32)",
        border: `1px solid ${borderCol}`, borderRadius: 8, padding: "12px 14px", marginBottom: 8,
        boxShadow: active && !isCharging ? `0 0 20px ${c}40, inset 0 0 10px ${c}06`
          : drone.outOfBounds ? `0 0 8px ${CRIT_RED}44` : "none",
        position: "relative", overflow: "hidden",
        transition: "border 0.25s, box-shadow 0.25s, background 0.25s",
        filter: isCharging ? "saturate(0.25) brightness(0.7)" : "none",
      }}
    >
      {active && !isRecalling && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${c},transparent)`, animation: "scanLine 2s linear infinite" }} />
      )}
      {drone.abortingToCenter && <div style={{ position: "absolute", top: 4, right: 8, fontSize: 11, color: CRIT_RED, letterSpacing: 1, animation: "humanPulse 0.7s ease-in-out infinite", fontWeight: 700 }}>⚠ ABORT RTB</div>}
      {drone.outOfBounds && !drone.abortingToCenter && <div style={{ position: "absolute", top: 4, right: 8, fontSize: 11, color: CRIT_RED, letterSpacing: 1, animation: "humanPulse 0.8s ease-in-out infinite", fontWeight: 700 }}>⚠ OOB</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: drone.relay === "ACTIVE" ? OK_GREEN : WARN_AMB, boxShadow: `0 0 6px ${drone.relay === "ACTIVE" ? OK_GREEN : WARN_AMB}`, flexShrink: 0 }} />
          <span style={{ color: active ? c : LABEL_PRIMARY, fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 700, textShadow: active ? `0 0 12px ${c}88, 0 0 5px rgba(0,245,255,0.5)` : LABEL_GLOW, letterSpacing: 1 }}>{drone.id}</span>
        </div>
        <span style={{ color: batColor, fontSize: 18, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", textShadow: `0 0 8px ${batColor}88`, animation: batCrit ? "batteryPulse 0.9s ease-in-out infinite" : "none" }}>{safeBattery}%</span>
      </div>
      <BatteryBar value={safeBattery} />

      {(batCrit || batWarn) && (
        <div style={{ marginTop: 6 }}>
          {batCrit && <span style={{ fontSize: 11, color: CRIT_RED, fontWeight: 700, border: `1px solid ${CRIT_RED}77`, background: `${CRIT_RED}12`, borderRadius: 4, padding: "2px 8px", animation: "batteryPulse 0.9s ease-in-out infinite" }}>⚡ CRITICAL BATTERY</span>}
          {batWarn && !batCrit && <span style={{ fontSize: 11, color: WARN_AMB, fontWeight: 700, border: `1px solid ${WARN_AMB}55`, background: `${WARN_AMB}0f`, borderRadius: 4, padding: "2px 8px" }}>⚡ LOW BATTERY</span>}
        </div>
      )}

      {drone.humanDetected && (
        <div style={{ marginTop: 6 }}><span style={{ fontSize: 11, color: HUMAN_MAG, fontWeight: 700, letterSpacing: 1, border: `1px solid ${HUMAN_MAG}55`, borderRadius: 4, padding: "2px 8px", animation: "humanPulse 0.8s ease-in-out infinite" }}>◉ HUMAN DETECTED</span></div>
      )}

      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, background: `${behavior.color}0e`, border: `1px solid ${behavior.color}33`, borderRadius: 4, padding: "4px 10px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: behavior.color, boxShadow: `0 0 5px ${behavior.color}`, flexShrink: 0, animation: drone.isScanning ? "humanPulse 0.9s ease-in-out infinite" : "none" }} />
        <span style={{ fontSize: 12, color: behavior.color, fontWeight: 700, letterSpacing: 0.5, fontFamily: "'Roboto Mono',monospace" }}>{behavior.label}</span>
      </div>

      <div style={{ marginTop: 8, background: "rgba(0,0,0,0.45)", border: `1px solid ${active ? c + "44" : c + "18"}`, borderRadius: 4, padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: LABEL_SECONDARY, fontWeight: 600, letterSpacing: 0.5 }}>POSITION</span>
        <span style={{ fontSize: 13, fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, color: active ? c : LABEL_PRIMARY, textShadow: active ? `0 0 8px ${c}88` : LABEL_GLOW }}>
          [{((drone.x ?? 0) / 1000).toFixed(2)}, {((drone.y ?? 0) / 1000).toFixed(2)}] km
        </span>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeOut" }} style={{ overflow: "hidden" }}>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, paddingTop: 10, borderTop: `1px solid ${c}20` }}>
              {[["Altitude", `${drone.alt ?? drone.altitude ?? 120} m`], ["Speed", `${speedKmh} km/h`]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: LABEL_SECONDARY, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 14, color: LABEL_PRIMARY, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", textShadow: LABEL_GLOW }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: LABEL_SECONDARY, fontWeight: 600 }}>Signal</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: sigColor(safeSig), fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>{safeSig.slice(0, 7)}</span>
                  <SignalBars sig={safeSig} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {sensorPhases.map(({ key, color, isActive }) => (
                <div key={key} style={{ padding: "3px 9px", borderRadius: 4, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", border: isActive ? `1px solid ${color}` : `1px solid ${color}22`, color: isActive ? color : `${color}55`, background: isActive ? `${color}1a` : "rgba(0,0,0,0.28)", fontWeight: isActive ? 700 : 400 }}>{key}</div>
              ))}
              {drone.waypoint && <div style={{ padding: "3px 9px", borderRadius: 4, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", border: `1px solid ${WARN_AMB}55`, color: WARN_AMB, background: `${WARN_AMB}12` }}>WAYPOINT</div>}
            </div>

            {!isCharging && (
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 12, gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); !isRecalling && onCycleSensor(drone.id); }}
                  style={{ padding: "5px 12px", fontSize: 11, background: `${SENSOR_COLOR[safeSensorMode] ?? AI_CYAN}18`, border: `1px solid ${SENSOR_COLOR[safeSensorMode] ?? AI_CYAN}55`, color: SENSOR_COLOR[safeSensorMode] ?? AI_CYAN, borderRadius: 5, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace", fontWeight: 700 }}>
                  ◈ {SENSOR_SHORT[safeSensorMode] || safeSensorMode}
                </button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); !isRecalling && onRecall(drone.id); }}
                  style={{ padding: "5px 12px", fontSize: 11, background: "rgba(255,170,0,0.09)", border: `1px solid ${WARN_AMB}44`, color: WARN_AMB, borderRadius: 5, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace" }}>
                  ↺ RECALL
                </motion.button>
              </div>
            )}
            {isCharging && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "5px 10px", background: `${OK_GREEN}0e`, border: `1px solid ${OK_GREEN}33`, borderRadius: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: OK_GREEN, boxShadow: `0 0 6px ${OK_GREEN}`, animation: "humanPulse 1.4s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, color: OK_GREEN, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 0.5 }}>RECHARGING — {safeBattery}%</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!active && <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: `${AI_CYAN}40`, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 0.5 }}>tap for details</div>}
    </motion.div>
  );
}

export function SwarmRegistry({ fleet }: { fleet: FleetState }) {
  const { drones, recalling, newIds, deployCount, flashDeploy, deployUnit, recallUnit, cycleSensorMode, activeDrone, setActiveDrone } = fleet;
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(330);
  const dragRef = useRef(false);
  const startRef = useRef({ mx: 0, w: 0 });
  const atCap = deployCount >= MAX_FLEET;

  const sortedDrones = useMemo(() =>
    [...drones].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "DEPLOYED" ? -1 : 1;
    }),
    [drones]);

  const onResizeStart = (e: React.MouseEvent) => {
    dragRef.current = true;
    startRef.current = { mx: e.clientX, w: width };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setWidth(clamp(startRef.current.w + ev.clientX - startRef.current.mx, 40, window.innerWidth * 0.38));
    };
    const onUp = () => { dragRef.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (collapsed) {
    return (
      <div style={{ width: 46, background: "rgba(0,5,16,0.82)", borderRight: `1px solid ${AI_CYAN}18`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 8, flexShrink: 0 }}>
        <button onClick={() => setCollapsed(false)} style={{ background: "transparent", border: `1px solid ${AI_CYAN}33`, color: AI_CYAN, borderRadius: 4, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>▶</button>
        {sortedDrones.map(d => (
          <div key={d.id} title={`${d.id} [${d.status}]`} onClick={() => d.status !== "CHARGING" && setActiveDrone(d.id)} style={{ cursor: d.status === "CHARGING" ? "default" : "pointer" }}>
            <div style={{ width: activeDrone === d.id ? 12 : d.status === "CHARGING" ? 6 : 9, height: activeDrone === d.id ? 12 : d.status === "CHARGING" ? 6 : 9, borderRadius: "50%", background: d.status === "CHARGING" ? "#334455" : (d.colour || AI_CYAN), boxShadow: d.status === "CHARGING" ? "none" : activeDrone === d.id ? `0 0 10px ${d.colour || AI_CYAN}, 0 0 20px ${(d.colour || AI_CYAN)}44` : `0 0 5px ${d.colour || AI_CYAN}`, opacity: d.status === "CHARGING" ? 0.45 : 1, transition: "all 0.2s" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width, background: "rgba(0,5,16,0.82)", borderRight: `1px solid ${AI_CYAN}18`, display: "flex", flexDirection: "column", backdropFilter: "blur(12px)", flexShrink: 0, position: "relative" }}>
      <div style={{ padding: "10px 13px 9px", borderBottom: `1px solid ${AI_CYAN}14`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, letterSpacing: 3, color: LABEL_PRIMARY, fontWeight: 700, textShadow: `0 0 8px ${AI_CYAN}66` }}>SWARM REGISTRY</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: LABEL_SECONDARY, fontFamily: "'Roboto Mono',monospace", fontWeight: 600 }}>
              <span style={{ color: OK_GREEN, fontWeight: 700 }}>{deployCount}</span>
              <span style={{ opacity: 0.5 }}>/{MAX_FLEET}</span>
            </span>
            <button onClick={() => setCollapsed(true)} style={{ background: "transparent", border: `1px solid ${AI_CYAN}33`, color: AI_CYAN, borderRadius: 3, width: 24, height: 24, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>
          </div>
        </div>
        <button onClick={deployUnit} disabled={atCap} style={{
          width: "100%", padding: "11px 0",
          background: flashDeploy ? "rgba(0,255,136,0.24)" : atCap ? "rgba(0,255,136,0.03)" : "rgba(0,255,136,0.10)",
          border: `1px solid ${atCap ? OK_GREEN + "22" : OK_GREEN}`,
          borderRadius: 6, cursor: atCap ? "not-allowed" : "pointer",
          color: atCap ? `${OK_GREEN}33` : OK_GREEN,
          fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 3,
          boxShadow: flashDeploy ? `0 0 36px ${OK_GREEN}88` : atCap ? "none" : `0 0 12px ${OK_GREEN}28`,
          transition: "all 0.25s",
        }}>+ DEPLOY UNIT</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: `${OK_GREEN}88`, fontFamily: "'Roboto Mono',monospace", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6, paddingLeft: 2 }}>▶ DEPLOYED ({deployCount})</div>
        <AnimatePresence>
          {sortedDrones.filter(d => d.status === "DEPLOYED").map(d => (
            <DroneCard key={d.id} drone={d} active={activeDrone === d.id} isNew={newIds.has(d.id)} isRecalling={recalling.has(d.id)} onSelect={setActiveDrone} onRecall={recallUnit} onCycleSensor={cycleSensorMode} />
          ))}
        </AnimatePresence>
        {sortedDrones.some(d => d.status === "CHARGING") && (
          <div style={{ fontSize: 11, color: "rgba(80,140,180,0.55)", fontFamily: "'Roboto Mono',monospace", letterSpacing: 1.5, fontWeight: 700, margin: "10px 0 6px", paddingLeft: 2 }}>⚡ CHARGING ({MAX_FLEET - deployCount})</div>
        )}
        <AnimatePresence>
          {sortedDrones.filter(d => d.status === "CHARGING").map(d => (
            <DroneCard key={d.id} drone={d} active={activeDrone === d.id} isNew={newIds.has(d.id)} isRecalling={recalling.has(d.id)} onSelect={setActiveDrone} onRecall={recallUnit} onCycleSensor={cycleSensorMode} />
          ))}
        </AnimatePresence>
        {atCap && <div style={{ textAlign: "center", fontSize: 12, color: WARN_AMB, letterSpacing: 1, padding: "8px 0", fontFamily: "'Roboto Mono',monospace" }}>⚠ ALL DRONES DEPLOYED</div>}
      </div>

      <div onMouseDown={onResizeStart} style={{ position: "absolute", top: 0, right: -3, width: 6, height: "100%", cursor: "ew-resize", zIndex: 50 }} />
    </div>
  );
}