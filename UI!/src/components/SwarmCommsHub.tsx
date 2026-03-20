/**
 * src/components/SwarmCommsHub.tsx
 */

import { useState, useRef, useEffect, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AI_CYAN, OK_GREEN, WARN_AMB, CRIT_RED, HUMAN_MAG,
  LABEL_PRIMARY, LABEL_SECONDARY, LABEL_GLOW,
  MAX_FLEET, TYPE_META, AGENT_CONFIG,
} from "../tokens";
import {
  getMeshHealth,
  sigStrength,
  sigColor,
  clamp,
  normalizePinnedSender,
  shouldPin
} from "../utils";
import type { LogEntryData, PinnedEntry, TargetMarker } from "../types";
import type { FleetState } from "../hooks/useFleet";
import { PinnedMessage } from "./logs/PinnedMessage";

const PIN_MAX = 5; // Increased slightly so multiple victims can be pinned at once

function SignalBars({ sig }: { sig: string }) {
  const strength = sigStrength(sig);
  const color = sigColor(sig);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ width: 6, height: Math.round(18 * ((i + 1) / 4)), borderRadius: 2, background: i < strength ? color : `${color}22`, boxShadow: i < strength ? `0 0 4px ${color}88` : "none" }} />
      ))}
    </div>
  );
}

function LegendToggleIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
      <rect x="0.5" y="0.5" width="13" height="13" rx="1.5" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="7" cy="7" r="1.5" fill={color} />
      <circle cx="3.5" cy="7" r="1" fill={color} />
      <circle cx="10.5" cy="7" r="1" fill={color} />
      <circle cx="7" cy="3.5" r="1" fill={color} />
      <circle cx="7" cy="10.5" r="1" fill={color} />
    </svg>
  );
}

function MeshLinkWidget({ latency, droneCount }: { latency: number; droneCount: number }) {
  const health = getMeshHealth(droneCount);
  const latColor = latency < 20 ? OK_GREEN : latency < 30 ? AI_CYAN : latency < 40 ? WARN_AMB : CRIT_RED;
  const sigLevel = latency < 20 ? 4 : latency < 30 ? 3 : latency < 40 ? 2 : 1;
  const sigLabelMap: Record<number, string> = { 4: "EXCELLENT", 3: "GOOD", 2: "INTERMITTENT", 1: "WEAK" };
  const sigLabel = sigLabelMap[sigLevel];
  const isWeak = sigLevel === 1, isWarn = sigLevel === 2;
  return (
    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${AI_CYAN}0e`, flexShrink: 0, background: isWeak ? "rgba(255,51,85,0.08)" : isWarn ? "rgba(255,170,0,0.06)" : "rgba(0,0,0,0.20)", transition: "background 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            {[[2, 7], [7, 2], [12, 7], [7, 12], [7, 7]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="1.5" fill={health.color} opacity={i === 4 ? 1 : 0.9} />)}
            {[[2, 7], [7, 2], [12, 7], [7, 12]].map(([x1, y1], i) => <line key={i} x1={x1} y1={y1} x2="7" y2="7" stroke={health.color} strokeWidth="0.8" opacity="0.55" />)}
          </svg>
          <span style={{ fontSize: 12, letterSpacing: 2, color: LABEL_SECONDARY, fontFamily: "'Roboto Mono',monospace", fontWeight: 600 }}>MESH LINK STATUS</span>
        </div>
        <div style={{ padding: "4px 10px", borderRadius: 5, border: `1px solid ${health.color}55`, background: `${health.color}12`, color: health.color, fontSize: 12, fontFamily: "'Roboto Mono',monospace", letterSpacing: 1.5, fontWeight: 700 }}>{health.label}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SignalBars sig={sigLabel} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 13, color: latColor, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>{sigLabel}</span>
            <span style={{ fontSize: 11, color: LABEL_SECONDARY, opacity: 0.7 }}>MESH COVERAGE</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontFamily: "'Share Tech Mono',monospace", color: latColor, fontWeight: 700, lineHeight: 1, textShadow: `0 0 10px ${latColor}66` }}>{latency.toFixed(1)}<span style={{ fontSize: 14, opacity: 0.65, fontWeight: 400 }}> ms</span></div>
          <div style={{ fontSize: 11, color: LABEL_SECONDARY, opacity: 0.65, marginTop: 4 }}>LINK LATENCY</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 12, fontFamily: "'Roboto Mono',monospace" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: health.color, boxShadow: `0 0 5px ${health.color}`, animation: "humanPulse 2s ease-in-out infinite" }} />
          <span style={{ color: LABEL_PRIMARY, fontWeight: 700, textShadow: LABEL_GLOW }}>{droneCount}<span style={{ color: LABEL_SECONDARY, fontWeight: 400, opacity: 0.55 }}>/{MAX_FLEET}</span><span style={{ color: health.color, fontWeight: 700, marginLeft: 6 }}>NODES ONLINE</span></span>
        </div>
        <span style={{ color: LABEL_SECONDARY, fontWeight: 600 }}>PKT LOSS: <span style={{ color: latency > 40 ? CRIT_RED : latency > 30 ? WARN_AMB : OK_GREEN, fontWeight: 700 }}>{latency > 40 ? "HIGH" : latency > 30 ? "MED" : "NONE"}</span></span>
      </div>
    </div>
  );
}

function LogEntryRow({ item, index }: { item: LogEntryData; index: number }) {
  if (item.sender) {
    const agent = AGENT_CONFIG[item.sender as keyof typeof AGENT_CONFIG];
    if (agent) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}22`, borderRadius: 8, padding: "10px 12px", marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 10 }}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${agent.color}10`, border: `1px solid ${agent.color}55`, fontSize: 14 }}>{agent.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: agent.color, fontFamily: "'Share Tech Mono',monospace", textShadow: `0 0 6px ${agent.color}66` }}>[{agent.short}] {agent.label.toUpperCase()}</span>
              <span style={{ fontSize: 11, color: LABEL_SECONDARY, opacity: 0.5 }}>{item.time}</span>
            </div>
            <div style={{ fontSize: 13, color: LABEL_PRIMARY, lineHeight: 1.55, fontFamily: "'Roboto Mono',monospace", fontWeight: 500 }}>{item.msg}</div>
          </div>
        </motion.div>
      );
    }
  }
  const meta = TYPE_META[item.type] ?? TYPE_META.INFO;
  const isEven = index % 2 === 0;
  const isHuman = item.type === "HUMAN";
  const msgColor = isHuman ? HUMAN_MAG : item.type === "DECISION" ? "#ffb8c8" : item.type === "MANUAL" || item.type === "RECALL" ? "#ffaaee" : item.type === "PROMPT" ? "#ffee99" : item.type === "BOUNDARY" || item.type === "CRIT" ? "#ff6677" : item.type === "CMD" ? "#ffee99" : LABEL_SECONDARY;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ fontSize: 14, lineHeight: 1.6, background: isEven ? "rgba(255,255,255,0.03)" : "rgba(51,250,255,0.025)", borderLeft: `4px solid ${meta.color}99`, border: `1px solid ${meta.border}`, borderRadius: 5, padding: "8px 12px", marginBottom: 6, animation: isHuman ? "humanPulse 0.8s ease-in-out 3" : "none" }}
    >
      <div style={{ fontSize: 12, color: LABEL_SECONDARY, marginBottom: 4, fontFamily: "'Roboto Mono',monospace", opacity: 0.65, fontWeight: 600 }}>[{item.time}]</div>
      <div><span style={{ color: meta.color, fontWeight: 700, marginRight: 6, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.5px", textShadow: `0 0 6px ${meta.color}55` }}>{item.type}:</span><span style={{ color: msgColor, fontFamily: "'Roboto Mono',monospace", fontWeight: 500 }}>{item.msg}</span></div>
    </motion.div>
  );
}

function TargetDetailCard({ target, onBack, onRescue }: { target: TargetMarker; onBack: () => void; onRescue: (id: string) => void }) {
  return (
    <motion.div key={target.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
      style={{ margin: "10px 16px 12px", background: target.isRescued ? "rgba(0,255,136,0.10)" : "rgba(255,34,68,0.07)", border: target.isRescued ? `1px solid ${OK_GREEN}88` : "1px solid rgba(255,34,68,0.42)", boxShadow: target.isRescued ? `0 0 18px ${OK_GREEN}22` : "none", borderRadius: 10, padding: "14px 16px", fontFamily: "'Roboto Mono',monospace", transition: "all 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", flexShrink: 0, background: target.isRescued ? OK_GREEN : "#ffdd00", boxShadow: target.isRescued ? `0 0 12px ${OK_GREEN}` : "0 0 12px #ffdd00", animation: target.isRescued ? "none" : "humanPulse 1s infinite" }} />
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, fontFamily: "'Orbitron',sans-serif", color: target.isRescued ? OK_GREEN : "#ffdd00", flex: 1 }}>{target.id}</span>
        {!target.isRescued && (
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => onRescue(target.id)}
            style={{ padding: "6px 12px", fontSize: 11, fontWeight: 700, background: `${OK_GREEN}18`, border: `1px solid ${OK_GREEN}77`, color: OK_GREEN, borderRadius: 6, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 0.8, boxShadow: `0 0 8px ${OK_GREEN}33`, flexShrink: 0 }}>✔ MARK RESCUED</motion.button>
        )}
        {target.isRescued && <div style={{ padding: "4px 12px", fontSize: 11, fontWeight: 700, background: `${OK_GREEN}22`, border: `1px solid ${OK_GREEN}99`, color: OK_GREEN, borderRadius: 6, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, flexShrink: 0 }}>✔ SECURED</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", marginBottom: 14 }}>
        {[["TYPE", target.type, "#ffb8c8"], ["SOURCE", target.droneId, LABEL_PRIMARY], ["LOC X", `${(target.wx / 1000).toFixed(3)} km`, LABEL_PRIMARY], ["LOC Y", `${(target.wy / 1000).toFixed(3)} km`, LABEL_PRIMARY], ["TIME", target.time, LABEL_SECONDARY], ["STATUS", target.isRescued ? "RESCUED" : "CONFIRMED", OK_GREEN]].map(([label, val, col]) => (
          <div key={label as string}>
            <div style={{ fontSize: 10, color: LABEL_SECONDARY, marginBottom: 3, letterSpacing: 1.2, fontWeight: 600, opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 14, color: col as string, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>
      {target.isRescued ? (
        <div style={{ background: `${OK_GREEN}0d`, border: `1px solid ${OK_GREEN}44`, borderRadius: 8, padding: "12px 14px" }}>
          <span style={{ fontSize: 11, color: OK_GREEN, letterSpacing: 1.5, fontWeight: 700, opacity: 0.8 }}>Rescue Time</span>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", color: OK_GREEN, textShadow: `0 0 12px ${OK_GREEN}66`, marginTop: 4 }}>{target.rescueTime}</div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: LABEL_SECONDARY, opacity: 0.7, letterSpacing: 1 }}>DETECTION CONFIDENCE</span>
            <span style={{ fontSize: 13, color: LABEL_PRIMARY, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>{target.confidence}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${target.confidence}%`, background: target.confidence >= 85 ? CRIT_RED : target.confidence >= 65 ? WARN_AMB : OK_GREEN, borderRadius: 4, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: 14, width: "100%", padding: "8px 0", fontSize: 11, fontWeight: 600, background: "rgba(255,34,68,0.10)", border: "1px solid rgba(255,34,68,0.30)", color: LABEL_SECONDARY, borderRadius: 6, cursor: "pointer", fontFamily: "'Roboto Mono',monospace" }}>← BACK TO LIST</button>
    </motion.div>
  );
}

function AbortDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        style={{ background: "rgba(5,0,12,0.98)", border: `2px solid ${CRIT_RED}`, borderRadius: 12, padding: "40px 46px", textAlign: "center", minWidth: 360, boxShadow: `0 0 60px ${CRIT_RED}44` }}>
        <div style={{ fontSize: 28, marginBottom: 14 }}>⚠️</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, color: LABEL_PRIMARY, fontWeight: 700, letterSpacing: 3, marginBottom: 10, textShadow: `0 0 12px ${CRIT_RED}88` }}>CONFIRM MISSION ABORT?</div>
        <div style={{ fontSize: 15, color: LABEL_SECONDARY, marginBottom: 30, fontFamily: "'Roboto Mono',monospace", lineHeight: 1.7, opacity: 0.8 }}>All drones will disengage current tasks<br />and return to center position.</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={onConfirm} style={{ padding: "12px 32px", background: "rgba(255,51,85,0.22)", border: `1px solid ${CRIT_RED}`, color: LABEL_PRIMARY, borderRadius: 8, cursor: "pointer", fontFamily: "'Orbitron',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, textShadow: `0 0 8px ${CRIT_RED}` }}>CONFIRM ABORT</button>
          <button onClick={onCancel} style={{ padding: "12px 32px", background: "rgba(51,250,255,0.09)", border: `1px solid ${AI_CYAN}44`, color: LABEL_PRIMARY, borderRadius: 8, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace", fontSize: 14, fontWeight: 600 }}>CANCEL</button>
        </div>
      </motion.div>
    </div>
  );
}

export function SwarmCommsHub({ fleet, showLegend, setShowLegend }: { fleet: FleetState, showLegend: boolean, setShowLegend: Dispatch<SetStateAction<boolean>> }) {
  const { drones, log, latency, intelText, setIntelText, submitIntel, targetMarkers, selectedTargetId, setSelectedTargetId, encryptActive, abortDialogOpen, setAbortDialogOpen, cmdRecalibrate, cmdAbortConfirm, cmdEncrypt, markTargetRescued, pushLog } = fleet;
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(380);
  const [logFocusMode, setLogFocusMode] = useState(false);
  const [targetTab, setTargetTab] = useState<"ACTIVE" | "SECURED">("ACTIVE");
  const [pinnedMessages, setPinnedMessages] = useState<PinnedEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  const startRef = useRef({ mx: 0, w: 0 });

  const activeTargets = useMemo(() => targetMarkers.filter(m => !m.isRescued), [targetMarkers]);
  const securedTargets = useMemo(() => targetMarkers.filter(m => m.isRescued), [targetMarkers]);
  const selTarget = useMemo(() => targetMarkers.find(m => m.id === selectedTargetId) ?? null, [targetMarkers, selectedTargetId]);

  // Exclude pinned messages from the general scrolling history
  const historyLogs = useMemo(() => log.filter(item => !pinnedMessages.some(p => p.id === item.id)), [log, pinnedMessages]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [log]);

  const lastProcessedLogIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (log.length === 0) return;

    let startIndex = 0;
    if (lastProcessedLogIdRef.current) {
      const idx = log.findIndex(l => l.id === lastProcessedLogIdRef.current);
      if (idx !== -1) {
        startIndex = idx + 1;
      } else {
        startIndex = log.length - 1;
      }
    }

    if (startIndex < log.length) {
      const newMessages = log.slice(startIndex);
      lastProcessedLogIdRef.current = log[log.length - 1].id;

      // MODIFIED: Pin messages if they meet shouldPin() criteria OR if they are HUMAN (Target found)
      const toPin = newMessages.filter(msg => shouldPin(msg) || msg.type === "HUMAN").map(newest => {
        // We ensure HUMAN logs get an explicit sender name so PinnedMessage.tsx can render it properly
        const normalizedSender = newest.type === "HUMAN" ? "SWARM RADAR" : normalizePinnedSender(newest.sender);
        if (!normalizedSender) return null;

        return {
          id: newest.id,
          sender: normalizedSender,
          msg: newest.msg,
          time: newest.time,
          pinnedAt: performance.now()
        } as PinnedEntry;
      }).filter((e): e is PinnedEntry => e !== null);

      if (toPin.length > 0) {
        setPinnedMessages(prev => {
          const withNew = [...toPin.reverse(), ...prev];
          return withNew.length > PIN_MAX ? withNew.slice(0, PIN_MAX) : withNew;
        });
      }
    }
  }, [log]);

  const evictPinned = useCallback((id: string) => {
    setPinnedMessages(prev => prev.filter(p => p.id !== id));
  }, []);

  const onResizeStart = (e: React.MouseEvent) => {
    dragRef.current = true;
    startRef.current = { mx: e.clientX, w: width };
    const onMove = (ev: MouseEvent) => { if (!dragRef.current) return; setWidth(clamp(startRef.current.w - (ev.clientX - startRef.current.mx), 40, window.innerWidth * 0.4)); };
    const onUp = () => { dragRef.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const CMD_BTNS = [
    { l: "RE-CALIBRATE", c: AI_CYAN, action: cmdRecalibrate },
    { l: "MESH_HANDSHAKE", c: AI_CYAN, action: () => pushLog({ type: "INFO", msg: "Mesh handshake complete — all nodes re-authenticated via local link" }) },
    { l: "ABORT_MSN", c: CRIT_RED, action: () => setAbortDialogOpen(true) },
    { l: "ENCRYPT_FEED", c: OK_GREEN, action: cmdEncrypt },
  ] as const;

  if (collapsed) {
    return (
      <div style={{ width: 46, background: "rgba(0,4,16,0.88)", borderLeft: `1px solid ${AI_CYAN}18`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 8, flexShrink: 0 }}>
        <button onClick={() => setCollapsed(false)} style={{ background: "transparent", border: `1px solid ${AI_CYAN}33`, color: AI_CYAN, borderRadius: 4, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>◀</button>
        {CMD_BTNS.map(btn => (
          <button key={btn.l} onClick={btn.action} title={btn.l} style={{ width: 30, height: 30, background: "transparent", border: `1px solid ${btn.c}33`, color: btn.c, borderRadius: 4, cursor: "pointer", fontSize: 10 }}>⬡</button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width, background: "rgba(0,4,16,0.88)", borderLeft: `1px solid ${AI_CYAN}18`, display: "flex", flexDirection: "column", backdropFilter: "blur(12px)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
      <div onMouseDown={onResizeStart} style={{ position: "absolute", top: 0, left: -3, width: 6, height: "100%", cursor: "ew-resize", zIndex: 50 }} />

      <div style={{ padding: "12px 16px 11px", borderBottom: `1px solid ${AI_CYAN}14`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, letterSpacing: 2, color: LABEL_PRIMARY, textShadow: `0 0 8px ${AI_CYAN}44`, fontWeight: 700 }}>SWARM COMMS HUB</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLegend(prev => !prev)}
              title={showLegend ? "Hide Legend" : "Show Legend"}
              style={{
                background: showLegend ? `${AI_CYAN}11` : "transparent",
                border: `1px solid ${showLegend ? AI_CYAN : `${LABEL_SECONDARY}55`}`,
                borderRadius: 5,
                width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <LegendToggleIcon color={showLegend ? AI_CYAN : LABEL_SECONDARY} />
            </motion.button>

            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,238,119,0.08)", border: "1px solid rgba(255,238,119,0.30)", borderRadius: 6, padding: "3px 9px" }}>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" stroke="#ffee77" strokeWidth="1" fill="none" /><rect x="3.5" y="3.5" width="3" height="3" fill="#ffee77" opacity="0.7" /></svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span style={{ fontSize: 9, color: "#ffee77", letterSpacing: 0.5, fontFamily: "'Roboto Mono',monospace", fontWeight: 700, lineHeight: 1.2 }}>LOCAL INFERENCE</span>
                <span style={{ fontSize: 8, color: "rgba(255,238,119,0.55)", fontFamily: "'Roboto Mono',monospace", lineHeight: 1.2 }}>GPU · 8GB VRAM</span>
              </div>
            </div>
            {encryptActive && <span style={{ fontSize: 12 }}>🔒</span>}
            <button onClick={() => setCollapsed(true)} style={{ background: "transparent", border: `1px solid ${AI_CYAN}33`, color: AI_CYAN, borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!logFocusMode && <motion.div key="mesh" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden", flexShrink: 0 }}><MeshLinkWidget latency={latency} droneCount={drones.length} /></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {!logFocusMode && (
          <motion.div key="target-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, delay: 0.04 }} style={{ overflow: "hidden", borderBottom: `1px solid ${AI_CYAN}0e`, flexShrink: 0 }}>
            <div style={{ padding: "10px 16px 0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {selTarget ? (
                <>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, letterSpacing: 2, color: LABEL_PRIMARY, fontWeight: 700 }}>TARGET INTEL</span>
                  <button onClick={() => setSelectedTargetId(null)} style={{ background: "rgba(255,34,68,0.10)", border: "1px solid rgba(255,34,68,0.30)", color: LABEL_SECONDARY, fontSize: 11, padding: "3px 12px", borderRadius: 5, cursor: "pointer", fontFamily: "'Roboto Mono',monospace", fontWeight: 600 }}>← LIST</button>
                </>
              ) : (
                <div style={{ display: "flex", gap: 6, width: "100%" }}>
                  {(["ACTIVE", "SECURED"] as const).map(tab => {
                    const isActive = targetTab === tab;
                    const col = tab === "ACTIVE" ? AI_CYAN : OK_GREEN;
                    const count = tab === "ACTIVE" ? activeTargets.length : securedTargets.length;
                    return (
                      <button key={tab} onClick={() => setTargetTab(tab)}
                        style={{ flex: 1, padding: "6px 0", fontSize: 12, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 0.8, cursor: "pointer", borderRadius: 6, border: `1px solid ${col}${isActive ? "99" : "22"}`, background: isActive ? `${col}18` : "rgba(255,255,255,0.02)", color: isActive ? col : LABEL_SECONDARY, boxShadow: isActive ? `0 0 10px ${col}22` : "none", transition: "all 0.18s" }}>
                        {tab} <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 700, color: isActive ? col : `${LABEL_SECONDARY}77` }}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              {selTarget ? (
                <TargetDetailCard key={selTarget.id} target={selTarget} onBack={() => setSelectedTargetId(null)} onRescue={markTargetRescued} />
              ) : (
                <motion.div key={`tab-${targetTab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ maxHeight: 180, overflowY: "auto", padding: "10px 16px 12px" }}>
                  {(targetTab === "ACTIVE" ? activeTargets : securedTargets).length === 0 ? (
                    <div style={{ fontSize: 12, color: `${LABEL_SECONDARY}55`, textAlign: "center", padding: "12px 0", fontFamily: "'Roboto Mono',monospace" }}>{targetTab === "ACTIVE" ? "No active targets" : "No secured targets"}</div>
                  ) : (targetTab === "ACTIVE" ? activeTargets : securedTargets).map(m => {
                    const isSelected = m.id === selectedTargetId;
                    return (
                      <div key={m.id} onClick={() => setSelectedTargetId(isSelected ? null : m.id)}
                        style={{ cursor: "pointer", padding: "8px 10px", marginBottom: 6, borderRadius: 8, background: isSelected ? (m.isRescued ? `${OK_GREEN}14` : "rgba(255,221,0,0.08)") : "rgba(0,0,0,0.28)", border: `1px solid ${isSelected ? (m.isRescued ? OK_GREEN + "77" : "#ffdd0088") : "rgba(255,255,255,0.08)"}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.18s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.isRescued ? OK_GREEN : "#ffdd00", boxShadow: m.isRescued ? `0 0 6px ${OK_GREEN}` : "0 0 6px #ffdd00", animation: m.isRescued ? "none" : "humanPulse 1.4s infinite" }} />
                          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", color: m.isRescued ? OK_GREEN : "#ffdd00" }}>{m.id}</span>
                          <span style={{ fontSize: 11, color: LABEL_SECONDARY, opacity: 0.6 }}>{m.type}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {m.isRescued ? <span style={{ fontSize: 11, color: OK_GREEN, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>RESCUED {m.rescueTime}</span> : <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace", color: m.confidence >= 85 ? CRIT_RED : m.confidence >= 65 ? WARN_AMB : OK_GREEN }}>{m.confidence}%</span>}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "10px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: LABEL_PRIMARY, fontFamily: "'Orbitron',sans-serif", letterSpacing: 4, fontWeight: 700 }}>HISTORY LOG</span>
          <button onClick={() => setLogFocusMode(v => !v)}
            style={{ fontSize: 11, color: logFocusMode ? AI_CYAN : LABEL_SECONDARY, background: "transparent", border: `1px solid ${logFocusMode ? AI_CYAN + "55" : "rgba(255,255,255,0.1)"}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontFamily: "'Share Tech Mono',monospace", transition: "all 0.18s" }}>
            {logFocusMode ? "EXPAND" : "FOCUS"}
          </button>
        </div>

        {/* --- PINNED LOG AREA --- */}
        <PinnedMessage
          pinnedMessages={pinnedMessages}
          onEvict={evictPinned}
        />

        <div ref={logRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "rgba(0,8,22,0.48)", borderRadius: 16, margin: "0 10px", padding: 12, border: `1px solid ${AI_CYAN}14`, boxShadow: `inset 0 0 14px rgba(0,255,255,0.02)` }}>
          <AnimatePresence initial={false}>
            {historyLogs.map((item, idx) => <LogEntryRow key={item.id} item={item} index={idx} />)}
          </AnimatePresence>
          {historyLogs.length === 0 && <div style={{ minHeight: 96, borderRadius: 12, border: `1px dashed ${AI_CYAN}22`, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, color: `${LABEL_SECONDARY}88`, fontFamily: "'Roboto Mono',monospace", fontSize: 12, lineHeight: 1.5 }}>No history messages yet.</div>}
          <div style={{ height: 6, flexShrink: 0 }} />
        </div>
      </div>

      {/* ── HUMAN INTEL INPUT (HITL) ── */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${AI_CYAN}0e`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: HUMAN_MAG, boxShadow: `0 0 5px ${HUMAN_MAG}`, animation: "humanPulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: LABEL_SECONDARY, fontFamily: "'Orbitron',sans-serif", letterSpacing: 1.5, fontWeight: 700, opacity: 0.9 }}>HUMAN INTEL INPUT <span style={{ color: HUMAN_MAG }}>(HITL)</span></span>
        </div>

        {/* HITL Quick Action Pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setIntelText("Prioritize search patterns for victims in high-probability sectors.")}
            style={{ padding: "4px 10px", background: `${HUMAN_MAG}11`, border: `1px solid ${HUMAN_MAG}44`, borderRadius: 12, color: HUMAN_MAG, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
          >
            <span style={{ fontSize: 12 }}>🛡️</span> Search victims
          </button>
          <button
            onClick={() => setIntelText("Mark current grid coordinate as Safe Zone. Stand down search units in this area.")}
            style={{ padding: "4px 10px", background: `${OK_GREEN}11`, border: `1px solid ${OK_GREEN}44`, borderRadius: 12, color: OK_GREEN, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
          >
            <span style={{ fontSize: 12 }}>🛡️</span> Mark Safe Zone
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <textarea
            value={intelText}
            onChange={e => setIntelText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitIntel(); } }}
            rows={2}
            placeholder="Enter field intel, survivor sighting, tactical override..."
            style={{ width: "100%", resize: "none", background: "rgba(255,0,204,0.04)", border: `1px solid ${HUMAN_MAG}44`, borderRadius: 8, padding: "10px 42px 10px 12px", fontSize: 14, fontFamily: "'Roboto Mono',monospace", color: LABEL_PRIMARY, outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={submitIntel} disabled={!intelText.trim()}
            style={{
              position: "absolute",
              right: 8,
              bottom: 9,
              background: intelText.trim() ? `${HUMAN_MAG}22` : "transparent",
              border: `1px solid ${intelText.trim() ? HUMAN_MAG + "77" : "#ffffff15"}`,
              color: intelText.trim() ? HUMAN_MAG : "#555",
              borderRadius: 6,
              width: 28,
              height: 28,
              cursor: intelText.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}>→</button>
        </div>
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${AI_CYAN}0e`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, flexShrink: 0 }}>
        {CMD_BTNS.map(btn => (
          <motion.button key={btn.l} whileTap={{ scale: 0.93 }} onClick={btn.action}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: btn.l === "ENCRYPT_FEED" && encryptActive ? "rgba(0,255,136,0.16)" : `rgba(${btn.c === CRIT_RED ? "255,51,85" : btn.c === OK_GREEN ? "0,255,136" : "51,250,255"},0.07)`, border: `1px solid ${btn.c}${btn.l === "ENCRYPT_FEED" && encryptActive ? "99" : "44"}`, color: btn.l === "ABORT_MSN" ? CRIT_RED : LABEL_PRIMARY, fontFamily: "'Share Tech Mono',monospace", fontSize: 12, fontWeight: 700, padding: "11px 8px", borderRadius: 6, cursor: "pointer", letterSpacing: 1, boxShadow: btn.l === "ENCRYPT_FEED" && encryptActive ? `0 0 14px ${OK_GREEN}44` : "none", textShadow: btn.l === "ABORT_MSN" ? `0 0 8px ${CRIT_RED}66` : LABEL_GLOW }}>
            {btn.l}
          </motion.button>
        ))}
      </div>

      {abortDialogOpen && <AbortDialog onConfirm={cmdAbortConfirm} onCancel={() => setAbortDialogOpen(false)} />}
    </div>
  );
}