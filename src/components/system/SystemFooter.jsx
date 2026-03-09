"use client";
import { ShieldCheck } from "lucide-react";
import { AI_CYAN, HUMAN_MAG } from "@/lib/constants";

/**
 * SystemFooter — bottom status strip.
 */
export default function SystemFooter() {
  return (
    <div style={{
      height:24, background:"rgba(0,0,0,0.55)", borderTop:`1px solid ${AI_CYAN}18`,
      display:"flex", alignItems:"center", padding:"0 18px", justifyContent:"space-between",
      fontSize:8, color:`${AI_CYAN}38`, flexShrink:0,
    }}>
      <span style={{ display:"flex", alignItems:"center", gap:5 }}>
        <ShieldCheck size={9} color={`${AI_CYAN}66`} />
        SECURE_ENCRYPTED_LINK_ESTABLISHED
      </span>
      <span style={{ color:`${AI_CYAN}55` }}>
        ◆ <span style={{ color:AI_CYAN }}>CYAN</span> = AI AUTONOMOUS &nbsp;|&nbsp;
        ◆ <span style={{ color:HUMAN_MAG }}>MAGENTA</span> = HUMAN OVERRIDE
      </span>
      <span>AUTH: <span style={{ color:"#ffdd55" }}>COMMAND_OVERRIDE</span></span>
      <span>MESH: DYNAMIC_DAISY_CHAIN_v3</span>
    </div>
  );
}
