"""
Tool Registry - Central store for all MCP-compatible tools.
Allows dynamic registration and lookup of drone action tools.
"""


class ToolRegistry:
    """
    Maintains a mapping of tool names to tool instances.
    Used by MCPBridge and MCPServer to route invocations.
    """

    def __init__(self):
        self._tools: dict = {}

    def register(self, tool):
        """Register a tool instance under its name."""
        self._tools[tool.name] = tool

    def get(self, name: str):
        """Retrieve a tool by name, or None if not found."""
        return self._tools.get(name)

    def list_names(self) -> list[str]:
        """Return names of all registered tools."""
        return list(self._tools.keys())

    def get_all_tools(self) -> list:
        """Return all registered tool instances."""
        return list(self._tools.values())
