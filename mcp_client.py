import asyncio
import ast
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools  # NEW: Required for persistent sessions
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent


async def main():
    print("Initiating Advanced Swarm Commander (Live Demo Mode)...\n")

    # 1. Initialize the client normally
    client = MultiServerMCPClient({
        "beacon_server": {
            "command": "python",
            "args": ["mcp_server.py"],
            "transport": "stdio"
        }
    })

    # 2. THE MEMORY FIX: Open a persistent session specifically for the beacon_server!
    async with client.session("beacon_server") as session:
        tools = await load_mcp_tools(session)
        print(f"Successfully loaded {len(tools)} advanced tools.")

        llm = ChatOllama(model="llama3.1", temperature=0)

        # 3. The Strict Rule Prompt
        system_prompt = (
            "You are a First Responder Swarm Commander. You control drones using tools. "
            "NEVER write out JSON or function calls in your text. "
            "CRITICAL RULES: "
            "1. You are strictly forbidden from parallel tool calling. "
            "2. You MUST only call exactly ONE tool per response message. "
            "3. Wait for the server to reply with the telemetry before calling the next tool. "
            "4. Your final message MUST be a comprehensive, multi-paragraph TACTICAL REPORT with headers like RECOMMENDATIONS and NEXT STEPS."
        )

        agent = create_react_agent(llm, tools, prompt=system_prompt)

        # 4. The Human-Style Command
        user_command = (
            "Commander, begin the rescue sequence. "
            "First, use the check_signal_network tool on 'node_2'. "
            "When you see the signal data, use the deploy_relay tool to place 'node_4' at x=25, y=10. "
            "Once the relay is online, use the multi_sensor_scan tool on 'node_2'. "
            "After the scan finishes, use the show_disaster_map tool to update our radar. "
            "Finally, once the map is printed, write a detailed Final Tactical Report summarizing the dead zone, the new relay, the hazards found, and your strategic Next Steps."
        )

        print("\n[MISSION UPLINK ESTABLISHED] Waiting for AI Commander...\n")

        try:
            # We run the agent INSIDE the session block so the server stays awake!
            async for chunk in agent.astream({"messages": [("user", user_command)]}):
                for node_name, output in chunk.items():
                    if "messages" in output:
                        msg = output["messages"][-1]

                        if node_name == "agent":
                            if hasattr(msg, "tool_calls") and msg.tool_calls:
                                for tool in msg.tool_calls:
                                    print(f"--- [COMMANDER OVERRIDE: {tool['name'].upper()}] ---")

                            elif hasattr(msg, "content") and str(msg.content).strip():
                                content = str(msg.content).strip()
                                if "{" not in content and "parameters" not in content and "name" not in content:
                                    print(f"\n=========================================")
                                    print(f"       FINAL TACTICAL REPORT")
                                    print(
                                        f"=========================================\n{content}\n=========================================")

                        elif node_name == "tools":
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