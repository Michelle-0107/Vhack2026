"use client";
import { motion } from "framer-motion";
import { OK_GREEN, WARN_AMB, CRIT_RED } from "@/lib/constants";

export default function BatteryBar({ value }) {
  const color = value > 60 ? OK_GREEN : value > 25 ? WARN_AMB : CRIT_RED;
  const MotionDiv = motion.div;
  return (
    <div style={{
      position:"relative", height:4, background:"rgba(255,255,255,0.06)",
      borderRadius:2, overflow:"hidden", width:"100%", marginTop:3,
    }}>
      <MotionDiv
        initial={{ width:0 }}
        animate={{ width:`${value}%` }}
        transition={{ duration:0.9, ease:"easeOut" }}
        style={{ height:"100%", background:color, borderRadius:2, boxShadow:`0 0 5px ${color}88` }}
      />
    </div>
  );
}
