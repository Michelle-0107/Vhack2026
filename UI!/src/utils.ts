import { GRID_CELL, GRID_W, GRID_H, DRONE_PALETTE, WORLD_CENTER, BASE_STATION_COORD, DRONE_SPEED, SIG_LEVELS, SENSOR_MODES, AI_CYAN, WARN_AMB, CRIT_RED, OK_GREEN, HUMAN_MAG } from "./tokens";
import type { Drone, Camera } from "./types";

// ── ID generators ──────────────────────────────────────────────────────────
let _uid = 0;
let _colourIdx = 0;
let _markerId = 0;

export const uid          = () => `DR-${String(++_uid).padStart(3, "0")}`;
export const logId        = () => `log-${Date.now()}-${Math.random()}`;
export const makeMarkerId = () => `TGT-${String(++_markerId).padStart(3, "0")}`;
export const assignDroneColour = () => DRONE_PALETTE[_colourIdx++ % DRONE_PALETTE.length];

// ── Math helpers ───────────────────────────────────────────────────────────
export const rand   = (a: number, b: number) => Math.random() * (b - a) + a;
export const clamp  = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const now8   = () => new Date().toTimeString().slice(0, 8);
export const dist2d = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);
export const lerp   = (a: number, b: number, t: number) => a + (b - a) * t;
export const knotsToKmh = (kn: number) => Math.round(kn * 1.852);

// ── Coordinate system ──────────────────────────────────────────────────────
export const worldToScreen = (
  wx: number, wy: number,
  camera: Camera,
  screenW: number, screenH: number
) => ({
  sx: (wx - camera.x) / camera.zoom + screenW / 2,
  sy: (wy - camera.y) / camera.zoom + screenH / 2,
});

export const screenToWorld = (
  sx: number, sy: number,
  camera: Camera,
  screenW: number, screenH: number
) => ({
  wx: (sx - screenW / 2) * camera.zoom + camera.x,
  wy: (sy - screenH / 2) * camera.zoom + camera.y,
});

// ── Spatial helpers ────────────────────────────────────────────────────────
export const cellIndex = (wx: number, wy: number) => {
  const col = clamp(Math.floor(wx / GRID_CELL), 0, GRID_W - 1);
  const row = clamp(Math.floor(wy / GRID_CELL), 0, GRID_H - 1);
  return row * GRID_W + col;
};

export const cellsInRadius = (wx: number, wy: number, radius: number) => {
  const cells: number[] = [];
  const cr   = Math.ceil(radius / GRID_CELL);
  const col0 = clamp(Math.floor(wx / GRID_CELL), 0, GRID_W - 1);
  const row0 = clamp(Math.floor(wy / GRID_CELL), 0, GRID_H - 1);
  for (let dr = -cr; dr <= cr; dr++) {
    for (let dc = -cr; dc <= cr; dc++) {
      const col = col0 + dc, row = row0 + dr;
      if (col < 0 || col >= GRID_W || row < 0 || row >= GRID_H) continue;
      if (dist2d(wx, wy, (col + 0.5) * GRID_CELL, (row + 0.5) * GRID_CELL) <= radius)
        cells.push(row * GRID_W + col);
    }
  }
  return cells;
};

// ── Status helpers ─────────────────────────────────────────────────────────
export function getMeshHealth(n: number) {
  if (n >= 10) return { label: "STRONG",   color: OK_GREEN, level: 4 };
  if (n >= 7)  return { label: "GOOD",     color: AI_CYAN,  level: 3 };
  if (n >= 4)  return { label: "MODERATE", color: WARN_AMB, level: 2 };
  return              { label: "WEAK",     color: CRIT_RED, level: 1 };
}

export function batteryColor(v: number) {
  if (v > 40) return OK_GREEN;
  if (v > 20) return WARN_AMB;
  return CRIT_RED;
}

export function sigStrength(sig: string): number {
  return { EXCELLENT: 4, GOOD: 3, INTERMITTENT: 2, WEAK: 1 }[sig] ?? 0;
}

export function sigColor(sig: string): string {
  return { EXCELLENT: OK_GREEN, GOOD: AI_CYAN, INTERMITTENT: WARN_AMB, WEAK: CRIT_RED }[sig] ?? "#666";
}

export function getDroneBehavior(d: Drone): { label: string; color: string } {
  if (d.status === "CHARGING")    return { label: "CHARGING AT BASE",  color: OK_GREEN  };
  if (d.abortingToCenter)         return { label: "RETURNING TO BASE", color: CRIT_RED  };
  if (d.battery <= 20)            return { label: "LOW BATTERY",       color: CRIT_RED  };
  if (d.isScanning)               return { label: "SCANNING SECTOR",   color: AI_CYAN   };
  if (d.humanDetected)            return { label: "TRACKING TARGET",   color: HUMAN_MAG };
  if (d.outOfBounds)              return { label: "OUT OF BOUNDS",     color: WARN_AMB  };
  if (d.waypoint)                 return { label: "NAVIGATING",        color: WARN_AMB  };
  return                                 { label: "PATROLLING",        color: OK_GREEN  };
}

// ── Drone factory ──────────────────────────────────────────────────────────
export const makeDrone = (initStatus: "CHARGING" | "DEPLOYED" = "CHARGING"): Drone => {
  const isDeployed = initStatus === "DEPLOYED";
  const angle = rand(0, Math.PI * 2), r = rand(100, 800);
  const batteryFloat = isDeployed ? rand(55, 100) : rand(20, 60);
  return {
    id: uid(), colour: assignDroneColour(),
    x: isDeployed ? WORLD_CENTER.x + Math.cos(angle) * r : BASE_STATION_COORD.x,
    y: isDeployed ? WORLD_CENTER.y + Math.sin(angle) * r : BASE_STATION_COORD.y,
    vx: isDeployed ? rand(-DRONE_SPEED, DRONE_SPEED) : 0,
    vy: isDeployed ? rand(-DRONE_SPEED, DRONE_SPEED) : 0,
    batteryFloat, battery: Math.round(batteryFloat),
    alt: rand(80, 250) | 0, spd: rand(12, 60) | 0,
    sig: SIG_LEVELS[Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2],
    mode: "AUTO",
    relay: "ACTIVE", isRelay: Math.random() < 0.4,
    sensorMode: SENSOR_MODES[Math.floor(Math.random() * 3)],
    isScanning: false, scanPhase: 0, trail: [],
    humanDetected: false, outOfBounds: false, waypoint: null,
    recalibrating: false, abortingToCenter: false,
    status: initStatus,
  };
};

// ── Pinned message helpers ─────────────────────────────────────────────────
export const PINNED_KEYWORDS = ["ALERT", "WARNING", "CRITICAL", "LINK LOST"];
export const SOP_STICKY_KEYWORDS = ["intervention", "denied", "blocked"];

export function shouldPin(entry: { sender?: string; type?: string; msg: string }): boolean {
  if (entry.sender === "SOP" || entry.sender === "CMD") return true;
  if (entry.sender === "SYS") return PINNED_KEYWORDS.some(kw => entry.msg.toUpperCase().includes(kw));
  return false;
}

export function normalizePinnedSender(sender?: string): "SOP" | "COMMANDER" | "SYSTEM" | null {
  if (sender === "SOP")     return "SOP";
  if (sender === "CMD")     return "COMMANDER";
  if (sender === "SYS")     return "SYSTEM";
  return null;
}

export function isSystemCritical(msg: string): boolean {
  return PINNED_KEYWORDS.some(kw => msg.toUpperCase().includes(kw));
}

export function hasSopStickyTrigger(msg: string): boolean {
  return SOP_STICKY_KEYWORDS.some(kw => msg.toLowerCase().includes(kw));
}
