"use client";
import { CRIT_RED } from "@/lib/constants";

/**
 * ThermalZone — heat-signature overlay widget positioned in the lower-left
 * of the map canvas.
 */
export default function ThermalZone() {
  return (
    <div style={{
      position:"absolute", bottom:32, left:14,
      width:108, height:80,
      background:"rgba(0,0,0,0.9)",
      border:`1px solid ${CRIT_RED}66`,
      borderRadius:4, overflow:"hidden",
      boxShadow:`0 0 14px ${CRIT_RED}22`,
    }}>
      <div style={{
        fontSize:7, color:"#ff7755", fontFamily:"'Share Tech Mono',monospace",
        padding:"3px 6px", borderBottom:`1px solid ${CRIT_RED}22`, letterSpacing:1,
      }}>THERMAL_ZONE_A</div>

      <div style={{ position:"relative", width:"100%", height:60, background:"#040410" }}>
        {/* Pulsing hot-spot */}
        <div style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          width:24, height:24,
          background:"radial-gradient(circle,#ff2200 0%,#ff660033 60%,transparent 80%)",
          borderRadius:"50%",
          animation:"thermalPulse 2s ease-in-out infinite",
          boxShadow:`0 0 16px ${CRIT_RED}77`,
        }} />
        {/* White core */}
        <div style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          width:6, height:6, background:"#fff", borderRadius:"50%",
          boxShadow:"0 0 6px #fff",
        }} />
        {/* Expanding rings */}
        {[1,2,3].map(i => (
          <div key={i} style={{
            position:"absolute", left:"50%", top:"50%",
            transform:"translate(-50%,-50%)",
            width:8+i*12, height:8+i*12,
            borderRadius:"50%",
            border:`1px solid rgba(255,80,0,${0.48-i*0.12})`,
            animation:`thermalRing 2.2s ease-in-out ${i*0.42}s infinite`,
          }} />
        ))}
        <div style={{ position:"absolute", bottom:3, left:4, fontSize:7, color:"#ff9966", fontFamily:"'Share Tech Mono',monospace" }}>
          HEAT SIG: GRID 42-X
        </div>
      </div>
    </div>
  );
}
