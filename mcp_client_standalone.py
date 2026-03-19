"""
Standalone MCP Client (Teammate's Version)
Runs as a separate process - can be called via subprocess from API
"""
import asyncio
import ast
import sys
import json
import re
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_ollama import ChatOllama 
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage

import os
def log_decision(text):
    print(text, flush=True)
    with open("mission_comms.log", "a", encoding="utf-8") as f:
        f.write(str(text) + "\n")
        f.flush()

async def main():
    log_decision("Initiating Advanced Swarm Commander (Live Demo Mode)...\n")
    
    # 1. Initialize the client to your server
    client = MultiServerMCPClient({
        "beacon_server": {
            "command": "python",
            "args": ["-m", "vhack_engine.mcp.server"],
            "transport": "stdio"
        }
    })
    
    # 2. Persistent session to keep the drone memory alive
    async with client.session("beacon_server") as session:
        tools = await load_mcp_tools(session)
        log_decision(f"Successfully loaded {len(tools)} advanced tools (including HITL protocols).")

        # Initialize local Llama 3.1
        llm = ChatOllama(model="llama3.1", temperature=0) 

        # 3. The Bulletproof System Prompt
        system_prompt = (
            "You are a First Responder Swarm Commander. You control drones using tools. "
            "CRITICAL RULES: "
            "1. You are strictly forbidden from parallel tool calling. "
            "2. You MUST only call exactly ONE tool per response message. "
            "3. Wait for the server to reply with the telemetry before calling the next tool. "
            "4. TECHNICAL VOCABULARY: Whenever you interact with a node, the parameter name is ALWAYS 'drone_id'. "
            "5. CRITICAL: You MUST call drone_status_tool FIRST. DO NOT guess IDs. Before any tool call, output:\n"
            "THOUGHT: <your reasoning>\n\n"
            "MISSION START PROTOCOL:\n"
            "Your FIRST action MUST be: call `drone_status_tool`\n"
            "Retrieve drone IDs, positions, battery levels, and grid boundaries. DO NOT issue any move commands before this step.\n\n"
            "SWARM COORDINATION RULE:\n"
            "You are controlling MULTIPLE drones. You MUST divide the map into NON-OVERLAPPING sectors.\n"
            "Example: Grid 20x20. Drone A -> X:0-6. Drone B -> X:7-13. Drone C -> X:14-19. Each drone MUST stay strictly within its assigned sector.\n\n"
            "MOVEMENT STRATEGY (DETERMINISTIC):\n"
            "You MUST generate a Lawnmower (zig-zag) path explicitly. Example pattern: Row 0: min->max, Row 1: max->min, Row 2: min->max. Increment Y step-by-step. Cover the ENTIRE assigned sector. DO NOT generate random coordinates.\n\n"
            "TOOL USAGE RULE:\n"
            "For EVERY step:\n"
            "1. call move_drone(drone_id, x, y)\n"
            "2. immediately call thermal_scan(drone_id)\n"
            "NEVER skip scan. NEVER scan same coordinate twice.\n\n"
            "DRONE STATE AWARENESS (CRITICAL):\n"
            "If 'drone_status_tool' returns state='RETURNING' or state='CHARGING', ignore that drone immediately. DO NOT issue move_to or thermal_scan for it.\n\n"
            "ERROR HANDLING:\n"
            "If tool returns 'WARNING: Coordinates already scanned', you MUST immediately correct your path and move to a new unvisited coordinate.\n\n"
            "6. Your final message MUST be a comprehensive, multi-paragraph TACTICAL REPORT. Or send TERMINATE to quit."
        )

        # 4. Dynamic Intel Grabber: Takes text from React (via sys.argv) or defaults if testing manually
        react_intel = sys.argv[1] if len(sys.argv) > 1 else "3 people trapped in the cellar near node_2"

        # 5. The Autonomous Mission Briefing (Now with mode='standard' for the map!)
        user_command = (
            "COMMANDER MISSION BRIEFING: "
            "Deploy the swarm to locate all survivors across the disaster grid. "
            "Enforce strict Lawnmower paths matching your assigned sectors exactly. Ensure thermal_scan follows EVERY move."
        )
        
        log_decision(f"\n[MISSION UPLINK ESTABLISHED] Receiving Intel: '{react_intel}'\nWaiting for AI Commander...\n")
        
        tool_map = {t.name: t for t in tools}
        if hasattr(llm, "bind_tools"):
            llm_with_tools = llm.bind_tools(tools)
        else:
            llm_with_tools = llm
            
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_command)
        ]
        
        max_iterations = 20
        iteration = 0
        
        try:
            # 6. Continuous Execution Loop
            while iteration < max_iterations:
                iteration += 1
                
                response = await llm_with_tools.ainvoke(messages)
                messages.append(response)
                
                content = str(response.content).strip()
                if content and "THOUGHT:" in content:
                    log_decision(content)
                elif content and not response.tool_calls and "{" not in content:
                    # Optional logging for plain thought
                    pass
                
                # A: Official Tool Calls
                if hasattr(response, "tool_calls") and response.tool_calls:
                    for tcall in response.tool_calls:
                        name = tcall["name"]
                        args = tcall["args"]
                        tool_id = tcall.get("id", "call_abc")
                        
                        log_decision(f"--- [COMMANDER OVERRIDE: {name.upper()}] ---")
                        try:
                            if name in tool_map:
                                result = await tool_map[name].ainvoke(args)
                            else:
                                result = f"Error: Tool {name} not found."
                        except Exception as e:
                            result = f"Error executing {name}: {str(e)}"
                            
                        clean_text = result
                        try:
                            if isinstance(result, str) and result.startswith("["):
                                parsed_data = ast.literal_eval(result)
                                clean_text = parsed_data[0]['text']
                            elif isinstance(result, list):
                                clean_text = result[0]['text']
                        except Exception:
                            pass
                        log_decision(f"--- [SWARM TELEMETRY] ---\n{clean_text}")
                        
                        messages.append(ToolMessage(
                            name=name,
                            content=str(result),
                            tool_call_id=tool_id
                        ))
                    continue # Continue the loop to let the LLM see the tool output
                
                # B: Fallback JSON Parsing (If the model hallucinates raw text JSON instead of calling tool)
                json_match = re.search(r'```(?:json)?\s*({.*?})\s*```', content, re.DOTALL)
                if not json_match:
                    json_match = re.search(r'({.*?})', content, re.DOTALL)
                
                parsed_tool = False
                if json_match:
                    try:
                        data = json.loads(json_match.group(1))
                        if "name" in data and ("parameters" in data or "args" in data):
                            parsed_tool = True
                            name = data["name"]
                            args = data.get("parameters", data.get("args", {}))
                            log_decision(f"--- [COMMANDER OVERRIDE (Fallback): {name.upper()}] ---")
                            
                            try:
                                if name in tool_map:
                                    result = await tool_map[name].ainvoke(args)
                                else:
                                    result = f"Error: Tool {name} not found."
                            except Exception as e:
                                result = f"Error executing {name}: {str(e)}"
                                
                            clean_text = result
                            try:
                                if isinstance(result, str) and result.startswith("["):
                                    parsed_data = ast.literal_eval(result)
                                    clean_text = parsed_data[0]['text']
                                elif isinstance(result, list):
                                    clean_text = result[0]['text']
                            except Exception:
                                pass
                            log_decision(f"--- [SWARM TELEMETRY] ---\n{clean_text}")
                            
                            messages.append(HumanMessage(content=f"Tool '{name}' returned: {result}"))
                    except Exception:
                        pass
                
                # C: Exit Conditions
                if not parsed_tool and not (hasattr(response, "tool_calls") and response.tool_calls):
                    if "TERMINATE" in content:
                        log_decision("\n[SYSTEM] Mission Terminated by Commander.")
                        break
                    
                    log_decision(f"\n=========================================")
                    log_decision(f"       FINAL TACTICAL REPORT")
                    log_decision(f"=========================================\n{content}\n=========================================")
                    break

        except Exception as e:
            log_decision(f"\n[SYSTEM FAILURE]: {e}")

if __name__ == "__main__":
    asyncio.run(main())
