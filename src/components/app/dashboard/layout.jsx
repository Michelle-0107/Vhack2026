import { AI_CYAN } from "@/lib/constants";

export const metadata = {
  title:       "BEACON-NET · HITL Command v4.2",
  description: "Decentralized drone swarm command interface with human-in-the-loop control.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin:0, padding:0, background:"#02080f", overflow:"hidden" }}>
        <style>{`
          *  { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar        { width: 3px; }
          ::-webkit-scrollbar-track  { background: #010810; }
          ::-webkit-scrollbar-thumb  { background: #00f5ff22; border-radius: 2px; }

          @keyframes scanLine    { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
          @keyframes thermalPulse{ 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1} 50%{transform:translate(-50%,-50%) scale(1.35);opacity:0.8} }
          @keyframes thermalRing { 0%{opacity:0.8;transform:translate(-50%,-50%) scale(0.8)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.7)} }
          @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.2} }
          @keyframes droneHover  { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-4px)} }
          @keyframes sweep       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes meshPulse   { 0%,100%{opacity:0.42} 50%{opacity:0.82} }
          @keyframes healPulse   { 0%,100%{opacity:0.9;stroke-dashoffset:0} 50%{opacity:0.6;stroke-dashoffset:20} }
          @keyframes pulseRing   { 0%{opacity:0.7;transform:scale(0.85)} 100%{opacity:0;transform:scale(1.5)} }
          @keyframes deployBurst { 0%{box-shadow:0 0 0 0 rgba(0,255,136,0.9)} 100%{box-shadow:0 0 0 24px rgba(0,255,136,0)} }
          @keyframes gapWarning  { 0%,100%{opacity:0.15} 50%{opacity:0.45} }
        `}</style>
        {children}
      </body>
    </html>
  );
}
