"""
Mission Manager - Coordinates overall mission lifecycle, from briefing through
task dispatch to completion reporting.
"""
from vhack_engine.agents.command_agent import CommandAgent
from vhack_engine.services.drone_manager import DroneManager
from vhack_engine.simulation.disaster_model import DisasterModel


class MissionManager:
    """
    Orchestrates an end-to-end search and rescue mission.
    Connects the AI CommandAgent, drone fleet, and simulation environment.
    """

    def __init__(self):
        self.command_agent = CommandAgent()
        self.drone_manager = DroneManager()
        self.model: DisasterModel | None = None
        self.active = False

    def start_mission(self, num_drones: int = 3, num_survivors: int = 5):
        """
        Initialise the simulation and start the mission.

        Args:
            num_drones: Drones to spawn in the simulation.
            num_survivors: Survivors to place in the environment.
        """
        self.model = DisasterModel(num_drones=num_drones, num_survivors=num_survivors)
        self.drone_manager.initialize_fleet()
        self.command_agent.initialize()
        self.active = True

    def step(self):
        """Advance simulation by one tick and let the agent reason."""
        if not self.active or self.model is None:
            return
        self.model.step()
        state = self.model.get_state()
        # TODO: self.command_agent.run(str(state))

    def stop_mission(self):
        """Terminate the active mission."""
        self.active = False

    def get_status(self) -> dict:
        """Return current mission status."""
        if self.model is None:
            return {"active": False}
        return {"active": self.active, **self.model.get_state()}
