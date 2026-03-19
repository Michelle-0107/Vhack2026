"""
DroneAgent - Mesa Agent representing a single autonomous rescue drone.
Handles movement, scanning, and battery consumption within the simulation.
"""
from mesa import Agent
from vhack_engine.environment.disaster_map import BASE_STATION_POS


from collections import defaultdict
import random

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
        self.visit_count = defaultdict(int)
        self.state = "SEARCHING"

    def step(self):
        """Execute one simulation tick: drain battery and perform current task."""
        if hasattr(self.model, 'all_discovered') and self.model.all_discovered():
            if not getattr(self.model, 'returning_logged', False):
                with open("mission_comms.log", "a") as f:
                    f.write("[SYSTEM] All targets discovered. Fleet returning to base.\n")
                    f.flush()
                self.model.returning_logged = True
            if self.state != "CHARGING":
                self.state = "RETURNING"
            
        if self.battery < 20 and self.state != "CHARGING":
            self.state = "RETURNING"
            
        if self.state == "RETURNING":
            self._return_to_base_step()
            base_x = max(0, min(BASE_STATION_POS[0], self.model.grid.width - 1))
            base_y = max(0, min(BASE_STATION_POS[1], self.model.grid.height - 1))
            if getattr(self, "pos", None) == (base_x, base_y):
                self.state = "CHARGING"
            return
            
        if self.state == "CHARGING":
            self.battery = min(100.0, self.battery + 5.0)
            all_found = hasattr(self.model, 'all_discovered') and self.model.all_discovered()
            if self.battery >= 100.0 and not all_found:
                self.state = "SEARCHING"
            return

    def move_to(self, x: int, y: int):
        """Move drone to the specified grid coordinates."""
        if self.state in ["RETURNING", "CHARGING"]:
            return
        self.model.grid.move_agent(self, (x, y))
        self._drain_battery()

    def scan(self, radius: int = 2) -> list:
        """Return survivor agents within scan radius of drone position."""
        from vhack_engine.simulation.survivor_agent import SurvivorAgent
        self.scanned_cells.add(self.pos)
        
        # Scan all cells within radius
        survivors = []
        x, y = self.pos
        for dx in range(-radius, radius + 1):
            for dy in range(-radius, radius + 1):
                scan_pos = (x + dx, y + dy)
                # Check if position is within grid bounds
                if (0 <= scan_pos[0] < self.model.grid.width and 
                    0 <= scan_pos[1] < self.model.grid.height):
                    cellmates = self.model.grid.get_cell_list_contents([scan_pos])
                    survivors.extend([a for a in cellmates if isinstance(a, SurvivorAgent)])
        
        for a in survivors:
            if not getattr(a, 'discovered', False):
                a.discovered = True
                with open("mission_comms.log", "a") as f:
                    f.write(f"CRITICAL ALERT: Survivor confirmed at {a.pos}\n")
                    f.flush()
            a.confidence = min(100.0, getattr(a, 'confidence', 0.0) + 25.0)
            
        return survivors

    def _drain_battery(self):
        """Reduce battery level by the per-step drain rate."""
        self.battery = max(0.0, min(100.0, self.battery - self.battery_drain_per_step))

    def _return_to_base_step(self):
        """Move one grid step toward the fixed base station when battery is low."""
        if self.pos is None:
            return

        base_x = max(0, min(BASE_STATION_POS[0], self.model.grid.width - 1))
        base_y = max(0, min(BASE_STATION_POS[1], self.model.grid.height - 1))
        x, y = self.pos

        if (x, y) == (base_x, base_y):
            return

        step_x = x + (1 if base_x > x else -1 if base_x < x else 0)
        step_y = y + (1 if base_y > y else -1 if base_y < y else 0)
        self.move_to(step_x, step_y)

    @property
    def needs_recharge(self) -> bool:
        """True if battery is below 20%."""
        return self.battery < 20.0
