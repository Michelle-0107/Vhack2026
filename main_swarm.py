# main_swarm.py
import autogen
import json
import re
import os
import asyncio
from vhack_engine.agents.planner_agent import create_planner
from vhack_engine.agents.command_agent import create_commander
from vhack_engine.agents.sop_agent import create_sop_expert, retrieve_sop
from vhack_engine.agents.reasoning import export_mission_log

LOG_PATH = os.path.abspath("mission_comms.log")

def write_to_live_log(sender_name, content):
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"[{sender_name}]: {content}\n")
    except Exception: pass

def run_swarm_simulation(mission_brief: str, mcp_tools=None):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    llm_config = {
        "config_list": [{"model": "llama3.2", "api_key": "NULL", "base_url": "http://127.0.0.1:11434/v1"}],
        "temperature": 0.0, # Extremely low temperature to stop the AI from hallucinating formats
        "cache_seed": None
    }

    # 1. Instantiate Brains
    planner = create_planner(llm_config)
    commander = create_commander(llm_config)
    sop_expert = create_sop_expert(llm_config)

    # ULTRA-STRICT Instructions
    commander.update_system_message(
        "You are Swarm_Commander. Your ONLY job is to execute the approved flight plan. "
        "You MUST use the provided tools. DO NOT write conversational text. "
        "To move a drone, you MUST output a raw JSON block exactly like this:\n"
        '{"name": "move_to", "arguments": {"drone_id": "drone_0", "x": 10, "y": 15}}\n'
        "To scan, output exactly this:\n"
        '{"name": "thermal_scan", "arguments": {"drone_id": "drone_0"}}\n'
        "Valid drones are 'drone_0', 'drone_1', 'drone_2'."
    )

    simulator = autogen.UserProxyAgent(
        name="Simulator_Env",
        system_message="Environment executor. Execute tool calls and return results.",
        human_input_mode="NEVER",
        code_execution_config=False,
        is_termination_msg=lambda x: "TERMINATE" in str(x.get("content", "")).upper()
    )

    from vhack_engine.mcp import server as _mcp_server

    def clean_id(d_id):
        nums = re.findall(r'\d+', str(d_id))
        return f"drone_{nums[0]}" if nums else str(d_id)

    def safe_move_to(drone_id: str, x: int, y: int) -> str:
        return _mcp_server.move_to(clean_id(drone_id), int(x), int(y))

    def safe_thermal_scan(drone_id: str) -> str:
        return _mcp_server.thermal_scan(clean_id(drone_id))

    def safe_get_status(drone_id: str) -> str:
        return _mcp_server.get_drone_status(clean_id(drone_id))

    # Register SOP tool
    autogen.agentchat.register_function(
        retrieve_sop, caller=sop_expert, executor=simulator, 
        name="retrieve_sop", description="Retrieve SOPs."
    )
    
    # Register Drone tools
    for f, n, d in [
        (safe_move_to, "move_to", "Move a specific drone. Requires drone_id, x, y."),
        (safe_thermal_scan, "thermal_scan", "Scan for survivors. Requires drone_id."),
        (safe_get_status, "get_drone_status", "Check position. Requires drone_id."),
        (_mcp_server.get_mission_status, "get_mission_status", "Check if mission complete."),
        (_mcp_server.extract_survivors, "extract_survivors", "Rescue survivors. Requires drone_id.")
    ]:
        autogen.agentchat.register_function(f, caller=commander, executor=simulator, name=n, description=d)

    # --- BULLETPROOF TOOL TRANSLATOR ---
    def parse_raw_json_tool_calls(agent, messages, sender, config):
        if not messages: return False, None
        message = messages[-1]
        
        # If it's already a perfect tool call, leave it alone
        if message.get("tool_calls"): return False, None
            
        content = str(message.get("content", ""))
        if not content: return False, None

        # Method A: Catch strict JSON format {"name": "move_to", "arguments": {"drone_id": "drone_0", "x": 10, "y": 10}}
        try:
            match = re.search(r'(\{.*?"name"\s*:\s*".*?\})', content, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                name = data.get("name")
                args = data.get("parameters", data.get("arguments", {}))
                if isinstance(args, dict): args = json.dumps(args)
                if name:
                    message["tool_calls"] = [{"id": "call_json", "type": "function", "function": {"name": name, "arguments": args}}]
                    return False, None
        except Exception: pass

        # Method B: Catch Python text format move_to(drone_id="drone_0", x=5, y=5)
        try:
            match = re.search(r'(\w+)\((.*?)\)', content)
            if match:
                name = match.group(1)
                raw_args = match.group(2)
                args_dict = {}
                for pair in raw_args.split(','):
                    if '=' in pair:
                        k, v = pair.split('=', 1)
                        v = v.strip().strip("'\"")
                        args_dict[k.strip()] = int(v) if v.isdigit() else str(v)
                
                # If they didn't use kwargs, force map them based on the function name
                if not args_dict and raw_args:
                    vals = [v.strip().strip("'\"") for v in raw_args.split(',')]
                    if name == "move_to" and len(vals) >= 3:
                        args_dict = {"drone_id": str(vals[0]), "x": int(vals[1]), "y": int(vals[2])}
                    elif len(vals) >= 1:
                        args_dict = {"drone_id": str(vals[0])}

                if name:
                    message["tool_calls"] = [{"id": "call_text", "type": "function", "function": {"name": name, "arguments": json.dumps(args_dict)}}]
                    return False, None
        except Exception: pass

        return False, None

    commander.register_reply([autogen.Agent, None], parse_raw_json_tool_calls, position=1)

    # Speaker Selection
    def _next_speaker(last_speaker, groupchat):
        if last_speaker is None: return planner
        name = getattr(last_speaker, "name", "")
        if name == "Simulator_Env":
            return planner if len(groupchat.messages) <= 1 else commander
        if name == "Mission_Planner": return sop_expert
        if name == "SOP_Expert":
            content = str(groupchat.messages[-1].get("content", ""))
            return commander if "APPROVED" in content else planner
        return simulator

    # Live UI Logging Hook
    def log_hook(agent, messages, sender, config):
        if messages:
            m = messages[-1]
            if m.get("content") and "TERMINATE" not in m["content"] and "tool_calls" not in m:
                write_to_live_log(m.get("name") or agent.name, m["content"])
        return False, None

    for a in [planner, commander, sop_expert, simulator]:
        a.register_reply([autogen.Agent, None], log_hook, position=2)

    # 6. RUN
    groupchat = autogen.GroupChat(
        agents=[simulator, planner, sop_expert, commander], 
        messages=[], max_round=60,
        speaker_selection_method=_next_speaker 
    )
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # Get live hint
    survivors = _mcp_server._get_survivor_agents()
    hint = ""
    if survivors:
        locs = ", ".join([f"({s.pos[0]},{s.pos[1]})" for s in survivors if not s.rescued])
        hint = f"\n\nLIVE DISTRESS SIGNALS: {locs}. Active Drones: drone_0, drone_1, drone_2."

    print("🚀 AutoGen Swarm Intelligence Online...")
    chat_result = simulator.initiate_chat(manager, message=f"MISSION: {mission_brief}{hint}")
    return {"status": "success"}