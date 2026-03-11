"""
Mission Manager - Coordinates overall mission lifecycle, from briefing through
task dispatch to completion reporting.
"""
from vhack_engine.agents.command_agent import CommandAgent
from vhack_engine.services.drone_manager import DroneManager
from vhack_engine.simulation.disaster_model import DisasterModel
from vhack_engine.mcp.client import MCPToolLoader
from vhack_engine.mcp import server as mcp_server


class MissionManager:
    """
    Orchestrates an end-to-end search and rescue mission.
    Connects the AI CommandAgent, drone fleet, and simulation environment.
    """

    def __init__(self):
        self.command_agent = CommandAgent()
        self.drone_manager = DroneManager()
        self.tool_loader = MCPToolLoader(use_subprocess=False)  # Direct integration
        self.model: DisasterModel | None = None
        self.active = False

    def start_mission(self, num_drones: int = 3, num_survivors: int = 5):
        """
        Initialise the simulation and start the mission.

        Args:
            num_drones: Drones to spawn in the simulation.
            num_survivors: Survivors to place in the environment.
        """
        # Initialize the simulation model
        self.model = DisasterModel(num_drones=num_drones, num_survivors=num_survivors)
        
        # CRITICAL: Link simulation model to MCP server for direct control
        mcp_server.set_simulation_model(self.model)
        
        # CRITICAL: Discover drones from the simulation
        self.drone_manager.discovery.set_simulation_model(self.model)
        discovered_drones = self.drone_manager.discovery.discover()
        
        # Register discovered drones with DroneManager
        for drone_info in discovered_drones:
            self.drone_manager.register(
                drone_info["id"],
                {
                    "position": drone_info["position"],
                    "battery": drone_info["battery"],
                    "status": drone_info["status"]
                }
            )
        
        # Sync MCP server with DroneManager state
        mcp_server.set_drone_manager(self.drone_manager)
        
        # Load MCP tools for CommandAgent
        mcp_tools = self.tool_loader.load_tools()
        
        # Initialize CommandAgent with MCP tools
        self.command_agent.initialize(mcp_tools=mcp_tools)
        
        self.active = True
        print(f"[MissionManager] Mission started with {num_drones} drones and {num_survivors} survivors.")
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
        
        # Let the CommandAgent analyze and act
        mission_brief = self._create_mission_brief(state)
        response = self.command_agent.run(mission_brief)
        
        print(f"[CommandAgent Response]: {response}")
        return response

    def _create_mission_brief(self, state: dict) -> str:
        """
        Create a natural language mission brief from simulation state.
        
        Args:
            state: Current simulation state dictionary.
        
        Returns:
            Formatted mission brief string.
        """
        drones = self.drone_manager.list_drones()
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
            battery_status = "LOW!" if drone['battery'] < 20 else "OK"
            brief += f"  {i}. {drone['id']}: Position {drone['position']}, Battery {drone['battery']:.1f}% [{battery_status}]\n"
        
        brief += "\nSURVIVOR STATUS:\n"
        if rescued < total_survivors:
            brief += f"  {total_survivors - rescued} survivors still missing and need to be located.\n"
            # Show survivors that haven't been rescued yet
            unrescued = [s for s in survivors_data if not s.get("rescued", False)]
            if len(unrescued) <= 3:  # Show positions if few survivors
                for survivor in unrescued:
                    brief += f"  - Survivor at {survivor.get('pos', 'unknown')}, Health: {survivor.get('health', 100)}%\n"
        else:
            brief += f"  ✓ All survivors located!\n"
        
        brief += "\nCOMMANDER INSTRUCTIONS:\n"
        brief += "1. First, check for human intelligence updates using get_human_intelligence()\n"
        brief += "2. Check battery levels - recall any drones below 20%\n"
        brief += "3. Coordinate systematic search pattern to cover unexplored areas\n"
        brief += "4. Use thermal_scan when drones reach new positions\n"
        brief += "5. Monitor signal networks and deploy relays if needed\n"
        
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
