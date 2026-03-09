"use client";
import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Link2, ShieldOff, Lock, Brain } from "lucide-react";
import { useFleetStore } from "@/store/useFleetStore";
import LogEntry    from "./LogEntry";
import SignalChart from "./SignalChart";
import { AI_CYAN, HUMAN_MAG, OK_GREEN, CRIT_RED, WARN_AMB } from "@/lib/constants";

const ACTION_BTNS = [
  { l:"RE-CALIBRATE",   icon:<RefreshCw  size={10}/>, c:AI_CYAN   },
  { l:"ESTABLISH_LINK", icon:<Link2      size={10}/>, c:AI_CYAN   },
  { l:"ABORT_MSN",      icon:<ShieldOff  size={10}/>, c:CRIT_RED  },
  { l:"ENCRYPT_FEED",   icon:<Lock       size={10}/>, c:AI_CYAN   },
];

/**
 * AIIntelligenceHub — right-column panel.
 * Contains: signal chart, hybrid legend, intel input, mission log, action buttons.
 */
export default function AIIntelligenceHub() {
  const log          = useFleetStore(s => s.log);
  const sigBars      = useFleetStore(s => s.sigBars);
  const latency      = useFleetStore(s => s.latency);
  const recalling    = useFleetStore(s => s.recalling);
  const intelText    = useFleetStore(s => s.intelText);
  const setIntelText = useFleetStore(s => s.setIntelText);
  const submitIntel  = useFleetStore(s => s.submitIntel);

  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const healing = recalling.size > 0;

  return (
    <div style={{
      width:318, background:"rgba(0,4,16,0.84)", borderLeft:`1px solid ${AI_CYAN}18`,
      display:"flex", flexDirection:"column", backdropFilter:"blur(12px)", flexShrink:0,
    }}>
      {/* Panel header */}
      <div style={{ padding:"10px 13px", borderBottom:`1px solid ${AI_CYAN}14` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, letterSpacing:3, color:AI_CYAN }}>
            AI INTELLIGENCE HUB
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:OK_GREEN, animation:"blink 1.2s infinite", boxShadow:`0 0 5px ${OK_GREEN}` }} />
            <Brain size={10} color="#ffdd55" />
            <span style={{ fontSize:7, color:"#ffdd55", letterSpacing:1 }}>LLAMA-3.2 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Signal chart */}
      <div style={{ padding:"9px 13px", borderBottom:`1px solid ${AI_CYAN}0e` }}>
        <div style={{ fontSize:9, letterSpacing:2, color:`${AI_CYAN}55`, marginBottom:4 }}>SIGNAL PROPAGATION</div>
        <SignalChart bars={sigBars} />
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:`${AI_CYAN}44` }}>
          <span>LATENCY: <span style={{ color:AI_CYAN }}>{latency.toFixed(1)}MS</span></span>
          <span style={{ color:OK_GREEN }}>MESH: ▲ {healing ? "HEALING" : "OPTIMAL"}</span>
        </div>
      </div>

      {/* Hybrid control legend */}
      <div style={{ padding:"8px 13px", borderBottom:`1px solid ${AI_CYAN}0e`, display:"flex", gap:10 }}>
        {[
          { title:"AI AUTONOMOUS",  c:AI_CYAN,   desc:"Auto-routing, collision avoidance, coverage optimization"  },
          { title:"HUMAN OVERRIDE", c:HUMAN_MAG, desc:"Manual waypoints, survivor tracking, recall authority"      },
        ].map(({ title, c, desc }) => (
          <div key={title} style={{ flex:1, background:"rgba(0,0,0,0.3)", border:`1px solid ${c}22`, borderRadius:4, padding:"6px 8px" }}>
            <div style={{ fontSize:8, color:c, letterSpacing:1, marginBottom:3, fontFamily:"'Orbitron',sans-serif" }}>{title}</div>
            <div style={{ fontSize:7, color:`${c}66`, lineHeight:1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Intel input */}
      <div style={{ padding:"8px 13px", borderBottom:`1px solid ${AI_CYAN}0e` }}>
        <div style={{ fontSize:9, letterSpacing:2, color:`${AI_CYAN}55`, marginBottom:5 }}>HUMAN INTEL INPUT</div>
        <div style={{ position:"relative" }}>
          <textarea
            value={intelText}
            onChange={e => setIntelText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitIntel(); }}}
            placeholder="Enter field intel, survivor sighting, tactical override..."
            rows={3}
            style={{
              width:"100%", background:`rgba(0,245,255,0.03)`, border:`1px solid ${AI_CYAN}28`,
              borderRadius:4, color:"#aaffee", fontFamily:"'Share Tech Mono',monospace",
              fontSize:9, padding:"7px 10px", resize:"none", outline:"none", lineHeight:1.6,
            }}
          />
          <button
            onClick={submitIntel}
            style={{
              position:"absolute", bottom:7, right:7, display:"flex", alignItems:"center", gap:4,
              background:`rgba(0,245,255,0.12)`, border:`1px solid ${AI_CYAN}44`, color:AI_CYAN,
              fontFamily:"'Share Tech Mono',monospace", fontSize:8, padding:"3px 8px",
              borderRadius:3, cursor:"pointer", letterSpacing:1,
            }}
          >
            <Send size={9} /> SUBMIT
          </button>
        </div>
        <div style={{ fontSize:7, color:`${AI_CYAN}28`, marginTop:3 }}>ENTER to submit · SHIFT+ENTER newline</div>
      </div>

      {/* Mission log */}
      <div style={{ flex:1, padding:"8px 13px", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:10, letterSpacing:2, color:AI_CYAN }}>MISSION LOG</span>
          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
            {healing && (
              <div style={{ fontSize:7, color:OK_GREEN, animation:"blink 0.7s infinite", letterSpacing:1 }}>⬡ SELF-HEALING</div>
            )}
            <div style={{ background:`rgba(0,245,255,0.07)`, border:`1px solid ${AI_CYAN}28`, borderRadius:3, padding:"1px 6px", fontSize:7, color:"#7ecfff" }}>
              REAL-TIME
            </div>
          </div>
        </div>

        <div ref={logRef} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
          <AnimatePresence initial={false}>
            {log.map(item => <LogEntry key={item.id} item={item} />)}
          </AnimatePresence>
          <div style={{ height:4 }} />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding:9, borderTop:`1px solid ${AI_CYAN}0e`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        {ACTION_BTNS.map(btn => (
          <button
            key={btn.l}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              background:`rgba(${btn.c === CRIT_RED ? "255,51,85" : "0,245,255"},0.05)`,
              border:`1px solid ${btn.c}33`, color:btn.c,
              fontFamily:"'Share Tech Mono',monospace", fontSize:8, padding:"8px 6px",
              borderRadius:4, cursor:"pointer", letterSpacing:1.1, transition:"all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = `rgba(${btn.c === CRIT_RED ? "255,51,85" : "0,245,255"},0.14)`}
            onMouseLeave={e => e.currentTarget.style.background = `rgba(${btn.c === CRIT_RED ? "255,51,85" : "0,245,255"},0.05)`}
          >
            {btn.icon}{btn.l}
          </button>
        ))}
      </div>
    </div>
  );
}
