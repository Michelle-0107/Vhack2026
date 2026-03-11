"""
Test script for CommandAgent with MCP tools integration.
Demonstrates how to use the LangChain-powered CommandAgent with Ollama.
"""
from vhack_engine.agents.command_agent import CommandAgent
from vhack_engine.services.drone_manager import DroneManager
from vhack_engine.mcp.client import MCPToolLoader
from vhack_engine.mcp import server as mcp_server


def test_command_agent():
    """Test the CommandAgent with MCP tools."""
    print("=" * 60)
    print("VHACK 2026 - CommandAgent Integration Test")
    print("=" * 60)
    
    # 1. Initialize DroneManager
    print("\n[1] Initializing DroneManager...")
    drone_manager = DroneManager()
    
    # Register test drones
    drone_manager.register("node_1", {"position": [0, 0], "battery": 100, "role": "relay"})
    drone_manager.register("node_2", {"position": [50, 20], "battery": 85, "role": "searcher"})
    drone_manager.register("node_3", {"position": [10, 10], "battery": 15, "role": "searcher"})
    
    print(f"   ✓ Registered {len(drone_manager.list_drones())} drones")
    
    # 2. Sync MCP server with DroneManager
    print("\n[2] Syncing MCP server with DroneManager...")
    mcp_server.set_drone_manager(drone_manager)
    print("   ✓ MCP server synchronized")
    
    # 3. Load MCP tools
    print("\n[3] Loading MCP tools...")
    tool_loader = MCPToolLoader(use_subprocess=False)  # Direct integration
    mcp_tools = tool_loader.load_tools()
    print(f"   ✓ Loaded {len(mcp_tools)} MCP tools:")
    for tool in mcp_tools:
        print(f"      - {tool.name}: {tool.description[:60]}...")
    
    # 4. Initialize CommandAgent
    print("\n[4] Initializing CommandAgent with Ollama (llama3.1)...")
    agent = CommandAgent(model_name="llama3.1")
    agent.initialize(mcp_tools=mcp_tools)
    print("   ✓ CommandAgent initialized")
    
    # 5. Test: Inject human intelligence
    print("\n[5] Testing Human Intelligence Injection...")
    intel = "3 people trapped in cellar near node_2"
    result = mcp_server.inject_human_intelligence(intel)
    print(f"   ✓ {result}")
    
    # 6. Run CommandAgent with mission brief
    print("\n[6] Running CommandAgent with mission briefing...")
    print("-" * 60)
    
    mission_brief = """
COMMANDER MISSION BRIEFING:
You have been tasked with a search and rescue operation.

CRITICAL INTEL: Human intelligence reports 3 people trapped near node_2.

YOUR OBJECTIVES:
1. First, check for any human intelligence updates using get_human_intelligence
2. Get the current swarm status to assess drone positions and battery levels
3. Analyze the situation and recommend next steps

Remember: Execute ONE tool at a time and wait for results.
"""
    
    print("Mission Brief:")
    print(mission_brief)
    print("-" * 60)
    
    try:
        response = agent.run(mission_brief)
        print("\n[CommandAgent Response]:")
        print("=" * 60)
        print(response)
        print("=" * 60)
    except Exception as e:
        print(f"\n[ERROR] CommandAgent execution failed: {e}")
        print("Make sure Ollama is running with llama3.1 model installed.")
        print("Run: ollama pull llama3.1")
    
    print("\n✓ Test completed!")


def test_direct_mcp_tools():
    """Test MCP tools directly without CommandAgent."""
    print("\n" + "=" * 60)
    print("TESTING MCP TOOLS DIRECTLY")
    print("=" * 60)
    
    # Initialize
    drone_manager = DroneManager()
    drone_manager.register("drone_1", {"position": [10, 20], "battery": 75})
    mcp_server.set_drone_manager(drone_manager)
    
    # Test tools
    print("\n[Test 1] get_swarm_status:")
    print(mcp_server.get_swarm_status())
    
    print("\n[Test 2] get_battery_status('drone_1'):")
    print(mcp_server.get_battery_status("drone_1"))
    
    print("\n[Test 3] move_to('drone_1', 30, 40):")
    print(mcp_server.move_to("drone_1", 30, 40))
    
    print("\n[Test 4] show_disaster_map('standard'):")
    print(mcp_server.show_disaster_map("standard"))
    
    print("\n[Test 5] inject_human_intelligence('Survivors in sector B'):")
    print(mcp_server.inject_human_intelligence("Survivors in sector B"))
    
    print("\n[Test 6] get_human_intelligence():")
    print(mcp_server.get_human_intelligence())
    
    print("\n✓ All direct tool tests passed!")


if __name__ == "__main__":
    # Test MCP tools directly first
    test_direct_mcp_tools()
    
    # Then test full CommandAgent integration
    print("\n\n")
    test_command_agent()
