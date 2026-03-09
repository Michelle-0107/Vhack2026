"use client";
import { motion } from "framer-motion";
import { TYPE_META, AI_CYAN, HUMAN_MAG, CRIT_RED } from "@/lib/constants";

const MSG_COLOR = (type) => {
  if (type === "DECISION")                      return "#ff8899";
  if (type === "MANUAL" || type === "RECALL")   return "#ff99ee";
  if (type === "COT"    || type === "HEAL")     return `rgba(0,245,255,0.78)`;
  if (type === "PROMPT")                        return "#ffee88";
  return `rgba(0,245,255,0.7)`;
};

/**
 * LogEntry — animated mission log line.
 *
 * Props
 *   item — { id, time, type, msg }
 */
export default function LogEntry({ item }) {
  const meta   = TYPE_META[item.type] ?? TYPE_META.INFO;
  const hasBox = !!meta.bg && meta.bg !== "transparent";

  return (
    <motion.div
      initial={{ opacity:0, y:10, x: item.type === "MANUAL" || item.type === "RECALL" ? -6 : 4 }}
      animate={{ opacity:1, y:0, x:0 }}
      transition={{ duration:0.3, ease:"easeOut" }}
      style={{
        fontSize:9, lineHeight:1.6,
        background: hasBox ? meta.bg    : "transparent",
        border:     hasBox ? `1px solid ${meta.border}` : "none",
        borderRadius: hasBox ? 4 : 0,
        padding:    hasBox ? "5px 8px" : "1px 2px",
      }}
    >
      <span style={{ color:"rgba(0,245,255,0.28)", marginRight:2 }}>[{item.time}]</span>
      <span style={{ color:meta.color, fontWeight:700, marginRight:4, textDecoration: item.type === "ANALYSIS" ? "underline" : "none" }}>
        {item.type}:
      </span>
      <span style={{ color: MSG_COLOR(item.type) }}>{item.msg}</span>
    </motion.div>
  );
}
