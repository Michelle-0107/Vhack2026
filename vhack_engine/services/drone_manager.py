"""
Drone Manager - High-level service that tracks all active drones,
manages their state, and provides an interface for tool calls to update drone data.
"""
from vhack_engine.mcp.discovery import DroneDiscovery


class DroneManager:
    """
    Central registry for all drones in the mission.
    Maintains drone state and coordinates fleet-level operations.
    """

    def __init__(self):
        self._drones: dict[str, dict] = {}
        self.discovery = DroneDiscovery()

    def initialize_fleet(self):
        """Discover and register all available drones."""
        discovered = self.discovery.discover()
        for drone in discovered:
            self.register(drone["id"], drone)

    def register(self, drone_id: str, info: dict):
        """Add a drone to the managed fleet."""
        self._drones[drone_id] = {
            "id": drone_id,
            "position": info.get("position", [0, 0]),
            "battery": info.get("battery", 100.0),
            "status": "idle",
            "current_task": None,
            **info,
        }

    def get(self, drone_id: str) -> dict | None:
        """Retrieve a drone's state by ID."""
        return self._drones.get(drone_id)

    def update_position(self, drone_id: str, x: int, y: int):
        """Update the recorded position of a drone."""
        if drone_id in self._drones:
            self._drones[drone_id]["position"] = [x, y]

    def update_battery(self, drone_id: str, battery: float):
        """Update the battery level for a drone."""
        if drone_id in self._drones:
            self._drones[drone_id]["battery"] = battery

    def list_drones(self) -> list[dict]:
        """Return state snapshots for all registered drones."""
        return list(self._drones.values())

    def get_available_drones(self) -> list[dict]:
        """Return drones that are idle and have sufficient battery."""
        return [
            d for d in self._drones.values()
            if d["status"] == "idle" and d["battery"] > 20.0
        ]
