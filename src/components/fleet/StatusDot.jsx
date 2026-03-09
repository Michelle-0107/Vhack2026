"use client";
import { OK_GREEN, WARN_AMB, CRIT_RED } from "@/lib/constants";

export default function StatusDot({ relay }) {
  const color =
    relay === "ACTIVE"     ? OK_GREEN  :
    relay === "STANDBY"    ? "#556677" :
    relay === "WARNING"    ? WARN_AMB  : CRIT_RED;
  return (
    <div style={{
      width:6, height:6, borderRadius:"50%",
      background:color, boxShadow:`0 0 5px ${color}`, flexShrink:0,
    }} />
  );
}
