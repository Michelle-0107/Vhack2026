"""
Disaster Map - Defines the static layout and hazard zones of the disaster environment.
"""
from vhack_engine.environment.sectors import Sector


# Fixed home base coordinate used by navigation and safety logic.
BASE_STATION_POS: tuple[int, int] = (10, 10)


class DisasterMap:
    """
    Holds the static properties of the disaster zone: dimensions,
    obstacle cells, hazard zones, and sector boundaries.
    """

    def __init__(self, width: int = 20, height: int = 20):
        self.width = width
        self.height = height
        self.obstacles: set[tuple[int, int]] = set()
        self.hazard_zones: set[tuple[int, int]] = set()
        self.sectors: list[Sector] = []

    def add_obstacle(self, x: int, y: int):
        """Mark a cell as impassable."""
        self.obstacles.add((x, y))

    def add_hazard(self, x: int, y: int):
        """Mark a cell as a hazard (drones take extra battery drain)."""
        self.hazard_zones.add((x, y))

    def is_passable(self, x: int, y: int) -> bool:
        """Return True if a drone can enter the cell."""
        return (x, y) not in self.obstacles

    def load_from_config(self, config: dict):
        """Populate the map from a configuration dictionary."""
        for obs in config.get("obstacles", []):
            self.add_obstacle(*obs)
        for hz in config.get("hazards", []):
            self.add_hazard(*hz)
