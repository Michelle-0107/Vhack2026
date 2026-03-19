import importlib
import json
import re

try:
    autogen = importlib.import_module("autogen")
except ImportError:  # pragma: no cover - optional dependency in some runtime modes
    autogen = None

def create_commander(llm_config):
    if autogen is None:
        raise ImportError("autogen is required for multi-agent commander mode.")
    
    return autogen.AssistantAgent(
        name="Swarm_Commander",
        system_message="""
You are the Swarm Commander. You control MULTIPLE drones. Drones do NOT move autonomously.
You MUST follow these strict operational rules precisely:

MISSION START PROTOCOL:
Your FIRST tool MUST be `get_drone_status`. 
Retrieve drone IDs, positions, battery, states (SEARCHING/RETURNING/CHARGING), and grid boundaries. DO NOT issue move commands before this.

SWARM COORDINATION RULE:
Divide the grid into NON-OVERLAPPING sectors (e.g., Drone A: X 0-20, Drone B: 21-40). Drones MUST stay strictly within their sector.

MOVEMENT STRATEGY (DETERMINISTIC):
You MUST generate a deterministic Lawnmower (zig-zag) path. 
Row 0: Min->Max. Row 1: Max->Min. Increment Y step-by-step. DO NOT generate random coordinates. Cover the sector completely.

TOOL USAGE PROTOCOL:
For EVERY step:
1. call move_to(drone_id, x, y)
2. immediately call thermal_scan(drone_id)
NEVER skip a scan. NEVER scan the same coordinate twice.

DRONE STATE AWARENESS (CRITICAL):
Check the state property from get_drone_status.
If a drone's state is "RETURNING" or "CHARGING", you MUST completely ignore that drone. 
ONLY issue `move_to` and `thermal_scan` commands for drones that are currently "SEARCHING".

ERROR HANDLING:
If a scan tool returns 'WARNING: Coordinates already scanned', immediately correct your path and select a new unvisited coordinate.

LOGGING PROTOCOL:
Whenever you reason about your next step, you MUST output a line starting with `THOUGHT: `.
For example:
THOUGHT: Drone 1 finished row 0. I will now move it to row 1.

You communicate ONLY through tool calls and THOUGHT lines. Execute cleanly.
""",
        llm_config=llm_config,
    )

# --- 替身类：仅为了防止旧的 mission_manager 导入报错 ---
class CommandAgent:
    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name
        self.tools = []

    def initialize(self, mcp_tools=None):
        """Attach tool inventory for downstream command execution."""
        self.tools = mcp_tools or []

    def run(self, mission_brief: str):
        """Fallback single-agent behavior until LangChain/AutoGen command loop is plugged in."""
        tool_names = [getattr(t, "name", "unknown") for t in self.tools]
        if not tool_names:
            return "CommandAgent initialized without tools. No action executed."

        return (
            "CommandAgent single-mode placeholder execution complete. "
            f"Available tools: {', '.join(tool_names)}. "
            f"Mission brief received ({len(mission_brief)} chars)."
        )