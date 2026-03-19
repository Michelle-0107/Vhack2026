/**
 * UI!/src/services/api.ts
 * Handles API communication with the FastAPI backend.
 */

const API_BASE = "http://127.0.0.1:8000";
export const WS_URL = "ws://127.0.0.1:8000/ws/stream";

export interface DeployResponse {
  status: string;
  message?: string;
}

/**
 * Sends human intelligence (HITL) to the AI Command Agent via HTTP POST.
 * Matches the 'IntelligenceReport' model in main.py
 */
export async function deployIntel(message: string): Promise<DeployResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intelligence_report: message }),
    });

    if (!res.ok) return null;
    return await res.json() as DeployResponse;
  } catch (error) {
    console.error("Failed to deploy intel:", error);
    return null;
  }
}

/**
 * Helper to start the mission simulation.
 */
export async function startMission(drones: number = 3, survivors: number = 5): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mission/start?num_drones=${drones}&num_survivors=${survivors}`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to start mission:", error);
    return null;
  }
}

export async function sendCommand(action: string, payload: Record<string, any> = {}): Promise<boolean> {
  try {
    console.log(`[API] Command triggered: ${action}`, payload);
    return true;
  } catch {
    return false;
  }
}