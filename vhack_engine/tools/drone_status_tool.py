"""
Drone Status Tool - MCP tool that returns full status of a drone including
position, battery, and current task.
"""


class DroneStatusTool:
    """Returns comprehensive status information for a drone."""

    name = "get_drone_status"
    description = "Get the full status of a drone: position, battery, and current task."

    def run(self, params: dict) -> dict:
        """
        Retrieve drone status.

        Args:
            params: {"drone_id": str}

        Returns:
            Status dict with position, battery_pct, and current_task.
        """
        drone_id = params.get("drone_id")
        # TODO: fetch from DroneManager
        return {
            "drone_id": drone_id,
            "position": [0, 0],
            "battery_pct": 100.0,
            "current_task": None,
            "status": "idle",
        }
