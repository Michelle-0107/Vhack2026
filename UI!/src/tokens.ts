// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
export const AI_CYAN = "#33faff";
export const HUMAN_MAG = "#ff00cc";
export const OK_GREEN = "#00ff88";
export const WARN_AMB = "#ffaa00";
export const CRIT_RED = "#ff3355";

export const LABEL_PRIMARY = "#FFFFFF";
export const LABEL_SECONDARY = "#E0FFFF";
export const LABEL_GLOW = `0 0 5px rgba(0,245,255,0.5)`;

export const MAX_FLEET = 10;
export const MISSION = { sector: "ALPHA-7G", lat: "36.7749° N", lon: "119.4194° W" };

// ── MAP STATE COLORS ──────────────────────────────────────────────────────
export const MAP_COLOR = {
  scannedNoTarget: { fill: "rgba(30,100,255,0.38)", stroke: "rgba(30,100,255,0.70)", hex: "#1e64ff" },
  probableTarget: { fill: "rgba(255,130,0,0.42)", stroke: "rgba(255,130,0,0.75)", hex: "#ff8200" },
  targetConfirmed: { fill: "rgba(255,30,50,0.52)", stroke: "rgba(255,30,50,0.85)", hex: "#ff1e32" },
} as const;

// ── DRONE COLOR PALETTE ───────────────────────────────────────────────────
export const DRONE_PALETTE = [
  "#33faff", "#00ff88", "#ff8800", "#cc44ff",
  "#ffee00", "#ff00cc", "#4488ff", "#aaff00",
  "#ff7755", "#00ffcc", "#ffbb00", "#8866ff",
];

// ── WORLD COORDINATE SYSTEM ───────────────────────────────────────────────
export const WORLD_W = 5000;
export const WORLD_H = 5000;
export const WORLD_CENTER = { x: 2500, y: 2500 };
export const BASE_STATION_COORD = { x: WORLD_W / 2, y: WORLD_H / 2 };
export const MISSION_RADIUS = 2200;
export const DRONE_SPEED = 8;
export const SCAN_RADIUS_WORLD = 280;
export const GRID_CELL = 50;
export const GRID_W = Math.ceil(WORLD_W / GRID_CELL);
export const GRID_H = Math.ceil(WORLD_H / GRID_CELL);
export const BATTERY_DRAIN_PER_TICK = 0.006;
export const BATTERY_MIN = 5;
export const TRACK_LERP = 0.09;
export const DEFAULT_ZOOM = 0.8;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 8.0;
export const MAX_PINNED = 3;

// ── SENSOR MODES ──────────────────────────────────────────────────────────
export const SENSOR_MODES = ["RADIO FREQUENCY", "THERMAL IMAGING", "COMPUTER VISION"];
export const SENSOR_SHORT: Record<string, string> = {
  "RADIO FREQUENCY": "RF", "THERMAL IMAGING": "THER", "COMPUTER VISION": "CV",
};
export const SENSOR_COLOR: Record<string, string> = {
  "RADIO FREQUENCY": "#ff00cc", "THERMAL IMAGING": "#ff4400", "COMPUTER VISION": "#00ff88",
};

// ── LOG TYPE META ─────────────────────────────────────────────────────────
export const TYPE_META: Record<string, { color: string; bg: string; border: string }> = {
  INFO: { color: AI_CYAN, bg: "rgba(0,245,255,0.04)", border: `${AI_CYAN}18` },
  WARN: { color: WARN_AMB, bg: "rgba(255,170,0,0.09)", border: `${WARN_AMB}44` },
  CRIT: { color: CRIT_RED, bg: "rgba(255,51,85,0.12)", border: `${CRIT_RED}55` },
  MANUAL: { color: HUMAN_MAG, bg: "rgba(255,0,204,0.09)", border: `${HUMAN_MAG}44` },
  RECALL: { color: WARN_AMB, bg: "rgba(255,170,0,0.09)", border: `${WARN_AMB}44` },
  DECISION: { color: "#ff9aaa", bg: "rgba(255,100,120,0.09)", border: "#ff9aaa44" },
  COT: { color: AI_CYAN, bg: "rgba(0,245,255,0.07)", border: `${AI_CYAN}33` },
  HEAL: { color: OK_GREEN, bg: "rgba(0,255,136,0.09)", border: `${OK_GREEN}44` },
  PROMPT: { color: "#ffee88", bg: "rgba(255,238,136,0.09)", border: "#ffee8844" },
  ANALYSIS: { color: AI_CYAN, bg: "rgba(0,245,255,0.07)", border: `${AI_CYAN}28` },
  DEPLOY: { color: OK_GREEN, bg: "rgba(0,255,136,0.11)", border: `${OK_GREEN}55` },
  HUMAN: { color: HUMAN_MAG, bg: "rgba(255,0,204,0.15)", border: `${HUMAN_MAG}77` },
  BOUNDARY: { color: CRIT_RED, bg: "rgba(255,51,85,0.10)", border: `${CRIT_RED}44` },
  CMD: { color: "#ffee88", bg: "rgba(255,238,136,0.11)", border: "#ffee8855" },
};

// ── MULTI-AGENT CONFIG ────────────────────────────────────────────────────
export const AGENT_CONFIG = {
  PLANNER: { label: "Planner", icon: "🧠", color: "#00FFFF", short: "PLN" },
  SOP: { label: "SOP Expert", icon: "📜", color: "#FFD700", short: "SOP" },
  CMD: { label: "Commander", icon: "🎯", color: "#FF6B6B", short: "CMD" },
  SYS: { label: "System", icon: "⚙️", color: "#aaaaaa", short: "SYS" },
} as const;

export const AGENT_CONVERSATION_POOL: Array<{ sender: keyof typeof AGENT_CONFIG; msg: string }> = [
  { sender: "PLANNER", msg: "Analyzing grid sector 7G. Thermal anomaly detected in NE quadrant — recommend deploying closest drone for scan." },
  { sender: "SOP", msg: "Rule validation in progress. Checking battery and airspace constraints before authorising operation." },
  { sender: "CMD", msg: "Approved. Redirecting nearest unit to NE quadrant. Initiating multi-phase scan sequence." },
  { sender: "SYS", msg: "Waypoint transmitted. ETA 14 seconds. Sensor array: RF → THER → CV pipeline armed." },
  { sender: "PLANNER", msg: "Coverage gap identified: SW corridor unscanned. Probability surface suggests survivor likelihood 34%." },
  { sender: "SOP", msg: "SOP-12 mandates dual-sensor confirmation before target classification. Enforcing protocol." },
  { sender: "CMD", msg: "Acknowledged. Assigning secondary drone to SW corridor. Maintain 200m separation for mesh integrity." },
  { sender: "SYS", msg: "Mesh relay re-balanced. 8 active nodes. Link latency nominal." },
  { sender: "PLANNER", msg: "Updated survivor probability map pushed to all units. Prioritising grid cells with confidence > 60%." },
  { sender: "SOP", msg: "Battery threshold alert — DR-003 at 22%. SOP-7 requires recall before reaching 20%. Initiating RTB." },
  { sender: "CMD", msg: "DR-003 recalled. Deploying DR-008 from base to maintain coverage ratio above 70%." },
  { sender: "SYS", msg: "DR-008 airborne. Formation recalibrated. Swarm coherence: STRONG." },
  { sender: "PLANNER", msg: "Cross-referencing RF signatures with thermal baseline. Two candidate signatures isolated for CV confirmation." },
  { sender: "SOP", msg: "CV lock requires 3-frame persistence before HUMAN classification. Monitoring." },
  { sender: "CMD", msg: "Target TGT-001 confirmed. Extraction team alerted. Drone holding position for rescue coordination." },
  { sender: "SYS", msg: "Rescue coordination signal broadcast on local mesh. All units acknowledge." },
];

export const LOG_POOL = [
  { type: "INFO", msg: "Local mesh topology updated — 4 relay nodes active" },
  { type: "COT", msg: "Route optimisation: avoid thermal column at sector NE" },
  { type: "DECISION", msg: "Rerouted to avoid collision corridor" },
  { type: "WARN", msg: "Battery threshold warning — unit at 28%" },
  { type: "ANALYSIS", msg: "Coverage gap detected: NE quadrant needs relay node" },
  { type: "INFO", msg: "Local mesh link re-established between swarm units" },
  { type: "COT", msg: "Survivor probability map updated — sector 7G-NE" },
  { type: "INFO", msg: "Swarm formation recalibrated for wind compensation" },
  { type: "ANALYSIS", msg: "Thermal anomaly cluster detected in grid sector" },
  { type: "HEAL", msg: "Self-healing mesh rerouted through local relay unit" },
  { type: "WARN", msg: "Mesh link intermittent — switching local relay path" },
];

export const SIG_LEVELS = ["EXCELLENT", "GOOD", "INTERMITTENT", "WEAK"];
