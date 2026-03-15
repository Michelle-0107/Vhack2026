"""
MCP Client - Loads tools from the FastMCP server for use with LangChain agents.
Provides both subprocess-based and direct tool loading approaches.
"""
import asyncio
from pathlib import Path
from typing import List, Optional
import sys
from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field


# Define Pydantic schemas for tool arguments
class DroneIdInput(BaseModel):
    """Input for tools requiring drone_id."""
    drone_id: str = Field(..., description="Drone identifier (e.g., 'drone_0', 'drone_1', 'drone_2')")


class MoveToInput(BaseModel):
    """Input for move_to tool."""
    drone_id: str = Field(..., description="Drone identifier to move")
    x: int = Field(..., description="Target X coordinate (0-19)", ge=0, le=19)
    y: int = Field(..., description="Target Y coordinate (0-19)", ge=0, le=19)


class DeployRelayInput(BaseModel):
    """Input for deploy_relay tool."""
    drone_id: str = Field(..., description="Source drone identifier")
    x: int = Field(..., description="Relay X coordinate", ge=0, le=19)
    y: int = Field(..., description="Relay Y coordinate", ge=0, le=19)


class SwapDronesInput(BaseModel):
    """Input for swap_drones tool."""
    tired_drone_id: str = Field(..., description="ID of the tired drone to recall")
    fresh_drone_id: str = Field(..., description="ID of the fresh drone to deploy")


class IntelInput(BaseModel):
    """Input for inject_human_intelligence tool."""
    intel_report: str = Field(..., description="Human commander intelligence report or manual override command")


class ShowMapInput(BaseModel):
    """Input for show_disaster_map tool."""
    mode: str = Field(default="standard", description="Display mode: 'standard' or 'thermal'")


def create_langchain_tools_direct():
    """
    Create LangChain tools directly from MCP server functions (no subprocess needed).
    
    Returns:
        List of LangChain StructuredTool objects.
    """
    from vhack_engine.mcp import server
    
    tools = [
        StructuredTool.from_function(
            func=server.get_swarm_status,
            name="get_swarm_status",
            description="Returns the current status, location, and battery of all drones."
        ),
        StructuredTool.from_function(
            func=server.get_battery_status,
            name="get_battery_status",
            description="Check the specific battery level of a single drone. Requires drone_id parameter.",
            args_schema=DroneIdInput
        ),
        StructuredTool.from_function(
            func=server.move_to,
            name="move_to",
            description="Move a drone to specific x, y coordinates. Requires drone_id, x, and y parameters.",
            args_schema=MoveToInput
        ),
        StructuredTool.from_function(
            func=server.get_drone_status,
            name="get_drone_status",
            description="Get the full status of a drone including position, battery, and current task. Requires drone_id parameter.",
            args_schema=DroneIdInput
        ),
        StructuredTool.from_function(
            func=server.show_disaster_map,
            name="show_disaster_map",
            description="Displays a visual ASCII radar map of the swarm. Requires mode parameter (default: 'standard').",
            args_schema=ShowMapInput
        ),
        StructuredTool.from_function(
            func=server.thermal_scan,
            name="thermal_scan",
            description="Performs a thermal scan to detect survivor heat signatures within 2-cell radius (5x5 area) of drone's position. Returns survivor IDs, health, positions, and distances. Requires drone_id parameter.",
            args_schema=DroneIdInput
        ),
        StructuredTool.from_function(
            func=server.check_signal_network,
            name="check_signal_network",
            description="Checks signal strength and detects network dead zones. Requires drone_id parameter.",
            args_schema=DroneIdInput
        ),
        StructuredTool.from_function(
            func=server.deploy_relay,
            name="deploy_relay",
            description="Deploys a new relay drone to heal network dead zones. Requires drone_id, x, and y parameters.",
            args_schema=DeployRelayInput
        ),
        StructuredTool.from_function(
            func=server.swap_drones,
            name="swap_drones",
            description="Energy rotation: sends tired drone home and fresh one to its location. Requires tired_drone_id and fresh_drone_id parameters.",
            args_schema=SwapDronesInput
        ),
        StructuredTool.from_function(
            func=server.multi_sensor_scan,
            name="multi_sensor_scan",
            description="Environmental awareness scan for thermals, gas, and fire. Requires drone_id parameter.",
            args_schema=DroneIdInput
        ),
        StructuredTool.from_function(
            func=server.inject_human_intelligence,
            name="inject_human_intelligence",
            description="Inject verbal intelligence from human commanders into swarm memory. Requires intel_report parameter.",
            args_schema=IntelInput
        ),
        StructuredTool.from_function(
            func=server.get_human_intelligence,
            name="get_human_intelligence",
            description="Reads the latest manual overrides or intelligence from human commanders. No parameters required."
        ),
    ]
    
    return tools


async def load_mcp_tools_async():
    """
    Load tools from the MCP server asynchronously via subprocess.
    This is the full MCP protocol approach (for external integrations).
    
    Returns:
        List of LangChain-compatible tool objects from the MCP server.
    """
    try:
        from langchain_mcp_adapters.client import MultiServerMCPClient
        from langchain_mcp_adapters.tools import load_mcp_tools
        
        # Get the path to the MCP server script
        server_path = Path(__file__).parent / "server.py"
        
        # Initialize client pointing to our FastMCP server
        client = MultiServerMCPClient({
            "beacon_server": {
                "command": sys.executable,  # Use current Python interpreter
                "args": [str(server_path)],
                "transport": "stdio"
            }
        })
        
        # Load tools from the server
        async with client.session("beacon_server") as session:
            tools = await load_mcp_tools(session)
            return tools
            
    except ImportError as e:
        print(f"Warning: langchain_mcp_adapters not installed. Using direct tool loading instead.")
        print(f"To use full MCP protocol, run: pip install langchain-mcp-adapters")
        return create_langchain_tools_direct()
    except Exception as e:
        print(f"Error loading MCP tools via subprocess: {e}")
        print(f"Falling back to direct tool loading...")
        return create_langchain_tools_direct()


def load_mcp_tools_sync(use_subprocess: bool = False) -> List:
    """
    Synchronous wrapper to load MCP tools.
    
    Args:
        use_subprocess: If True, uses subprocess approach. If False, uses direct integration.
    
    Returns:
        List of LangChain-compatible tool objects.
    """
    if use_subprocess:
        return asyncio.run(load_mcp_tools_async())
    else:
        return create_langchain_tools_direct()


class MCPToolLoader:
    """
    Helper class to manage MCP tool loading and caching.
    """
    
    def __init__(self, use_subprocess: bool = False):
        self._tools: Optional[List] = None
        self._loaded = False
        self.use_subprocess = use_subprocess
    
    def load_tools(self) -> List:
        """
        Load tools from MCP server (cached after first call).
        
        Returns:
            List of LangChain tools.
        """
        if not self._loaded:
            self._tools = load_mcp_tools_sync(use_subprocess=self.use_subprocess)
            self._loaded = True
        return self._tools
    
    def reload_tools(self) -> List:
        """Force reload of tools from MCP server."""
        self._loaded = False
        return self.load_tools()
    
    @property
    def tools(self) -> List:
        """Get loaded tools (loads if not already loaded)."""
        return self.load_tools()

