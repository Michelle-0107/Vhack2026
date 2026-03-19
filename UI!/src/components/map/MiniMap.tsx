/**
 * src/components/map/MiniMap.tsx
 */
import { useRef, useCallback, useEffect, useState } from "react";
import {
  AI_CYAN, OK_GREEN, CRIT_RED,
  WORLD_W, WORLD_H, WORLD_CENTER, MISSION_RADIUS,
  GRID_W, GRID_H, GRID_CELL, MAP_COLOR, LABEL_PRIMARY, LABEL_GLOW,
} from "../../tokens";
import { dist2d } from "../../utils";
import type { Drone, TargetMarker, Camera } from "../../types";

interface Props {
  drones: Drone[];
  targetMarkers: TargetMarker[];
  selectedTargetId: string | null;
  fogOfWar: Set<number>;
  coverageMap: Map<number, number>;
  probabilityMap: Map<number, number>;
  camera: Camera;
  screenSize: { w: number; h: number };
  onNavigate: (wx: number, wy: number) => void;
  activeDrone: string | null;
}

const MM_W = 160, MM_H = 120;
const SCALE = MM_W / WORLD_W;

export function MiniMap({
  drones, targetMarkers, selectedTargetId, fogOfWar,
  coverageMap, probabilityMap, camera, screenSize, onNavigate, activeDrone,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, MM_W, MM_H);
    ctx.fillStyle = "rgba(0,2,10,0.97)"; ctx.fillRect(0, 0, MM_W, MM_H);
    const now3 = Date.now() / 1000;

    if (fogOfWar.size > 0) {
      ctx.fillStyle = "rgba(0,3,12,0.90)"; ctx.fillRect(0, 0, MM_W, MM_H);
      ctx.globalCompositeOperation = "destination-out";
      fogOfWar.forEach(idx => {
        const col = idx % GRID_W, row = Math.floor(idx / GRID_W);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(col * GRID_CELL * SCALE, row * GRID_CELL * SCALE, GRID_CELL * SCALE + 0.5, GRID_CELL * SCALE + 0.5);
      });
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fillStyle = "rgba(0,3,12,0.80)"; ctx.fillRect(0, 0, MM_W, MM_H);
    }

    coverageMap.forEach((val, idx) => {
      if (!fogOfWar.has(idx)) return;
      if (probabilityMap.has(idx)) return;
      const col = idx % GRID_W, row = Math.floor(idx / GRID_W);
      const t = Math.min(val / 12, 1);
      ctx.fillStyle = `rgba(30,100,255,${(0.25 + t * 0.40).toFixed(2)})`;
      ctx.fillRect(col * GRID_CELL * SCALE, row * GRID_CELL * SCALE, GRID_CELL * SCALE + 0.5, GRID_CELL * SCALE + 0.5);
    });

    probabilityMap.forEach((val, idx) => {
      if (!fogOfWar.has(idx)) return;
      const col = idx % GRID_W, row = Math.floor(idx / GRID_W);
      if (val === -1) ctx.fillStyle = MAP_COLOR.scannedNoTarget.fill;
      else if (val >= 3) ctx.fillStyle = MAP_COLOR.targetConfirmed.fill;
      else ctx.fillStyle = MAP_COLOR.probableTarget.fill;
      ctx.fillRect(col * GRID_CELL * SCALE, row * GRID_CELL * SCALE, GRID_CELL * SCALE + 0.5, GRID_CELL * SCALE + 0.5);
    });

    const cx = WORLD_CENTER.x * SCALE, cy = WORLD_CENTER.y * SCALE;

    ctx.strokeStyle = "rgba(0,200,255,0.16)"; ctx.lineWidth = 0.4; ctx.beginPath();
    for (let r = 0; r <= GRID_H; r += 5) { const my2 = r * GRID_CELL * SCALE; ctx.moveTo(0, my2); ctx.lineTo(MM_W, my2); }
    for (let c = 0; c <= GRID_W; c += 5) { const mx2 = c * GRID_CELL * SCALE; ctx.moveTo(mx2, 0); ctx.lineTo(mx2, MM_H); }
    ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, MISSION_RADIUS * SCALE, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,51,85,0.4)"; ctx.lineWidth = 0.8; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);

    for (let i = 1; i <= 3; i++) {
      ctx.beginPath(); ctx.arc(cx, cy, 500 * i * SCALE * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,210,255,0.14)"; ctx.lineWidth = 0.5; ctx.stroke();
    }

    drones.forEach((a, i) => drones.slice(i + 1).forEach(b => {
      if (dist2d(a.x, a.y, b.x, b.y) > 800) return;
      ctx.beginPath(); ctx.moveTo(a.x * SCALE, a.y * SCALE); ctx.lineTo(b.x * SCALE, b.y * SCALE);
      ctx.strokeStyle = a.colour; ctx.lineWidth = 0.4; ctx.globalAlpha = 0.18; ctx.stroke(); ctx.globalAlpha = 1;
    }));

    targetMarkers.forEach(m => {
      const mx = m.wx * SCALE, my = m.wy * SCALE;
      const isSelected = m.id === selectedTargetId;
      const mmColor = m.isRescued ? OK_GREEN : (isSelected ? "#ffdd00" : "#ff2244");
      if (isSelected) {
        const pulse = Math.sin(now3 * 6) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(mx, my, 4.5 + pulse * 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = mmColor; ctx.lineWidth = 1; ctx.globalAlpha = 0.7 + pulse * 0.3; ctx.stroke(); ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fillStyle = mmColor; ctx.fill();
      } else {
        const pulse = Math.sin(now3 * 3) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(mx, my, 2.5 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = mmColor; ctx.globalAlpha = 0.7 + pulse * 0.3; ctx.fill(); ctx.globalAlpha = 1;
      }
    });

    drones.forEach(d => {
      const dx = d.x * SCALE, dy = d.y * SCALE;
      const isActive = d.id === activeDrone;
      ctx.fillStyle = d.colour; ctx.globalAlpha = isActive ? 1 : 0.75;
      ctx.beginPath();
      ctx.moveTo(dx, dy - 3); ctx.lineTo(dx + 2, dy + 2); ctx.lineTo(dx, dy + 0.8); ctx.lineTo(dx - 2, dy + 2); ctx.closePath(); ctx.fill();
      if (isActive) {
        const pulse = Math.sin(now3 * 4) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(dx, dy, 4 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = d.colour; ctx.lineWidth = 1; ctx.globalAlpha = 0.6 + pulse * 0.3; ctx.stroke();
      }
      if (d.battery <= 20) {
        const bp = Math.sin(now3 * 4) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(dx, dy, 3.5 + bp, 0, Math.PI * 2);
        ctx.strokeStyle = CRIT_RED; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6 + bp * 0.4; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });

    const vx0 = (camera.x - screenSize.w / 2 * camera.zoom) * SCALE;
    const vy0 = (camera.y - screenSize.h / 2 * camera.zoom) * SCALE;
    const vw = screenSize.w * camera.zoom * SCALE;
    const vh = screenSize.h * camera.zoom * SCALE;
    if (!(vw >= MM_W * 0.95 && vh >= MM_H * 0.95)) {
      ctx.strokeStyle = AI_CYAN; ctx.lineWidth = 1; ctx.setLineDash([3, 2]); ctx.globalAlpha = 0.8;
      ctx.strokeRect(vx0, vy0, vw, vh);
      ctx.fillStyle = "rgba(51,250,255,0.04)"; ctx.fillRect(vx0, vy0, vw, vh);
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  }, [drones, targetMarkers, selectedTargetId, fogOfWar, coverageMap, probabilityMap, camera, screenSize, activeDrone]);

  useEffect(() => {
    let id: number;
    const loop = () => { draw(); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [draw]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    onNavigate((e.clientX - rect.left) / MM_W * WORLD_W, (e.clientY - rect.top) / MM_H * WORLD_H);
  }, [onNavigate]);

  if (collapsed) {
    return (
      <div style={{ position: "absolute", bottom: 52, left: 18, zIndex: 22 }}>
        <button onClick={() => setCollapsed(false)} title="Expand Mini Map"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,2,10,0.96)", border: `1px solid ${AI_CYAN}44`, color: AI_CYAN, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          🗺
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", bottom: 52, left: 18, zIndex: 22, background: "rgba(0,2,10,0.96)", border: `1px solid ${AI_CYAN}44`, borderRadius: 6, overflow: "hidden", boxShadow: `0 0 18px rgba(0,0,0,0.8), 0 0 8px ${AI_CYAN}18` }}>
      <div style={{ height: 26, background: `rgba(0,245,255,0.06)`, borderBottom: `1px solid ${AI_CYAN}28`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: AI_CYAN, boxShadow: `0 0 5px ${AI_CYAN}` }} />
          <span style={{ fontSize: 10, color: LABEL_PRIMARY, fontFamily: "'Orbitron',sans-serif", letterSpacing: 1.5, fontWeight: 700, textShadow: LABEL_GLOW }}>MINI MAP</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {targetMarkers.length > 0 && (
            <span style={{ fontSize: 10, color: "#ff4466", letterSpacing: 0.5, fontFamily: "'Share Tech Mono',monospace", fontWeight: 700 }}>◉ {targetMarkers.length}</span>
          )}
          <span style={{ fontSize: 10, color: "#E0FFFF", fontFamily: "'Share Tech Mono',monospace", fontWeight: 600 }}>{drones.length} UAV</span>
          <button onClick={() => setCollapsed(true)} style={{ background: "transparent", border: "none", color: `${AI_CYAN}77`, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
        </div>
      </div>
      <canvas ref={canvasRef} width={MM_W} height={MM_H} style={{ display: "block", cursor: "crosshair" }} onClick={handleClick} />
    </div>
  );
}