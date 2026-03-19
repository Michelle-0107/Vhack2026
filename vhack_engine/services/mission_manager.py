"""
Mission Manager - Coordinates overall mission lifecycle, from briefing through
task dispatch to completion reporting.
"""

import time  # Added for throttling
from vhack_engine.agents.command_agent import CommandAgent
from vhack_engine.simulation.disaster_model import DisasterModel
from vhack_engine.mcp.discovery import DroneDiscovery
from vhack_engine.mcp import server as mcp_server
from vhack_engine.services.drone_manager import DroneManager

try:
    from vhack_engine.mcp.client import MCPToolLoader
except ImportError:  # pragma: no cover - optional in multiagent-only mode
    MCPToolLoader = None


class MissionManager:
    """
    Orchestrates an end-to-end search and rescue mission.
    Connects the AI CommandAgent, drone fleet, and simulation environment.
    """

    def __init__(self):
        self.command_agent = CommandAgent()
        self.tool_loader = MCPToolLoader(use_subprocess=False) if MCPToolLoader else None
        self.drone_manager = DroneManager()
        self.model: DisasterModel | None = None
        self.active = False
        self.mode = "multiagent"

    def start_mission(self, num_drones: int = 3, num_survivors: int = 5):
        """
        Initialise the simulation and start the mission.
        """
        # Initialize the simulation model
        self.model = DisasterModel(num_drones=num_drones, num_survivors=num_survivors)
        self.mode = "multiagent"
        
        # CRITICAL: Link simulation model to MCP server for direct control
        mcp_server.set_simulation_model(self.model)
        
        # Discover drones from the simulation
        discovery = DroneDiscovery()
        discovery.set_simulation_model(self.model)
        discovered_drones = discovery.discover()

        # Reset state
        mcp_server.swarm_data.clear()
        self.drone_manager = DroneManager()
        
        # Initialize swarm_data in MCP server
        for drone_info in discovered_drones:
            drone_id = drone_info["id"]
            mcp_server.swarm_data[drone_id] = {
                "x": drone_info["position"][0],
                "y": drone_info["position"][1],
                "battery": drone_info["battery"],
                "role": "searcher",
                "status": drone_info["status"]
            }
            self.drone_manager.register(drone_id, {
                "position": drone_info["position"],
                "battery": drone_info["battery"],
                "status": drone_info["status"],
                "role": "searcher",
            })
        
        # Load tools for CommandAgent
        mcp_tools = []
        if self.tool_loader is not None and hasattr(self.tool_loader, 'load_tools'):
            mcp_tools = self.tool_loader.load_tools()
        
        # Initialize CommandAgent
        self.command_agent.initialize(mcp_tools=mcp_tools)
        
        self.active = True
        print(f"[MissionManager] Mission started. Throttling active (0.5s delay).")

    def step(self):
        """Advance simulation and let the agent reason with a throttle to prevent UI crashes."""
        if not self.active or self.model is None:
            return
        
        # 1. Step the physical simulation
        self.model.step()
        state = self.model.get_state()
        
        # 2. Sync state to ensure AI sees real positions
        self._sync_drone_state(state)
        
        # 3. Throttling: Pause to let the Frontend process the previous messages
        # This fixes "Maximum update depth exceeded" in React
        time.sleep(0.5) 
        
        # 4. AI Reasoning Cycle
        mission_brief = self._create_mission_brief(state)
        response = self._run_multiagent(mission_brief)
        
        return response

    def run_multiagent_brief(self, mission_brief: str):
        return self._run_multiagent(mission_brief)

    def _run_multiagent(self, mission_brief: str):
        """Run one multi-agent orchestration cycle."""
        try:
            from vhack_engine.main_swarm import run_swarm_simulation
            return run_swarm_simulation(mission_brief)
        except Exception as e:
            return {"status": "failed", "error": str(e)}

    def _sync_drone_state(self, state: dict):
        """Synchronize states between MESA, DroneManager, and MCP Server."""
        drones = state.get("drones", [])
        for d in drones:
            # Handle potential ID format differences (drone_1 vs 1)
            raw_id = d.get('id')
            drone_id = f"drone_{raw_id}" if not str(raw_id).startswith("drone_") else str(raw_id)
            
            pos = d.get("pos", (0, 0))
            battery = d.get("battery", 0.0)

            # Update Drone Manager
            if self.drone_manager.get(drone_id):
                self.drone_manager.update_position(drone_id, int(pos[0]), int(pos[1]))
                self.drone_manager.update_battery(drone_id, float(battery))
            
            # Update MCP Server (This is what the AI reads via tools)
            mcp_server.swarm_data[drone_id] = {
                "x": int(pos[0]),
                "y": int(pos[1]),
                "battery": float(battery),
                "role": "searcher",
                "status": "active",
            }

    def _create_mission_brief(self, state: dict) -> str:
        drones = state.get("drones", [])
        step = state.get("step", 0)
        survivors_data = state.get("survivors", [])
        rescued = sum(1 for s in survivors_data if s.get("rescued", False))
        total = len(survivors_data)
        
        brief = f"=== MISSION STEP {step} ===\n"
        brief += f"Status: {rescued}/{total} survivors rescued.\n\n"
        brief += "DRONE POSITIONS:\n"
        for d in drones:
            brief += f"- drone_{d.get('id')}: {d.get('pos')} (Bat: {d.get('battery'):.1f}%)\n"
        
        brief += "\nACTIVE OBJECTIVES:\n"
        unrescued = [s for s in survivors_data if not s.get("rescued", False)]
        for s in unrescued:
            brief += f"- Locate survivor at {s.get('pos')}\n"
        
        return brief

    def stop_mission(self):
        self.active = False
        print("[MissionManager] Mission stopped.")

    def get_status(self) -> dict:
        if self.model is None:
            return {"active": False}
        return {"active": self.active, **self.model.get_state()}
    
    def inject_intelligence(self, intel_report: str) -> str:
        return mcp_server.inject_human_intelligence(intel_report)