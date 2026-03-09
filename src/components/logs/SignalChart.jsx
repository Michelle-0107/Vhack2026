"use client";
import { AI_CYAN, OK_GREEN } from "@/lib/constants";

/**
 * SignalChart — live bar graph of recent signal strength readings.
 *
 * Props
 *   bars — number[] (0–100), from sigBars in the store
 */
export default function SignalChart({ bars }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:56, padding:"4px 0" }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex:1, height:`${h}%`, borderRadius:"2px 2px 0 0",
          background: i === bars.length-1 ? OK_GREEN : `rgba(0,245,255,${0.22 + i * 0.025})`,
          boxShadow:  i === bars.length-1 ? `0 0 7px ${OK_GREEN}` : "none",
          transition: "height 0.5s ease",
        }} />
      ))}
    </div>
  );
}
