import asyncio
import ast
import sys
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent 

async def main():
    print("Initiating Advanced Swarm Commander (Live Demo Mode)...\n")
    
    # 1. Initialize the client to your server
    client = MultiServerMCPClient({
        "beacon_server": {
            "command": "python",
            "args": ["mcp_server.py"],
            "transport": "stdio"
        }
    })
    
    # 2. Persistent session to keep the drone memory alive
    async with client.session("beacon_server") as session:
        tools = await load_mcp_tools(session)
        print(f"Successfully loaded {len(tools)} advanced tools (including HITL protocols).")

        # Initialize local Llama 3.1
        llm = ChatOllama(model="llama3.1", temperature=0) 

        # 3. The Bulletproof System Prompt (With Anti-JSON Forcefield)
        system_prompt = (
            "You are a First Responder Swarm Commander. You control drones using tools. "
            "CRITICAL RULES: "
            "1. You are strictly forbidden from parallel tool calling. "
            "2. You MUST only call exactly ONE tool per response message. "
            "3. Wait for the server to reply with the telemetry before calling the next tool. "
            "4. TECHNICAL VOCABULARY: Whenever you interact with a node, the parameter name is ALWAYS 'drone_id'. "
            "5. FATAL ERROR PREVENTION: NEVER write raw JSON dictionaries like {\"name\": \"show_disaster_map\"}. You MUST use the native tool invocation mechanism. "
            "6. Your final message MUST be a comprehensive, multi-paragraph TACTICAL REPORT."
        )
        
        agent = create_react_agent(llm, tools, prompt=system_prompt)

        # 4. Dynamic Intel Grabber: Takes text from React (via sys.argv) or defaults if testing manually
        react_intel = sys.argv[1] if len(sys.argv) > 1 else "3 people trapped in the cellar near node_2"

        # 5. The Autonomous Mission Briefing (Now with mode='standard' for the map!)
        user_command = (
            "COMMANDER MISSION BRIEFING: "
            f"1. First, use 'inject_human_intelligence' to log this critical update: '{react_intel}'. "
            "2. Your ultimate goal is to secure 'node_2' and find those survivors. "
            "3. You must act autonomously to achieve this goal. Your exact tool inventory and required parameters are: "
            "   - 'check_signal_network' (Parameter required: drone_id) "
            "   - 'deploy_relay' (Parameters required: drone_id, x, y) "
            "   - 'multi_sensor_scan' (Parameter required: drone_id) "
            "   - 'show_disaster_map' (Parameter required: mode='standard') "
            "4. Analyze the situation step-by-step. If you detect a network dead zone, you must autonomously deploy a self-healing relay (drone_id='node_4', x=25, y=10) to fix it before you can scan. "
            "5. Once the survivors are located, pull the disaster map and write your Final Tactical Report."
        )
        
        print(f"\n[MISSION UPLINK ESTABLISHED] Receiving Intel: '{react_intel}'\nWaiting for AI Commander...\n")
        
        try:
            # 6. The Execution Loop
            async for chunk in agent.astream({"messages": [("user", user_command)]}):
                for node_name, output in chunk.items():
                    if "messages" in output:
                        msg = output["messages"][-1]
                        
                        if node_name == "agent":
                            # Print the tool the AI decided to use
                            if hasattr(msg, "tool_calls") and msg.tool_calls:
                                for tool in msg.tool_calls:
                                    print(f"--- [COMMANDER OVERRIDE: {tool['name'].upper()}] ---")
                            
                            # Print the Final Report (Or catch JSON Hallucinations)
                            elif hasattr(msg, "content") and str(msg.content).strip():
                                content = str(msg.content).strip()
                                if "{" not in content and "parameters" not in content and "name" not in content:
                                    print(f"\n=========================================")
                                    print(f"       FINAL TACTICAL REPORT")
                                    print(f"=========================================\n{content}\n=========================================")
                                else:
                                    print(f"\n[AI COGNITIVE ERROR] The AI attempted to write JSON code instead of pressing the button:\n{content}")
                        
                        elif node_name == "tools":
                            # Clean up and print the telemetry returned from the server
                            clean_text = msg.content
                            try:
                                if isinstance(msg.content, str) and msg.content.startswith("["):
                                    parsed_data = ast.literal_eval(msg.content)
                                    clean_text = parsed_data[0]['text']
                                elif isinstance(msg.content, list):
                                    clean_text = msg.content[0]['text']
                            except Exception:
                                pass
                            
                            print(f"--- [SWARM TELEMETRY] ---\n{clean_text}")

        except Exception as e:
            print(f"\n[SYSTEM FAILURE]: {e}")

if __name__ == "__main__":
    asyncio.run(main())