"""
main.py - Application entry point for the VHack Drone Orchestrator.
Starts the MCP tool server and exposes a FastAPI REST API for mission control.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from vhack_engine.config.settings import Settings
from vhack_engine.services.mission_manager import MissionManager

settings = Settings()
app = FastAPI(
    title="VHack 2026 - Autonomous Drone Orchestrator",
    description="API for controlling the search and rescue drone fleet with AI-powered command agent.",
    version="0.2.0",
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any React localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mission_manager = MissionManager()


class IntelligenceReport(BaseModel):
    """Human intelligence override model."""
    intelligence_report: str


@app.on_event("startup")
async def startup():
    """Initialize the application on startup."""
    print("[VHack API] Starting Autonomous Drone Orchestrator...")


@app.get("/")
def root():
    """API root endpoint."""
    return {
        "service": "VHack 2026 Autonomous Drone Orchestrator",
        "version": "0.2.0",
        "status": "operational",
        "features": ["AI CommandAgent", "MCP Tools", "LangChain Integration", "Human-in-the-Loop"]
    }


@app.get("/status")
def get_status():
    """Return current mission status."""
    return mission_manager.get_status()


@app.post("/mission/start")
def start_mission(num_drones: int = 3, num_survivors: int = 5):
    """Start a new search and rescue mission."""
    mission_manager.start_mission(num_drones=num_drones, num_survivors=num_survivors)
    return {
        "message": "Mission started with AI CommandAgent",
        "num_drones": num_drones,
        "num_survivors": num_survivors
    }


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
async def trigger_ai_commander(deployment: IntelligenceReport):
    """
    Human-in-the-Loop: Inject intelligence and trigger AI commander.
    Compatible with React frontend.
    """
    try:
        # Inject the human intelligence
        result = mission_manager.inject_intelligence(deployment.intelligence_report)
        
        # Create mission brief with the intelligence
        mission_brief = (
            f"CRITICAL INTEL RECEIVED: {deployment.intelligence_report}\n\n"
            "Analyze this intelligence and coordinate drone operations accordingly. "
            "Check current drone status, verify signal networks, and deploy resources as needed."
        )
        
        # Run the CommandAgent
        response = mission_manager.command_agent.run(mission_brief)
        
        return {
            "status": "SUCCESS",
            "mission_logs": response,
            "intelligence_registered": result
        }
        
    except Exception as e:
        return {
            "status": "FAILED",
            "error": str(e)
        }


@app.get("/tools")
def list_tools():
    """List all available MCP tools."""
    tools = mission_manager.tool_loader.tools
    return {
        "count": len(tools),
        "tools": [{"name": tool.name, "description": tool.description} for tool in tools]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)
