/**
 * src/components/map/MapCanvas.tsx
 *
 * Deterministic rendering engine using HTML Canvas.
 * - Draws: fog-of-war, coverage/probability maps, grid, topo rings, base station,
 * mesh links (STRONG/WEAK/relay), scan effects, drone trails, drone icons,
 * target markers, selected target HUD panel, track mode overlay.
 */

import { useRef, useEffect, useCallback, useMemo } from "react";
import {
  AI_CYAN, HUMAN_MAG, OK_GREEN, WARN_AMB, CRIT_RED,
  WORLD_CENTER, BASE_STATION_COORD,
  SCAN_RADIUS_WORLD, SENSOR_COLOR, GRID_CELL, GRID_W, GRID_H,
  MISSION_RADIUS, MAP_COLOR,
} from "../../tokens";
import { worldToScreen } from "../../utils";
import type { FleetState } from "../../hooks/useFleet";
import type { CameraControls } from "../../hooks/useCamera";

interface Props {
  fleet: FleetState;
  cameraCtrl: CameraControls;
  screenSize: { w: number; h: number };
  trackMode: boolean;
}

// Stores the "visual" position of each drone so we can smoothly animate it
const visualPositions = new Map<string, { x: number; y: number }>();

// Smoothly calculates the steps between the old position and the new position
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export function MapCanvas({ fleet, cameraCtrl, screenSize, trackMode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { camera } = cameraCtrl;
  const {
    drones, coverageMap, probabilityMap, fogOfWar,
    targetMarkers, activeDrone, selectedTargetId, recalibrateFlash, getMeshEdges,
  } = fleet;

  const edges = useMemo(() => getMeshEdges(drones), [drones, getMeshEdges]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const toS = (wx: number, wy: number) => worldToScreen(wx, wy, camera, W, H);
    const now = Date.now() / 1000;

    // ── Background ────────────────────────────────────────────────────────────
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    bgGrad.addColorStop(0, "#0A1520"); bgGrad.addColorStop(1, "#0F141A");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    const centerS = toS(WORLD_CENTER.x, WORLD_CENTER.y);

    // ── Dormant state ─────────────────────────────────────────────────────────
    if (drones.length === 0) {
      ctx.save();
      ctx.fillStyle = "rgba(51,250,255,0.07)";
      ctx.font = "bold 28px 'Orbitron',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SYSTEM DORMANT / NO SIGNAL", W / 2, H / 2);
      ctx.textAlign = "left";
      ctx.restore();
      return;
    }

    // ── Fog of War ────────────────────────────────────────────────────────────
    ctx.save();
    ctx.fillStyle = "rgba(0,3,10,0.68)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "destination-out";
    const fogC0 = Math.floor((camera.x - W / 2 * camera.zoom) / GRID_CELL) - 1;
    const fogC1 = Math.ceil((camera.x + W / 2 * camera.zoom) / GRID_CELL) + 1;
    const fogR0 = Math.floor((camera.y - H / 2 * camera.zoom) / GRID_CELL) - 1;
    const fogR1 = Math.ceil((camera.y + H / 2 * camera.zoom) / GRID_CELL) + 1;
    for (let row = Math.max(0, fogR0); row <= Math.min(GRID_H - 1, fogR1); row++) {
      for (let col = Math.max(0, fogC0); col <= Math.min(GRID_W - 1, fogC1); col++) {
        if (!fogOfWar.has(row * GRID_W + col)) continue;
        const s0 = toS(col * GRID_CELL, row * GRID_CELL);
        const s1 = toS((col + 1) * GRID_CELL, (row + 1) * GRID_CELL);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(s0.sx - 1, s0.sy - 1, s1.sx - s0.sx + 2, s1.sy - s0.sy + 2);
      }
    }
    ctx.globalCompositeOperation = "source-over"; ctx.restore();

    // ── Coverage Map (blue) ───────────────────────────────────────────────────
    if (coverageMap.size > 0) {
      const sc0 = Math.floor((camera.x - W / 2 * camera.zoom) / GRID_CELL);
      const sc1 = Math.ceil((camera.x + W / 2 * camera.zoom) / GRID_CELL);
      const sr0 = Math.floor((camera.y - H / 2 * camera.zoom) / GRID_CELL);
      const sr1 = Math.ceil((camera.y + H / 2 * camera.zoom) / GRID_CELL);
      for (let row = Math.max(0, sr0); row <= Math.min(GRID_H - 1, sr1); row++) {
        for (let col = Math.max(0, sc0); col <= Math.min(GRID_W - 1, sc1); col++) {
          const idx = row * GRID_W + col;
          const val = coverageMap.get(idx);
          if (!val || !fogOfWar.has(idx)) continue;
          if (probabilityMap.has(idx)) continue;
          const t = Math.min(val / 12, 1);
          const s0 = toS(col * GRID_CELL, row * GRID_CELL);
          const s1 = toS((col + 1) * GRID_CELL, (row + 1) * GRID_CELL);
          ctx.fillStyle = `rgba(30,100,255,${(0.22 + t * 0.33).toFixed(2)})`;
          ctx.fillRect(s0.sx, s0.sy, s1.sx - s0.sx, s1.sy - s0.sy);
        }
      }
    }

    // ── Probability Map (orange/red) ──────────────────────────────────────────
    if (probabilityMap.size > 0) {
      const sc0 = Math.floor((camera.x - W / 2 * camera.zoom) / GRID_CELL);
      const sc1 = Math.ceil((camera.x + W / 2 * camera.zoom) / GRID_CELL);
      const sr0 = Math.floor((camera.y - H / 2 * camera.zoom) / GRID_CELL);
      const sr1 = Math.ceil((camera.y + H / 2 * camera.zoom) / GRID_CELL);
      for (let row = Math.max(0, sr0); row <= Math.min(GRID_H - 1, sr1); row++) {
        for (let col = Math.max(0, sc0); col <= Math.min(GRID_W - 1, sc1); col++) {
          const idx = row * GRID_W + col;
          const val = probabilityMap.get(idx);
          if (val === undefined || !fogOfWar.has(idx)) continue;
          const s0 = toS(col * GRID_CELL, row * GRID_CELL);
          const s1 = toS((col + 1) * GRID_CELL, (row + 1) * GRID_CELL);
          const px = s1.sx - s0.sx, py = s1.sy - s0.sy;
          if (val === -1) { ctx.fillStyle = MAP_COLOR.scannedNoTarget.fill; ctx.strokeStyle = MAP_COLOR.scannedNoTarget.stroke; }
          else if (val >= 3) { ctx.fillStyle = MAP_COLOR.targetConfirmed.fill; ctx.strokeStyle = MAP_COLOR.targetConfirmed.stroke; }
          else { ctx.fillStyle = MAP_COLOR.probableTarget.fill; ctx.strokeStyle = MAP_COLOR.probableTarget.stroke; }
          ctx.lineWidth = 0.6;
          ctx.fillRect(s0.sx, s0.sy, px, py);
          ctx.strokeRect(s0.sx, s0.sy, px, py);
        }
      }
    }

    // ── Grid ─────────────────────────────────────────────────────────────────
    {
      const cellPx = GRID_CELL / camera.zoom;
      const sc0 = Math.floor((camera.x - W / 2 * camera.zoom) / GRID_CELL);
      const sc1 = Math.ceil((camera.x + W / 2 * camera.zoom) / GRID_CELL);
      const sr0 = Math.floor((camera.y - H / 2 * camera.zoom) / GRID_CELL);
      const sr1 = Math.ceil((camera.y + H / 2 * camera.zoom) / GRID_CELL);
      const lineAlpha = Math.min(0.18, Math.max(0.10, cellPx * 0.012));
      ctx.save();
      ctx.strokeStyle = `rgba(0,200,255,${lineAlpha.toFixed(3)})`;
      ctx.lineWidth = 0.5; ctx.globalAlpha = 1; ctx.beginPath();
      for (let c = sc0; c <= sc1; c++) { const { sx } = toS(c * GRID_CELL, 0); if (sx < 0 || sx > W) continue; ctx.moveTo(sx, 0); ctx.lineTo(sx, H); }
      for (let r = sr0; r <= sr1; r++) { const { sy } = toS(0, r * GRID_CELL); if (sy < 0 || sy > H) continue; ctx.moveTo(0, sy); ctx.lineTo(W, sy); }
      ctx.stroke();
      if (cellPx > 10) {
        const crossAlpha = Math.min(0.38, cellPx * 0.018);
        const armLen = Math.min(5.0, cellPx * 0.14);
        ctx.strokeStyle = `rgba(0,230,255,${crossAlpha.toFixed(3)})`; ctx.lineWidth = 0.9; ctx.beginPath();
        for (let r = sr0; r <= sr1; r++) {
          for (let c = sc0; c <= sc1; c++) {
            const { sx, sy } = toS(c * GRID_CELL, r * GRID_CELL);
            if (sx < -armLen || sx > W + armLen || sy < -armLen || sy > H + armLen) continue;
            ctx.moveTo(sx - armLen, sy); ctx.lineTo(sx + armLen, sy);
            ctx.moveTo(sx, sy - armLen); ctx.lineTo(sx, sy + armLen);
          }
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Topo Rings ────────────────────────────────────────────────────────────
    ctx.save(); ctx.globalAlpha = 0.27;
    for (let i = 1; i <= 6; i++) {
      const r = (500 * i) / camera.zoom;
      ctx.beginPath(); ctx.ellipse(centerS.sx, centerS.sy, r * 1.1, r * 0.9, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#00d8ff"; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();

    // ── Mission Boundary ──────────────────────────────────────────────────────
    const boundR = MISSION_RADIUS / camera.zoom;
    ctx.save(); ctx.beginPath(); ctx.arc(centerS.sx, centerS.sy, boundR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,51,85,0.45)"; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();

    // ── Radar Sweep ───────────────────────────────────────────────────────────
    const sweepAngle = (now * 0.8) % (Math.PI * 2);
    ctx.save(); ctx.translate(centerS.sx, centerS.sy); ctx.rotate(sweepAngle);
    const sweepGrad = ctx.createLinearGradient(0, 0, Math.min(W, H) * 0.5, 0);
    sweepGrad.addColorStop(0, "rgba(0,245,255,0.12)"); sweepGrad.addColorStop(1, "rgba(0,245,255,0)");
    ctx.fillStyle = sweepGrad; ctx.globalAlpha = 0.09;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, Math.min(W, H) * 0.6, -0.25, 0.25); ctx.closePath(); ctx.fill(); ctx.restore();

    // ── Base Station ──────────────────────────────────────────────────────────
    {
      const { sx: bsx, sy: bsy } = toS(BASE_STATION_COORD.x, BASE_STATION_COORD.y);
      const hexR = Math.max(10, 22 / camera.zoom);
      const pulse = Math.sin(now * 1.6) * 0.5 + 0.5;
      ctx.save();
      ctx.beginPath(); ctx.arc(bsx, bsy, hexR * 1.85 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = OK_GREEN; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.18 + pulse * 0.12; ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = bsx + hexR * Math.cos(angle), hy = bsy + hexR * Math.sin(angle);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = `${OK_GREEN}18`; ctx.globalAlpha = 0.85; ctx.fill();
      ctx.strokeStyle = OK_GREEN; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.75 + pulse * 0.2; ctx.stroke();
      const arm = hexR * 0.48;
      ctx.strokeStyle = OK_GREEN; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55 + pulse * 0.3;
      ctx.beginPath();
      ctx.moveTo(bsx - arm, bsy); ctx.lineTo(bsx + arm, bsy);
      ctx.moveTo(bsx, bsy - arm); ctx.lineTo(bsx, bsy + arm);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(bsx, bsy, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = OK_GREEN; ctx.globalAlpha = 1; ctx.shadowColor = OK_GREEN; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      if (camera.zoom < 2.5) {
        const labelText = "BASE STATION";
        ctx.font = "bold 8px 'Orbitron',sans-serif";
        const tw = ctx.measureText(labelText).width;
        const labelY = bsy - hexR * 1.55;
        ctx.globalAlpha = 0.80; ctx.fillStyle = "rgba(0,0,0,0.72)";
        ctx.fillRect(bsx - tw / 2 - 4, labelY - 10, tw + 8, 13);
        ctx.globalAlpha = 1; ctx.fillStyle = OK_GREEN; ctx.textAlign = "center";
        ctx.fillText(labelText, bsx, labelY); ctx.textAlign = "left";
      }
      ctx.restore();
    }

    // ── Recalibrate Flash ─────────────────────────────────────────────────────
    if (recalibrateFlash) {
      drones.forEach(d => {
        // Fallback to exactly d.x, d.y if visual position fails during flash
        const visPos = visualPositions.get(d.id) || { x: d.x, y: d.y };
        const { sx, sy } = toS(visPos.x, visPos.y);
        ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, 28, 0, Math.PI * 2);
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.restore();
      });
    }

    // ── Drone Scan Effects ────────────────────────────────────────────────────
    drones.forEach((d, di) => {
      const visPos = visualPositions.get(d.id) || { x: d.x, y: d.y };
      const { sx, sy } = toS(visPos.x, visPos.y);
      const sensorR = SCAN_RADIUS_WORLD / camera.zoom;
      const sColor = SENSOR_COLOR[d.sensorMode] || AI_CYAN;
      const isActive = d.id === activeDrone;
      const t = (now / 3 + di * 0.3) % 1;
      ctx.save(); ctx.globalAlpha = isActive ? (1 - t) * 0.42 : (1 - t) * 0.13;
      ctx.beginPath(); ctx.arc(sx, sy, sensorR * (0.6 + t * 0.7), 0, Math.PI * 2);
      ctx.strokeStyle = sColor; ctx.lineWidth = isActive ? 1.5 : 0.8; ctx.stroke(); ctx.restore();
      if (d.isScanning && d.scanPhase >= 1) {
        const scanColors = [HUMAN_MAG, "#ff4400", OK_GREEN];
        const ac = scanColors[Math.min(d.scanPhase - 1, 2)];
        for (let ring = 0; ring < 3; ring++) {
          const tR = ((now / 2.4) + ring * 0.33) % 1;
          ctx.save(); ctx.globalAlpha = (1 - tR) * (isActive ? 0.80 : 0.50);
          ctx.beginPath(); ctx.arc(sx, sy, tR * sensorR * 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = ac; ctx.lineWidth = isActive ? 2.0 : 1.2; ctx.stroke(); ctx.restore();
        }
      }
    });

    // ── Mesh Links (STRONG/WEAK/relay) ────────────────────────────────────────
    const linkedDroneIds = new Set<string>();
    edges.forEach(e => { const m = e.key.match(/DR-\d+/g) ?? []; m.forEach(id => linkedDroneIds.add(id)); });

    edges.forEach(e => {
      const a = toS(e.ax, e.ay), b = toS(e.bx, e.by);
      ctx.save(); ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
      if (e.linkState === "STRONG") {
        ctx.strokeStyle = e.isRelay ? "#44ffaa" : OK_GREEN; ctx.lineWidth = 0.9; ctx.globalAlpha = 0.32; ctx.setLineDash([]); ctx.stroke();
        const flowT = (now * 0.7 + (e.ax * 0.001)) % 1;
        const fx = a.sx + (b.sx - a.sx) * flowT, fy = a.sy + (b.sy - a.sy) * flowT;
        ctx.beginPath(); ctx.arc(fx, fy, 1.6, 0, Math.PI * 2); ctx.fillStyle = OK_GREEN; ctx.globalAlpha = 0.65; ctx.fill();
      } else {
        ctx.strokeStyle = e.isRelay ? "#ffcc44" : WARN_AMB; ctx.lineWidth = 0.6;
        ctx.globalAlpha = e.isRelay ? (Math.sin(now * 3) * 0.15 + 0.22) : 0.18;
        ctx.setLineDash([4, 7]); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore();
    });

    // ── NO LINK halos ─────────────────────────────────────────────────────────
    drones.forEach(d => {
      if (d.status !== "DEPLOYED" || linkedDroneIds.has(d.id)) return;
      const visPos = visualPositions.get(d.id) || { x: d.x, y: d.y };
      const { sx, sy } = toS(visPos.x, visPos.y);
      ctx.save();
      ctx.beginPath(); ctx.arc(sx, sy, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.55 + Math.sin(now * 2) * 0.2;
      ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = 0.85; ctx.fillStyle = "#888888";
      ctx.font = "bold 7px 'Share Tech Mono',monospace"; ctx.fillText("NO LINK", sx - 14, sy - 22);
      ctx.restore();
    });

    // ── Target Markers (non-selected) ─────────────────────────────────────────
    targetMarkers.forEach(m => {
      if (m.id === selectedTargetId) return;
      const { sx, sy } = toS(m.wx, m.wy);
      const pulse = Math.sin(now * 3) * 0.5 + 0.5;
      const mColor = m.isRescued ? OK_GREEN : "#ff2244";
      ctx.save();
      ctx.beginPath(); ctx.arc(sx, sy, 5 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = mColor; ctx.lineWidth = 1; ctx.globalAlpha = 0.4 + pulse * 0.4; ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fillStyle = mColor; ctx.fill();
      ctx.strokeStyle = mColor; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(sx - 9, sy); ctx.lineTo(sx - 4, sy); ctx.moveTo(sx + 4, sy); ctx.lineTo(sx + 9, sy);
      ctx.moveTo(sx, sy - 9); ctx.lineTo(sx, sy - 4); ctx.moveTo(sx, sy + 4); ctx.lineTo(sx, sy + 9);
      ctx.stroke();
      if (camera.zoom < 3) {
        const mLabelColor = m.isRescued ? OK_GREEN : "#ff4466";
        const mSubText = m.isRescued ? "RESCUED" : `${m.confidence}%`;
        ctx.globalAlpha = 0.82; ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(sx + 10, sy - 11, 56, 20);
        ctx.globalAlpha = 1; ctx.fillStyle = mLabelColor; ctx.font = "bold 9px 'Share Tech Mono',monospace"; ctx.fillText(m.id, sx + 13, sy);
        ctx.fillStyle = m.isRescued ? `rgba(0,255,136,0.85)` : "rgba(255,180,180,0.9)"; ctx.font = "8px 'Share Tech Mono',monospace"; ctx.fillText(mSubText, sx + 13, sy + 9);
      }
      ctx.restore();
    });

    // ── Drone Trails ──────────────────────────────────────────────────────────
    drones.forEach(d => {
      if (d.trail.length < 2) return;
      const isActive = d.id === activeDrone;
      ctx.save();
      for (let i = 1; i < d.trail.length; i++) {
        const { sx: x1, sy: y1 } = toS(d.trail[i - 1].x, d.trail[i - 1].y);
        const { sx: x2, sy: y2 } = toS(d.trail[i].x, d.trail[i].y);
        ctx.globalAlpha = (1 - i / d.trail.length) * (isActive ? 0.70 : 0.38);
        ctx.strokeStyle = d.colour; ctx.lineWidth = isActive ? 1.2 : 0.7;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.restore();
    });

    // ── Drone Icons (Smooth Lerp Render) ───────────────────────────────────────────
    drones.forEach(d => {
      // 1. Sanitize the target coordinate from the backend
      const targetX = (typeof d.x === 'number' && !isNaN(d.x)) ? d.x : WORLD_CENTER.x;
      const targetY = (typeof d.y === 'number' && !isNaN(d.y)) ? d.y : WORLD_CENTER.y;

      // 2. Get the current animated position
      let currentPos = visualPositions.get(d.id);

      // 3. Initialize or Animate (Lerp)
      if (!currentPos || isNaN(currentPos.x) || isNaN(currentPos.y)) {
        // First frame: Snap immediately to target so it doesn't draw off-screen or crash
        currentPos = { x: targetX, y: targetY };
      } else {
        // Every other frame: Move smoothly towards target
        currentPos.x = lerp(currentPos.x, targetX, 0.05);
        currentPos.y = lerp(currentPos.y, targetY, 0.05);
      }

      // Save for the next frame
      visualPositions.set(d.id, currentPos);

      // 4. Convert to Screen Coordinates
      const { sx, sy } = toS(currentPos.x, currentPos.y);

      // 5. Ultimate Failsafe (Aborts drawing this specific drone if math fails)
      if (isNaN(sx) || isNaN(sy)) return;

      const hasNoLink = d.status === "DEPLOYED" && !linkedDroneIds.has(d.id);
      const col = hasNoLink ? "#666666" : (d.colour || AI_CYAN);
      const isActive = d.id === activeDrone;
      const alpha = isActive ? 1.0 : activeDrone ? 0.52 : 0.90;
      const iconScale = isActive ? 1.4 : 1.0;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(iconScale, iconScale);

      // Draw Selected Glow
      if (isActive) {
        for (let ring = 0; ring < 3; ring++) {
          const tR = ((now * 1.2) + ring * 0.33) % 1;
          ctx.beginPath(); ctx.arc(0, 0, 20 + tR * 34, 0, Math.PI * 2);
          ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.globalAlpha = (1 - tR) * 0.72; ctx.stroke();
        }
        const solidPulse = Math.sin(now * 4) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(0, 0, 16 + solidPulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = col; ctx.lineWidth = 2.0; ctx.globalAlpha = 0.55 + solidPulse * 0.35; ctx.stroke();
        ctx.globalAlpha = 1;
        if (camera.zoom < 3) {
          ctx.save(); ctx.scale(1 / iconScale, 1 / iconScale);
          const blink = Math.sin(now * 4) > 0;
          const trackW = trackMode ? 110 : 96; const trackH = 15;
          const trackX = -trackW / 2, trackY = -44;
          ctx.fillStyle = col; ctx.globalAlpha = 0.18; ctx.fillRect(trackX - 1, trackY - 1, trackW + 2, trackH + 2);
          ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.globalAlpha = blink ? 0.95 : 0.55; ctx.strokeRect(trackX, trackY, trackW, trackH);
          ctx.globalAlpha = blink ? 1 : 0.65; ctx.fillStyle = col; ctx.font = `bold 8px 'Orbitron',sans-serif`;
          ctx.textAlign = "center"; ctx.fillText(trackMode ? `◎ TRACKING ${d.id}` : `[ ${d.id} ]`, 0, trackY + 10); ctx.textAlign = "left";
          ctx.restore();
        }
      }

      // Draw The Drone Triangle
      ctx.shadowColor = col; ctx.shadowBlur = isActive ? 22 : 8;
      ctx.fillStyle = col; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(5, 4); ctx.lineTo(0, 1); ctx.lineTo(-5, 4); ctx.closePath(); ctx.fill();
      [[-8, -4], [8, -4], [-8, 6], [8, 6]].forEach(([rx, ry]) => {
        ctx.beginPath(); ctx.arc(rx, ry, 2.8, 0, Math.PI * 2);
        ctx.globalAlpha = isActive ? 0.85 : alpha * 0.68; ctx.fill();
      });
      ctx.restore();

      // Draw Labels
      if (camera.zoom < 4) {
        ctx.save(); ctx.shadowBlur = 0;
        if (camera.zoom < 2.5) {
          // Use currentPos so the label smoothly follows the drone
          const coordText = `[${(currentPos.x / 1000).toFixed(2)},${(currentPos.y / 1000).toFixed(2)}]km`;
          const panW = coordText.length * 5.2 + 6, panH = 12;
          const panX = sx - panW / 2, panY = sy - 32;
          ctx.globalAlpha = 0.80; ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(panX, panY, panW, panH);
          ctx.globalAlpha = isActive ? 1 : 0.65; ctx.fillStyle = isActive ? col : "#FFFFFF";
          ctx.font = "6px 'Share Tech Mono',monospace"; ctx.fillText(coordText, panX + 3, panY + 9);
        }
        ctx.fillStyle = col; ctx.globalAlpha = isActive ? 1 : 0.65;
        ctx.font = isActive ? `bold 9px 'Share Tech Mono',monospace` : `bold 8px 'Share Tech Mono',monospace`;
        ctx.fillText(d.id, sx - (isActive ? 16 : 14), sy - 13);
        ctx.restore();
      }

      // Draw HUD warnings
      if (d.humanDetected) { ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = HUMAN_MAG; ctx.font = "bold 7px 'Share Tech Mono',monospace"; ctx.fillText("◉ HUMAN", sx - 22, sy + 28); ctx.restore(); }
      if (d.outOfBounds) { ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = CRIT_RED; ctx.font = "bold 7px 'Share Tech Mono',monospace"; ctx.fillText("⚠ OOB", sx - 12, sy + 28); ctx.restore(); }
      if (d.battery <= 20) {
        const batPulse = Math.sin(now * 4) * 0.5 + 0.5;
        ctx.save(); ctx.globalAlpha = 0.7 + batPulse * 0.3; ctx.fillStyle = CRIT_RED; ctx.font = "bold 7px 'Share Tech Mono',monospace"; ctx.fillText(`⚡${d.battery}%`, sx + 8, sy + 18); ctx.restore();
      }
      if (d.waypoint) {
        const wp = toS(d.waypoint.wx, d.waypoint.wy);
        ctx.save(); ctx.globalAlpha = 0.44; ctx.strokeStyle = WARN_AMB; ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(wp.sx, wp.sy); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(wp.sx, wp.sy, 4, 0, Math.PI * 2); ctx.strokeStyle = WARN_AMB; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      }
    });

    // ── Selected Target (drawn last, highest visual priority) ──────────────────
    const selTarget = targetMarkers.find(m => m.id === selectedTargetId);
    if (selTarget) {
      const { sx, sy } = toS(selTarget.wx, selTarget.wy);
      const pulse = Math.sin(now * 5) * 0.5 + 0.5;
      const selColor = selTarget.isRescued ? OK_GREEN : "#ffdd00";
      ctx.save();
      for (let ring = 0; ring < 3; ring++) {
        const tRing = ((now * 1.8) + ring * 0.33) % 1;
        ctx.beginPath(); ctx.arc(sx, sy, 10 + tRing * 40, 0, Math.PI * 2);
        ctx.strokeStyle = selColor; ctx.lineWidth = 1.2; ctx.globalAlpha = (1 - tRing) * 0.7; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fillStyle = selColor; ctx.shadowColor = selColor; ctx.shadowBlur = 16; ctx.fill();
      ctx.strokeStyle = selColor; ctx.lineWidth = 1.2; ctx.shadowBlur = 6; ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(sx - 22, sy); ctx.lineTo(sx - 7, sy); ctx.moveTo(sx + 7, sy); ctx.lineTo(sx + 22, sy);
      ctx.moveTo(sx, sy - 22); ctx.lineTo(sx, sy - 7); ctx.moveTo(sx, sy + 7); ctx.lineTo(sx, sy + 22);
      ctx.stroke();
      const br = 16 + pulse * 4; ctx.lineWidth = 2; ctx.globalAlpha = 0.85;
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([fx, fy]) => {
        ctx.beginPath(); ctx.moveTo(sx + fx * br, sy + fy * br - fy * 6); ctx.lineTo(sx + fx * br, sy + fy * br); ctx.lineTo(sx + fx * br - fx * 6, sy + fy * br); ctx.stroke();
      });
      if (camera.zoom < 3) {
        const panelW = 150, panelH = 88;
        const rightRoom = W - sx;
        const panX = rightRoom >= panelW + 24 ? sx + 18 : sx - panelW - 18;
        const panY = (sy > panelH / 2 + 10 && H - sy > panelH / 2 + 10) ? sy - panelH / 2 : (H - sy > panelH + 14 ? sy + 14 : sy - panelH - 14);
        ctx.globalAlpha = 0.45; ctx.strokeStyle = selColor; ctx.lineWidth = 0.8; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(panX, panY + panelH / 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.globalAlpha = 0.95; ctx.fillStyle = selTarget.isRescued ? "rgba(0,8,4,0.97)" : "rgba(6,4,0,0.96)";
        ctx.strokeStyle = selColor; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(panX, panY, panelW, panelH, 5); ctx.fill(); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = selColor; ctx.font = "bold 11px 'Orbitron',sans-serif"; ctx.fillText(selTarget.id, panX + 10, panY + 19);
        if (selTarget.isRescued) { ctx.fillStyle = OK_GREEN; ctx.font = "bold 8px 'Share Tech Mono',monospace"; ctx.fillText("✔ SECURED", panX + panelW - 68, panY + 19); }
        ctx.fillStyle = "#FFFFFF"; ctx.font = "8px 'Share Tech Mono',monospace"; ctx.fillText("TYPE: " + selTarget.type, panX + 10, panY + 33);
        ctx.font = "bold 8px 'Share Tech Mono',monospace"; ctx.fillText(`LOC: ${(selTarget.wx / 1000).toFixed(3)}, ${(selTarget.wy / 1000).toFixed(3)} km`, panX + 10, panY + 46);
        ctx.fillStyle = "rgba(255,255,255,0.65)"; ctx.font = "8px 'Share Tech Mono',monospace"; ctx.fillText("DRONE: " + selTarget.droneId, panX + 10, panY + 59);
        if (selTarget.isRescued) { ctx.fillStyle = OK_GREEN; ctx.font = "bold 11px 'Share Tech Mono',monospace"; ctx.fillText(`RESCUED: ${selTarget.rescueTime}`, panX + 10, panY + 78); }
        else {
          const confColor = selTarget.confidence >= 85 ? CRIT_RED : selTarget.confidence >= 65 ? WARN_AMB : OK_GREEN;
          ctx.fillStyle = confColor; ctx.font = "bold 13px 'Share Tech Mono',monospace"; ctx.fillText(`CONF: ${selTarget.confidence}%`, panX + 10, panY + 78);
        }
      }
      ctx.restore();
    }

    // ── Coord labels at high zoom-out ─────────────────────────────────────────
    if (camera.zoom < 0.5) {
      const step = 1000;
      const startX = Math.floor((camera.x - W / 2 * camera.zoom) / step) * step;
      const startY = Math.floor((camera.y - H / 2 * camera.zoom) / step) * step;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, H - 16, W, 16);
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, 34, H);
      ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 8px 'Share Tech Mono',monospace";
      for (let wx2 = startX; wx2 <= camera.x + W / 2 * camera.zoom; wx2 += step) {
        const { sx } = toS(wx2, 0); ctx.fillText(`${(wx2 / 1000).toFixed(0)}km`, sx + 2, H - 4);
      }
      for (let wy2 = startY; wy2 <= camera.y + H / 2 * camera.zoom; wy2 += step) {
        const { sy } = toS(0, wy2); ctx.fillText(`${(wy2 / 1000).toFixed(0)}km`, 2, sy - 2);
      }
      ctx.restore();
    }

    // ── Track mode canvas overlay ─────────────────────────────────────────────
    if (trackMode && activeDrone) {
      const blink = Math.sin(now * 3) > 0;
      ctx.save();
      const tw = 180, th = 22, tx = W / 2 - tw / 2, ty = 8;
      ctx.fillStyle = "rgba(0,0,0,0.80)"; ctx.fillRect(tx, ty, tw, th);
      ctx.strokeStyle = blink ? AI_CYAN : `${AI_CYAN}55`; ctx.lineWidth = 1; ctx.strokeRect(tx, ty, tw, th);
      ctx.fillStyle = blink ? AI_CYAN : `${AI_CYAN}88`; ctx.font = "bold 10px 'Orbitron',sans-serif";
      ctx.textAlign = "center"; ctx.fillText(`◎ TRACKING — ${activeDrone}`, W / 2, ty + 15); ctx.textAlign = "left";
      ctx.restore();
    }
  }, [camera, drones, edges, coverageMap, probabilityMap, fogOfWar, targetMarkers, activeDrone, selectedTargetId, recalibrateFlash, trackMode]);

  // 60fps RAF render loop
  useEffect(() => {
    let id: number;
    const loop = () => { draw(); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={screenSize.w}
      height={screenSize.h}
      style={{ display: "block", position: "absolute", inset: 0 }}
    />
  );
}