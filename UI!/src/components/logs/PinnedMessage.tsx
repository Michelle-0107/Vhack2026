/**
 * src/components/logs/PinnedMessage.tsx
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRIT_RED, WARN_AMB, LABEL_PRIMARY, LABEL_SECONDARY } from "../../tokens";
import { hasSopStickyTrigger } from "../../utils";
import type { PinnedEntry } from "../../types";

const PINNED_LIFETIME_MS = 10_000;
const MAX_PINNED = 3;
const SOP_STICKY_DURATION_MS = 20_000;

const SENDER_COLOR: Record<string, string> = {
  SOP: "#ffaa00",
  COMMANDER: "#bb77ff",
  SYSTEM: CRIT_RED,
};

interface Props {
  pinnedMessages: PinnedEntry[];
  onEvict: (id: string) => void;
}

function PinnedCard({ entry, onExpire }: { entry: PinnedEntry; onExpire: (id: string) => void }) {
  const [fraction, setFraction] = useState(1);
  const color = SENDER_COLOR[entry.sender] ?? CRIT_RED;

  useEffect(() => {
    const start = entry.pinnedAt;
    let raf: number;
    const tick = () => {
      const elapsed = performance.now() - start;
      const f = Math.max(0, 1 - elapsed / PINNED_LIFETIME_MS);
      setFraction(f);
      if (f > 0) raf = requestAnimationFrame(tick);
      else onExpire(entry.id);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entry.id, entry.pinnedAt, onExpire]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        position: "relative", borderRadius: 8,
        background: "rgba(5, 5, 5, 0.85)", border: `1px solid ${color}44`,
        padding: "12px 14px 16px", marginBottom: 10, overflow: "hidden",
        boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${color}` }} />
          <span style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 1,
            fontFamily: "'Orbitron',sans-serif", color,
            textShadow: `0 0 8px ${color}55`,
          }}>{entry.sender}</span>
        </div>
        <span style={{ fontSize: 12, color: LABEL_SECONDARY, opacity: 0.5, fontFamily: "'Share Tech Mono',monospace" }}>
          {entry.time}
        </span>
      </div>

      <div style={{ fontSize: 14, color: LABEL_PRIMARY, fontFamily: "'Roboto Mono',monospace", lineHeight: 1.5, fontWeight: 500 }}>
        {entry.msg}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.06)" }}>
        <div style={{
          height: "100%", width: `${fraction * 100}%`,
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
          transition: "none",
        }} />
      </div>
    </motion.div>
  );
}

function SopStickyAlert({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: `${CRIT_RED}14`, border: `1px solid ${CRIT_RED}77`,
        borderRadius: 8, padding: "8px 12px", marginBottom: 8,
        animation: "humanPulse 1.4s ease-in-out infinite",
        boxShadow: `0 0 20px ${CRIT_RED}33`,
        zIndex: 10, position: "relative",
      }}
    >
      <span style={{ fontSize: 11, color: CRIT_RED, fontWeight: 700, letterSpacing: 1.5, fontFamily: "'Orbitron',sans-serif" }}>
        ⚠ SOP ALERT
      </span>
      <div style={{ fontSize: 12, color: LABEL_SECONDARY, fontFamily: "'Roboto Mono',monospace", marginTop: 4, lineHeight: 1.5 }}>
        {msg}
      </div>
    </motion.div>
  );
}

export function PinnedMessage({ pinnedMessages, onEvict }: Props) {
  const [sopSticky, setSopSticky] = useState<{ id: string; msg: string } | null>(null);
  const sopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trigger = pinnedMessages.find(p => hasSopStickyTrigger(p.msg));
    if (trigger && sopSticky?.id !== trigger.id) {
      setSopSticky({ id: trigger.id, msg: trigger.msg });
      if (sopTimer.current) clearTimeout(sopTimer.current);
      sopTimer.current = setTimeout(() => setSopSticky(null), SOP_STICKY_DURATION_MS);
    }
    return () => { if (sopTimer.current) clearTimeout(sopTimer.current); };
  }, [pinnedMessages]);

  if (pinnedMessages.length === 0 && !sopSticky) return null;

  return (
    <div style={{ padding: "8px 16px 0", flexShrink: 0 }}>
      <div style={{ marginBottom: 6, fontSize: 10, color: `${WARN_AMB}88`, fontFamily: "'Roboto Mono',monospace", letterSpacing: 1.5 }}>
        — PINNED COMMS —
      </div>

      <AnimatePresence>
        {sopSticky && <SopStickyAlert key={sopSticky.id} msg={sopSticky.msg} />}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {pinnedMessages.slice(0, MAX_PINNED).map(entry => (
          <PinnedCard key={entry.id} entry={entry} onExpire={onEvict} />
        ))}
      </AnimatePresence>
    </div>
  );
}