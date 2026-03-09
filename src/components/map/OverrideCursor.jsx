"use client";
import { motion } from "framer-motion";
import { AI_CYAN, HUMAN_MAG } from "@/lib/constants";

/**
 * OverrideCursor — animated cross-hair SVG that follows the active drone.
 *
 * Props
 *   x        — drone.x (%)
 *   y        — drone.y (%)
 *   isManual — true → magenta, false → cyan
 */
export default function OverrideCursor({ x, y, isManual }) {
  const c = isManual ? HUMAN_MAG : AI_CYAN;

  return (
    <motion.div
      initial={{ opacity:0, scale:0.3 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ type:"spring", stiffness:320, damping:22 }}
      style={{
        position:"absolute", left:`${x}%`, top:`${y}%`,
        transform:"translate(-50%,-50%)",
        pointerEvents:"none", zIndex:20,
      }}
    >
      <svg width="54" height="54" viewBox="0 0 54 54" style={{ overflow:"visible" }}>
        <circle cx="27" cy="27" r="23" fill="none" stroke={c} strokeWidth="1.4"
          strokeDasharray="5 4"
          style={{ animation:"sweep 5s linear infinite", transformOrigin:"27px 27px" }} />
        <circle cx="27" cy="27" r="14" fill="none" stroke={c} strokeWidth="0.7" opacity="0.45" />
        {[[27,2,27,11],[27,43,27,52],[2,27,11,27],[43,27,52,27]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="1.2" />
        ))}
        <circle cx="27" cy="27" r="3.5" fill={c} opacity="0.9" />
      </svg>
      <div style={{
        position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)",
        fontSize:7, color:c, fontFamily:"'Share Tech Mono',monospace",
        whiteSpace:"nowrap", letterSpacing:1.2, textShadow:`0 0 8px ${c}`,
      }}>
        {isManual ? "MANUAL OVERRIDE" : "AI CONTROL"}
      </div>
    </motion.div>
  );
}
