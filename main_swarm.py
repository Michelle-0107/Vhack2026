# main_swarm.py
import autogen
from vhack_engine.agents.planner_agent import create_planner
from vhack_engine.agents.command_agent import create_commander
from vhack_engine.agents.sop_agent import create_sop_expert, retrieve_sop
from vhack_engine.agents.reasoning import export_mission_log # 🌟 新增：导入你的日志生成器

def run_swarm_simulation(mission_brief: str, mcp_tools=None):
    # 统一的 Ollama 配置
    llm_config = {
        "config_list": [{
            "model": "llama3.2",
            "base_url": "http://localhost:11434/v1",
            "api_key": "ollama",
            "price": [0, 0],
        }],
        "temperature": 0.5
    }

    # 1. 实例化我们的三个大脑
    planner = create_planner(llm_config)
    commander = create_commander(llm_config)
    sop_expert = create_sop_expert(llm_config)

    # 2. 实例化模拟器 (环境/执行者)
    simulator = autogen.UserProxyAgent(
        name="Simulator_Env",
        system_message="Environment executor. Reply 'TERMINATE' when mission is done.",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=120,
        code_execution_config=False,
        is_termination_msg=lambda x: x.get("content", "").strip().upper() == "TERMINATE"
    )

    # 3. 注册工具 (把武器发给对应的人)
    # --- A. 注册 SOP RAG 工具 ---
    autogen.agentchat.register_function(
        retrieve_sop, caller=sop_expert, executor=simulator, 
        name="retrieve_sop", description="Search SOP database for rules."
    )
    
    # --- B. 注册真实仿真工具 ---
    from vhack_engine.mcp import server as _mcp_server

    def move_to(drone_id: str, x: int, y: int) -> str:
        return _mcp_server.move_to(drone_id, x, y)

    def thermal_scan(drone_id: str) -> str:
        return _mcp_server.thermal_scan(drone_id)

    def get_battery_status(drone_id: str) -> str:
        return _mcp_server.get_battery_status(drone_id)

    def get_drone_status(drone_id: str) -> str:
        return _mcp_server.get_drone_status(drone_id)

    def get_swarm_status() -> str:
        return _mcp_server.get_swarm_status()

    def check_signal_network(drone_id: str) -> str:
        return _mcp_server.check_signal_network(drone_id)

    def deploy_relay(drone_id: str, x: int, y: int) -> str:
        return _mcp_server.deploy_relay(drone_id, x, y)

    def extract_survivors(drone_id: str, radius: int = 2) -> str:
        return _mcp_server.extract_survivors(drone_id, radius)

    def return_to_base(drone_id: str) -> str:
        return _mcp_server.return_to_base(drone_id)

    def get_mission_status() -> str:
        return _mcp_server.get_mission_status()

    def get_human_intelligence() -> str:
        """ALWAYS call this FIRST. Reads latest human operator intelligence and mission overrides."""
        return _mcp_server.get_human_intelligence()

    def inject_human_intelligence(intel_report: str) -> str:
        """Log human commander intelligence into swarm memory. Provide intel_report string."""
        return _mcp_server.inject_human_intelligence(intel_report)

    commander_tools = [
        (move_to, "move_to", "Move a drone to a target grid cell. Example: move_to(drone_id='drone_1', x=10, y=15)"),
        (thermal_scan, "thermal_scan", "Scan around a drone for nearby survivors in the live simulation."),
        (extract_survivors, "extract_survivors", "Rescue survivors within extraction radius after a positive scan."),
        (return_to_base, "return_to_base", "Immediately recall a drone to base at (10, 10), especially when battery is below 20%."),
        (get_battery_status, "get_battery_status", "Read the live battery level of a specific drone."),
        (get_drone_status, "get_drone_status", "Read live status for a specific drone."),
        (get_swarm_status, "get_swarm_status", "Read the live state of all drones."),
        (get_mission_status, "get_mission_status", "Read rescued count, remaining survivors, mission completion, and low-battery drones."),
        (check_signal_network, "check_signal_network", "Check whether a drone has good communications coverage."),
        (deploy_relay, "deploy_relay", "Deploy a relay drone to restore communications coverage."),
    ]

    for tool_func, tool_name, description in commander_tools:
        autogen.agentchat.register_function(
            tool_func,
            caller=commander,
            executor=simulator,
            name=tool_name,
            description=description,
        )

    autogen.agentchat.register_function(
        get_human_intelligence,
        caller=commander,
        executor=simulator,
        name="get_human_intelligence",
        description="ALWAYS call this FIRST before any other action. Returns latest human operator intelligence and overrides."
    )
    autogen.agentchat.register_function(
        inject_human_intelligence,
        caller=commander,
        executor=simulator,
        name="inject_human_intelligence",
        description="Log human commander intelligence into swarm memory. Requires intel_report parameter."
    )

    _commander_retries = [0]
    _sop_retrieval_used = [False]

    def _next_speaker(last_speaker, groupchat):
        """Force a stable workflow: Planner -> SOP -> Commander -> Simulator -> Commander..."""
        if last_speaker is None:
            return planner

        def _last_non_sim_message_name() -> str:
            for message in reversed(groupchat.messages):
                name = message.get("name", "")
                if name and name != "Simulator_Env":
                    return name
            return ""

        name = getattr(last_speaker, "name", "")
        if name == "Simulator_Env":
            # Initial prompt goes to planner.
            if len(groupchat.messages) <= 1:
                return planner

            # If simulator just executed a SOP tool call, let SOP produce verdict.
            if _last_non_sim_message_name() == "SOP_Expert":
                return sop_expert
            return commander
        if name == "Mission_Planner":
            return sop_expert
        if name == "SOP_Expert":
            # SOP either calls retrieve_sop or issues approval/rejection.
            last_content = ""
            if groupchat.messages:
                last_content = str(groupchat.messages[-1].get("content", ""))
            # FIX 1: REJECTED is a hard block — route back to Planner for re-planning.
            if "APPROVED FOR COMMANDER" in last_content:
                return commander
            if "REJECTED" in last_content:
                return planner
            # Allow SOP retrieval only once per mission run; after that require explicit verdict.
            if _sop_retrieval_used[0]:
                groupchat.messages.append({
                    "role": "user",
                    "name": "Simulator_Env",
                    "content": (
                        "SYSTEM OVERRIDE: SOP_Expert must output a final verdict now. "
                        "Reply with exactly one line: APPROVED FOR COMMANDER or REJECTED. "
                        "Do not call retrieve_sop again in this mission run."
                    ),
                })
                return sop_expert
            _sop_retrieval_used[0] = True
            return simulator
        if name == "chat_manager":
            return commander
        if name == "Swarm_Commander":
            # FIX 2: Detect plain-text Commander messages and retry instead of blindly
            # passing to Simulator, which would silently drop the turn.
            last_msg = groupchat.messages[-1] if groupchat.messages else {}
            has_tool_calls = bool(last_msg.get("tool_calls"))
            content = str(last_msg.get("content") or "").strip()
            if has_tool_calls or content.upper() == "TERMINATE":
                _commander_retries[0] = 0
                return simulator
            # Plain-text narrative detected: inject a hard nudge and retry (up to 2×).
            if _commander_retries[0] < 2:
                _commander_retries[0] += 1
                groupchat.messages.append({
                    "role": "user",
                    "name": "Simulator_Env",
                    "content": (
                        "SYSTEM OVERRIDE: You sent plain text. This is invalid. "
                        "You MUST call exactly ONE tool now — no explanations. "
                        "Example: call get_mission_status() or move_to('drone_1', x, y)."
                    ),
                })
                return commander
            _commander_retries[0] = 0
            return simulator
        return commander

    # ==========================================
    # 🌟 重点在这里：Manager (会议主持人) 登场！
    # ==========================================
    groupchat = autogen.GroupChat(
        agents=[simulator, planner, sop_expert, commander], 
        messages=[], 
        max_round=50,
        speaker_selection_method=_next_speaker,
    )
    # Manager 负责根据群里的聊天上下文，决定下一个谁发言
    manager = autogen.GroupChatManager(
        groupchat=groupchat,
        llm_config=llm_config,
        is_termination_msg=lambda msg: (
            str(msg.get("content", "")).strip().upper() == "TERMINATE"
            and _mcp_server.is_mission_complete()
        ),
    )

    # ==========================================
    # 开始模拟！由模拟器抛出初始任务给 Manager
    # ==========================================
    print("🚀 启动 AutoGen 搜救指挥群聊...")

    # Inject live survivor positions so the Planner can target them directly.
    survivor_agents = _mcp_server._get_survivor_agents()
    if survivor_agents:
        unrescued = [s for s in survivor_agents if not s.rescued]
        if unrescued:
            positions = ", ".join(f"({s.pos[0]}, {s.pos[1]})" for s in unrescued)
            survivor_hint = (
                f"\n\nKNOWN DISTRESS SIGNALS: {len(unrescued)} survivors located at grid positions: "
                f"{positions}. Planner MUST route drones to these exact coordinates first."
            )
        else:
            survivor_hint = ""
    else:
        survivor_hint = ""

    # 🌟 新增：用变量 chat_result 接住群聊的返回结果
    chat_result = simulator.initiate_chat(
        manager,
        message=f"""MISSION BRIEF: {mission_brief}{survivor_hint}
        Planner: Give a concrete step-by-step flight plan with exact (x, y) waypoints targeting the distress signals above.
        SOP_Expert: Check the strategy against our SOP database before we move and explicitly approve or reject it.
        Commander: Call get_human_intelligence() once, then execute the Planner's waypoints one tool call at a time. After every move call thermal_scan. If scan detects survivors call extract_survivors. If battery < 20% call return_to_base. Call get_mission_status() after each action; when mission_complete=True reply TERMINATE."""
    )
    
    # 🌟 新增：群聊结束（比如 Commander 说了 TERMINATE，或者达到了 max_round）后，导出战报！
    print("\n💾 正在保存比赛战报日志...")

    recall_result = "Mission not complete; no fleet recall triggered."
    if _mcp_server.is_mission_complete():
        recall_result = _mcp_server.all_drones_return()
        print("\n📡 Mission complete. Recalling all drones to base station...")
        print(recall_result)

    export_mission_log(chat_result, filepath="vhack_mission_log.txt")
    print("🎉 模拟运行结束！")

    turns = 0
    if hasattr(chat_result, "chat_history") and isinstance(chat_result.chat_history, list):
        turns = len(chat_result.chat_history)

    return {
        "status": "completed",
        "mode": "multiagent",
        "turns": turns,
        "log_file": "vhack_mission_log.txt",
        "recall": recall_result,
    }

if __name__ == "__main__":
    # 🌟 在這裡定義詳細的任務邊界
    brief = """
    MISSION BRIEF:
    1. AREA: Sector A (Grid size 1000x1000).
    2. OBJECTIVE: Search for 3 missing survivors.
    3. ASSETS: Drones 1 and 2 are on standby.
    4. STRATEGY: Start grid search from (0,0). Use thermal scans every 100 units.
    """
    run_swarm_simulation(brief)