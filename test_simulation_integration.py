"""
Test script for full MESA simulation + MCP + LangChain integration.
Tests autonomous AI agent controlling real simulated drones.
"""
from vhack_engine.services.mission_manager import MissionManager
from vhack_engine.mcp import server as mcp_server


def test_simulation_integration():
    """Test the complete simulation integration."""
    print("=" * 70)
    print("VHACK 2026 - AUTONOMOUS SEARCH & RESCUE SIMULATION TEST")
    print("=" * 70)
    
    # Initialize MissionManager
    print("\n[1] Initializing Mission Manager...")
    mission_manager = MissionManager()
    
    # Start mission with MESA simulation
    print("\n[2] Starting mission with 3 drones and 5 survivors...")
    mission_manager.start_mission(num_drones=3, num_survivors=5)
    
    # Get initial state
    print("\n[3] Getting initial simulation state...")
    state = mission_manager.get_status()
    print(f"   Step: {state['step']}")
    print(f"   Drones in simulation: {len(state['drones'])}")
    print(f"   Survivors in simulation: {len(state['survivors'])}")
    
    # Display drone and survivor positions
    print("\n[4] Initial Positions:")
    for drone in state['drones']:
        print(f"   Drone {drone['id']}: Position {drone['pos']}, Battery {drone['battery']:.1f}%")
    
    for survivor in state['survivors']:
        print(f"   Survivor {survivor['id']}: Position {survivor['pos']}, Health {survivor['health']}%")
    
    # Test MCP tools with real simulation
    print("\n[5] Testing MCP tools with real simulation...")
    
    # Test get_swarm_status
    print("\n   Testing get_swarm_status():")
    result = mcp_server.get_swarm_status()
    print(f"   {result}")
    
    # Test drone status
    drone_id = mission_manager.drone_manager.list_drones()[0]['id']
    print(f"\n   Testing get_drone_status('{drone_id}'):")
    result = mcp_server.get_drone_status(drone_id)
    print(f"   {result}")
    
    # Test battery check
    print(f"\n   Testing get_battery_status('{drone_id}'):")
    result = mcp_server.get_battery_status(drone_id)
    print(f"   {result}")
    
    # Test move drone in simulation
    print(f"\n   Testing move_to('{drone_id}', 5, 5):")
    result = mcp_server.move_to(drone_id, 5, 5)
    print(f"   {result}")
    
    # Verify position changed in simulation
    state = mission_manager.get_status()
    for drone in state['drones']:
        if f"drone_{drone['id']}" == drone_id:
            print(f"   Verified: Drone now at {drone['pos']} in simulation")
    
    # Test thermal scan
    print(f"\n   Testing thermal_scan('{drone_id}'):")
    result = mcp_server.thermal_scan(drone_id)
    print(f"   {result}")
    
    # Test human intelligence
    print("\n[6] Testing Human-in-the-Loop...")
    intel = "Survivors reported near grid position (10, 15)"
    result = mcp_server.inject_human_intelligence(intel)
    print(f"   {result}")
    
    result = mcp_server.get_human_intelligence()
    print(f"   {result}")
    
    # Run the full multi-agent swarm ONCE.
    # The agents issue move_to / thermal_scan / extract_survivors tool calls internally
    # and signal TERMINATE when mission_complete=True.  Do NOT loop here — each call
    # to run_multiagent_brief already runs up to max_round agent turns.
    print("\n[7] Running multi-agent swarm (single full run)...")
    print("-" * 70)

    state = mission_manager.get_status()
    survivors_data = state.get('survivors', [])
    total_survivors = len(survivors_data)
    unrescued = [s for s in survivors_data if not s.get('rescued', False)]

    # Build a brief that includes known survivor positions so the Planner can target them.
    brief_lines = [
        f"Objective: Search and Rescue — locate {total_survivors} survivors on a 20x20 grid.",
        f"Survivors rescued so far: 0/{total_survivors}.",
        "",
        "DRONE STATUS:",
    ]
    for drone in state.get('drones', []):
        brief_lines.append(
            f"  drone_{drone['id']}: Position {drone['pos']}, Battery {drone['battery']:.1f}%"
        )
    if unrescued:
        brief_lines.append("")
        brief_lines.append("KNOWN DISTRESS SIGNALS (send drones here first):")
        for s in unrescued:
            brief_lines.append(f"  - Survivor at {s.get('pos')}, Health {s.get('health', 100)}%")

    mission_brief = "\n".join(brief_lines)

    try:
        response = mission_manager.run_multiagent_brief(mission_brief)
        print("   [Swarm Result]:")
        print(f"   {response}")
    except Exception as e:
        print(f"\n[ERROR] Multi-agent run failed: {e}")
        print("Note: Make sure Ollama is running with llama3.2 model installed.")
        print("Run: ollama pull llama3.2")
    
    # Get final state
    print("\n[8] Final State:")
    state = mission_manager.get_status()
    print(f"   Simulation steps completed: {state['step']}")
    
    # Check if any survivors were rescued
    rescued_count = sum(1 for s in state['survivors'] if s['rescued'])
    print(f"   Survivors rescued: {rescued_count}/{len(state['survivors'])}")
    
    print("\n" + "=" * 70)
    print("✓ SIMULATION INTEGRATION TEST COMPLETE!")
    print("=" * 70)
    
    return mission_manager


def test_manual_control():
    """Test manual control of drones in simulation without AI agent."""
    print("\n" + "=" * 70)
    print("MANUAL DRONE CONTROL TEST")
    print("=" * 70)
    
    mission_manager = MissionManager()
    mission_manager.start_mission(num_drones=2, num_survivors=3)
    
    state = mission_manager.get_status()
    drone_id = mission_manager.drone_manager.list_drones()[0]['id']
    
    print(f"\n[Testing manual control of {drone_id}]")
    
    # Get survivor position
    survivor_pos = state['survivors'][0]['pos']
    print(f"Moving drone to survivor position: {survivor_pos}")
    
    # Move drone to survivor
    result = mcp_server.move_to(drone_id, survivor_pos[0], survivor_pos[1])
    print(f"Move result: {result}")
    
    # Scan for survivors
    result = mcp_server.thermal_scan(drone_id)
    print(f"Scan result: {result}")
    
    # Check if survivor was detected
    if "SURVIVOR" in result.upper():
        print("✓ Successfully detected survivor at target location!")
    else:
        print("✗ No survivor detected (check grid alignment)")
    
    print("\n" + "=" * 70)


if __name__ == "__main__":
    # Run full simulation test
    test_simulation_integration()
    
    # Optionally run manual control test
    print("\n\nPress Enter to run manual control test, or Ctrl+C to exit...")
    try:
        input()
        test_manual_control()
    except KeyboardInterrupt:
        print("\nTest suite complete!")
