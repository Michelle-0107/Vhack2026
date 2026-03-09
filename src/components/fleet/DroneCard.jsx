"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Radio, RotateCcw, Zap, Gauge, Signal } from "lucide-react";
import BatteryBar from "./BatteryBar";
import StatusDot from "./StatusDot";
import { AI_CYAN, HUMAN_MAG, WARN_AMB, CRIT_RED, OK_GREEN } from "@/lib/constants";

const SIG_COLOR = {
  EXCELLENT: OK_GREEN,
  GOOD: AI_CYAN,
  INTERMITTENT: WARN_AMB,
  WEAK: CRIT_RED,
};

export default function DroneCard({ drone, active, isNew, isRecalling, onSelect, onToggleMode, onRecall }) {
  const cardRef = useRef(null); // Reference for scrolling
  const sigColor = SIG_COLOR[drone.sig] ?? "#666";
  const isManual = drone.mode === "MANUAL";
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  // Navigation Logic: Smoothly scroll this card into the sidebar view when selected
  useEffect(() => {
    if (active && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [active]);

  const borderCol = isRecalling
    ? CRIT_RED
    : active
      ? (isManual ? HUMAN_MAG : AI_CYAN)
      : isNew ? HUMAN_MAG : "rgba(0,245,255,0.12)";

  return (
    <MotionDiv
      ref={cardRef}
      layout
      initial={isNew ? { opacity: 0, x: -50, scale: 0.9 } : false}
      animate={isRecalling ? { opacity: 0.45, scale: 0.97 } : { opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -60, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      onClick={() => !isRecalling && onSelect(drone.id)}
      style={{
        cursor: isRecalling ? "not-allowed" : "pointer",
        background: active ? "rgba(0,245,255,0.08)" : "rgba(0,0,0,0.38)",
        border: `1px solid ${borderCol}`,
        borderRadius: 7, padding: "9px 11px", marginBottom: 6,
        boxShadow: active
          ? `0 0 16px ${isManual ? HUMAN_MAG + "44" : AI_CYAN + "33"}`
          : "none",
        position: "relative", overflow: "hidden",
        transition: "border 0.25s, box-shadow 0.25s, background 0.25s",
      }}
    >
      {/* Active Selection Scan-line */}
      {active && !isRecalling && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,transparent,${isManual ? HUMAN_MAG : AI_CYAN},transparent)`,
          animation: "scanLine 2s linear infinite",
        }} />
      )}

      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StatusDot relay={drone.relay} />
          <span style={{ color: active ? (isManual ? HUMAN_MAG : AI_CYAN) : "#b0e0e0", fontFamily: "'Share Tech Mono',monospace", fontSize: 11, fontWeight: 700 }}>
            {drone.id}
          </span>
        </div>
        <span style={{ color: drone.battery > 60 ? OK_GREEN : drone.battery > 25 ? WARN_AMB : CRIT_RED, fontSize: 11 }}>
          {drone.battery}%
        </span>
      </div>

      <BatteryBar value={drone.battery} />

      {/* Telemetry Data */}
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        {[
          { icon: <Zap size={8} />, k: "ALT", v: `${drone.alt}M` },
          { icon: <Gauge size={8} />, k: "SPD", v: `${drone.spd}KM` },
          { icon: <Signal size={8} />, k: "SIG", v: drone.sig.slice(0, 5), c: sigColor },
        ].map(({ icon, k, v, c }) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 8, color: "#2a6060" }}>
            {icon} {k}: <span style={{ color: c ?? "#6ab0c0" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7 }}>
        <div
          onClick={e => { e.stopPropagation(); !isRecalling && onToggleMode(drone.id); }}
          style={{ display: "flex", border: `1px solid ${isManual ? HUMAN_MAG + "55" : AI_CYAN + "33"}`, borderRadius: 3, overflow: "hidden", cursor: "pointer" }}
        >
          {["AUTO", "MANUAL"].map(m => (
            <div key={m} style={{
              padding: "2px 6px", fontSize: 7,
              background: drone.mode === m ? (m === "MANUAL" ? "rgba(255,0,204,0.2)" : "rgba(0,245,255,0.15)") : "transparent",
              color: drone.mode === m ? (m === "MANUAL" ? HUMAN_MAG : AI_CYAN) : "rgba(0,245,255,0.28)",
            }}>{m}</div>
          ))}
        </div>

        <MotionButton
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); !isRecalling && onRecall(drone.id); }}
          style={{ padding: "2px 9px", fontSize: 8, background: `rgba(255,170,0,0.08)`, border: `1px solid ${WARN_AMB}44`, color: WARN_AMB, borderRadius: 3, cursor: "pointer" }}
        >
          <RotateCcw size={8} style={{ marginRight: 4, display: 'inline' }} /> RECALL
        </MotionButton>
      </div>
    </MotionDiv>
  );
}
