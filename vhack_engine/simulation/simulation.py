"""
Simulation entry point - ties together DisasterModel, DroneAgents,
and SurvivorAgents for a full Mesa-based simulation run.
Migrated and extended from vhack_engine/simulation.py.
"""
from vhack_engine.simulation.disaster_model import DisasterModel


def run_simulation(
    steps: int = 10, num_drones: int = 3, num_survivors: int = 5
) -> DisasterModel:
    """
    Initialise and step through the disaster simulation.

    Args:
        steps: Number of simulation ticks to run.
        num_drones: Number of drone agents to spawn.
        num_survivors: Number of survivor agents to place.

    Returns:
        The DisasterModel after all steps have been run.
    """
    model = DisasterModel(num_drones=num_drones, num_survivors=num_survivors)
    for _ in range(steps):
        model.step()
    return model
