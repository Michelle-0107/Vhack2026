"""
Battery Tool - MCP tool that checks a drone's current battery level.
"""


class BatteryTool:
    """Reports the current battery percentage of a specified drone."""

    name = "check_battery"
    description = "Return the current battery level of a drone as a percentage."

    def run(self, params: dict) -> dict:
        """
        Query drone battery.

        Args:
            params: {"drone_id": str}

        Returns:
            {"drone_id": str, "battery_pct": float}
        """
        drone_id = params.get("drone_id")
        # TODO: fetch from DroneManager
        return {"drone_id": drone_id, "battery_pct": 100.0}
