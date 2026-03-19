/**
 * src/hooks/useFleet.ts
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MAX_FLEET, WORLD_CENTER, BASE_STATION_COORD, DRONE_SPEED,
  SCAN_RADIUS_WORLD, BATTERY_DRAIN_PER_TICK, BATTERY_MIN,
  SENSOR_MODES, MISSION_RADIUS, AGENT_CONVERSATION_POOL, LOG_POOL,
} from "../tokens";
import type { Drone, TargetMarker, LogEntryData } from "../types";
import {
  logId, makeMarkerId, rand, clamp, now8, dist2d,
  makeDrone, cellIndex, cellsInRadius,
} from "../utils";
import { deployIntel, sendCommand } from "../services/api";

export function useFleet(isLive: boolean = false) {
  const [drones, setDrones] = useState<Drone[]>(() => [
    ...Array.from({ length: 6 }, () => makeDrone("DEPLOYED")),
    ...Array.from({ length: MAX_FLEET - 6 }, () => makeDrone("CHARGING")),
  ]);

  // Core Fix: Derive deployed count directly from the array to prevent out-of-sync bugs (like 13/12)
  const deployCount = drones.filter(d => d.status === "DEPLOYED").length;

  // Use a ref to track the latest drones state to avoid stale closures and strict-mode double invocation issues
  const dronesRef = useRef(drones);
  dronesRef.current = drones;

  const [activeDrone, setActiveDroneRaw] = useState<string | null>(null);
  const [recalling, setRecalling] = useState(new Set<string>());
  const [newIds, setNewIds] = useState(new Set<string>());
  const [flashDeploy, setFlashDeploy] = useState(false);
  const [log, setLog] = useState<LogEntryData[]>([]);
  const [latency, setLatency] = useState(12.4);
  const [heartbeat, setHeartbeat] = useState(() => Array.from({ length: 28 }, () => rand(40, 80) | 0));
  const [intelText, setIntelText] = useState("");
  const [coverageMap, setCoverageMap] = useState<Map<number, number>>(() => new Map());
  const [probabilityMap, setProbabilityMap] = useState<Map<number, number>>(() => new Map());
  const [fogOfWar, setFogOfWar] = useState<Set<number>>(() => new Set());
  const [targetMarkers, setTargetMarkers] = useState<TargetMarker[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [encryptActive, setEncryptActive] = useState(false);
  const [recalibrateFlash, setRecalibrateFlash] = useState(false);
  const [abortDialogOpen, setAbortDialogOpen] = useState(false);
  const [activeSopAlert, setActiveSopAlert] = useState<{ id: string; msg: string } | null>(null);

  const sopAlertCooldownRef = useRef<Set<string>>(new Set());
  const onSelectDroneNavRef = useRef<((id: string) => void) | null>(null);
  const recallingRef = useRef(new Set<string>());
  recallingRef.current = recalling;

  const setActiveDrone = useCallback((id: string | null) => {
    setActiveDroneRaw(id);
    if (id && onSelectDroneNavRef.current) onSelectDroneNavRef.current(id);
  }, []);

  const pushLog = useCallback((entry: { type: string; msg: string; sender?: string }) =>
    setLog(prev => [...prev.slice(-80), { ...entry, id: logId(), time: now8() } as LogEntryData]), []);

  const revealFog = useCallback((wx: number, wy: number) => {
    const cells = cellsInRadius(wx, wy, SCAN_RADIUS_WORLD);
    setFogOfWar(prev => { const n = new Set(prev); cells.forEach(c => n.add(c)); return n; });
  }, []);

  const burnCoverage = useCallback((wx: number, wy: number) => {
    const cells = cellsInRadius(wx, wy, SCAN_RADIUS_WORLD * 0.5);
    setCoverageMap(prev => {
      const n = new Map(prev);
      cells.forEach(c => n.set(c, Math.min(12, (n.get(c) || 0) + 1)));
      return n;
    });
  }, []);

  const updateProbability = useCallback((wx: number, wy: number, detected: boolean) => {
    const idx = cellIndex(wx, wy);
    setProbabilityMap(prev => {
      const n = new Map(prev);
      if (detected) n.set(idx, Math.min(5, (n.get(idx) || 0) + 3));
      else { const cur = n.get(idx) || 0; n.set(idx, cur > 2 ? cur : -1); }
      return n;
    });
  }, []);

  const placeTargetMarker = useCallback((droneId: string, wx: number, wy: number, confidence: number) => {
    const marker: TargetMarker = { id: makeMarkerId(), droneId, wx, wy, confidence, time: now8(), type: "HUMAN", isRescued: false, rescueTime: "" };
    setTargetMarkers(prev => [...prev, marker]);
    pushLog({ type: "HUMAN", msg: `TARGET ${marker.id} at [${(wx / 1000).toFixed(2)}km, ${(wy / 1000).toFixed(2)}km] — CONF: ${confidence}%` });
  }, [pushLog]);

  const startScanSequence = useCallback((id: string, delayOffset = 0) => {
    setTimeout(() => {
      setDrones(p => p.map(d => d.id === id && d.status === "DEPLOYED" ? { ...d, isScanning: true, scanPhase: 1, humanDetected: false } : d));
      pushLog({ type: "COT", msg: `${id} initiated RADIO FREQUENCY scan — phase 1` });

      setTimeout(() => {
        setDrones(p => p.map(d => d.id === id ? { ...d, scanPhase: 2 } : d));
        pushLog({ type: "COT", msg: `${id} THERMAL IMAGING overlay active — phase 2` });
      }, 1200);

      setTimeout(() => {
        // Fix: Move side effects out of the setDrones state updater
        const drone = dronesRef.current.find(d => d.id === id);
        if (!drone) return;

        const detected = Math.random() < 0.3;
        const confidence = detected ? Math.floor(rand(72, 99)) : Math.floor(rand(5, 30));

        burnCoverage(drone.x, drone.y);
        revealFog(drone.x, drone.y);
        updateProbability(drone.x, drone.y, detected);
        if (detected) placeTargetMarker(id, drone.x, drone.y, confidence);

        setDrones(p => p.map(d => d.id === id ? { ...d, scanPhase: 3, humanDetected: detected } : d));

        if (detected) pushLog({ type: "HUMAN", msg: `${id} — [ HUMAN DETECTED ] — civilian signature confirmed` });
        else pushLog({ type: "DECISION", msg: `${id} COMPUTER VISION lock — no signature` });
      }, 2400);

      setTimeout(() => {
        setDrones(p => p.map(d => d.id === id ? { ...d, isScanning: false, scanPhase: 0, humanDetected: false } : d));
      }, 5000);
    }, delayOffset);
  }, [pushLog, burnCoverage, revealFog, updateProbability, placeTargetMarker]);

  const startScanAll = useCallback(() => {
    dronesRef.current.filter(d => d.status === "DEPLOYED").forEach((d, i) => startScanSequence(d.id, i * 320));
    pushLog({ type: "COT", msg: "Autonomous scan cycle initiated — all units active" });
  }, [startScanSequence, pushLog]);

  // ── Local Simulation: Patrol Cycle ──
  useEffect(() => {
    if (isLive) return;
    pushLog({ type: "INFO", msg: "Local mesh system online — autonomous patrol cycle engaged." });
    const t1 = setTimeout(startScanAll, 800);
    const iv = setInterval(() => {
      pushLog({ type: "INFO", msg: "Patrol cycle refresh — all units re-tasked" });
      startScanAll();
    }, 18000);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, [isLive, startScanAll, pushLog]);

  // ── Local Simulation: Fake Conversations ──
  useEffect(() => {
    if (isLive) return;
    let scriptIdx = 0;
    const fireNext = () => {
      const turn = AGENT_CONVERSATION_POOL[scriptIdx % AGENT_CONVERSATION_POOL.length];
      scriptIdx++;
      setLog(prev => [
        ...prev.slice(-80),
        { id: logId(), type: "COT", msg: turn.msg, time: now8(), sender: turn.sender },
      ]);
    };
    const firstTimeout = setTimeout(fireNext, 3200);
    const iv = setInterval(fireNext, 8500);
    return () => { clearTimeout(firstTimeout); clearInterval(iv); };
  }, [isLive, setLog]);


  // ── Connected Backend Actions ──────────────────────────────────────────────

  const submitIntel = useCallback(async () => {
    if (!intelText.trim()) return;
    const text = intelText.trim();
    pushLog({ type: "HUMAN", msg: text });
    setIntelText("");

    if (isLive) {
      const response = await deployIntel(text);
      if (response && response.status === "SUCCESS" && response.mission_logs) {
        const lines = response.mission_logs.split('\n');
        lines.forEach(line => {
          if (line.trim()) pushLog({ type: "CMD", msg: line.trim(), sender: "COMMANDER" });
        });
      } else if (response && response.status === "FAILED") {
        pushLog({ type: "CRIT", msg: `Command rejected: ${response.errors}`, sender: "SYSTEM" });
      }
    }
  }, [intelText, pushLog, isLive]);

  const deployUnit = useCallback(async () => {
    if (isLive) await sendCommand("deploy_unit");

    // Fix: Perform side effects outside of state updates to avoid React StrictMode double invocation bugs
    const idx = dronesRef.current.findIndex(d => d.status === "CHARGING");
    if (idx === -1) return;

    const d = dronesRef.current[idx];
    const angle = rand(0, Math.PI * 2), r = rand(150, 600);

    setNewIds(p => new Set([...p, d.id]));
    setFlashDeploy(true);
    pushLog({ type: "DEPLOY", msg: `${d.id} deployed — AUTO mode, ${d.sensorMode} sensor` });

    setDrones(prev => prev.map((drone, i) => i !== idx ? drone : {
      ...drone, status: "DEPLOYED" as const,
      x: BASE_STATION_COORD.x + Math.cos(angle) * r, y: BASE_STATION_COORD.y + Math.sin(angle) * r,
      vx: rand(-DRONE_SPEED, DRONE_SPEED), vy: rand(-DRONE_SPEED, DRONE_SPEED), trail: [],
    }));

    setTimeout(() => setFlashDeploy(false), 800);
    setTimeout(() => setNewIds(p => { const s = new Set(p); s.delete(d.id); return s; }), 2000);
  }, [pushLog, isLive]);

  const recallUnit = useCallback(async (id: string) => {
    if (isLive) await sendCommand("recall_unit", { drone_id: id });
    setRecalling(p => new Set([...p, id]));
    pushLog({ type: "RECALL", msg: `${id} executing return-to-base sequence` });
    setTimeout(() => {
      setDrones(p => p.map(d => d.id !== id ? d : {
        ...d, status: "CHARGING" as const, x: BASE_STATION_COORD.x, y: BASE_STATION_COORD.y, vx: 0, vy: 0, trail: [],
        isScanning: false, scanPhase: 0, humanDetected: false, waypoint: null, abortingToCenter: false,
      }));
      setRecalling(p => { const s = new Set(p); s.delete(id); return s; });
      pushLog({ type: "HEAL", msg: `${id} safely recovered` });
    }, 2200);
  }, [pushLog, isLive]);

  const cycleSensorMode = useCallback(async (id: string) => {
    if (isLive) await sendCommand("cycle_sensor", { drone_id: id });
    const d = dronesRef.current.find(drone => drone.id === id);
    if (!d) return;
    const next = SENSOR_MODES[(SENSOR_MODES.indexOf(d.sensorMode) + 1) % SENSOR_MODES.length];
    pushLog({ type: "INFO", msg: `${id} sensor cycled → ${next}` });
    setDrones(p => p.map(drone => drone.id === id ? { ...drone, sensorMode: next } : drone));
  }, [pushLog, isLive]);

  const setWaypoint = useCallback(async (id: string, wx: number, wy: number) => {
    if (isLive) await sendCommand("set_waypoint", { drone_id: id, wx, wy });
    pushLog({ type: "MANUAL", msg: `${id} waypoint → [${(wx / 1000).toFixed(2)}km, ${(wy / 1000).toFixed(2)}km]` });
    setDrones(p => p.map(drone => drone.id === id ? { ...drone, waypoint: { wx, wy } } : drone));
  }, [pushLog, isLive]);

  const cmdRecalibrate = useCallback(async () => {
    if (isLive) await sendCommand("recalibrate");
    setRecalibrateFlash(true); pushLog({ type: "CMD", msg: "RE-CALIBRATE initiated" });
    setDrones(p => p.map(d => ({ ...d, recalibrating: true })));
    setTimeout(() => {
      setRecalibrateFlash(false); setDrones(p => p.map(d => ({ ...d, recalibrating: false })));
      pushLog({ type: "HEAL", msg: "RE-CALIBRATE complete" });
    }, 900);
  }, [pushLog, isLive]);

  const cmdAbortConfirm = useCallback(async () => {
    if (isLive) await sendCommand("abort_mission");
    setAbortDialogOpen(false); pushLog({ type: "CRIT", msg: "⚠ MISSION ABORT" });
    setDrones(p => p.map(d => ({ ...d, mode: "AUTO" as const, waypoint: { wx: WORLD_CENTER.x, wy: WORLD_CENTER.y }, abortingToCenter: true })));
    setTimeout(() => {
      setDrones(p => p.map(d => ({ ...d, abortingToCenter: false, waypoint: null })));
    }, 8000);
  }, [pushLog, isLive]);

  const cmdEncrypt = useCallback(async () => {
    const nextState = !encryptActive;
    if (isLive) await sendCommand("toggle_encryption", { active: nextState });
    setEncryptActive(nextState);
    pushLog({ type: "CMD", msg: nextState ? "ENCRYPT_FEED: secure channel established 🔒" : "ENCRYPT_FEED: channel decrypted" });
  }, [encryptActive, pushLog, isLive]);

  const cmdMeshHandshake = useCallback(async () => {
    if (isLive) await sendCommand("mesh_handshake");
    pushLog({ type: "INFO", msg: "Mesh handshake complete" });
  }, [pushLog, isLive]);

  const markTargetRescued = useCallback(async (id: string) => {
    if (isLive) await sendCommand("mark_rescued", { target_id: id });
    const ts = now8();
    setTargetMarkers(prev => prev.map(m => m.id !== id ? m : { ...m, isRescued: true, rescueTime: ts }));
    pushLog({ type: "HEAL", msg: `TARGET ${id} — RESCUED ✔` });
  }, [pushLog, isLive]);

  const getMeshEdges = useCallback((droneList: Drone[]) => {
    type LinkState = "STRONG" | "WEAK" | "BROKEN";
    const edges: { key: string; ax: number; ay: number; bx: number; by: number; ca: string; cb: string; linkState: LinkState; isRelay: boolean; }[] = [];
    const STRONG_DIST = 500, WEAK_DIST = 800;
    const deployed = droneList.filter(d => d.status === "DEPLOYED");
    for (let i = 0; i < deployed.length; i++) {
      for (let j = i + 1; j < deployed.length; j++) {
        const a = deployed[i], b = deployed[j];
        const d = dist2d(a.x, a.y, b.x, b.y);
        if (d > WEAK_DIST) continue;
        const linkState: LinkState = d <= STRONG_DIST ? "STRONG" : "WEAK";
        edges.push({ key: `${a.id}-${b.id}`, ax: a.x, ay: a.y, bx: b.x, by: b.y, ca: a.colour, cb: b.colour, linkState, isRelay: false });
      }
    }
    return edges;
  }, []);

  const tick_update = useCallback(() => {
    setLatency(prev => {
      const next = clamp(prev + rand(-1.8, 1.8), 10, 50);
      const barH = clamp(Math.round(90 - ((next - 10) / 40) * 75) + (rand(-8, 8) | 0), 10, 95);
      setHeartbeat(hb => [...hb.slice(1), barH | 0]);
      return next;
    });

    if (isLive) return;

    const nextDrones = dronesRef.current.map(d => {
      if (recallingRef.current.has(d.id)) return d;
      if (d.status === "CHARGING") {
        const newBatteryFloat = Math.min(100, d.batteryFloat + 0.5);
        return { ...d, x: BASE_STATION_COORD.x, y: BASE_STATION_COORD.y, vx: 0, vy: 0, trail: [], batteryFloat: newBatteryFloat, battery: Math.round(newBatteryFloat), outOfBounds: false };
      }
      let { x, y, vx, vy, trail, batteryFloat, waypoint, mode } = d;
      const dFromCenter = dist2d(x, y, WORLD_CENTER.x, WORLD_CENTER.y);
      const outOfBounds = dFromCenter > MISSION_RADIUS;
      const newBatteryFloat = Math.max(BATTERY_MIN, batteryFloat - BATTERY_DRAIN_PER_TICK);
      const newBattery = Math.round(newBatteryFloat);
      if (mode === "MANUAL" && waypoint) {
        const dx = waypoint.wx - x, dy = waypoint.wy - y;
        const dd = Math.hypot(dx, dy);
        if (dd < 20) { vx = 0; vy = 0; }
        else { const spd = DRONE_SPEED * 2; vx = (dx / dd) * spd; vy = (dy / dd) * spd; }
      } else {
        vx += rand(-0.8, 0.8); vy += rand(-0.8, 0.8);
        vx = clamp(vx, -DRONE_SPEED, DRONE_SPEED);
        vy = clamp(vy, -DRONE_SPEED, DRONE_SPEED);
        if (dFromCenter > MISSION_RADIUS * 0.85) {
          const angle = Math.atan2(WORLD_CENTER.y - y, WORLD_CENTER.x - x);
          vx += Math.cos(angle) * 2; vy += Math.sin(angle) * 2;
        }
      }
      x = clamp(x + vx, 50, 4950);
      y = clamp(y + vy, 50, 4950);
      return { ...d, x, y, vx, vy, trail: [{ x, y }, ...(trail || [])].slice(0, 14), batteryFloat: newBatteryFloat, battery: newBattery, outOfBounds };
    });

    setDrones(nextDrones);

    // Calculate fog and events strictly outside the state updater loop
    nextDrones.forEach(d => {
      if (d.status === "DEPLOYED") revealFog(d.x, d.y);
    });

    if (Math.random() < 0.03) pushLog(LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)]);

    if (Math.random() < 0.008) {
      const victim = nextDrones.find(d => d.status === "DEPLOYED" && d.battery <= 20 && !sopAlertCooldownRef.current.has(d.id));
      if (victim) {
        sopAlertCooldownRef.current.add(victim.id);
        setTimeout(() => sopAlertCooldownRef.current.delete(victim.id), 60_000);
        setActiveSopAlert({ id: `sop-battery-${victim.id}`, msg: `${victim.id} battery critically low (${victim.battery}%). SOP-7 violation — mission task blocked. Initiating recall.` });
        setTimeout(() => setActiveSopAlert(null), 5000);
        pushLog({ type: "WARN", msg: `SOP INTERVENTION: ${victim.id} battery ${victim.battery}% — operation suspended` });
      }
    }
  }, [pushLog, revealFog, isLive]);

  return {
    setDrones, setLog, setTargetMarkers,
    drones, activeDrone, setActiveDrone, recalling, newIds, deployCount, flashDeploy,
    log, heartbeat, latency, intelText, setIntelText,
    coverageMap, probabilityMap, fogOfWar, targetMarkers,
    selectedTargetId, setSelectedTargetId,
    encryptActive, recalibrateFlash, abortDialogOpen, setAbortDialogOpen,
    activeSopAlert, setActiveSopAlert,
    deployUnit, recallUnit, cycleSensorMode, startScanSequence, setWaypoint,
    submitIntel, getMeshEdges, tick_update,
    cmdRecalibrate, cmdAbortConfirm, cmdEncrypt, cmdMeshHandshake, pushLog,
    onSelectDroneNavRef, markTargetRescued
  };
}

export type FleetState = ReturnType<typeof useFleet>;