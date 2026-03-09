"use client";
import dynamic from "next/dynamic";
import SystemStatusBar from "@/components/system/SystemStatusBar";
import FleetPanel from "@/components/fleet/SwarmRegistry";
import AIIntelligenceHub from "@/components/logs/AIIntelligenceHub";
import SystemFooter from "@/components/system/SystemFooter";

const SimLoop = dynamic(() => import("@/components/system/SimLoop"), { ssr: false });
const MapGrid = dynamic(() => import("@/components/map/MapGrid"), { ssr: false });

export default function Home() {
  return (
    <div style={{ height: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
        <SimLoop />
        <SystemStatusBar />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <FleetPanel />
            <MapGrid />
            <AIIntelligenceHub />
        </div>
        <SystemFooter />
    </div>
  );
}
