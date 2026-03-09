"use client";
import { create } from "zustand";
import {
  BASE_DRONES, INITIAL_LOG, NAMES, SIGS,
  MAX_FLEET, AI_CYAN, HUMAN_MAG
} from "@/lib/constants";
import { makeLog, rnd, clamp, initDronePhysics, droneColor } from "@/lib/utils";

/**
 * BEACON-NET Fleet Store
 * - Holds simulated swarm state (positions, links, logs)
 * - Runs a lightweight physics step (invoked at 10Hz by the map)
 * - Implements CoT-style self-healing when relay nodes are recalled
 */
const seedDrones = BASE_DRONES.map(initDronePhysics);

export const useFleetStore = create((set, get) => ({
  // Core state
  drones: seedDrones,
  log: INITIAL_LOG,
  recalling: new Set(),       
  newIds: new Set(),          
  healingLinks: new Set(),    
  activeDrone: null,          
  deployCount: BASE_DRONES.length,
  intelText: "",
  tick: 0,
  latency: 11.8,
  sigBars: [55, 70, 48, 82, 90, 65, 44, 78, 92, 58, 71, 85],
  flashDeploy: false,

  // UI actions
  setActiveDrone: (id) => set({ activeDrone: id }),
  setIntelText: (v) => set({ intelText: v }),
  pushLog: (...entries) => set((s) => ({ log: [...s.log, ...entries] })),

  // Mesh networking
  getMeshEdges: () => {
    const { drones, activeDrone } = get();
    const edges = [];
    for (let i = 0; i < drones.length; i++) {
      for (let j = i + 1; j < drones.length; j++) {
        const a = drones[i];
        const b = drones[j];
        
        // At least one must be a relay to form a link
        if (!a.isRelay && !b.isRelay) continue; 
        
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Maximum transmission range: 45 units
        if (dist < 45) {
          edges.push({
            key: `${a.id}-${b.id}`,
            a, b, dist,
            isHuman: a.mode === "MANUAL" || b.mode === "MANUAL",
            isHighlit: activeDrone === a.id || activeDrone === b.id
          });
        }
      }
    }
    return edges;
  },

  // Heartbeat: physics, battery, trails
  tick_update: () => {
    set((s) => {
      const drones = s.drones.map((d) => {
        let nx = d.x + d.vx, ny = d.y + d.vy;
        
        // 1) Boundary physics (bounce at edges)
        let nvx = (nx < 10 || nx > 92) ? -d.vx : d.vx + (Math.random() - 0.5) * 0.012;
        let nvy = (ny < 10 || ny > 88) ? -d.vy : d.vy + (Math.random() - 0.5) * 0.012;

        // 2) Self-healing navigation: nudge toward the healing waypoint
        if (d.healTarget) {
          const dx = d.healTarget.x - d.x, dy = d.healTarget.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 2) { 
            nvx += dx / dist * 0.06; 
            nvy += dy / dist * 0.06; 
          } else {
            nvx = d.vx; nvy = d.vy;
          }
        }

        // 3) Trail history for the ghosting effect (last 8 points)
        const trail = [...(d.trail || []), { x: d.x, y: d.y }].slice(-8);
        
        // 4) Random battery depletion
        const battery = Math.max(1, d.battery - (Math.random() < 0.004 ? 1 : 0));

        return {
          ...d,
          x: clamp(nx, 10, 92), y: clamp(ny, 10, 88),
          vx: clamp(nvx, -0.14, 0.14), vy: clamp(nvy, -0.14, 0.14),
          trail, battery,
        };
      });

      // Update telemetry noise
      const latency = clamp(s.latency + (Math.random() - 0.5) * 0.35, 7, 30);
      const sigBars = [...s.sigBars.slice(1), Math.floor(rnd(35, 96))];

      return { drones, latency, sigBars, tick: s.tick + 1 };
    });
  },

  // Deployment
  deployUnit: () => {
    const { deployCount, pushLog } = get();
    if (deployCount >= MAX_FLEET) return;

    const idx = deployCount;
    const newId = `U-${String(idx + 1).padStart(2, "0")}`;
    const name = NAMES[idx];
    
    const newDrone = {
      id: newId, name, 
      battery: Math.floor(rnd(75, 95)),
      alt: Math.floor(rnd(95, 155)), 
      spd: Math.floor(rnd(30, 58)),
      sig: "EXCELLENT", relay: "ACTIVE",
      x: rnd(14, 88), y: rnd(14, 84),
      mode: "MANUAL", isRelay: false,
      trail: [], vx: (Math.random() - 0.5) * 0.065,
      vy: (Math.random() - 0.5) * 0.065,
      healTarget: null, color: HUMAN_MAG,
      sensorRadius: Math.floor(rnd(20, 28)),
    };

    set((s) => ({
      drones: [...s.drones, newDrone],
      deployCount: s.deployCount + 1,
      newIds: new Set([...s.newIds, newId]),
      flashDeploy: true,
    }));

    pushLog(
      makeLog("MANUAL", `[OPERATOR] ${newId} deployed. survivor search in Sector 7G.`),
      makeLog("COT", `CoT: Integrating new node ${newId}. Optimizing mesh...`),
      makeLog("ANALYSIS", `Grid expansion verified. +18% signal redundancy.`)
    );

    setTimeout(() => set({ flashDeploy: false }), 800);
    setTimeout(() => set((s) => { 
      const n = new Set(s.newIds); n.delete(newId); 
      return { newIds: n }; 
    }), 3000);
  },

  // Recall protocol with CoT-style self-healing
  recallUnit: (id) => {
    const { drones, recalling, pushLog } = get();
    const recalled = drones.find((d) => d.id === id);
    if (!recalled || recalling.has(id)) return;

    set((s) => ({ recalling: new Set([...s.recalling, id]) }));
    pushLog(makeLog("RECALL", `[HUMAN] RTB order issued to ${id}. Swapping to recovery mode.`));

    setTimeout(() => {
      const snapshot = get();
      const current = snapshot.drones;
      const toRemove = current.find((d) => d.id === id);
      if (!toRemove) {
        set((s) => ({ recalling: new Set([...s.recalling].filter((x) => x !== id)) }));
        return;
      }

      const remaining = current.filter((d) => d.id !== id);
      const shouldHeal = !!toRemove.isRelay && remaining.length >= 2;
      if (!shouldHeal) {
        set((s) => ({
          drones: remaining,
          deployCount: remaining.length,
          recalling: new Set([...s.recalling].filter((x) => x !== id)),
          activeDrone: s.activeDrone === id ? null : s.activeDrone,
        }));
        return;
      }

      const healer = remaining.reduce((best, d) => {
        if (!best) return d;
        const da = Math.sqrt((d.x - toRemove.x) ** 2 + (d.y - toRemove.y) ** 2);
        const db = Math.sqrt((best.x - toRemove.x) ** 2 + (best.y - toRemove.y) ** 2);
        return da < db ? d : best;
      }, null);

      if (!healer) {
        set((s) => ({
          drones: remaining,
          deployCount: remaining.length,
          recalling: new Set([...s.recalling].filter((x) => x !== id)),
          activeDrone: s.activeDrone === id ? null : s.activeDrone,
        }));
        return;
      }

      const target = {
        x: (toRemove.x + healer.x) / 2 + rnd(-5, 5),
        y: (toRemove.y + healer.y) / 2 + rnd(-5, 5),
      };

      const linkKey = `${healer.id}-heal-${id}`;

      set((s) => ({
        drones: remaining.map((d) =>
          d.id === healer.id
            ? { ...d, healTarget: target, isRelay: true, color: AI_CYAN, mode: "AUTO" }
            : d
        ),
        deployCount: remaining.length,
        recalling: new Set([...s.recalling].filter((x) => x !== id)),
        healingLinks: new Set([...s.healingLinks, linkKey]),
        activeDrone: s.activeDrone === id ? null : s.activeDrone,
        log: [
          ...s.log,
          makeLog("COT", `CoT: Critical relay ${id} lost. Coverage gap detected.`),
          makeLog("DECISION", `AI: Rerouting ${healer.id} to maintain mesh coverage.`),
          makeLog("ACTION", `Uploading new flight plan to ${healer.id}...`),
        ],
      }));

      setTimeout(() => {
        const st = get();
        if (!st.healingLinks.has(linkKey)) return;
        st.pushLog(makeLog("HEAL", `SELF-HEAL COMPLETE: ${healer.id} has filled the gap. Mesh integrity optimal.`));
        set((s) => ({
          healingLinks: new Set([...s.healingLinks].filter((k) => k !== linkKey)),
          drones: s.drones.map((d) => (d.id === healer.id ? { ...d, healTarget: null } : d)),
        }));
      }, 4200);
    }, 1200);
  },

  // Hybrid control
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
      `${id} switched to ${newMode} mode.`
    ));
  },

  submitIntel: () => {
    const { intelText, pushLog } = get();
    if (!intelText.trim()) return;
    pushLog(
      makeLog("PROMPT", intelText.trim()),
      makeLog("COT", `CoT: Cross-referencing intel with satellite imagery...`),
      makeLog("ACTION", `Search parameters updated based on human input.`)
    );
    set({ intelText: "" });
  },
}));
