"""
main.py - Application entry point for the VHack Drone Orchestrator.
Starts the MCP tool server and exposes a FastAPI REST API for mission control.
"""
from fastapi import FastAPI

from vhack_engine.config.settings import Settings
from vhack_engine.mcp.server import MCPServer
from vhack_engine.services.mission_manager import MissionManager

settings = Settings()
app = FastAPI(
    title="VHack 2026 - Autonomous Drone Orchestrator",
    description="API for controlling the search and rescue drone fleet.",
    version="0.1.0",
)

mission_manager = MissionManager()
mcp_server = MCPServer(host=settings.MCP_HOST, port=settings.MCP_PORT)


@app.on_event("startup")
async def startup():
    """Register all drone tools with the MCP server on startup."""
    mcp_server.register_tools()


@app.get("/status")
def get_status():
    """Return current mission status."""
    return mission_manager.get_status()


@app.post("/mission/start")
def start_mission(num_drones: int = 3, num_survivors: int = 5):
    """Start a new search and rescue mission."""
    mission_manager.start_mission(num_drones=num_drones, num_survivors=num_survivors)
    return {"message": "Mission started", "num_drones": num_drones, "num_survivors": num_survivors}


@app.post("/mission/step")
def step_mission():
    """Advance the mission by one simulation tick."""
    mission_manager.step()
    return mission_manager.get_status()


@app.post("/mission/stop")
def stop_mission():
    """Stop the active mission."""
    mission_manager.stop_mission()
    return {"message": "Mission stopped"}


@app.get("/drones")
def list_drones():
    """Return the state of all registered drones."""
    return mission_manager.drone_manager.list_drones()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)
