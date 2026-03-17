"""
Mission Manager - Coordinates overall mission lifecycle, from briefing through
task dispatch to completion reporting.
"""
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

        Args:
            num_drones: Drones to spawn in the simulation.
            num_survivors: Survivors to place in the environment.
        """
        # Initialize the simulation model
        self.model = DisasterModel(num_drones=num_drones, num_survivors=num_survivors)
        self.mode = "multiagent"
        
        # CRITICAL: Link simulation model to MCP server for direct control
        mcp_server.set_simulation_model(self.model)
        
        # CRITICAL: Discover drones from the simulation and initialize swarm_data
        discovery = DroneDiscovery()
        discovery.set_simulation_model(self.model)
        discovered_drones = discovery.discover()

        # Reset local state for a fresh mission run
        mcp_server.swarm_data.clear()
        self.drone_manager = DroneManager()
        
        # Initialize swarm_data in MCP server with discovered drones
        for drone_info in discovered_drones:
            mcp_server.swarm_data[drone_info["id"]] = {
                "x": drone_info["position"][0],
                "y": drone_info["position"][1],
                "battery": drone_info["battery"],
                "role": "searcher",
                "status": drone_info["status"]
            }
            self.drone_manager.register(drone_info["id"], {
                "position": drone_info["position"],
                "battery": drone_info["battery"],
                "status": drone_info["status"],
                "role": "searcher",
            })
        
        # Load MCP tools for CommandAgent
        mcp_tools = []
        if self.tool_loader:
            mcp_tools = self.tool_loader.load_tools()
        
        # Initialize CommandAgent with MCP tools
        self.command_agent.initialize(mcp_tools=mcp_tools)
        
        self.active = True
        print(f"[MissionManager] Mission started with {num_drones} drones and {num_survivors} survivors.")
        print(f"[MissionManager] Mode: {self.mode}")
        print(f"[MissionManager] Discovered {len(discovered_drones)} drones from simulation.")
        print(f"[MissionManager] Loaded {len(mcp_tools)} MCP tools for CommandAgent.")
        
        # Print initial drone positions
        for drone in discovered_drones:
            print(f"  - {drone['id']} at position {drone['position']}, battery {drone['battery']:.1f}%")

    def step(self):
        """Advance simulation by one tick and let the agent reason."""
        if not self.active or self.model is None:
            return
        
        # Step the simulation
        self.model.step()
        state = self.model.get_state()
        self._sync_drone_state(state)
        
        # Let the CommandAgent analyze and act
        mission_brief = self._create_mission_brief(state)
        response = self._run_multiagent(mission_brief)
        
        print(f"[CommandAgent Response]: {response}")
        return response

    def run_multiagent_brief(self, mission_brief: str):
        """Public entrypoint for HITL/API-triggered multi-agent execution."""
        return self._run_multiagent(mission_brief)

    def _run_multiagent(self, mission_brief: str):
        """Run one multi-agent orchestration cycle using the AutoGen swarm stack."""
        try:
            from main_swarm import run_swarm_simulation
            return run_swarm_simulation(mission_brief)
        except Exception as e:
            return {
                "status": "failed",
                "mode": "multiagent",
                "error": str(e),
            }

    def _sync_drone_state(self, state: dict):
        """Synchronize DroneManager and MCP swarm_data from simulation state."""
        drones = state.get("drones", [])
        for d in drones:
            drone_id = f"drone_{d.get('id')}"
            pos = d.get("pos", (0, 0))
            battery = d.get("battery", 0.0)

            if self.drone_manager.get(drone_id) is None:
                self.drone_manager.register(drone_id, {
                    "position": list(pos),
                    "battery": battery,
                    "status": "idle",
                    "role": "searcher",
                })
            else:
                self.drone_manager.update_position(drone_id, int(pos[0]), int(pos[1]))
                self.drone_manager.update_battery(drone_id, float(battery))

            mcp_server.swarm_data[drone_id] = {
                "x": int(pos[0]),
                "y": int(pos[1]),
                "battery": float(battery),
                "role": "searcher",
                "status": "idle",
            }

    def _create_mission_brief(self, state: dict) -> str:
        """
        Create a natural language mission brief from simulation state.
        
        Args:
            state: Current simulation state dictionary.
        
        Returns:
            Formatted mission brief string.
        """
        drones = state.get("drones", [])
        step = state.get("step", 0)
        survivors_data = state.get("survivors", [])
        
        # Count rescued vs total survivors
        total_survivors = len(survivors_data)
        rescued = sum(1 for s in survivors_data if s.get("rescued", False))
        
        brief = f"=== MISSION STEP {step} ===\n\n"
        brief += f"Objective: Search and Rescue - Locate {total_survivors} survivors in disaster zone.\n"
        brief += f"Survivors rescued: {rescued}/{total_survivors}\n\n"
        
        brief += "DRONE STATUS:\n"
        for i, drone in enumerate(drones, 1):
            battery = float(drone.get("battery", 0.0))
            battery_status = "LOW!" if battery < 20 else "OK"
            brief += f"  {i}. drone_{drone.get('id')}: Position {drone.get('pos')}, Battery {battery:.1f}% [{battery_status}]\n"
        
        brief += "\nSURVIVOR STATUS:\n"
        if rescued < total_survivors:
            brief += f"  {total_survivors - rescued} survivors still missing and need to be located.\n"
            # Always show unrescued survivor positions so Planner can target them directly.
            unrescued = [s for s in survivors_data if not s.get("rescued", False)]
            for survivor in unrescued:
                brief += f"  - Survivor at {survivor.get('pos', 'unknown')}, Health: {survivor.get('health', 100)}%\n"
        else:
            brief += f"  ✓ All survivors located!\n"
        
        brief += "\nCOMMANDER INSTRUCTIONS:\n"
        brief += "1. Call get_human_intelligence() once at mission start, then call get_mission_status().\n"
        brief += "2. If any drone battery is below 20%, immediately call return_to_base(drone_id).\n"
        brief += "3. Coordinate systematic search pattern to cover unexplored areas.\n"
        brief += "4. Use thermal_scan when drones reach new positions; if survivors are detected, call extract_survivors(drone_id).\n"
        brief += "5. After each action, call get_mission_status(); when remaining=0, terminate the mission.\n"
        
        return brief

    def stop_mission(self):
        """Terminate the active mission."""
        self.active = False
        print("[MissionManager] Mission stopped.")

    def get_status(self) -> dict:
        """Return current mission status."""
        if self.model is None:
            return {"active": False}
        return {"active": self.active, **self.model.get_state()}
    
    def inject_intelligence(self, intel_report: str) -> str:
        """
        Inject human intelligence into the mission (HITL support).
        
        Args:
            intel_report: Human-provided intelligence or override.
        
        Returns:
            Confirmation message.
        """
        result = mcp_server.inject_human_intelligence(intel_report)
        print(f"[MissionManager] {result}")
        return result