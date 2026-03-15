# main_swarm.py
import autogen
from vhack_engine.agents.planner_agent import create_planner
from vhack_engine.agents.command_agent import create_commander
from vhack_engine.agents.sop_agent import create_sop_expert, retrieve_sop
from vhack_engine.agents.reasoning import export_mission_log # 🌟 新增：导入你的日志生成器
from vhack_engine.mcp.mcp_bridge import MCPBridge
def run_swarm_simulation(mission_brief: str, mcp_tools=None):
    # 统一的 Ollama 配置
    llm_config = {
        "config_list": [{"model": "llama3.2", "base_url": "http://localhost:11434/v1", "api_key": "ollama"}],
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
        max_consecutive_auto_reply=15,
        code_execution_config=False,
        is_termination_msg=lambda x: "TERMINATE" in x.get("content", "").upper()
    )

    # 3. 注册工具 (把武器发给对应的人)
    # --- A. 注册 SOP RAG 工具 ---
    autogen.agentchat.register_function(
        retrieve_sop, caller=sop_expert, executor=simulator, 
        name="retrieve_sop", description="Search SOP database for rules."
    )
    
    # --- B. 动态注册 MCP 工具 (增强兼容版) ---
    bridge = MCPBridge()
    # 手动注册你的工具实例
    from vhack_engine.tools.move_tool import MoveTool
    from vhack_engine.tools.battery_tool import BatteryTool
    from vhack_engine.tools.drone_status_tool import DroneStatusTool
    from vhack_engine.tools.thermal_scan_tool import ThermalScanTool

    bridge.registry.register(MoveTool())
    bridge.registry.register(BatteryTool())
    bridge.registry.register(DroneStatusTool())
    bridge.registry.register(ThermalScanTool())
    
    all_tools = bridge.registry.get_all_tools()

    for tool_instance in all_tools:
        def create_wrapped_tool(t_inst):
            # 🌟 核心改进：为所有参数提供类型标注，包括 **kwargs: dict
            def wrapped_tool(drone_id: str = "D1", x: float = 0.0, y: float = 0.0, **kwargs: dict) -> str:
                """Universal drone tool wrapper with full type annotations."""
                # 整合参数
                params = {"drone_id": drone_id, "x": x, "y": y}
                if kwargs:
                    params.update(kwargs)
                
                # 清理 None
                params = {k: v for k, v in params.items() if v is not None}
                
                print(f"🚀 [MCP Action] 执行: {t_inst.name} | 参数: {params}")
                
                try:
                    result = t_inst.run(params)
                    return f"SUCCESS: {t_inst.name} executed. Result: {result}"
                except Exception as e:
                    return f"ERROR in {t_inst.name}: {str(e)}"
            
            wrapped_tool.__name__ = t_inst.name
            return wrapped_tool

        # 只保留这一个注册调用
        autogen.agentchat.register_function(
            create_wrapped_tool(tool_instance),
            caller=commander,
            executor=simulator,
            name=tool_instance.name,
            description=f"Action tool: {tool_instance.name}. Example: {tool_instance.name}(drone_id='D1', x=5.0, y=5.0)"
        )

    # ==========================================
    # 🌟 重点在这里：Manager (会议主持人) 登场！
    # ==========================================
    groupchat = autogen.GroupChat(
        agents=[simulator, planner, commander, sop_expert], 
        messages=[], 
        max_round=30,  # 稍微增加轮次，确保能完成：规划 -> 问规则 -> 执行
        speaker_selection_method="round_robin" # 🌟 强制轮流发言，防止小模型逻辑混乱
    )
    # Manager 负责根据群里的聊天上下文，决定下一个谁发言
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # ==========================================
    # 开始模拟！由模拟器抛出初始任务给 Manager
    # ==========================================
    print("🚀 启动 AutoGen 搜救指挥群聊...")
    
    # 🌟 新增：用变量 chat_result 接住群聊的返回结果
    chat_result = simulator.initiate_chat(
        manager,
        message=f"""MISSION BRIEF: {mission_brief}
        Planner: Give a strategy.
        SOP_Expert: Check the strategy against our SOP database before we move.
        Commander: Execute only after SOP_Expert approves."""
    )
    
    # 🌟 新增：群聊结束（比如 Commander 说了 TERMINATE，或者达到了 max_round）后，导出战报！
    print("\n💾 正在保存比赛战报日志...")
    export_mission_log(chat_result, filepath="vhack_mission_log.txt")
    print("🎉 模拟运行结束！")

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