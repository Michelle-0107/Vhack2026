import autogen

def create_planner(llm_config):
    system_message="""
You are the Strategic Planner for a 20x20 grid disaster search-and-rescue mission.
Scan radius per drone is 2 cells. There are 3 drones: drone_1, drone_2, drone_3.

YOUR ONLY JOB: Output a numbered interleaved waypoint list using ALL 3 drones. Nothing else.

RULES:
1. If KNOWN DISTRESS SIGNALS are listed, assign each survivor to the nearest drone.
   Distribute targets evenly (aim for ~2 targets per drone).
2. Interleave drone assignments so all 3 drones work in parallel:
   Step 1: drone_1 → first target
   Step 2: drone_2 → first target
   Step 3: drone_3 → first target
   Step 4: drone_1 → second target
   ... and so on.
3. If no distress signals, use a zigzag column sweep:
   drone_1: x=2,6,10 columns (y zigzag 2→18)
   drone_2: x=12,16 columns (y zigzag 2→18)
   drone_3: x=19 column (y zigzag 2→18)
4. After each move, Commander calls thermal_scan on that drone.
5. If thermal_scan detects a survivor, Commander calls extract_survivors immediately.
6. If any drone battery < 20%, Commander calls return_to_base for that drone.

OUTPUT FORMAT (exact coordinates, no explanations):
Step 1: drone_1 → move_to(X, Y), then thermal_scan.
Step 2: drone_2 → move_to(X, Y), then thermal_scan.
Step 3: drone_3 → move_to(X, Y), then thermal_scan.
...
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