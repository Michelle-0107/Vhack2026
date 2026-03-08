"""
DisasterModel - Mesa Model representing the disaster zone.
Manages the simulation grid, spawns drones and survivors, and tracks mission state.
"""
from mesa import Model
from mesa.space import MultiGrid

from vhack_engine.simulation.drone_agent import DroneAgent
from vhack_engine.simulation.survivor_agent import SurvivorAgent


class DisasterModel(Model):
    """
    Top-level Mesa simulation model for the disaster rescue scenario.
    """

    def __init__(
        self,
        num_drones: int = 3,
        num_survivors: int = 5,
        width: int = 20,
        height: int = 20,
    ):
        super().__init__()
        self.num_drones = num_drones
        self.num_survivors = num_survivors
        self.grid = MultiGrid(width, height, torus=False)
        self.step_count = 0
        self._spawn_agents()

    def _spawn_agents(self):
        """Place drone and survivor agents on the grid."""
        for _ in range(self.num_drones):
            drone = DroneAgent(self)
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            self.grid.place_agent(drone, (x, y))

        for _ in range(self.num_survivors):
            survivor = SurvivorAgent(self)
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            self.grid.place_agent(survivor, (x, y))

    def step(self):
        """Advance the simulation by one tick."""
        self.agents.shuffle_do("step")
        self.step_count += 1

    def get_state(self) -> dict:
        """Return a snapshot of the current simulation state."""
        return {
            "step": self.step_count,
            "drones": [
                {"id": a.unique_id, "pos": a.pos, "battery": a.battery}
                for a in self.agents
                if isinstance(a, DroneAgent)
            ],
            "survivors": [
                {"id": a.unique_id, "pos": a.pos, "rescued": a.rescued, "health": a.health}
                for a in self.agents
                if isinstance(a, SurvivorAgent)
            ],
        }
