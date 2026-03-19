/**
 * src/hooks/useCamera.ts
 *
 * Encapsulates all camera pan/zoom/drag logic for the MapGrid component.
 * Preserves all existing smooth animation easing behaviour.
 */

import { useState, useRef, useCallback } from "react";
import type { Camera } from "../types";
import { WORLD_W, WORLD_H, WORLD_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from "../tokens";
import { clamp } from "../utils";

// ── Smooth camera pan with cubic ease-out ──────────────────────────────────
function useSmoothCamera(setCamera: React.Dispatch<React.SetStateAction<Camera>>) {
  const animRef = useRef<number>(0);
  return useCallback((wx: number, wy: number, targetZoom?: number) => {
    cancelAnimationFrame(animRef.current);
    const startTime = performance.now();
    const duration  = 650;
    let sX = 0, sY = 0, sZ = 0, init = false;
    const step = (now: number) => {
      const t    = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCamera(prev => {
        if (!init) { sX = prev.x; sY = prev.y; sZ = prev.zoom; init = true; }
        return {
          x:    sX + (clamp(wx, 0, WORLD_W) - sX) * ease,
          y:    sY + (clamp(wy, 0, WORLD_H) - sY) * ease,
          zoom: targetZoom != null
            ? sZ + (clamp(targetZoom, MIN_ZOOM, MAX_ZOOM) - sZ) * ease
            : prev.zoom,
        };
      });
      if (t < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, [setCamera]);
}

export function useCamera(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onInterrupt?: () => void
) {
  const [camera, setCamera] = useState<Camera>({ x: WORLD_CENTER.x, y: WORLD_CENTER.y, zoom: DEFAULT_ZOOM });
  const isDragging  = useRef(false);
  const hasDragged  = useRef(false);
  const dragStart   = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });
  const smoothPanTo = useSmoothCamera(setCamera);

  const getScreenSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: 800, h: 600 };
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }, [containerRef]);

  const panTo = useCallback((wx: number, wy: number) =>
    setCamera(c => ({ ...c, x: clamp(wx, 0, WORLD_W), y: clamp(wy, 0, WORLD_H) })), []);

  const zoomAtPoint = useCallback((factor: number, sx: number, sy: number) => {
    onInterrupt?.();
    setCamera(prev => {
      const { w, h } = getScreenSize();
      const nz = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      const wx = (sx - w / 2) * prev.zoom + prev.x;
      const wy = (sy - h / 2) * prev.zoom + prev.y;
      return { x: clamp(wx - (sx - w / 2) * nz, 0, WORLD_W), y: clamp(wy - (sy - h / 2) * nz, 0, WORLD_H), zoom: nz };
    });
  }, [getScreenSize, onInterrupt]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAtPoint(e.deltaY > 0 ? 1.15 : 0.87, e.clientX - rect.left, e.clientY - rect.top);
  }, [zoomAtPoint, containerRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    isDragging.current = true; hasDragged.current = false;
    setCamera(c => { dragStart.current = { mx: e.clientX, my: e.clientY, cx: c.x, cy: c.y }; return c; });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mx, dy = e.clientY - dragStart.current.my;
    if (Math.hypot(dx, dy) > 3) { hasDragged.current = true; onInterrupt?.(); }
    setCamera(prev => ({
      ...prev,
      x: clamp(dragStart.current.cx - dx * prev.zoom, 0, WORLD_W),
      y: clamp(dragStart.current.cy - dy * prev.zoom, 0, WORLD_H),
    }));
  }, [onInterrupt]);

  const handleMouseUp   = useCallback(() => { isDragging.current = false; }, []);
  const resetCamera     = useCallback(() => setCamera({ x: WORLD_CENTER.x, y: WORLD_CENTER.y, zoom: DEFAULT_ZOOM }), []);
  const zoomIn          = useCallback(() => { const { w, h } = getScreenSize(); zoomAtPoint(0.75, w / 2, h / 2); }, [zoomAtPoint, getScreenSize]);
  const zoomOut         = useCallback(() => { const { w, h } = getScreenSize(); zoomAtPoint(1.33, w / 2, h / 2); }, [zoomAtPoint, getScreenSize]);

  return { camera, setCamera, panTo, smoothPanTo, zoomAtPoint, zoomIn, zoomOut, resetCamera, isDragging, hasDragged, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp };
}

export type CameraControls = ReturnType<typeof useCamera>;
