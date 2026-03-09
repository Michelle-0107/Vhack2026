import { AI_CYAN, HUMAN_MAG } from "./constants";

let logIdCounter = 5;

export function nowStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

export function makeLog(type, msg) {
  return { id: logIdCounter++, time: nowStr(), type, msg };
}

export function rnd(a, b) { return a + Math.random() * (b - a); }
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export function droneColor(mode) {
  return mode === "MANUAL" ? HUMAN_MAG : AI_CYAN;
}

export function initDronePhysics(drone) {
  return {
    ...drone,
    trail: [],
    vx: (Math.random() - 0.5) * 0.065,
    vy: (Math.random() - 0.5) * 0.065,
    healTarget: null,
    color: droneColor(drone.mode),
  };
}
