"""
Fleet Optimizer - Algorithms for optimal drone task assignment,
coverage maximization, and battery-aware routing.
"""
from vhack_engine.environment.sectors import Sector


class FleetOptimizer:
    """
    Assigns drones to sectors and optimizes coverage routes.
    """

    def assign_sectors(
        self, drones: list[dict], sectors: list[Sector]
    ) -> dict[str, str]:
        """
        Assign each sector to the closest available drone.

        Args:
            drones: List of drone state dicts with 'id' and 'position'.
            sectors: Unassigned sectors.

        Returns:
            Mapping of drone_id -> sector_id.
        """
        assignments: dict[str, str] = {}
        remaining_drones = list(drones)
        for sector in sectors:
            if not remaining_drones:
                break
            cx, cy = sector.center
            closest = min(
                remaining_drones,
                key=lambda d: abs(d["position"][0] - cx) + abs(d["position"][1] - cy),
            )
            assignments[closest["id"]] = sector.sector_id
            remaining_drones = [d for d in remaining_drones if d["id"] != closest["id"]]
        return assignments

    def prioritize_sectors(self, sectors: list[Sector]) -> list[Sector]:
        """Sort sectors by priority (descending)."""
        return sorted(sectors, key=lambda s: s.priority, reverse=True)
