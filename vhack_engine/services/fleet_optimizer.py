"""
Fleet Optimizer - Algorithms for optimal drone task assignment,
coverage maximization, and battery-aware routing.
"""
import math
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

    def ensure_relay_connectivity(
        self,
        drones: list[dict],
        base_position: tuple[int, int],
        max_link_distance: float = 20.0,
    ) -> dict:
        """
        Verify that every non-relay drone can reach base directly or through a relay.

        Returns:
            {
              "gaps": [{"drone_id": ..., "position": (...), "distance_to_anchor": ...}],
              "relay_orders": [{"relay_drone_id": ..., "target_drone_id": ..., "relay_position": (...)}]
            }
        """
        if not drones:
            return {"gaps": [], "relay_orders": []}

        def _distance(a: tuple[int, int], b: tuple[int, int]) -> float:
            return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

        relays = [d for d in drones if d.get("role") == "relay"]
        searchers = [d for d in drones if d.get("role") != "relay"]

        anchors = [{"id": "base", "position": base_position}] + [
            {"id": d["id"], "position": tuple(d["position"])} for d in relays
        ]

        gaps: list[dict] = []
        for drone in searchers:
            drone_pos = tuple(drone["position"])
            nearest_anchor_dist = min(
                _distance(drone_pos, tuple(anchor["position"])) for anchor in anchors
            )
            if nearest_anchor_dist > max_link_distance:
                gaps.append(
                    {
                        "drone_id": drone["id"],
                        "position": drone_pos,
                        "distance_to_anchor": round(nearest_anchor_dist, 2),
                    }
                )

        relay_orders: list[dict] = []
        available_relays = [
            d
            for d in searchers
            if d.get("battery", 0.0) > 30.0
        ]
        used_relays: set[str] = set()

        for gap in gaps:
            target_pos = tuple(gap["position"])
            candidate = None
            best_score = float("inf")

            for drone in available_relays:
                if drone["id"] == gap["drone_id"] or drone["id"] in used_relays:
                    continue
                candidate_pos = tuple(drone["position"])
                midpoint = (
                    (target_pos[0] + base_position[0]) // 2,
                    (target_pos[1] + base_position[1]) // 2,
                )
                score = _distance(candidate_pos, midpoint)
                if score < best_score:
                    best_score = score
                    candidate = drone

            if candidate:
                used_relays.add(candidate["id"])
                relay_orders.append(
                    {
                        "relay_drone_id": candidate["id"],
                        "target_drone_id": gap["drone_id"],
                        "relay_position": (
                            (target_pos[0] + base_position[0]) // 2,
                            (target_pos[1] + base_position[1]) // 2,
                        ),
                    }
                )

        return {"gaps": gaps, "relay_orders": relay_orders}
