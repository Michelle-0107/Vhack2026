/**
 * src/components/SystemStatusBar.tsx
 */

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AI_CYAN, OK_GREEN, CRIT_RED,
  LABEL_PRIMARY, LABEL_SECONDARY, LABEL_GLOW,
  MAX_FLEET, MISSION, TYPE_META,
} from "../tokens";
import type { FleetState } from "../hooks/useFleet";
import type { LogEntryData } from "../types";

// ── Rolling activity ticker ────────────────────────────────────────────────
function AIActivityTicker({ log }: { log: LogEntryData[] }) {
  const [tickerIdx, setTickerIdx] = useState(0);
  const lastLogLen = useRef(log.length);

  useEffect(() => {
    if (log.length !== lastLogLen.current) {
      lastLogLen.current = log.length;
      setTickerIdx(log.length - 1);
    }
  }, [log]);

  useEffect(() => {
    const iv = setInterval(() => setTickerIdx(i => (i + 1) % Math.max(1, log.length)), 4000);
    return () => clearInterval(iv);
  }, [log.length]);

  const entry = log[Math.min(tickerIdx, log.length - 1)];
  if (!entry) return null;
  const meta = TYPE_META[entry.type] ?? TYPE_META.INFO;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1, minWidth: 0 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, boxShadow: `0 0 6px ${meta.color}`, flexShrink: 0, animation: "humanPulse 1.5s ease-in-out infinite" }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={entry.id}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 12, fontFamily: "'Roboto Mono',monospace", color: LABEL_SECONDARY, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          <span style={{ color: meta.color, fontWeight: 700, marginRight: 4 }}>{entry.type}:</span>
          {entry.msg}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── SystemStatusBar ────────────────────────────────────────────────────────
export function SystemStatusBar({ fleet }: { fleet: FleetState }) {
  const { drones, latency, log, deployCount, encryptActive } = fleet;

  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setElapsed(Date.now() - startRef.current), 1000);
    return () => clearInterval(iv);
  }, []);

  const totalSec = Math.floor(elapsed / 1000);
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSec % 60).padStart(2, "0");

  const atCap = deployCount >= MAX_FLEET;
  const linkColor = latency < 25 ? OK_GREEN : latency < 40 ? AI_CYAN : CRIT_RED;

  return (
    <div style={{
      height: 46, background: "rgba(0,3,12,0.96)",
      borderBottom: `1px solid ${AI_CYAN}18`,
      display: "flex", alignItems: "center", padding: "0 16px", gap: 14,
      flexShrink: 0, zIndex: 100,
    }}>
      <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 15, fontWeight: 900, color: LABEL_PRIMARY, letterSpacing: 3, textShadow: `0 0 12px ${AI_CYAN}66`, flexShrink: 0, userSelect: "none" }}>
        BEACON<span style={{ color: AI_CYAN }}>NET</span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,238,119,0.07)", border: "1px solid rgba(255,238,119,0.22)", borderRadius: 12, padding: "2px 9px", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1" stroke="#ffee77" strokeWidth="1" fill="none" />
          <rect x="3.5" y="3.5" width="3" height="3" fill="#ffee77" opacity="0.7" />
        </svg>
        <span style={{ fontSize: 11, color: "#ffee77", fontFamily: "'Roboto Mono',monospace", letterSpacing: 1, fontWeight: 700 }}>LOCAL SYSTEM</span>
      </div>

      {encryptActive && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: `${OK_GREEN}18`, border: `1px solid ${OK_GREEN}55`, borderRadius: 12, padding: "2px 10px" }}>
          <span style={{ fontSize: 13 }}>🔒</span>
          <span style={{ fontSize: 12, color: OK_GREEN, fontFamily: "'Roboto Mono',monospace", letterSpacing: 1.5, fontWeight: 700 }}>ENCRYPTED</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(51,250,255,0.07)", border: `1px solid ${AI_CYAN}33`, borderRadius: 16, padding: "3px 11px", flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: AI_CYAN, boxShadow: `0 0 6px ${AI_CYAN}` }} />
        <span style={{ color: LABEL_PRIMARY, fontSize: 14, fontFamily: "'Roboto Mono',monospace", fontWeight: 700, textShadow: LABEL_GLOW }}>AUTONOMOUS · {drones.length} DRONES</span>
      </div>

      <div style={{ display: "flex", gap: 16, flex: 1, fontFamily: "'Roboto Mono',monospace" }}>
        <span style={{ fontSize: 13, color: LABEL_SECONDARY, fontWeight: 600 }}>SECTOR: <span style={{ color: LABEL_PRIMARY, fontWeight: 700, fontSize: 14, textShadow: LABEL_GLOW }}>{MISSION.sector}</span></span>
        <span style={{ fontSize: 13, color: LABEL_SECONDARY, fontWeight: 600 }}>AREA: <span style={{ color: LABEL_PRIMARY, fontWeight: 700, fontSize: 14, textShadow: LABEL_GLOW }}>5×5 km²</span></span>
        <span style={{ fontSize: 13, color: LABEL_SECONDARY, fontWeight: 600 }}>ELAPSED: <span style={{ color: AI_CYAN, fontWeight: 700, fontSize: 14, fontFamily: "'Share Tech Mono',monospace", textShadow: LABEL_GLOW }}>{hrs}:{mins}:{secs}</span></span>
      </div>

      <AIActivityTicker log={log} />

      <div style={{ display: "flex", gap: 20, fontFamily: "'Roboto Mono',monospace" }}>
        {[
          { label: "FLEET", value: `${deployCount}/${MAX_FLEET}`, color: atCap ? CRIT_RED : LABEL_PRIMARY },
          { label: "LINK LATENCY", value: `${latency.toFixed(1)} ms`, color: linkColor },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: "right" }}>
            <div style={{ color: LABEL_SECONDARY, marginBottom: 1, fontSize: 11, letterSpacing: 1, fontWeight: 600, opacity: 0.7 }}>{label}</div>
            <div style={{ color, fontWeight: 700, fontSize: 18, textShadow: `0 0 8px ${color}55` }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}