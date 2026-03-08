"""
Move Tool - MCP tool that commands a drone to move to a target grid coordinate.
"""


class MoveTool:
    """Instructs a drone to navigate to a specified (x, y) position."""

    name = "move_drone"
    description = "Move a drone to a target grid coordinate."

    def run(self, params: dict) -> dict:
        """
        Execute a move command.

        Args:
            params: {"drone_id": str, "x": int, "y": int}

        Returns:
            {"success": bool, "drone_id": str, "position": [x, y]}
        """
        drone_id = params.get("drone_id")
        x, y = params.get("x", 0), params.get("y", 0)
        # TODO: call DroneManager.update_position
        return {"success": True, "drone_id": drone_id, "position": [x, y]}
