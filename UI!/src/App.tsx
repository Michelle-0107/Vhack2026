import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFleet } from "./hooks/useFleet";
import { useCamera } from "./hooks/useCamera";
import { SystemStatusBar } from "./components/SystemStatusBar";
import { SwarmRegistry } from "./components/SwarmRegistry";
import { SwarmCommsHub } from "./components/SwarmCommsHub";
import { MapCanvas } from "./components/map/MapCanvas";
import { MiniMap } from "./components/map/MiniMap";
import { WS_URL } from "./services/api";
import { MIN_ZOOM, MAX_ZOOM, WORLD_CENTER } from "./tokens";
import { now8 } from "./utils";

export default function App() {
  const [isOffline, setIsOffline] = useState(true);
  const fleet = useFleet(!isOffline);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const lastLogRef = useRef<string>("");

  const [screenSize, setScreenSize] = useState({ w: 800, h: 600 });
  const [trackMode, setTrackMode] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const cameraCtrl = useCamera(mapContainerRef, () => setTrackMode(false));
  const { setDrones, pushLog, setTargetMarkers, tick_update } = fleet;

  // --- CLIENT-SIDE AUTONOMOUS PATROL & TIMERS ---
  const droneWaypoints = useRef<Record<string, { x: number; y: number; lockedOnSurvivor: boolean }>>({});
  const chargeWaitTimers = useRef<Record<string, number>>({});

  // SCAN RADIUS: How close a drone must be to "reveal" a hidden victim on the map
  const SCAN_REVEAL_DISTANCE = 400;

  const getRandomWaypoint = () => ({
    x: 500 + Math.random() * 4000,
    y: 500 + Math.random() * 4000
  });

  useEffect(() => {
    const handleResize = () => {
      if (mapContainerRef.current) {
        const { width, height } = mapContainerRef.current.getBoundingClientRect();
        setScreenSize({ w: width, h: height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    el.addEventListener("wheel", cameraCtrl.handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", cameraCtrl.handleWheel);
  }, [cameraCtrl.handleWheel]);

  // ── WebSocket Telemetry ──
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: number;

    const connectWS = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsOffline(false);
        pushLog({ type: "INFO", msg: "CONNECTED: Swarm intelligence online." });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.active) return;

          // 1. Initialize Drones
          if (data.drones && Array.isArray(data.drones)) {
            setDrones(prevDrones => {
              if (prevDrones.length === 3) return prevDrones;

              return [
                { id: "DR-001", x: WORLD_CENTER.x, y: WORLD_CENTER.y, battery: 100, batteryFloat: 100, status: "DEPLOYED", trail: [], colour: "#1e64ff", sensorMode: "RF", altitude: 120, speed: 0, signal: "EXCELLENT", abortingToCenter: false },
                { id: "DR-002", x: WORLD_CENTER.x, y: WORLD_CENTER.y, battery: 100, batteryFloat: 90, status: "DEPLOYED", trail: [], colour: "#00ff88", sensorMode: "THER", altitude: 150, speed: 0, signal: "EXCELLENT", abortingToCenter: false },
                { id: "DR-003", x: WORLD_CENTER.x, y: WORLD_CENTER.y, battery: 100, batteryFloat: 80, status: "DEPLOYED", trail: [], colour: "#ff3355", sensorMode: "CV", altitude: 135, speed: 0, signal: "EXCELLENT", abortingToCenter: false }
              ] as any;
            });
          }

          // 2. Stream LLM Thoughts
          if (data.ai_logs && Array.isArray(data.ai_logs)) {
            data.ai_logs.forEach((rawMsg: string) => {
              const cleanMsg = rawMsg.trim();
              if (cleanMsg !== "" && cleanMsg !== lastLogRef.current) {
                const parts = cleanMsg.split(/\]: /);
                const senderName = parts.length > 1 ? parts[0].replace('[', '') : "SYSTEM";
                const messageText = parts.length > 1 ? parts[1] : cleanMsg;
                pushLog({ type: "DECISION", msg: messageText, sender: senderName.toUpperCase() });
                lastLogRef.current = cleanMsg;
              }
            });
          }

          // 3. Survivor Data Feed (Keep them hidden initially)
          if (data.survivors && Array.isArray(data.survivors)) {
            setTargetMarkers(prev => {
              const newMarkers = [...prev];

              data.survivors.forEach((s: any) => {
                const sx = typeof s.pos[0] === 'number' ? s.pos[0] : 0;
                const sy = typeof s.pos[1] === 'number' ? s.pos[1] : 0;
                const exists = newMarkers.find(m => Math.hypot(m.wx - sx, m.wy - sy) < 50);

                if (!exists) {
                  // Push new survivor to the list, but mark as NOT discovered yet
                  newMarkers.push({
                    id: `SV-${s.id}`, droneId: "AI_SWARM", wx: sx, wy: sy,
                    confidence: s.confidence || 95, time: now8(), type: "HUMAN",
                    isRescued: s.rescued || false, rescueTime: s.rescued ? now8() : "",
                    isDiscovered: false // <--- NEW FLAG
                  } as any);

                  // Intercept logic: We still secretly route the nearest drone to it to ensure it gets found
                  setDrones(currentDrones => {
                    let closestDrone = null;
                    let minDist = Infinity;
                    currentDrones.forEach(d => {
                      if (d.status === "CHARGING" || d.abortingToCenter) return;
                      const dist = Math.hypot(d.x - sx, d.y - sy);
                      if (dist < minDist) { minDist = dist; closestDrone = d; }
                    });
                    if (closestDrone) {
                      droneWaypoints.current[closestDrone.id] = { x: sx, y: sy, lockedOnSurvivor: true };
                    }
                    return currentDrones;
                  });
                }
              });

              return newMarkers;
            });
          }

        } catch (error) {
          console.error("Data error:", error);
        }
      };

      ws.onclose = () => { setIsOffline(true); reconnectTimer = window.setTimeout(connectWS, 3000); };
      ws.onerror = () => ws.close();
    };

    connectWS();
    return () => { clearTimeout(reconnectTimer); if (ws) ws.close(); };
  }, [setDrones, pushLog, setTargetMarkers]);

  // ── Frontend Flight, Battery, & Radar Controller (10fps) ──
  useEffect(() => {
    const flightSpeed = 25;
    const drainRate = 0.08;
    const chargeRate = 0.50;

    const flightLoop = setInterval(() => {
      // Phase 1: Move drones and calculate battery
      setDrones(prevDrones => {
        if (prevDrones.length === 0) return prevDrones;

        return prevDrones.map(drone => {
          let currentBatFloat = drone.batteryFloat ?? 100;
          let newStatus = drone.status;
          let wp = droneWaypoints.current[drone.id];

          if (newStatus === "CHARGING") {
            const lockedX = WORLD_CENTER.x;
            const lockedY = WORLD_CENTER.y;
            const waitTime = (chargeWaitTimers.current[drone.id] || 0) + 100;
            chargeWaitTimers.current[drone.id] = waitTime;

            if (waitTime > 3000) {
              currentBatFloat = Math.min(100, currentBatFloat + chargeRate);
              if (currentBatFloat >= 100) {
                newStatus = "DEPLOYED";
                pushLog({ type: "INFO", msg: `${drone.id} fully charged. Resuming patrol.` });
                wp = { ...getRandomWaypoint(), lockedOnSurvivor: false };
                droneWaypoints.current[drone.id] = wp;
                chargeWaitTimers.current[drone.id] = 0;
              }
            }

            return {
              ...drone,
              x: lockedX,
              y: lockedY,
              status: newStatus,
              batteryFloat: currentBatFloat,
              battery: Math.floor(currentBatFloat),
              speed: 0,
              abortingToCenter: false,
              trail: []
            };
          }

          if (currentBatFloat <= 20 && !drone.abortingToCenter) {
            pushLog({ type: "CRITICAL", msg: `${drone.id} battery critical. Aborting to base.` });
            drone.abortingToCenter = true;
            wp = { x: WORLD_CENTER.x, y: WORLD_CENTER.y, lockedOnSurvivor: false };
            droneWaypoints.current[drone.id] = wp;
          }

          if (!wp) {
            wp = { ...getRandomWaypoint(), lockedOnSurvivor: false };
            droneWaypoints.current[drone.id] = wp;
          }

          const dx = wp.x - drone.x;
          const dy = wp.y - drone.y;
          const dist = Math.hypot(dx, dy);

          if (drone.abortingToCenter && dist < 50) {
            chargeWaitTimers.current[drone.id] = 0;
            pushLog({ type: "INFO", msg: `${drone.id} docked at base. Cooling down...` });
            return { ...drone, x: WORLD_CENTER.x, y: WORLD_CENTER.y, status: "CHARGING", abortingToCenter: false, speed: 0, trail: [] };
          }

          if (dist < 100 && !wp.lockedOnSurvivor && !drone.abortingToCenter) {
            wp = { ...getRandomWaypoint(), lockedOnSurvivor: false };
            droneWaypoints.current[drone.id] = wp;
          }

          const moveX = dist > 0 ? (dx / dist) * Math.min(flightSpeed, dist) : 0;
          const moveY = dist > 0 ? (dy / dist) * Math.min(flightSpeed, dist) : 0;

          currentBatFloat -= drainRate;
          const currentSpeed = dist < 10 ? 0 : 85 + Math.random() * 5;

          return {
            ...drone,
            x: drone.x + moveX,
            y: drone.y + moveY,
            batteryFloat: currentBatFloat,
            battery: Math.max(0, Math.floor(currentBatFloat)),
            speed: currentSpeed,
            trail: [{ x: drone.x + moveX, y: drone.y + moveY }, ...(drone.trail || [])].slice(0, 20)
          };
        });
      });

      // Phase 2: Radar Check - Reveal victims if a drone flies near them
      setTargetMarkers((prevMarkers) => {
        let stateChanged = false;

        // We need to access the current drone positions from the fleet hook safely
        const currentDrones = useFleet.getState ? useFleet.getState().drones : [];
        // Note: Because we are inside a setState, we can't easily grab the EXACT frame of drones,
        // but since this runs at 10fps, using fleet.drones reference is completely fine.

        const updatedMarkers = prevMarkers.map((marker: any) => {
          // If already discovered, keep it visible
          if (marker.isDiscovered) return marker;

          // Check if any active drone is within SCAN_REVEAL_DISTANCE
          let nearDrone = false;
          let discoveringDroneId = "";

          fleet.drones.forEach(d => {
            if (d.status === "CHARGING") return;
            const distToVictim = Math.hypot(d.x - marker.wx, d.y - marker.wy);
            if (distToVictim <= SCAN_REVEAL_DISTANCE) {
              nearDrone = true;
              discoveringDroneId = d.id;
            }
          });

          if (nearDrone) {
            stateChanged = true;
            pushLog({ type: "HUMAN", msg: `${discoveringDroneId} SENSOR HIT: Target ${marker.id} confirmed at [${(marker.wx / 1000).toFixed(2)}, ${(marker.wy / 1000).toFixed(2)}].` });
            return { ...marker, isDiscovered: true, droneId: discoveringDroneId };
          }

          return marker;
        });

        return stateChanged ? updatedMarkers : prevMarkers;
      });

      tick_update();
    }, 100);

    return () => clearInterval(flightLoop);
  }, [setDrones, setTargetMarkers, fleet.drones, tick_update, pushLog]);

  const zoomPercent = Math.max(0, Math.min(100, ((cameraCtrl.camera.zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100));

  // Only pass DISCOVERED markers to the map components to render
  const visibleMarkers = fleet.targetMarkers.filter((m: any) => m.isDiscovered !== false);

  return (
    <div style={{ height: "100vh", width: "100%", background: "#000", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <SystemStatusBar fleet={fleet} />

      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
        <SwarmRegistry fleet={fleet} />

        <div
          ref={mapContainerRef}
          style={{ flex: 1, position: "relative", overflow: "hidden", background: "#05080a", cursor: "crosshair" }}
          onMouseDown={cameraCtrl.handleMouseDown}
          onMouseMove={cameraCtrl.handleMouseMove}
          onMouseUp={cameraCtrl.handleMouseUp}
          onMouseLeave={cameraCtrl.handleMouseUp}
        >
          {/* Inject only the VISIBLE markers to MapCanvas */}
          <MapCanvas fleet={{ ...fleet, targetMarkers: visibleMarkers }} cameraCtrl={cameraCtrl} screenSize={screenSize} trackMode={trackMode} />

          {/* Inject only the VISIBLE markers to MiniMap */}
          <MiniMap
            drones={fleet.drones} targetMarkers={visibleMarkers} selectedTargetId={fleet.selectedTargetId}
            camera={cameraCtrl.camera} screenSize={screenSize} onNavigate={(wx, wy) => cameraCtrl.panTo(wx, wy)}
            fogOfWar={fleet.fogOfWar} coverageMap={fleet.coverageMap} probabilityMap={fleet.probabilityMap} activeDrone={fleet.activeDrone}
          />

          <div style={zoomContainerStyle}>
            <span style={zoomLabelStyle}>ZOOM</span>
            <button onClick={() => cameraCtrl.zoomIn()} style={zoomBtnStyle}>+</button>
            <div style={zoomBarWrapperStyle}>
              <div style={zoomBarStyle(zoomPercent)} />
              <span style={zoomValueStyle}>{Math.round(cameraCtrl.camera.zoom * 100)}%</span>
            </div>
            <button onClick={() => cameraCtrl.zoomOut()} style={zoomBtnStyle}>-</button>
            <button onClick={() => cameraCtrl.resetCamera()} style={{ ...zoomBtnStyle, fontSize: 20 }}>⌂</button>
          </div>

          <button onClick={() => setShowLegend(v => !v)} style={legendToggleStyle(showLegend)}>?</button>

          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                style={legendOverlayStyle}
              >
                <div style={legendHeaderStyle}>MAP LEGEND</div>
                <div style={legendItem}><div style={legendBox("#1e64ff")} /> Scanned - clear</div>
                <div style={legendItem}><div style={legendBox("#ff8200")} /> Probable target</div>
                <div style={legendItem}><div style={legendBox("#ff1e32")} /> Target confirmed</div>
                <div style={dividerStyle} />
                <div style={legendItem}><div style={dotStyle("#00ff88")} /> Battery OK</div>
                <div style={legendItem}><div style={dotStyle("#ff3355")} /> Battery Critical</div>
              </motion.div>
            )}
          </AnimatePresence>

          {isOffline && (
            <div style={offlineBadgeStyle}>
              <div style={pulseDotStyle} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>RECONNECTING TO SWARM...</span>
            </div>
          )}
        </div>

        {/* SwarmCommsHub needs the full fleet to display the stats correctly */}
        <SwarmCommsHub fleet={{ ...fleet, targetMarkers: visibleMarkers }} showLegend={showLegend} setShowLegend={setShowLegend} />
      </div>
    </div>
  );
}

// ── Styles ──
const zoomContainerStyle: React.CSSProperties = { position: "absolute", top: 20, left: 24, display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(0,10,20,0.85)", border: "1px solid rgba(51,250,255,0.2)", borderRadius: 14, padding: "14px 10px", gap: 12, zIndex: 10, backdropFilter: "blur(4px)" };
const zoomLabelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#e0ffff", letterSpacing: 2, fontFamily: "'Orbitron', sans-serif" };
const zoomBtnStyle: React.CSSProperties = { width: 36, height: 36, background: "transparent", border: "1px solid rgba(51,250,255,0.3)", color: "#33faff", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 22 };
const zoomBarWrapperStyle: React.CSSProperties = { height: 90, width: 36, background: "rgba(0,5,10,0.6)", border: "1px solid rgba(51,250,255,0.15)", borderRadius: 8, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" };
const zoomBarStyle = (h: number) => ({ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: `${Math.max(5, h)}%`, background: "linear-gradient(to top, rgba(51,250,255,0.5), rgba(51,250,255,0.15))", transition: "height 0.2s ease-out" });
const zoomValueStyle: React.CSSProperties = { position: "relative", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Share Tech Mono', monospace" };
const legendToggleStyle = (active: boolean): React.CSSProperties => ({ position: "absolute", bottom: 24, right: 24, width: 42, height: 42, borderRadius: "50%", background: active ? "rgba(51,250,255,0.15)" : "rgba(0,10,20,0.85)", border: `1px solid ${active ? "#33faff" : "rgba(51,250,255,0.5)"}`, color: active ? "#33faff" : "#FFFFFF", fontSize: 22, fontWeight: "bold", cursor: "pointer", zIndex: 20 });
const legendHeaderStyle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "#e0ffff", marginBottom: 14, fontFamily: "'Orbitron', sans-serif" };
const legendBox = (c: string) => ({ width: 16, height: 16, background: c + "66", border: `1px solid ${c}`, borderRadius: 3 });
const dividerStyle: React.CSSProperties = { height: 1, background: "rgba(255,255,255,0.1)", margin: "14px 0" };
const pulseDotStyle: React.CSSProperties = { width: 10, height: 10, borderRadius: "50%", background: "#ff3355", animation: "humanPulse 1s infinite" };
const offlineBadgeStyle: React.CSSProperties = { position: "absolute", top: 15, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "rgba(255,51,85,0.15)", border: "1px solid #ff335577", padding: "8px 20px", borderRadius: 24, color: "#ff3355", display: "flex", alignItems: "center", gap: 12 };
const legendOverlayStyle: React.CSSProperties = { position: "absolute", bottom: 82, right: 24, background: "rgba(0,10,20,0.85)", border: "1px solid rgba(51,250,255,0.2)", borderRadius: 10, padding: "20px", color: "rgba(255,255,255,0.8)", zIndex: 10, backdropFilter: "blur(4px)" };
const legendItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: 14, fontSize: 13, marginBottom: 10 };
const dotStyle = (color: string) => ({ width: 12, height: 12, borderRadius: "50%", background: color });