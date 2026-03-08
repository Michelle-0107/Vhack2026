"""
MCP Bridge - Translates between LangChain tool calls and MCP protocol messages.
Acts as the communication layer between the AI agent and drone tools.
"""
from vhack_engine.mcp.tool_registry import ToolRegistry


class MCPBridge:
    """
    Forwards tool invocation requests from the CommandAgent to the MCP server
    and returns structured results.
    """

    def __init__(self):
        self.registry = ToolRegistry()

    def invoke(self, tool_name: str, params: dict) -> dict:
        """
        Invoke a registered MCP tool by name.

        Args:
            tool_name: Name of the tool (e.g. "move_drone").
            params: Tool input parameters.

        Returns:
            Tool execution result as a dict.
        """
        tool = self.registry.get(tool_name)
        if tool is None:
            return {"error": f"Tool '{tool_name}' not found"}
        return tool.run(params)

    def list_tools(self) -> list[str]:
        """Return names of all registered tools."""
        return self.registry.list_names()
