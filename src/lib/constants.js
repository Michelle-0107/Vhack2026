// ─────────────────────────── THEME COLORS ────────────────────────────────────
export const AI_CYAN = "#00f5ff";
export const HUMAN_MAG = "#ff00cc";
export const WARN_AMB = "#ffaa00";
export const CRIT_RED = "#ff3355";
export const OK_GREEN = "#00ff88";

export const MAX_FLEET = 10;

export const MISSION = {
  sector: "7G-NORTH",
  lat: "34.0522° N",
  lon: "118.2437° W"
};

export const NAMES = [
  "ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO",
  "FOXTROT", "GOLF", "HOTEL", "INDIA", "JULIET",
];

export const SIGS = ["EXCELLENT", "GOOD", "GOOD", "INTERMITTENT", "WEAK"];

export const BASE_DRONES = [
  { id: "U-01", name: "ALPHA", battery: 89, alt: 120, spd: 42, sig: "EXCELLENT", relay: "ACTIVE", x: 22, y: 24, mode: "AUTO", isRelay: true },
  { id: "U-02", name: "BRAVO", battery: 74, alt: 115, spd: 38, sig: "GOOD", relay: "STANDBY", x: 50, y: 18, mode: "AUTO", isRelay: true },
  { id: "U-03", name: "CHARLIE", battery: 42, alt: 122, spd: 45, sig: "INTERMITTENT", relay: "WARNING", x: 76, y: 26, mode: "AUTO", isRelay: false },
  { id: "U-04", name: "DELTA", battery: 14, alt: 98, spd: 22, sig: "WEAK", relay: "RE-ROUTING", x: 85, y: 55, mode: "MANUAL", isRelay: false },
  { id: "U-05", name: "ECHO", battery: 61, alt: 135, spd: 51, sig: "GOOD", relay: "ACTIVE", x: 60, y: 72, mode: "AUTO", isRelay: true },
  { id: "U-06", name: "FOXTROT", battery: 67, alt: 118, spd: 36, sig: "GOOD", relay: "ACTIVE", x: 34, y: 68, mode: "AUTO", isRelay: true },
];

export const TYPE_META = {
  SUCCESS: { color: "#00ff88", bg: "rgba(0,255,136,0.06)", border: "rgba(0,255,136,0.2)" },
  INFO: { color: "#7ecfff", bg: "transparent", border: "transparent" },
  ANALYSIS: { color: "#00f5ff", bg: "rgba(0,245,255,0.05)", border: "rgba(0,245,255,0.15)" },
  DECISION: { color: "#ff3355", bg: "rgba(255,51,85,0.07)", border: "rgba(255,51,85,0.28)" },
  ACTION: { color: "#aaffee", bg: "transparent", border: "transparent" },
  MANUAL: { color: "#ff00cc", bg: "rgba(255,0,204,0.07)", border: "rgba(255,0,204,0.28)" },
  RECALL: { color: "#ffaa00", bg: "rgba(255,170,0,0.07)", border: "rgba(255,170,0,0.28)" },
  COT: { color: "#00f5ff", bg: "rgba(0,245,255,0.04)", border: "rgba(0,245,255,0.12)" },
  HEAL: { color: "#00ff88", bg: "rgba(0,255,136,0.06)", border: "rgba(0,255,136,0.22)" },
  PROMPT: { color: "#ffdd55", bg: "rgba(255,221,85,0.06)", border: "rgba(255,221,85,0.2)" },
  WARNING: { color: "#ffaa00", bg: "rgba(255,170,0,0.07)", border: "rgba(255,170,0,0.25)" },
};

export const INITIAL_LOG = [
  { id: 0, time: "08:42:10", type: "SUCCESS", msg: "Llama-3.2 initialized on local NPU. MCP bridge online." },
  { id: 1, time: "08:42:11", type: "INFO", msg: "Scanning MCP tool registry... 14 tools registered." },
  { id: 2, time: "08:42:12", type: "ANALYSIS", msg: "Mesh topology stable. 5 nodes, 8 active relay links." },
  { id: 3, time: "08:42:16", type: "WARNING", msg: "U-04 (DELTA) battery critical: 14%. Estimated 6 min flight time." },
  { id: 4, time: "08:42:18", type: "DECISION", msg: "AI recommends immediate RECALL of U-04. Coverage gap: GRID-8B." },
];
