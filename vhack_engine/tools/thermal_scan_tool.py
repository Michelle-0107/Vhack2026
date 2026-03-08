"""
Thermal Scan Tool - MCP tool that triggers a thermal imaging scan at the drone's
current position to detect heat signatures (survivors).
"""


class ThermalScanTool:
    """Performs a thermal scan and returns detected heat signatures."""

    name = "thermal_scan"
    description = "Scan the current grid cell for survivor heat signatures."

    def run(self, params: dict) -> dict:
        """
        Execute a thermal scan.

        Args:
            params: {"drone_id": str}

        Returns:
            {"drone_id": str, "signatures": list[dict]}
        """
        drone_id = params.get("drone_id")
        # TODO: query simulation grid for survivors at drone position
        return {"drone_id": drone_id, "signatures": []}
