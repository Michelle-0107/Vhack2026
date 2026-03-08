"""
SurvivorAgent - Mesa Agent representing a survivor in the disaster zone.
Survivors remain stationary until located by a drone.
"""
from mesa import Agent


class SurvivorAgent(Agent):
    """
    Represents a survivor waiting to be found by the drone fleet.
    Health degrades each simulation step until they are rescued.
    """

    def __init__(self, model):
        super().__init__(model)
        self.rescued: bool = False
        self.health: float = 100.0
        self.health_decay: float = 0.5

    def step(self):
        """Simulate health degradation over time."""
        if not self.rescued:
            self.health = max(0.0, self.health - self.health_decay)

    def rescue(self):
        """Mark this survivor as rescued."""
        self.rescued = True
