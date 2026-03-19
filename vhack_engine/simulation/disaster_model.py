"""
DisasterModel - Mesa Model representing the disaster zone.
Manages the simulation grid, spawns drones and survivors, and tracks mission state.
"""
from mesa import Model
from mesa.space import MultiGrid

from vhack_engine.simulation.drone_agent import DroneAgent
from vhack_engine.simulation.survivor_agent import SurvivorAgent

BASE_STATION_POS = (10, 10)


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
        self.returning_logged = False
        self._spawn_agents()

    def _spawn_agents(self):
        """Place drone and survivor agents on the grid."""
        for _ in range(self.num_drones):
            drone = DroneAgent(self)
            self.grid.place_agent(drone, BASE_STATION_POS)
            drone.visit_count[drone.pos] = 1
            drone.scanned_cells.add(drone.pos)

        for _ in range(self.num_survivors):
            survivor = SurvivorAgent(self)
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            self.grid.place_agent(survivor, (x, y))

    def step(self):
        """Advance the simulation by one tick."""
        self.agents.shuffle_do("step")
        self.step_count += 1

    def get_survivor_by_id(self, sid: str):
        for a in self.agents:
            if isinstance(a, SurvivorAgent) and f"SV-{a.unique_id}" == sid:
                return a
        return None

    def get_drone_by_id(self, did: str):
        try:
            agent_id = int(str(did).replace("drone_", "").replace("DR-", ""))
        except:
            return None
        from vhack_engine.simulation.drone_agent import DroneAgent
        for a in self.agents:
            if isinstance(a, DroneAgent) and a.unique_id == agent_id:
                return a
        return None

    def all_discovered(self):
        survivors = [a for a in self.agents if isinstance(a, SurvivorAgent)]
        if not survivors:
            return False
        return all(getattr(s, 'discovered', False) for s in survivors)

    def get_state(self) -> dict:
        """Return a snapshot of the current simulation state."""
        from vhack_engine.simulation.drone_agent import DroneAgent
        from vhack_engine.simulation.survivor_agent import SurvivorAgent
        
        # Gather all unique scanned coordinates from all drones
        all_scanned = set()
        for a in self.agents:
            if isinstance(a, DroneAgent):
                all_scanned.update(getattr(a, 'scanned_cells', set()))
                
        return {
            "active": True,
            "step": self.step_count,
            "scannedCells": [{"x": pos[0], "y": pos[1]} for pos in all_scanned],
            "drones": [
                {
                    "id": str(a.unique_id), 
                    "pos": a.pos, 
                    "battery": getattr(a, 'battery', 100.0),
                    "state": getattr(a, 'state', 'SEARCHING') 
                }
                for a in self.agents
                if isinstance(a, DroneAgent)
            ],
            "survivors": [
                {
                    "id": str(a.unique_id), "pos": a.pos, "rescued": getattr(a, 'rescued', False), "health": getattr(a, 'health', 100), 
                    "discovered": getattr(a, 'discovered', False), 
                    "confidence": getattr(a, 'confidence', 0.0), 
                    "status": getattr(a, 'status', 'ACTIVE')
                }
                for a in self.agents
                if isinstance(a, SurvivorAgent)
            ],
        }