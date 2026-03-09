"use client";
import { create } from "zustand";
import {
  BASE_DRONES, INITIAL_LOG, NAMES, SIGS,
  MAX_FLEET, AI_CYAN, HUMAN_MAG,
} from "@/lib/constants";
import { makeLog, nowStr, rnd, clamp, initDronePhysics, droneColor } from "@/lib/utils";

// ── Seed physics onto base drones ────────────────────────────────────────────
const seedDrones = BASE_DRONES.map(initDronePhysics);

export const useFleetStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  drones: seedDrones,
  log: INITIAL_LOG,
  recalling: new Set(),      // Set of drone IDs mid-recall
  newIds: new Set(),      // Set of freshly-deployed drone IDs
  healingLinks: new Set(),      // Set of active heal-link keys
  activeDrone: null,           // currently selected drone id
  deployCount: BASE_DRONES.length,
  intelText: "",
  tick: 0,
  latency: 11.8,
  sigBars: [55, 70, 48, 82, 90, 65, 44, 78, 92, 58, 71, 85],
  flashDeploy: false,

  // ─── UI helpers ───────────────────────────────────────────────────────────
  setActiveDrone: (id) => set({ activeDrone: id }),
  setIntelText: (v) => set({ intelText: v }),

  pushLog: (...entries) =>
    set((s) => ({ log: [...s.log, ...entries] })),

  // ─── Map Links ────────────────────────────────────────────────────────────
  getMeshEdges: () => {
    const { drones } = get();
    const edges = [];
    for (let i = 0; i < drones.length; i++) {
      for (let j = i + 1; j < drones.length; j++) {
        const a = drones[i];
        const b = drones[j];
        if (!a.isRelay && !b.isRelay) continue; // Must be at least 1 relay
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 42) {
          edges.push({
            key: `${a.id}-${b.id}`,
            a, b, dist,
            isHuman: a.mode === "MANUAL" || b.mode === "MANUAL"
          });
        }
      }
    }
    return edges;
  },

  // ─── Tick: movement · battery drain · heal-move ───────────────────────────
  tick_update: () => {
    set((s) => {
      const drones = s.drones.map((d) => {
        let nx = d.x + d.vx, ny = d.y + d.vy;
        let nvx = (nx < 10 || nx > 92) ? -d.vx : d.vx + (Math.random() - 0.5) * 0.012;
        let nvy = (ny < 10 || ny > 88) ? -d.vy : d.vy + (Math.random() - 0.5) * 0.012;

        if (d.healTarget) {
          const dx = d.healTarget.x - d.x, dy = d.healTarget.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 2) { nvx += dx / dist * 0.06; nvy += dy / dist * 0.06; }
          else { nvx = d.vx; nvy = d.vy; }
        }

        const trail = [...(d.trail || []), { x: d.x, y: d.y }].slice(-8);
        const battery = Math.max(1, d.battery - (Math.random() < 0.004 ? 1 : 0));

        return {
          ...d,
          x: clamp(nx, 10, 92), y: clamp(ny, 10, 88),
          vx: clamp(nvx, -0.14, 0.14), vy: clamp(nvy, -0.14, 0.14),
          trail, battery,
        };
      });

      const latency = clamp(s.latency + (Math.random() - 0.5) * 0.35, 7, 30);
      const sigBars = [...s.sigBars.slice(1), Math.floor(rnd(35, 96))];

      return { drones, latency, sigBars, tick: s.tick + 1 };
    });
  },

  // ─── DEPLOY UNIT (manual) ─────────────────────────────────────────────────
  deployUnit: () => {
    const { deployCount, pushLog } = get();
    if (deployCount >= MAX_FLEET) return;

    const idx = deployCount;
    const newId = `U-${String(idx + 1).padStart(2, "0")}`;
    const name = NAMES[idx];
    const battery = Math.floor(rnd(55, 92));
    const sig = SIGS[Math.floor(Math.random() * SIGS.length)];

    const newDrone = {
      id: newId, name, battery,
      alt: Math.floor(rnd(95, 155)), spd: Math.floor(rnd(30, 58)),
      sig, relay: "ACTIVE",
      x: rnd(14, 88), y: rnd(14, 84),
      mode: "MANUAL", isRelay: false,
      trail: [], vx: (Math.random() - 0.5) * 0.065,
      vy: (Math.random() - 0.5) * 0.065,
      healTarget: null, color: HUMAN_MAG,
    };

    set((s) => ({
      drones: [...s.drones, newDrone],
      deployCount: s.deployCount + 1,
      newIds: new Set([...s.newIds, newId]),
      flashDeploy: true,
    }));

    pushLog(
      makeLog("MANUAL", `[HUMAN] ${newId} (${name}) manually deployed. Survivor sighting at grid ${Math.floor(rnd(10, 99))}-X.`),
      makeLog("COT", `CoT: Detected new node ${newId} inserted by operator. Re-computing mesh coverage...`),
      makeLog("ANALYSIS", `Mesh expanded: +${Math.floor(rnd(12, 22))}% coverage area. Relay path updated.`),
    );

    setTimeout(() => set({ flashDeploy: false }), 800);
    setTimeout(() => set((s) => { const n = new Set(s.newIds); n.delete(newId); return { newIds: n }; }), 3000);
  },

  // ─── RECALL UNIT ──────────────────────────────────────────────────────────
  recallUnit: (id) => {
    const { drones, recalling, activeDrone, pushLog } = get();
    const drone = drones.find((d) => d.id === id);
    if (!drone || recalling.has(id)) return;

    set((s) => ({ recalling: new Set([...s.recalling, id]) }));

    pushLog(makeLog("RECALL", `[HUMAN] RECALL issued: ${id} (${drone.name}). Battery: ${drone.battery}%. RTB initiated.`));

    setTimeout(() => {
      set((s) => {
        const remaining = s.drones.filter((d) => d.id !== id);
        let updatedDrones = remaining;
        let extraLogs = [];

        if (drone.isRelay && remaining.length >= 2) {
          const sorted = [...remaining].sort((a, b) => {
            const da = Math.sqrt((a.x - drone.x) ** 2 + (a.y - drone.y) ** 2);
            const db = Math.sqrt((b.x - drone.x) ** 2 + (b.y - drone.y) ** 2);
            return da - db;
          });
          const healer = sorted[0];
          const target = {
            x: (drone.x + healer.x) / 2 + rnd(-8, 8),
            y: (drone.y + healer.y) / 2 + rnd(-8, 8),
          };

          updatedDrones = remaining.map((d) =>
            d.id === healer.id
              ? { ...d, healTarget: target, isRelay: true, color: AI_CYAN, mode: "AUTO" }
              : d
          );

          const linkKey = `${healer.id}-heal`;
          const newHealLinks = new Set([...s.healingLinks, linkKey]);

          setTimeout(() => {
            set((st) => { const n = new Set(st.healingLinks); n.delete(linkKey); return { healingLinks: n }; });
          }, 4000);
          setTimeout(() => {
            set((st) => ({ drones: st.drones.map((d) => d.id === healer.id ? { ...d, healTarget: null } : d) }));
          }, 5000);
          setTimeout(() => {
            get().pushLog(makeLog("HEAL", `SELF-HEAL COMPLETE: ${healer.id} reached gap position. Mesh signal restored. Coverage: ${Math.floor(rnd(94, 100))}%.`));
          }, 4200);

          extraLogs = [
            makeLog("COT", `CoT: ${id} removed. Analyzing coverage gap at (${drone.x.toFixed(0)},${drone.y.toFixed(0)})...`),
            makeLog("COT", `CoT: Nearest relay candidate: ${healer.id} (${healer.name}). Distance: ${Math.sqrt((healer.x - drone.x) ** 2 + (healer.y - drone.y) ** 2).toFixed(1)} units.`),
            makeLog("DECISION", `AI: Repositioning ${healer.id} → gap sector. Promoting to RELAY node.`),
            makeLog("ACTION", `Transmitting new waypoint to ${healer.id}. ETA: ${Math.floor(rnd(18, 40))}s.`),
          ];

          const newRecalling = new Set(s.recalling);
          newRecalling.delete(id);

          return {
            drones: updatedDrones, deployCount: remaining.length,
            recalling: newRecalling, healingLinks: newHealLinks,
            activeDrone: s.activeDrone === id ? null : s.activeDrone,
            log: [...s.log, ...extraLogs],
          };
        } else {
          extraLogs = [
            makeLog("COT", `CoT: ${id} removed. Non-relay unit — no coverage gap detected.`),
            makeLog("ANALYSIS", `Mesh integrity maintained. ${remaining.length} nodes active.`),
          ];
          const newRecalling = new Set(s.recalling);
          newRecalling.delete(id);
          return {
            drones: updatedDrones, deployCount: remaining.length,
            recalling: newRecalling,
            activeDrone: s.activeDrone === id ? null : s.activeDrone,
            log: [...s.log, ...extraLogs],
          };
        }
      });
    }, 1200);
  },

  // ─── TOGGLE MODE (AUTO ↔ MANUAL) ──────────────────────────────────────────
  toggleMode: (id) => {
    const { drones, pushLog } = get();
    const drone = drones.find((d) => d.id === id);
    if (!drone) return;
    const newMode = drone.mode === "AUTO" ? "MANUAL" : "AUTO";
    set((s) => ({
      drones: s.drones.map((d) =>
        d.id !== id ? d : { ...d, mode: newMode, color: droneColor(newMode) }
      ),
    }));
    pushLog(makeLog(
      newMode === "MANUAL" ? "MANUAL" : "ACTION",
      `${id} mode → ${newMode}. ${newMode === "MANUAL" ? "Human operator assumed control." : "Returned to AI autonomy."}`,
    ));
  },

  // ─── SUBMIT INTEL ─────────────────────────────────────────────────────────
  submitIntel: () => {
    const { intelText, drones, pushLog } = get();
    if (!intelText.trim()) return;
    pushLog(
      makeLog("PROMPT", intelText.trim()),
      makeLog("COT", `CoT: Processing operator intel. Cross-referencing with swarm telemetry, thermal data, and grid map...`),
      makeLog("ACTION", `Intel logged. Adjusting patrol priorities for ${drones.length} active units.`),
    );
    set({ intelText: "" });
  },

  // ─── UPDATE TELEMETRY (WebSocket-ready hook) ──────────────────────────────
  // Call this from a WebSocket onmessage handler: store.updateTelemetry(payload)
  updateTelemetry: (payload) => {
    // payload: { id, battery, alt, spd, sig, x, y }
    set((s) => ({
      drones: s.drones.map((d) =>
        d.id === payload.id ? { ...d, ...payload } : d
      ),
    }));
  },
}));
