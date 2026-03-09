"use client";
import { motion } from "framer-motion";
import { AI_CYAN, HUMAN_MAG, CRIT_RED } from "@/lib/constants";

/**
 * DroneMapIcon — SVG drone sprite positioned absolutely on the map canvas.
 *
 * Props
 *   drone       — drone object from the store
 *   isActive    — highlight / selection state
 *   isNew       — spawn animation
 *   isRecalling — fade + tilt animation
 *   onClick     — (id) => void
 */
export default function DroneMapIcon({ drone, isActive, isNew, isRecalling, onClick }) {
  const c        = drone.mode === "MANUAL" ? HUMAN_MAG : drone.color ?? AI_CYAN;
  const MotionDiv = motion.div;
  const glowStr  = isRecalling
    ? `0px 0px 14px ${CRIT_RED}`
    : isActive
      ? `0px 0px ${isNew ? 12 : 9}px ${c}`
      : `0px 0px 4px ${c}88`;

  return (
    <MotionDiv
      key={drone.id}
      initial={isNew ? { opacity:0, scale:0 } : false}
      animate={isRecalling ? { opacity:0.3, scale:0.7, rotate:15 } : { opacity:1, scale:1, rotate:0 }}
      exit={{ opacity:0, scale:0, transition:{ duration:0.5 } }}
      transition={{ type:"spring", stiffness:280, damping:20 }}
      onClick={e => { e.stopPropagation(); onClick(drone.id); }}
      style={{
        position:"absolute",
        left:`${drone.x}%`, top:`${drone.y}%`,
        transform:"translate(-50%,-50%)",
        cursor:"pointer",
        animation: isRecalling ? "none" : "droneHover 2.4s ease-in-out infinite",
        zIndex: isActive ? 14 : 7,
        filter:`drop-shadow(${glowStr})`,
      }}
    >
      {/* Selection pulse ring */}
      {isActive && !isRecalling && (
        <div style={{
          position:"absolute", inset:-16, borderRadius:"50%",
          border:`1px solid ${c}`, opacity:0.5,
          animation:"pulseRing 1.8s ease-out infinite",
        }} />
      )}

      {/* Drone SVG body */}
      <svg width="28" height="28" viewBox="0 0 28 28">
        <polygon points="14,3 18,14 14,11 10,14" fill={c} opacity="0.94" />
        {[[6,10],[22,10],[6,20],[22,20]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.6" fill={c} opacity="0.72" />
        ))}
        <line x1="6"  y1="10" x2="14" y2="13.5" stroke={c} strokeWidth="0.9" />
        <line x1="22" y1="10" x2="14" y2="13.5" stroke={c} strokeWidth="0.9" />
        <line x1="6"  y1="20" x2="14" y2="16"   stroke={c} strokeWidth="0.9" />
        <line x1="22" y1="20" x2="14" y2="16"   stroke={c} strokeWidth="0.9" />
        {drone.isRelay && (
          <circle cx="14" cy="14" r="2.2" fill="none" stroke={c} strokeWidth="0.8" opacity="0.6" />
        )}
      </svg>

      {/* Label */}
      <div style={{
        position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)",
        background:"rgba(0,0,0,0.85)", border:`1px solid ${c}44`, borderRadius:3,
        padding:"1px 5px", fontSize:7, color:c, whiteSpace:"nowrap",
        fontFamily:"'Share Tech Mono',monospace", letterSpacing:0.5,
      }}>
        {drone.id}{drone.mode === "MANUAL" ? " [M]" : ""}
      </div>
    </MotionDiv>
  );
}
