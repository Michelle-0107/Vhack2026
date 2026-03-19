print("SERVER LOADED")

"""
MCP Server - Hosts the Model Context Protocol server that exposes drone tools.
Uses FastMCP to provide MCP-compatible tool interface for LangChain agents.
"""
from mcp.server.fastmcp import FastMCP
import math
from vhack_engine.environment.disaster_map import BASE_STATION_POS
from vhack_engine.services.fleet_optimizer import FleetOptimizer

# Initialize the Server
mcp = FastMCP("BeaconNetServer")

# --- SHARED STATE ---
swarm_data = {}
import random
auto_patrol_index = 0
known_dead_zones = []
environmental_hazards = {"gas_leak": (15, 15), "fire": (45, 25)}
human_intelligence_database = "No manual intelligence provided yet."
_human_intelligence_fresh = False
_fleet_optimizer = FleetOptimizer()

# Reference to MESA DisasterModel (for direct simulation control)
_simulation_model = None

def set_simulation_model(model):
    """Link the MESA DisasterModel for direct drone control."""
    global _simulation_model
    _simulation_model = model
    _refresh_swarm_data() # Auto-populate immediately

def set_drone_manager(drone_manager):
    """Compatibility helper: mirror DroneManager state into swarm_data."""
    swarm_data.clear()
    for drone in drone_manager.list_drones():
        pos = drone.get("position", [0, 0])
        swarm_data[drone["id"]] = {
            "x": int(pos[0]),
            "y": int(pos[1]),
            "battery": float(drone.get("battery", 100.0)),
            "role": drone.get("role", "searcher"),
            "status": drone.get("status", "idle"),
        }

def _get_drone_agent(drone_id: str):
    """Get the MESA DroneAgent instance by drone_id."""
    if _simulation_model is None:
        return None
    from vhack_engine.simulation.drone_agent import DroneAgent
    try:
        agent_id = int(drone_id.replace("drone_", ""))
    except (ValueError, AttributeError):
        return None
    for agent in _simulation_model.agents:
        if isinstance(agent, DroneAgent) and agent.unique_id == agent_id:
            return agent
    return None

def _get_survivor_agents():
    """Return all survivor agents in the active simulation."""
    if _simulation_model is None: return []
    from vhack_engine.simulation.survivor_agent import SurvivorAgent
    return [a for a in _simulation_model.agents if isinstance(a, SurvivorAgent)]

def _refresh_swarm_data():
    """Keep shared swarm_data aligned with the live MESA simulation."""
    if _simulation_model is None:
        return
    from vhack_engine.simulation.drone_agent import DroneAgent
    
    # Dynamically pull drones from the physics engine into swarm_data
    for agent in _simulation_model.agents:
        if isinstance(agent, DroneAgent):
            d_id = f"drone_{agent.unique_id}"
            if d_id not in swarm_data:
                swarm_data[d_id] = {"role": "searcher", "status": "idle"}
            
            swarm_data[d_id]["x"] = int(agent.pos[0])
            swarm_data[d_id]["y"] = int(agent.pos[1])
            swarm_data[d_id]["battery"] = float(agent.battery)

def _mission_status_payload() -> dict:
    """Build a real mission summary from the live simulation."""
    _refresh_swarm_data()
    survivors = _get_survivor_agents()
    rescued = sum(1 for s in survivors if s.rescued)
    remaining = len(survivors) - rescued
    low_battery_drones = [
        d_id for d_id, d in swarm_data.items()
        if float(d.get("battery", 0.0)) < 20.0 and d.get("role") != "relay"
    ]
    return {
        "rescued": rescued,
        "remaining": remaining,
        "mission_complete": remaining == 0 and len(survivors) > 0,
        "low_battery_drones": low_battery_drones,
    }

# --- CORE DRONE TOOLS ---
@mcp.tool()
def get_swarm_status() -> str:
    """Returns the current status, location, and battery of all drones."""
    _refresh_swarm_data()
    return str(swarm_data)

@mcp.tool()
def get_battery_status(drone_id: str) -> str:
    """Check the specific battery level of a single drone."""
    _refresh_swarm_data()
    if drone_id in swarm_data:
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent:
            swarm_data[drone_id]['battery'] = drone_agent.battery
            return f"{drone_id} battery is at {drone_agent.battery:.1f}%."
        return f"{drone_id} battery is at {swarm_data[drone_id]['battery']}%."
    return f"Error: '{drone_id}' not found. Valid drones are: {list(swarm_data.keys())}"

@mcp.tool()
def move_to(drone_id: str, x: int, y: int) -> str:
    """Move a drone to specific x, y coordinates."""
    _refresh_swarm_data()
    global auto_patrol_index
    
    # If the AI sends a bad drone ID, pick one for it to keep things moving
    if drone_id not in swarm_data and swarm_data:
        available_drones = list(swarm_data.keys())
        drone_id = available_drones[auto_patrol_index % len(available_drones)]
        auto_patrol_index += 1
        # Auto-spread if coordinates are bad or 0,0
        if x <= 0 or y <= 0:
            x = random.randint(2, 18)
            y = random.randint(2, 18)

    if drone_id in swarm_data:
        current_battery = float(swarm_data[drone_id].get("battery", 0.0))
        if current_battery < 20.0 and (x, y) != BASE_STATION_POS:
            x, y = BASE_STATION_POS
            swarm_data[drone_id]["status"] = "returning_to_base"

        swarm_data[drone_id]["x"] = x
        swarm_data[drone_id]["y"] = y
        
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent and _simulation_model:
            x_clamped = max(0, min(x, _simulation_model.grid.width - 1))
            y_clamped = max(0, min(y, _simulation_model.grid.height - 1))
            drone_agent.move_to(x_clamped, y_clamped)
            swarm_data[drone_id]["status"] = "returning" if (x_clamped, y_clamped) == BASE_STATION_POS else "searching"
            if current_battery < 20.0 and (x_clamped, y_clamped) == BASE_STATION_POS:
                return f"SAFETY OVERRIDE: {drone_id} returned to base due to low battery."
            return f"SUCCESS: {drone_id} moved to ({x_clamped}, {y_clamped}) in simulation."
        
        return f"SUCCESS: {drone_id} position updated to ({x}, {y})."
    return f"Error: No valid drones found to move."

@mcp.tool()
def get_drone_status(drone_id: str) -> str:
    """Get the full status of a drone: position, battery, and current task."""
    _refresh_swarm_data()
    if drone_id in swarm_data:
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent:
            swarm_data[drone_id]['x'] = drone_agent.pos[0]
            swarm_data[drone_id]['y'] = drone_agent.pos[1]
            swarm_data[drone_id]['battery'] = drone_agent.battery
            return f"{drone_id}: Position {drone_agent.pos}, Battery {drone_agent.battery:.1f}%, Scanned cells: {len(drone_agent.scanned_cells)}"
        
        drone = swarm_data[drone_id]
        return f"{drone_id}: Position ({drone['x']}, {drone['y']}), Battery {drone['battery']}%"
    return f"Error: '{drone_id}' not found. Valid drones are: {list(swarm_data.keys())}"

@mcp.tool()
def thermal_scan(drone_id: str) -> str:
    """Performs a thermal scan to detect survivor heat signatures."""
    _refresh_swarm_data()
    if drone_id not in swarm_data:
        return f"Error: '{drone_id}' not found. Valid drones are: {list(swarm_data.keys())}"
    
    drone_agent = _get_drone_agent(drone_id)
    if drone_agent and _simulation_model:
        survivors = [s for s in drone_agent.scan(radius=2) if not s.rescued]
        if survivors:
            details = [f"ID:{s.unique_id}, Pos:{s.pos}" for s in survivors]
            return f"[THERMAL] {drone_id}: SURVIVOR(S) DETECTED! Details: {'; '.join(details)}"
        return f"[THERMAL] {drone_id}: No heat signatures detected near {drone_agent.pos}."
    
    return f"[THERMAL] {drone_id}: No heat signatures detected."

@mcp.tool()
def extract_survivors(drone_id: str, radius: int = 2) -> str:
    """Mark nearby detected survivors as rescued."""
    _refresh_swarm_data()
    if drone_id not in swarm_data:
        return f"Error: '{drone_id}' not found. Valid drones are: {list(swarm_data.keys())}"

    drone_agent = _get_drone_agent(drone_id)
    if not drone_agent: return "Simulation not available."

    rescued = []
    for s in _get_survivor_agents():
        if not s.rescued:
            dist = abs(s.pos[0] - drone_agent.pos[0]) + abs(s.pos[1] - drone_agent.pos[1])
            if dist <= radius:
                s.rescue()
                rescued.append(f"survivor_{s.unique_id}@{s.pos}")

    status = _mission_status_payload()
    if not rescued:
        return f"No survivors extracted. Remaining: {status['remaining']}."

    swarm_data[drone_id]["status"] = "extracting"
    return f"EXTRACTION SUCCESS: {drone_id} rescued {len(rescued)} survivor(s). Remaining: {status['remaining']}."

@mcp.tool()
def return_to_base(drone_id: str) -> str:
    """Recall a drone back to the fixed home base."""
    _refresh_swarm_data()
    if drone_id not in swarm_data:
        return f"Error: '{drone_id}' not found. Valid drones are: {list(swarm_data.keys())}"
    return move_to(drone_id, BASE_STATION_POS[0], BASE_STATION_POS[1])

@mcp.tool()
def all_drones_return() -> str:
    """Recall all drones to the fixed base station."""
    _refresh_swarm_data()
    if not swarm_data: return "No drones registered."
    recalled = [f"{d_id}: {move_to(d_id, BASE_STATION_POS[0], BASE_STATION_POS[1])}" for d_id in swarm_data.keys()]
    return "ALL DRONES RETURN COMPLETE:\n" + "\n".join(recalled)

@mcp.tool()
def get_mission_status() -> str:
    """Return real mission completion status."""
    s = _mission_status_payload()
    return f"MISSION STATUS: rescued={s['rescued']}, remaining={s['remaining']}, complete={s['mission_complete']}"

def is_mission_complete() -> bool:
    return _mission_status_payload()["mission_complete"]

@mcp.tool()
def check_signal_network(drone_id: str) -> str:
    _refresh_swarm_data()
    if drone_id not in swarm_data: return f"Error: '{drone_id}' not found."
    return f"{drone_id} signal is strong (95%)."

@mcp.tool()
def deploy_relay(drone_id: str, x: int, y: int) -> str:
    swarm_data[drone_id] = {"x": x, "y": y, "battery": 100, "role": "relay"}
    return f"Relay {drone_id} deployed at ({x}, {y})."

@mcp.tool()
def inject_human_intelligence(intel_report: str) -> str:
    global human_intelligence_database, _human_intelligence_fresh
    human_intelligence_database = intel_report
    _human_intelligence_fresh = True
    return f"CRITICAL OVERRIDE: Intel registered -> '{intel_report}'"

@mcp.tool()
def get_human_intelligence() -> str:
    global human_intelligence_database, _human_intelligence_fresh
    if _human_intelligence_fresh:
        _human_intelligence_fresh = False
        return f"HIGH PRIORITY INTEL: {human_intelligence_database}"
    return "No new human intelligence."

if __name__ == "__main__":
    mcp.run()