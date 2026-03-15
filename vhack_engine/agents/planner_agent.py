import autogen

def create_planner(llm_config):
    system_message="""
    You are the Strategic Planner. 
    Your job is to take the MISSION BRIEF and create a 3-step technical drone flight plan. 
    Example: Step 1: Deploy Drone 1 to (0,0). Step 2: Scan Sector A.
    Do not give general medical advice. Focus on DRONE STRATEGY.
    When you receive a scan result, analyze it immediately. If a survivor is found, call for immediate extraction
    """

    return autogen.AssistantAgent(
        name="Mission_Planner",
        system_message=system_message,
        llm_config=llm_config,
    )

# --- 替身类：仅为了防止旧的 mission_manager 或 __init__.py 导入报错 ---
class PlannerAgent:
    def __init__(self, *args, **kwargs): pass
    def plan(self, *args, **kwargs): return []