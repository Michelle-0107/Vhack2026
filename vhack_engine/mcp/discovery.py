"""
Drone Discovery - Dynamically detects available drones and registers their
capabilities without requiring hardcoded drone lists.
"""
from vhack_engine.config.settings import Settings


class DroneDiscovery:
    """
    Scans the simulation or network for active drones and returns
    their identifiers and capability manifests.
    """

    def __init__(self):
        self.settings = Settings()

    def discover(self) -> list[dict]:
        """
        Return a list of discovered drone descriptors.

        Returns:
            List of dicts with keys: id, capabilities, battery, position.
        """
        # TODO: query simulation state or network broadcast
        return []

    def register_drone(self, drone_id: str, capabilities: list[str]):
        """Manually register a drone and its supported tool capabilities."""
        pass
