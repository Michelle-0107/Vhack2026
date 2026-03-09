"use client";
import { Cpu, Radio, Clock, Zap } from "lucide-react";
import { useFleetStore } from "@/store/useFleetStore";
import { AI_CYAN, HUMAN_MAG, OK_GREEN, CRIT_RED, MAX_FLEET, MISSION } from "@/lib/constants";

/**
 * SystemStatusBar — full-width header strip.
 * Displays branding, hybrid-autonomy pills, mission coordinates, and hardware stats.
 */
export default function SystemStatusBar() {
  const drones    = useFleetStore(s => s.drones);
  const latency   = useFleetStore(s => s.latency);

  const aiCount  = drones.filter(d => d.mode === "AUTO").length;
  const manCount = drones.filter(d => d.mode === "MANUAL").length;
  const atCap    = drones.length >= MAX_FLEET;

  const hwStats = [
    { icon:<Radio size={9}/>,  label:"EDGE NODE",  value:"LOCAL: ACTIVE",              color:OK_GREEN                          },
    { icon:<Cpu   size={9}/>,  label:"HARDWARE",   value:"32GB / 8GB VRAM",            color:"#7ecfff"                        },
    { icon:<Zap   size={9}/>,  label:"FLEET",      value:`${drones.length}/${MAX_FLEET} ACTIVE`, color:atCap ? CRIT_RED : AI_CYAN },
    { icon:<Clock size={9}/>,  label:"LATENCY",    value:`${latency.toFixed(1)} MS`,   color:AI_CYAN                          },
  ];

  return (
    <div style={{
      height:48, background:"rgba(0,245,255,0.028)", borderBottom:`1px solid ${AI_CYAN}28`,
      display:"flex", alignItems:"center", padding:"0 18px", gap:0,
      backdropFilter:"blur(14px)", flexShrink:0,
    }}>
      {/* Brand */}
      <div style={{ display:"flex", alignItems:"center", gap:9, marginRight:22 }}>
        <div style={{ width:9, height:9, background:AI_CYAN, borderRadius:1, animation:"blink 1.8s infinite", boxShadow:`0 0 8px ${AI_CYAN}` }} />
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:900, color:AI_CYAN, letterSpacing:3 }}>BEACON-NET</span>
        <span style={{ color:`${AI_CYAN}44`, fontSize:14, margin:"0 4px" }}>::</span>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:`${AI_CYAN}77`, letterSpacing:2 }}>HITL COMMAND v4.2</span>
      </div>

      {/* Autonomy pills */}
      <div style={{ display:"flex", gap:8, marginRight:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, background:`rgba(0,245,255,0.06)`, border:`1px solid ${AI_CYAN}33`, borderRadius:20, padding:"3px 9px", fontSize:8 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:AI_CYAN, boxShadow:`0 0 5px ${AI_CYAN}` }} />
          <span style={{ color:AI_CYAN, letterSpacing:1 }}>AI AUTO: {aiCount}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, background:`rgba(255,0,204,0.06)`, border:`1px solid ${HUMAN_MAG}44`, borderRadius:20, padding:"3px 9px", fontSize:8 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:HUMAN_MAG, boxShadow:`0 0 5px ${HUMAN_MAG}` }} />
          <span style={{ color:HUMAN_MAG, letterSpacing:1 }}>MANUAL: {manCount}</span>
        </div>
      </div>

      {/* Mission coords */}
      <div style={{ display:"flex", gap:16, flex:1, fontSize:9, color:`${AI_CYAN}55` }}>
        <span>SECTOR: <span style={{ color:AI_CYAN }}>{MISSION.sector}</span></span>
        <span>LAT: <span style={{ color:AI_CYAN }}>{MISSION.lat}</span></span>
        <span>LON: <span style={{ color:AI_CYAN }}>{MISSION.lon}</span></span>
      </div>

      {/* HW stats */}
      <div style={{ display:"flex", gap:20, fontSize:9 }}>
        {hwStats.map(({ icon, label, value, color }) => (
          <div key={label} style={{ textAlign:"right" }}>
            <div style={{ color:`${AI_CYAN}33`, marginBottom:1, fontSize:8, display:"flex", alignItems:"center", gap:3, justifyContent:"flex-end" }}>
              {icon}{label}
            </div>
            <div style={{ color, fontWeight:700, fontSize:9 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
