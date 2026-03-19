"""
main.py - Application entry point for the VHack Drone Orchestrator.
Updated with FastAPI Lifespan and improved WebSocket broadcasting.
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
from contextlib import asynccontextmanager

# These imports are likely failing due to pathing issues
try:
    from vhack_engine.config.settings import Settings
    from vhack_engine.mcp.server import MCPServer
    from vhack_engine.services.mission_manager import MissionManager
except ImportError as e:
    print(f"IMPORT ERROR: {e}. Check your PYTHONPATH or virtual environment!")

LOG_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "vhack_mission_log.txt")
)

def read_log_file_lines(max_lines: int = 20):
    try:
        if not os.path.exists(LOG_PATH):
            return []
        with open(LOG_PATH, "r", encoding="utf-8") as f:
            lines = f.readlines()
            return [line.strip() for line in lines[-max_lines:]]
    except Exception:
        return []

# --- CONFIG & MANAGERS ---
settings = Settings()
manager = None # Defined inside lifespan

# --- ADDED Pydantic Model to fix NameError ---
class IntelligenceReport(BaseModel):
    intelligence_report: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in list(self.active_connections):
            try:
                # Ensure we send as JSON to match React expectations
                await connection.send_json(data)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()
mission_manager = MissionManager()

# --- BACKGROUND TASK ---
async def physics_loop():
    """Background task to continuously run simulation and broadcast."""
    print("[Physics] Loop Started.")
    while True:
        try:
            if mission_manager.active and mission_manager.model:
                # 1. Advance the simulation logic
                mission_manager.model.step()
                
                # 2. Sync internal state
                mission_manager._sync_drone_state(mission_manager.model.get_state())
            
            # 3. Prepare the payload for the UI
            data = mission_manager.get_status()
            data["ai_logs"] = read_log_file_lines()
            
            # 4. Push to all WebSockets
            await ws_manager.broadcast(data)
            
        except Exception as e:
            print(f"[WebSocket Loop Error] {e}")
            
        await asyncio.sleep(0.1) # 10Hz Update Rate

# --- LIFESPAN HANDLER ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    mcp_server = MCPServer(host=settings.MCP_HOST, port=settings.MCP_PORT)
    mcp_server.register_tools()
    print("[VHack API] Starting Autonomous Drone Orchestrator...")
    
    # Start the background physics task
    bg_task = asyncio.create_task(physics_loop())
    
    yield
    
    # Shutdown logic
    bg_task.cancel()
    print("[VHack API] Shutting down...")

app = FastAPI(
    title="VHack 2026 - Autonomous Drone Orchestrator",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS ---

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@app.post("/mission/start")
async def start_mission(num_drones: int = 3, num_survivors: int = 5):
    mission_manager.start_mission(num_drones=num_drones, num_survivors=num_survivors)
    
    # Bridge to MCP
    from vhack_engine.mcp import server as mcp_logic
    mcp_logic.set_simulation_model(mission_manager.model)
    
    return {"status": "mission_started"}


@app.post("/mission/step")
def step_mission():
    """Advance the mission by one simulation tick and run CommandAgent."""
    response = mission_manager.step()
    return {
        "status": mission_manager.get_status(),
        "agent_response": response
    }


@app.post("/mission/stop")
def stop_mission():
    """Stop the active mission."""
    mission_manager.stop_mission()
    return {"message": "Mission stopped"}


@app.get("/drones")
def list_drones():
    """Return the state of all registered drones."""
    return mission_manager.drone_manager.list_drones()


@app.post("/api/deploy")
async def deploy(req: IntelligenceReport):
    def isolated_swarm_thread(intel):
        try:
            mission_manager.inject_intelligence(intel)
            mission_brief = (
                f"CRITICAL INTEL RECEIVED: {intel}\n\n"
                "Analyze this intelligence and coordinate drone operations accordingly. "
                "Check current drone status, verify signal networks, and deploy resources as needed."
            )
            mission_manager.run_multiagent_brief(mission_brief)
        except Exception as e:
            print(f"[Swarm Execution Error] {e}")

    asyncio.create_task(
        asyncio.to_thread(isolated_swarm_thread, req.intelligence_report)
    )
    return {"status": "started"}


@app.get("/tools")
def list_tools():
    """List all available MCP tools."""
    if not mission_manager.tool_loader:
        return {"count": 0, "tools": [], "note": "LangChain tool loader not available"}
    tools = mission_manager.tool_loader.tools
    return {
        "count": len(tools),
        "tools": [{"name": tool.name, "description": tool.description} for tool in tools]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)