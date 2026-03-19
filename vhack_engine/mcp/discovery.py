"""
Drone Discovery - Dynamically detects available drones and registers their
capabilities without requiring hardcoded drone lists.
"""
from typing import Optional
from vhack_engine.config.settings import Settings


class DroneDiscovery:
    """
    Scans the simulation or network for active drones and returns
    their identifiers and capability manifests.
    """

    def __init__(self):
        self.settings = Settings()
        self._simulation_model = None

    def set_simulation_model(self, model):
        """Link to the MESA DisasterModel for drone discovery."""
        self._simulation_model = model

    def discover(self) -> list[dict]:
        """
        Return a list of discovered drone descriptors.

        Returns:
            List of dicts with keys: id, capabilities, battery, position.
        """
        if self._simulation_model is None:
            return []
        
        from vhack_engine.simulation.drone_agent import DroneAgent
        
        drones = []
        for agent in self._simulation_model.agents:
            if isinstance(agent, DroneAgent):
                drone_info = {
                    "id": f"drone_{agent.unique_id}",
                    "capabilities": ["move", "scan", "thermal_detection"],
                    "battery": agent.battery,
                    "position": list(agent.pos) if agent.pos else [0, 0],
                    "status": "idle",
                    "agent_ref": agent  # Keep reference to MESA agent
                }
                drones.append(drone_info)
        
        return drones

    def register_drone(self, drone_id: str, capabilities: list[str]):
        """Manually register a drone and its supported tool capabilities."""
        # For manual registration when not using simulation
        pass

    def get_drone_agent(self, drone_id: str):
        """Get the MESA DroneAgent instance by ID."""
        if self._simulation_model is None:
            return None
        
        from vhack_engine.simulation.drone_agent import DroneAgent
        
        # Extract numeric ID from "drone_X" format
        try:
            agent_id = int(drone_id.replace("drone_", ""))
        except (ValueError, AttributeError):
            return None
        
        for agent in self._simulation_model.agents:
            if isinstance(agent, DroneAgent) and agent.unique_id == agent_id:
                return agent
        
        return None
