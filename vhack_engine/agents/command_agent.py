"""
Command Agent - Top-level AI agent responsible for orchestrating the drone fleet.
Uses LangChain to reason about mission state and dispatch tool calls via MCP.
"""
from vhack_engine.llm.llm_client import OllamaClient
from vhack_engine.mcp.tool_registry import ToolRegistry


class CommandAgent:
    """
    The central AI agent that receives mission objectives and coordinates
    multiple drones to locate survivors in a disaster zone.
    """

    def __init__(self, model_name: str = "llama3"):
        self.llm = OllamaClient(model_name=model_name)
        self.tool_registry = ToolRegistry()
        self._initialized = False

    def initialize(self):
        """Load tools from the registry and build the agent executor."""
        from vhack_engine.tools.move_tool import MoveTool
        from vhack_engine.tools.thermal_scan_tool import ThermalScanTool
        from vhack_engine.tools.battery_tool import BatteryTool
        from vhack_engine.tools.drone_status_tool import DroneStatusTool

        for tool in [MoveTool(), ThermalScanTool(), BatteryTool(), DroneStatusTool()]:
            self.tool_registry.register(tool)

        # TODO: build LangChain AgentExecutor with self.llm and tools
        self._initialized = True

    def run(self, mission_brief: str) -> str:
        """
        Execute a mission step given a natural-language brief or state summary.

        Args:
            mission_brief: Text describing the current mission state.

        Returns:
            Agent response or action plan as a string.
        """
        if not self._initialized:
            self.initialize()
        # TODO: return self._executor.invoke({"input": mission_brief})
        return f"[CommandAgent] Received brief: {mission_brief}"
