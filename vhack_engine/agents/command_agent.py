import autogen

def create_commander(llm_config):
    return autogen.AssistantAgent(
        name="Swarm_Commander",
        system_message="""
        You are the Swarm Commander. 
        When you want to move or scan, you MUST use the tools.
        Use tools like move_drone(drone_id, x, y) and thermal_scan(drone_id). Wait for the Simulator's response before claiming success
        IMPORTANT: To call a tool, you must reply ONLY with the tool name and its params.
        DO NOT wrap it in a 'Plan Execution' JSON. Just call the function directly!""",
        llm_config=llm_config,
    )

# --- 替身类：仅为了防止旧的 mission_manager 导入报错 ---
class CommandAgent:
    def __init__(self, *args, **kwargs): pass
    def run(self, *args, **kwargs): pass