"use client";
import { SENSOR_COLOR } from "@/store/useFleetStore";

// ── Per-mode animation keyframes injected once into the document head ─────────
const KEYFRAMES = `
  /* Thermal: slow organic pulse */
  @keyframes thermalPulse {
    0%, 100% { transform: translate(-50%,-50%) scale(1);   opacity: 1;   }
    50%       { transform: translate(-50%,-50%) scale(1.4); opacity: 0.7; }
  }
  @keyframes thermalRing {
    0%   { opacity: 0.8; transform: translate(-50%,-50%) scale(0.7); }
    100% { opacity: 0;   transform: translate(-50%,-50%) scale(1.8); }
  }

  /* CV: crisp corner-bracket blink */
  @keyframes cvBlink {
    0%, 100% { opacity: 1;   }
    50%       { opacity: 0.3; }
  }
  @keyframes cvScan {
    0%   { transform: translateY(0%);   opacity: 0.8; }
    100% { transform: translateY(100%); opacity: 0;   }
  }

  /* Signal: hexagonal radio-wave expand */
  @keyframes sigExpand {
    0%   { r: 6;  opacity: 0.9; }
    100% { r: 30; opacity: 0;   }
  }
  @keyframes sigRotate {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }

`;

// ── Shared container dimensions ───────────────────────────────────────────────
const W = 120; // px — widget width
const H = 92;  // px — widget total height
const INNER_H = 68; // px — canvas area below title bar

// ── Title bar ─────────────────────────────────────────────────────────────────
function TitleBar({ label, color }) {
  return (
    <div style={{
      fontSize: 7, color, fontFamily: "'Share Tech Mono',monospace",
      padding: "3px 6px",
      borderBottom: `1px solid ${color}33`,
      letterSpacing: 1,
      display: "flex", alignItems: "center", gap: 5,
    }}>
      {/* Blinking status dot */}
      <span style={{
        display: "inline-block", width: 5, height: 5, borderRadius: "50%",
        background: color, boxShadow: `0 0 5px ${color}`,
        animation: "cvBlink 1.2s ease-in-out infinite",
      }} />
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THERMAL — soft radial heat-blob with expanding temperature rings
// ─────────────────────────────────────────────────────────────────────────────
function ThermalDisplay() {
  const color = SENSOR_COLOR.THERMAL;
  const cx = W / 2;
  const cy = INNER_H / 2;

  return (
    <svg width={W} height={INNER_H} style={{ display: "block" }}>
      {/* Background heat-field gradient */}
      <defs>
        <radialGradient id="thermGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ff2200" stopOpacity="0.6" />
          <stop offset="40%"  stopColor="#ff6600" stopOpacity="0.25" />
          <stop offset="100%" stopColor={color}   stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={26} fill="url(#thermGrad)"
        style={{ animation: "thermalPulse 2.2s ease-in-out infinite",
                 transformOrigin: `${cx}px ${cy}px` }} />

      {/* Expanding temperature-contour rings */}
      {[10, 17, 24].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke="#ff4400"
          strokeWidth="0.8"
          opacity="0.55"
          style={{
            animation: `thermalRing 2.4s ease-out ${i * 0.55}s infinite`,
            transformOrigin: `${cx}px ${cy}px`,
          }} />
      ))}

      {/* Hot-spot core */}
      <circle cx={cx} cy={cy} r={4}
        fill="#ff2200" opacity="0.95"
        style={{ filter: "blur(0.5px)" }} />
      <circle cx={cx} cy={cy} r={2} fill="#ffffff" opacity="0.9" />

      {/* Grid reference label */}
      <text x={4} y={INNER_H - 4} fill="#ff9966"
        fontFamily="'Share Tech Mono',monospace" fontSize="6">
        HEAT SIG: GRID 42-X
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CV — computer-vision bounding-box with classification label and scan-line
// ─────────────────────────────────────────────────────────────────────────────
function CVDisplay() {
  const color = SENSOR_COLOR.CV;
  const bx = 28, by = 14, bw = 64, bh = 40; // bounding-box geometry

  return (
    <svg width={W} height={INNER_H} style={{ display: "block" }}>
      <defs>
        {/* Clip-path constrains the scan-line to the bounding box */}
        <clipPath id="cvClip">
          <rect x={bx} y={by} width={bw} height={bh} />
        </clipPath>
      </defs>

      {/* Dim fill inside detection region */}
      <rect x={bx} y={by} width={bw} height={bh}
        fill={color} opacity="0.05" />

      {/* Corner-bracket markers — top-left */}
      {[
        [bx,      by,      bx+10, by,      bx,      by+10      ],
        [bx+bw,   by,      bx+bw-10, by,   bx+bw,   by+10      ],
        [bx,      by+bh,   bx+10, by+bh,   bx,      by+bh-10   ],
        [bx+bw,   by+bh,   bx+bw-10, by+bh, bx+bw,  by+bh-10   ],
      ].map(([x1,y1,x2,y2,x3,y3], i) => (
        <polyline key={i}
          points={`${x1},${y1} ${x2},${y2}`}
          fill="none" stroke={color} strokeWidth="1.4"
          style={{ animation: "cvBlink 1.8s ease-in-out infinite",
                   animationDelay: `${i * 0.15}s` }} />
      ))}
      {/* Vertical corner segments */}
      {[
        [bx,    by,    bx,    by+10  ],
        [bx+bw, by,    bx+bw, by+10  ],
        [bx,    by+bh, bx,    by+bh-10],
        [bx+bw, by+bh, bx+bw, by+bh-10],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={`v${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth="1.4"
          style={{ animation: "cvBlink 1.8s ease-in-out infinite",
                   animationDelay: `${i * 0.15}s` }} />
      ))}

      {/* Animated scan-line sweeping downward through the bounding box */}
      <line x1={bx} y1={by} x2={bx + bw} y2={by}
        stroke={color} strokeWidth="1"
        clipPath="url(#cvClip)"
        opacity="0.8"
        style={{ animation: "cvScan 1.6s linear infinite" }} />

      {/* Classification label */}
      <rect x={bx} y={by - 11} width={bw} height={10}
        fill={color} opacity="0.18" />
      <text x={bx + 2} y={by - 3} fill={color}
        fontFamily="'Share Tech Mono',monospace" fontSize="6.5"
        style={{ animation: "cvBlink 2s ease-in-out infinite" }}>
        CLASS: HUMAN  CONF: 94%
      </text>

      {/* Target centre crosshair */}
      <line x1={bx + bw/2 - 5} y1={by + bh/2} x2={bx + bw/2 + 5} y2={by + bh/2}
        stroke={color} strokeWidth="0.8" opacity="0.7" />
      <line x1={bx + bw/2} y1={by + bh/2 - 5} x2={bx + bw/2} y2={by + bh/2 + 5}
        stroke={color} strokeWidth="0.8" opacity="0.7" />

      <text x={4} y={INNER_H - 4} fill={`${color}99`}
        fontFamily="'Share Tech Mono',monospace" fontSize="6">
        CV LOCK: GRID 42-X
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL — hexagonal RF radio-wave rings radiating from source point
// ─────────────────────────────────────────────────────────────────────────────
function SignalDisplay() {
  const color = SENSOR_COLOR.SIGNAL;
  const cx = W / 2;
  const cy = INNER_H / 2;

  // Six points of a regular hexagon at a given radius
  const hexPoints = (r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");

  return (
    <svg width={W} height={INNER_H} style={{ display: "block" }}>
      {/* Slowly-rotating outer hex frame */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "sigRotate 8s linear infinite" }}>
        <polygon points={hexPoints(28)}
          fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      </g>

      {/* Counter-rotating inner hex */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "sigRotate 5s linear infinite reverse" }}>
        <polygon points={hexPoints(16)}
          fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Expanding radio-wave circles (SVG animation for smooth r change) */}
      {[0, 0.7, 1.4].map((delay, i) => (
        <circle key={i} cx={cx} cy={cy} fill="none"
          stroke={color} strokeWidth="1.2">
          <animate attributeName="r"   from="4" to="30" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.85" to="0" dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Signal source pip */}
      <circle cx={cx} cy={cy} r={3} fill={color} opacity="0.95" />
      <circle cx={cx} cy={cy} r={1.2} fill="#ffffff" />

      {/* Bearing tick-marks at 60° increments */}
      {Array.from({ length: 6 }, (_, i) => {
        const a  = (Math.PI / 3) * i;
        const r1 = 30, r2 = 33;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
            stroke={color} strokeWidth="0.8" opacity="0.5" />
        );
      })}

      <text x={4} y={INNER_H - 4} fill={`${color}99`}
        fontFamily="'Share Tech Mono',monospace" fontSize="6">
        RF SIG: -72 dBm · GRID 42-X
      </text>
    </svg>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ThermalZone — main export
// Renders the correct sensor-mode display based on the active drone's sensorMode.
// Falls back to THERMAL when no drone is selected or mode is unrecognised.
// ─────────────────────────────────────────────────────────────────────────────
export default function ThermalZone({ sensorMode = "THERMAL" }) {
  const color = SENSOR_COLOR[sensorMode] ?? SENSOR_COLOR.THERMAL;

  // Map each mode to its display component
  const displays = {
    THERMAL: <ThermalDisplay />,
    CV:      <CVDisplay />,
    SIGNAL:  <SignalDisplay />,
  };

  // Mode label shown in the title bar
  const labels = {
    THERMAL: "THERMAL_CAM · HEAT-SIG",
    CV:      "COMPUTER VISION · DETECT",
    SIGNAL:  "RF SCAN · PHONE SIG",
  };

  return (
    <>
      {/* Inject keyframes once — harmless if rendered multiple times */}
      <style>{KEYFRAMES}</style>

      <div style={{
        position: "absolute", bottom: 32, left: 14,
        width: W, height: H,
        background: "rgba(0,0,0,0.92)",
        border: `1px solid ${color}55`,
        borderRadius: 4,
        overflow: "hidden",
        // mix-blend-mode applied here so sensor colours layer correctly over TopoGrid
        mixBlendMode: "plus-lighter",
        boxShadow: `0 0 16px ${color}22, inset 0 0 8px ${color}08`,
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
      }}>
        <TitleBar label={labels[sensorMode] ?? labels.THERMAL} color={color} />
        <div style={{ background: "#040410" }}>
          {displays[sensorMode] ?? displays.THERMAL}
        </div>
      </div>
    </>
  );
}
