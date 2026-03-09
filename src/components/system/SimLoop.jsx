"use client";
import { useEffect } from "react";
import { useFleetStore } from "@/store/useFleetStore";

/**
 * SimLoop
 * Runs the swarm simulation at a fixed 10Hz step (100ms).
 * Kept separate from the map renderer so simulation continues even if views change.
 */
export default function SimLoop() {
  const tick_update = useFleetStore((s) => s.tick_update);

  useEffect(() => {
    const TICK_MS = 100;
    const MAX_STEPS_PER_FRAME = 3;

    let rafId = 0;
    let last = performance.now();
    let acc = 0;

    const loop = (now) => {
      const delta = now - last;
      last = now;
      acc += delta;

      let steps = 0;
      while (acc >= TICK_MS && steps < MAX_STEPS_PER_FRAME) {
        tick_update();
        acc -= TICK_MS;
        steps += 1;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [tick_update]);

  return null;
}
