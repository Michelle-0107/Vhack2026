"""
MCP Server - Hosts the Model Context Protocol server that exposes drone tools.
"""
from vhack_engine.mcp.tool_registry import ToolRegistry


class MCPServer:
    """
    Listens for tool invocation requests and routes them to the
    appropriate drone tool implementation.
    """

    def __init__(self, host: str = "localhost", port: int = 8765):
        self.host = host
        self.port = port
        self.registry = ToolRegistry()
        self._running = False

    def register_tools(self):
        """Register all drone tools with the server."""
        from vhack_engine.tools.move_tool import MoveTool
        from vhack_engine.tools.thermal_scan_tool import ThermalScanTool
        from vhack_engine.tools.battery_tool import BatteryTool
        from vhack_engine.tools.drone_status_tool import DroneStatusTool

        for tool in [MoveTool(), ThermalScanTool(), BatteryTool(), DroneStatusTool()]:
            self.registry.register(tool)

    def start(self):
        """Start the MCP server."""
        self.register_tools()
        self._running = True
        # TODO: implement async WebSocket/HTTP listener

    def stop(self):
        """Gracefully shut down the server."""
        self._running = False
