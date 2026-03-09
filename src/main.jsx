import React from 'react';
import { createRoot } from 'react-dom/client';
import SystemStatusBar from "@/components/system/SystemStatusBar";
import FleetPanel from "@/components/fleet/SwarmRegistry";
import MapGrid from "@/components/map/MapGrid";
import AIIntelligenceHub from "@/components/logs/AIIntelligenceHub";
import SystemFooter from "@/components/system/SystemFooter";
import './index.css';

const App = () => (
    <div style={{ height: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
        <SystemStatusBar />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <FleetPanel />
            <MapGrid />
            <AIIntelligenceHub />
        </div>
        <SystemFooter />
    </div>
);

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);