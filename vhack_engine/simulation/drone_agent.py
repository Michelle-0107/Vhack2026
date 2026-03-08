"""
DroneAgent - Mesa Agent representing a single autonomous rescue drone.
Handles movement, scanning, and battery consumption within the simulation.
"""
from mesa import Agent


class DroneAgent(Agent):
    """
    Represents a drone in the disaster simulation.
    Movement and scanning decisions are driven by the CommandAgent via MCP tools.
    """

    def __init__(self, model):
        super().__init__(model)
        self.battery: float = 100.0
        self.battery_drain_per_step: float = 1.0
        self.current_task: str | None = None
        self.scanned_cells: set = set()

    def step(self):
        """Execute one simulation tick: drain battery and perform current task."""
        self._drain_battery()

    def move_to(self, x: int, y: int):
        """Move drone to the specified grid coordinates."""
        self.model.grid.move_agent(self, (x, y))

    def scan(self) -> list:
        """Return survivor agents at the current cell."""
        from vhack_engine.simulation.survivor_agent import SurvivorAgent
        self.scanned_cells.add(self.pos)
        cellmates = self.model.grid.get_cell_list_contents([self.pos])
        return [a for a in cellmates if isinstance(a, SurvivorAgent)]

    def _drain_battery(self):
        """Reduce battery level by the per-step drain rate."""
        self.battery = max(0.0, self.battery - self.battery_drain_per_step)

    @property
    def needs_recharge(self) -> bool:
        """True if battery is below 20%."""
        return self.battery < 20.0
