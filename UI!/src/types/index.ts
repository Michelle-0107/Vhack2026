import type { AGENT_CONFIG } from "../tokens";

export type AgentSender = keyof typeof AGENT_CONFIG;

export interface Drone {
  id: string; colour: string;
  x: number; y: number; vx: number; vy: number;
  batteryFloat: number; battery: number;
  alt: number; spd: number; sig: string;
  mode: "AUTO" | "MANUAL";
  relay: string; isRelay: boolean; sensorMode: string;
  isScanning: boolean; scanPhase: number;
  trail: { x: number; y: number }[];
  humanDetected: boolean; outOfBounds: boolean;
  waypoint: { wx: number; wy: number } | null;
  recalibrating: boolean; abortingToCenter: boolean;
  status: "CHARGING" | "DEPLOYED";
}

export interface TargetMarker {
  id: string; droneId: string;
  wx: number; wy: number;
  confidence: number; time: string; type: string;
  isRescued: boolean;
  rescueTime: string;
}

export interface LogEntryData {
  id: string;
  type: string;
  msg: string;
  time: string;
  sender?: AgentSender;
}

export interface Camera { x: number; y: number; zoom: number; }

export interface PinnedEntry {
  id: string;
  sender: "SOP" | "COMMANDER" | "SYSTEM";
  msg: string;
  time: string;
  pinnedAt: number;
}

export interface MeshEdge {
  key: string; ax: number; ay: number; bx: number; by: number;
  ca: string; cb: string; linkState: "STRONG" | "WEAK" | "BROKEN"; isRelay: boolean;
}

export interface MissionState {
  drones: Drone[];
  log: LogEntryData[];
  targetMarkers: TargetMarker[];
  coverageMap: Map<number, number>;
  probabilityMap: Map<number, number>;
  fogOfWar: Set<number>;
  latency: number;
  heartbeat: number[];
  activeDrone: string | null;
  recalling: Set<string>;
  newIds: Set<string>;
  deployCount: number;
  flashDeploy: boolean;
  intelText: string;
  selectedTargetId: string | null;
  encryptActive: boolean;
  recalibrateFlash: boolean;
  abortDialogOpen: boolean;
  activeSopAlert: { id: string; msg: string } | null;
}
