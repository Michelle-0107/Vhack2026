"""
Standalone API (Teammate's Version)
Alternative to main.py - runs mcp_client_standalone.py as subprocess
"""
import os
import sys
import subprocess
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# FIXED IMPORT: Use _simulation_model instead of global_model
from vhack_engine.mcp.server import _simulation_model as global_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists("mission_comms.log"):
        os.remove("mission_comms.log")
        
    yield

app = FastAPI(title="Beacon-Net API", lifespan=lifespan)

# CRITICAL FOR REACT: This allows your local React app to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any React localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ManualDeployment(BaseModel):
    intelligence_report: str

class DroneCommand(BaseModel):
    drone_id: str

class DroneMoveCommand(DroneCommand):
    x: int
    y: int

@app.post("/api/mcp/move")
def mcp_move(cmd: DroneMoveCommand):
    if not global_model: return {"message": "Simulation not running."}
    drone = global_model.get_drone_by_id(cmd.drone_id)
    if not drone: return {"message": "Drone not found."}
    if getattr(drone, "state", "") == "RETURNING":
        return {"message": "IGNORED: Drone is returning to base due to low battery."}
    drone.move_to(cmd.x, cmd.y)
    return {"message": f"SUCCESS: {cmd.drone_id} moved to ({cmd.x}, {cmd.y})"}

# We will skip importing execute_thermal_scan to avoid circular import issues
# It isn't strictly necessary for the REST API if the Swarm is running it via MCP
scanned_history = [] 

@app.post("/api/mcp/status")
def mcp_status():
    if not global_model: return {"message": "Simulation not running."}
    status_lines = [f"GRID: {global_model.grid.width}x{global_model.grid.height}"]
    for d in global_model.agents:
        from vhack_engine.simulation.drone_agent import DroneAgent
        if isinstance(d, DroneAgent):
            status_lines.append(f"{d.unique_id}: Pos={d.pos}, Battery={d.battery:.1f}%")
    return {"message": "\n".join(status_lines)}


# FIXED IMPORT: Only import run_swarm_simulation if main_swarm exists.
try:
    from main_swarm import run_swarm_simulation
except ImportError:
    print("Warning: main_swarm.py not found or failed to import. AI Swarm will not run.")
    async def run_swarm_simulation(intel): pass

from vhack_engine.mcp.server import inject_human_intelligence

async def safe_swarm_runner(intel: str):
    """Wrapper to catch and log errors from the background thread."""
    try:
        print(f"\n[SYSTEM] Launching AutoGen Swarm Thread with Intel: {intel[:30]}...\n")
        
        # Initialize the global simulation model if it doesn't exist
        from vhack_engine.simulation.disaster_model import DisasterModel
        from vhack_engine.mcp.server import set_simulation_model
        
        global global_model
        if global_model is None:
            global_model = DisasterModel(width=20, height=20, num_drones=3, num_survivors=5)
            set_simulation_model(global_model)
            print("[SYSTEM] Simulation model initialized and linked to MCP Server.")
            
        await asyncio.to_thread(run_swarm_simulation, intel)
    except Exception as e:
        print(f"\n❌ [FATAL ERROR IN AI THREAD] ❌\n{str(e)}")
        import traceback
        traceback.print_exc()

@app.post("/api/deploy")
async def deploy_mission(payload: dict):
    intel = payload.get("intelligence_report", "EMERGENCY: Swarm activated.")
    inject_human_intelligence(intel)
    
    # Launch the safe wrapper instead of the raw function
    asyncio.create_task(safe_swarm_runner(intel))
    
    return {"status": "SUCCESS", "message": "Swarm deployed."}

@app.post("/api/rescue")
def rescue_survivor(payload: dict):
    if not global_model: return {"status": "ERROR", "message": "Simulation not running."}
    survivor_id = payload.get("survivor_id")

    # MESA models don't have get_survivor_by_id by default, we have to find it
    from vhack_engine.simulation.survivor_agent import SurvivorAgent
    survivor = next((a for a in global_model.agents if isinstance(a, SurvivorAgent) and str(a.unique_id) == str(survivor_id)), None)
    
    if not survivor:
        return {"status": "ERROR", "message": "Survivor not found"}

    survivor.rescue()

    return {"status": "SUCCESS"}


@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Re-fetch global_model locally in case it was created after startup
    from vhack_engine.mcp.server import _simulation_model
    current_model = _simulation_model
    
    try:
        while True:
            data = {"active": False}
            
            # Need to re-fetch to see if the Swarm Thread created it
            from vhack_engine.mcp.server import _simulation_model
            current_model = _simulation_model
            
            if current_model:
                # Advance simulation independently from AI agents
                current_model.step()
                state = current_model.get_state()
                
                # Scale coordinates up for frontend display (20x20 -> 5000x5000)
                scaled_drones = []
                for d in state["drones"]:
                    # The frontend expects {"id": ..., "pos": [x,y], "battery": ...}
                    scaled_pos = [p * 250 for p in d["pos"]]
                    
                    # CRITICAL FIX: MESA uses 0, 1, 2. React uses 1, 2, 3. 
                    # We must add 1 to the MESA ID before converting it to the DR-00X format.
                    try:
                        numeric_id = int(d['id']) + 1 
                        drone_id = f"DR-{numeric_id:03d}" 
                    except ValueError:
                        drone_id = str(d['id'])

                    scaled_drones.append({"id": drone_id, "pos": scaled_pos, "battery": d["battery"]})
                    
                scaled_survivors = []
                for s in state["survivors"]:
                    if s.get("discovered", False):
                        scaled_pos = [p * 250 for p in s["pos"]]
                        scaled_survivors.append({
                            "id": str(s["id"]), 
                            "pos": scaled_pos, 
                            "health": s["health"], 
                            "rescued": s["rescued"], 
                            "discovered": True,
                            "confidence": s.get("confidence", 0.0),
                            "status": s.get("status", "ACTIVE")
                        })
                    
                ai_logs = []
                if os.path.exists("mission_comms.log"):
                    with open("mission_comms.log", "r", encoding="utf-8") as f:
                        ai_logs = [line.strip() for line in f.read().splitlines() if line.strip()]
                    if ai_logs:
                        with open("mission_comms.log", "w", encoding="utf-8") as f:
                            pass # clear flushed logs

                # Construct active mission data
                data = {
                    "active": True,
                    "step": state["step"],
                    "drones": scaled_drones,
                    "survivors": scaled_survivors,
                    "scannedCells": [{"x": p[0] * 250, "y": p[1] * 250} for p in scanned_history],
                    "ai_logs": ai_logs
                }
                
                print(f"Step {state['step']}: Sending {len(scaled_drones)} drones to UI")
                
            await websocket.send_json(data)
            await asyncio.sleep(0.5)
            
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket Error: {e}")

@app.get("/")
def root():
    """Health check"""
    return {"status": "operational", "mode": "standalone_subprocess"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_standalone:app", host="0.0.0.0", port=8000, reload=True)