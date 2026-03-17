import importlib

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
You are the Swarm Commander. You communicate ONLY through tool calls. NEVER write plain text.

ABSOLUTE RULES — NEVER BREAK THESE:
1. Every turn you must call EXACTLY ONE tool. No introductions, no summaries, no narrative text.
2. Execute the Planner's interleaved waypoint list in order:
   a. get_human_intelligence()    — call ONCE at the very start only.
   b. return_to_base(drone_id)    — IMMEDIATELY for ANY drone whose battery is below 20%.
   c. move_to(drone_id, x, y)     — follow the Planner's waypoints one at a time.
   d. thermal_scan(drone_id)      — call after EVERY move without exception.
   e. extract_survivors(drone_id) — call IMMEDIATELY if thermal_scan says SURVIVOR DETECTED.
   f. get_mission_status()        — call ONLY after an extraction or a return_to_base.
      When it reports mission_complete=True, reply with the single word: TERMINATE
3. Do NOT call get_mission_status() after a plain move or scan — only after rescue/return.
4. Do NOT call get_human_intelligence() more than once per mission.
5. DO NOT send any text message that is not a tool call.""",
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