"use client";
import { memo, useMemo } from "react";
import { motion as MOTION } from "framer-motion";
import { SENSOR_COLOR, useFleetStore } from "@/store/useFleetStore";
import { AI_CYAN } from "@/lib/constants";

function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6; // pointy-top
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

function HexagonOutline({ r = 7, color = "var(--color-target)", opacity = 0.9, solid = false, segmented = false }) {
  const strokeW = 2;
  return (
    <polygon
      points={hexPoints(0, 0, r)}
      fill={solid ? color : "none"}
      stroke={color}
      strokeWidth={strokeW}
      strokeDasharray={segmented ? "3 1.6" : "none"}
      opacity={opacity}
      style={{ filter: "drop-shadow(0 0 12px var(--color-target))" }}
    />
  );
}

function GlobalRadar({ color }) {
  return (
    <g transform="translate(50,50)" style={{ mixBlendMode: "screen" }}>
      <MOTION.circle
        r={8}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        initial={{ opacity: 0.25 }}
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <MOTION.circle
        r={16}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 2.8, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <MOTION.circle
        r={24}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        initial={{ opacity: 0.18 }}
        animate={{ opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 3.2, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <MOTION.g
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      >
        <path d="M0,0 L24,0 A24,24 0 0,1 12,20 Z" fill={color} opacity={0.12} />
      </MOTION.g>
    </g>
  );
}
function RadarRipples() {
  return (
    <>
      {[0, 0.7, 1.4].map((delay, i) => (
        <MOTION.circle
          key={i}
          cx={0}
          cy={0}
          r={5}
          fill="none"
          stroke="var(--color-target)"
          strokeWidth={3}
          initial={{ r: 5, opacity: 0.9 }}
          animate={{ r: 50, opacity: 0 }}
          transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 15px #ff00ff)" }}
        />
      ))}
    </>
  );
}

function ThermalBloom({ id }) {
  return (
    <g style={{ filter: "blur(10px) drop-shadow(0 0 10px var(--color-active))" }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4000" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ff7a00" stopOpacity="0.5" />
          <stop offset="100%" stopColor={SENSOR_COLOR.THERMAL} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}_clip`}>
          <polygon points={hexPoints(0, 0, 7.2)} />
        </clipPath>
      </defs>
      <MOTION.circle
        r={6.5}
        fill={`url(#${id})`}
        clipPath={`url(#${id}_clip)`}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}

function Scanline({ width = 14 }) {
  const half = width / 2;
  return (
    <MOTION.line
      x1={-half}
      x2={half}
      y1={-half}
      y2={-half}
      stroke="url(#magScan)"
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={1}
      style={{ filter: "drop-shadow(0 0 12px var(--color-target))" }}
      initial={{ y1: -half, y2: -half }}
      animate={{ y1: half, y2: half }}
      transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
  );
}

function HexShutter({ r = 7.2 }) {
  return (
    <>
      {[0, 0.15, 0.3].map((delay, i) => (
        <MOTION.polygon
          key={i}
          points={hexPoints(0, 0, r)}
          fill="none"
          stroke="var(--color-target)"
          strokeWidth={2}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 0.92, 1.06, 1], opacity: [0.7, 1, 0.8, 0.7] }}
          transition={{ duration: 0.9, delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 12px var(--color-target))" }}
        />
      ))}
    </>
  );
}

function HUDForDrone({ d }) {
  const { scanPhase, isScanning } = d;
  const clipId = `hexGrad_${d.id}`;
  const baseColor = isScanning ? "var(--color-target)" : "var(--color-active)";
  return (
    <g transform={`translate(${d.x}, ${d.y})`} style={{ mixBlendMode: "screen" }}>
      {/* Phase ≥ 2: thermal bloom behind everything */}
      {isScanning && scanPhase >= 2 && <ThermalBloom id={clipId} />}

      {/* Core hexagon — persistent base, segmented stroke */}
      <HexagonOutline r={7.2} color={baseColor} opacity={0.9} solid={isScanning && scanPhase >= 3} segmented />

      {/* Radar ripples — render whenever scanning */}
      {isScanning && (
        <>
          <RadarRipples />
        </>
      )}

      {/* Phase ≥ 3: scanline + target lock label */}
      {isScanning && scanPhase >= 3 && (
        <MOTION.text
          x={9}
          y={-9}
          fill="var(--color-target)"
          fontSize="5"
          fontFamily="'Share Tech Mono', monospace"
          initial={{ opacity: 0.9, x: 0 }}
          animate={{ opacity: [0.9, 1, 0.9], x: [0, 0.4, -0.3, 0] }}
          transition={{ duration: 1.0, repeat: Infinity }}
          style={{ filter: "drop-shadow(0 0 12px var(--color-target))" }}
        >
          [ TARGET LOCKED: CIVILIAN ]
        </MOTION.text>
      )}

      {/* Phase ≥ 3: magenta hex shutter pulses */}
      {isScanning && scanPhase >= 3 && <HexShutter r={7.2} />}

      {isScanning && scanPhase >= 3 && <Scanline width={14} />}
    </g>
  );
}

function SensorCountsBar({ drones }) {
  const counts = {
    THERMAL: drones.filter(d => d.sensorMode === "THERMAL").length,
    CV:      drones.filter(d => d.sensorMode === "CV").length,
    SIGNAL:  drones.filter(d => d.sensorMode === "SIGNAL").length,
  };
  const items = [
    { label: "THERMAL", c: SENSOR_COLOR.THERMAL, value: counts.THERMAL },
    { label: "COMP-VIS", c: SENSOR_COLOR.CV,      value: counts.CV },
    { label: "RF-SIG",   c: SENSOR_COLOR.SIGNAL,  value: counts.SIGNAL },
  ];
  return (
    <div style={{
      position: "absolute", top: 6, left: 8, display: "flex", gap: 10,
      fontSize: 8, fontFamily: "'Share Tech Mono',monospace", pointerEvents: "none",
      mixBlendMode: "screen",
    }}>
      {items.map(it => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 2, background: it.c,
            boxShadow: `0 0 8px ${it.c}`,
          }} />
          <span style={{ color: it.c }}>{it.label}: {it.value}</span>
        </div>
      ))}
    </div>
  );
}

function EdgeParticles({ a, b, delay = 0 }) {
  return (
    <MOTION.circle
      r={0.8}
      fill="var(--color-target)"
      initial={{ cx: a.x, cy: a.y, opacity: 1 }}
      animate={{ cx: b.x, cy: b.y, opacity: [1, 0.8, 1] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, ease: "linear" }}
      style={{ filter: "drop-shadow(0 0 10px var(--color-target))" }}
    />
  );
}

export default memo(function CommanderView({ drones, showEdges = true, showCounts = true, showGlobalRadar = true }) {
  const crowdScales = useMemo(() => {
    return drones.map((d, i) => {
      const crowded = drones.some((o, j) => j !== i && Math.hypot(d.x - o.x, d.y - o.y) < 6);
      return crowded ? 0.95 : 1.0;
    });
  }, [drones]);

  const edges = useFleetStore.getState().getMeshEdges();

  return (
    <MOTION.div
      style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", zIndex: 9999, opacity: 1 }}
    >
      {showCounts && <SensorCountsBar drones={drones} />}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g>
          {showGlobalRadar && <GlobalRadar color={drones.some(d => d.isScanning) ? "var(--color-target)" : AI_CYAN} />}
        </g>
      </svg>
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="magScan" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-target)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-target)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {showEdges && (
          <g style={{ filter: "drop-shadow(0 0 12px var(--color-target))" }}>
            {edges.map((e) => (
              <g key={e.key}>
                <line
                  x1={e.a.x} y1={e.a.y}
                  x2={e.b.x} y2={e.b.y}
                  stroke="var(--color-target)"
                  strokeWidth={1.5}
                  opacity={0.9}
                  strokeDasharray="6 2"
                />
                <EdgeParticles a={e.a} b={e.b} delay={0} />
                <EdgeParticles a={e.a} b={e.b} delay={0.4} />
                <EdgeParticles a={e.a} b={e.b} delay={0.8} />
              </g>
            ))}
          </g>
        )}

        {/* Drone hex HUD */}
        {drones.map((d, idx) => (
          <g key={d.id} transform={`translate(0,0)`}>
            <HUDForDrone d={d} scale={crowdScales[idx]} />
          </g>
        ))}
      </svg>
    </MOTION.div>
  );
});
