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
    
    # Extract numeric ID from "drone_X" format
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
    if _simulation_model is None:
        return []

    from vhack_engine.simulation.survivor_agent import SurvivorAgent

    return [
        agent for agent in _simulation_model.agents
        if isinstance(agent, SurvivorAgent)
    ]


def _refresh_swarm_data():
    """Keep shared swarm_data aligned with the live MESA simulation."""
    if _simulation_model is None:
        return

    for drone_id in list(swarm_data.keys()):
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent is None:
            continue
        swarm_data[drone_id]["x"] = int(drone_agent.pos[0])
        swarm_data[drone_id]["y"] = int(drone_agent.pos[1])
        swarm_data[drone_id]["battery"] = float(drone_agent.battery)


def _mission_status_payload() -> dict:
    """Build a real mission summary from the live simulation."""
    _refresh_swarm_data()
    survivors = _get_survivor_agents()
    rescued = sum(1 for survivor in survivors if survivor.rescued)
    remaining = len(survivors) - rescued
    low_battery_drones = [
        drone_id for drone_id, drone in swarm_data.items()
        if float(drone.get("battery", 0.0)) < 20.0 and drone.get("role") != "relay"
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
    if drone_id in swarm_data:
        # Get real-time battery from MESA simulation if available
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent:
            battery = drone_agent.battery
            # Update swarm_data with real battery level
            swarm_data[drone_id]['battery'] = battery
        else:
            battery = swarm_data[drone_id]['battery']
        
        return f"{drone_id} battery is at {battery:.1f}%."
    return "Drone not found."


@mcp.tool()
def move_to(drone_id: str, x: int, y: int) -> str:
    """Move a drone to specific x, y coordinates."""
    if drone_id in swarm_data:
        _refresh_swarm_data()
        current_battery = float(swarm_data[drone_id].get("battery", 0.0))
        if current_battery < 20.0 and (x, y) != BASE_STATION_POS:
            x, y = BASE_STATION_POS
            swarm_data[drone_id]["status"] = "returning_to_base"

        # Update swarm_data dict
        swarm_data[drone_id]["x"] = x
        swarm_data[drone_id]["y"] = y
        
        # CRITICAL: Actually move the MESA drone in simulation
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent and _simulation_model:
            # Ensure coordinates are within grid bounds
            x_clamped = max(0, min(x, _simulation_model.grid.width - 1))
            y_clamped = max(0, min(y, _simulation_model.grid.height - 1))
            drone_agent.move_to(x_clamped, y_clamped)
            swarm_data[drone_id]["status"] = "returning_to_base" if (x_clamped, y_clamped) == BASE_STATION_POS else "searching"
            if current_battery < 20.0 and (x_clamped, y_clamped) == BASE_STATION_POS:
                return f"SAFETY OVERRIDE: {drone_id} battery is below 20%. Drone returned to base at {BASE_STATION_POS}."
            return f"SUCCESS: {drone_id} moved to ({x_clamped}, {y_clamped}) in simulation."
        
        return f"SUCCESS: {drone_id} position updated to ({x}, {y})."
    return "Drone not found."


@mcp.tool()
def get_drone_status(drone_id: str) -> str:
    """Get the full status of a drone: position, battery, and current task."""
    if drone_id in swarm_data:
        # Get real-time data from MESA simulation
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent:
            # Update with real simulation data
            swarm_data[drone_id]['x'] = drone_agent.pos[0]
            swarm_data[drone_id]['y'] = drone_agent.pos[1]
            swarm_data[drone_id]['battery'] = drone_agent.battery
            scanned = len(drone_agent.scanned_cells)
            return f"{drone_id}: Position {drone_agent.pos}, Battery {drone_agent.battery:.1f}%, Scanned cells: {scanned}, Needs recharge: {drone_agent.needs_recharge}"
        
        # Fallback to swarm_data
        drone = swarm_data[drone_id]
        return f"{drone_id}: Position ({drone['x']}, {drone['y']}), Battery {drone['battery']}%, Role: {drone['role']}, Status: {drone.get('status', 'idle')}"
    return "Drone not found."


@mcp.tool()
def show_disaster_map(mode: str = "standard") -> str:
    """Displays a visual ASCII radar map of the swarm."""
    grid = [[" . " for _ in range(6)] for _ in range(6)]
    base_gx, base_gy = min(BASE_STATION_POS[0] // 10, 5), min(BASE_STATION_POS[1] // 10, 5)
    grid[base_gy][base_gx] = " H "  # Home Base

    for d_id, data in swarm_data.items():
        gx, gy = min(data["x"] // 10, 5), min(data["y"] // 10, 5)
        if 0 <= gx <= 5 and 0 <= gy <= 5:
            grid[gy][gx] = f" {d_id[-1]} "

    map_str = "\n--- BEACON-NET REAL-TIME RADAR ---\n"
    for row in reversed(grid):
        map_str += "".join(row) + "\n"
    map_str += "----------------------------------\nH = Base | Numbers = Drones\n"
    return map_str


# --- ADVANCED TOOLS ---
@mcp.tool()
def thermal_scan(drone_id: str) -> str:
    """Performs a thermal scan to detect survivor heat signatures."""
    if drone_id not in swarm_data:
        return "Drone not found."
    
    # CRITICAL: Query actual MESA simulation for survivors
    drone_agent = _get_drone_agent(drone_id)
    if drone_agent and _simulation_model:
        # Use the drone's scan() method with 2-cell radius
        survivors = [survivor for survivor in drone_agent.scan(radius=2) if not survivor.rescued]
        
        if survivors:
            survivor_details = []
            for survivor in survivors:
                distance = abs(survivor.pos[0] - drone_agent.pos[0]) + abs(survivor.pos[1] - drone_agent.pos[1])
                survivor_details.append(
                    f"ID:{survivor.unique_id}, Health:{survivor.health}%, Position:{survivor.pos}, Distance:{distance}cells"
                )
            return f"[THERMAL] {drone_id}: SURVIVOR(S) DETECTED! Count: {len(survivors)}. Details: {'; '.join(survivor_details)}"
        
        return f"[THERMAL] {drone_id}: No heat signatures detected within 2-cell radius of {drone_agent.pos}."
    
    # Fallback to hardcoded check if simulation not available
    drone = swarm_data[drone_id]
    if abs(drone["x"] - 50) <= 10 and abs(drone["y"] - 20) <= 10:
        return f"[THERMAL] {drone_id}: SURVIVOR SIGNATURE DETECTED at ({drone['x']}, {drone['y']})!"
    return f"[THERMAL] {drone_id}: No heat signatures detected."


@mcp.tool()
def extract_survivors(drone_id: str, radius: int = 2) -> str:
    """Mark nearby detected survivors as rescued."""
    if drone_id not in swarm_data:
        return "Drone not found."

    drone_agent = _get_drone_agent(drone_id)
    if drone_agent is None:
        return "Simulation model not available."

    rescued_survivors = []
    for survivor in _get_survivor_agents():
        if survivor.rescued:
            continue
        distance = abs(survivor.pos[0] - drone_agent.pos[0]) + abs(survivor.pos[1] - drone_agent.pos[1])
        if distance <= radius:
            survivor.rescue()
            rescued_survivors.append(f"survivor_{survivor.unique_id}@{survivor.pos}")

    status = _mission_status_payload()
    if not rescued_survivors:
        return f"No survivors extracted by {drone_id}. Remaining survivors: {status['remaining']}."

    swarm_data[drone_id]["status"] = "extracting"
    return (
        f"EXTRACTION SUCCESS: {drone_id} rescued {len(rescued_survivors)} survivor(s): "
        f"{', '.join(rescued_survivors)}. Remaining survivors: {status['remaining']}."
    )


@mcp.tool()
def return_to_base(drone_id: str) -> str:
    """Recall a drone back to the fixed home base."""
    if drone_id not in swarm_data:
        return "Drone not found."

    _refresh_swarm_data()
    battery = float(swarm_data[drone_id].get("battery", 0.0))
    if battery >= 20.0:
        return (
            f"NO ACTION: {drone_id} battery is {battery:.1f}% (>=20%). "
            "Return-to-base is only required for low-battery safety."
        )

    return move_to(drone_id, BASE_STATION_POS[0], BASE_STATION_POS[1])


@mcp.tool()
def all_drones_return() -> str:
    """Recall all drones and relay nodes to the fixed base station."""
    if not swarm_data:
        return "No drones are registered in swarm_data."

    _refresh_swarm_data()
    recalled = []
    for drone_id in list(swarm_data.keys()):
        result = move_to(drone_id, BASE_STATION_POS[0], BASE_STATION_POS[1])
        recalled.append(f"{drone_id}: {result}")

    return "ALL DRONES RETURN COMPLETE:\n" + "\n".join(recalled)


@mcp.tool()
def get_mission_status() -> str:
    """Return real mission completion and battery status from the live simulation."""
    status = _mission_status_payload()
    low_battery = ", ".join(status["low_battery_drones"]) or "none"
    return (
        f"MISSION STATUS: rescued={status['rescued']}, remaining={status['remaining']}, "
        f"mission_complete={status['mission_complete']}, low_battery_drones={low_battery}"
    )


def is_mission_complete() -> bool:
    """Return True only when all survivors in the live simulation are rescued."""
    return _mission_status_payload()["mission_complete"]


@mcp.tool()
def check_signal_network(drone_id: str) -> str:
    """Checks signal strength. Intelligent Dead Zone Detection."""
    if drone_id not in swarm_data:
        return "Drone not found."

    _refresh_swarm_data()
    drone = swarm_data[drone_id]
    drones_snapshot = [
        {
            "id": d_id,
            "position": (int(data["x"]), int(data["y"])),
            "role": data.get("role", "searcher"),
            "battery": float(data.get("battery", 100.0)),
        }
        for d_id, data in swarm_data.items()
    ]
    connectivity = _fleet_optimizer.ensure_relay_connectivity(
        drones_snapshot,
        base_position=BASE_STATION_POS,
        max_link_distance=20.0,
    )

    for gap in connectivity["gaps"]:
        if gap["drone_id"] != drone_id:
            continue
        order = next(
            (
                relay_order
                for relay_order in connectivity["relay_orders"]
                if relay_order["target_drone_id"] == drone_id
            ),
            None,
        )
        if order:
            relay_pos = tuple(order["relay_position"])
            return (
                f"CRITICAL: {drone_id} connectivity broken. "
                f"ORDER relay drone {order['relay_drone_id']} to position {relay_pos} to restore chain."
            )
        known_dead_zones.append((drone["x"], drone["y"]))
        return f"CRITICAL: {drone_id} is in a Dead Zone (Signal 0%). No relay candidate available."

    base_dx = drone["x"] - BASE_STATION_POS[0]
    base_dy = drone["y"] - BASE_STATION_POS[1]
    dist_to_base = math.sqrt(base_dx ** 2 + base_dy ** 2)
    if dist_to_base > 20:
        return f"WARNING: {drone_id} signal weak (40%). Consider deploying relay."
    return f"{drone_id} signal is strong (95%)."


@mcp.tool()
def deploy_relay(drone_id: str, x: int, y: int) -> str:
    """Deploys a new relay drone to heal network dead zones."""
    swarm_data[drone_id] = {"x": x, "y": y, "battery": 100, "role": "relay", "status": "active"}
    return f"SELF-HEALING SUCCESS: Relay {drone_id} deployed at ({x}, {y})."


@mcp.tool()
def swap_drones(tired_drone_id: str, fresh_drone_id: str) -> str:
    """Energy Rotation: Sends a tired drone home and fresh one to its exact spot."""
    if tired_drone_id in swarm_data and fresh_drone_id in swarm_data:
        target_x = swarm_data[tired_drone_id]["x"]
        target_y = swarm_data[tired_drone_id]["y"]
        
        swarm_data[tired_drone_id]["x"] = 0
        swarm_data[tired_drone_id]["y"] = 0
        swarm_data[fresh_drone_id]["x"] = target_x
        swarm_data[fresh_drone_id]["y"] = target_y
        
        return f"ROTATION COMPLETE: {fresh_drone_id} took over for {tired_drone_id}."
    return "Drones not found."


@mcp.tool()
def multi_sensor_scan(drone_id: str) -> str:
    """Environmental Awareness: Scans for thermals, gas, and fire."""
    if drone_id not in swarm_data:
        return "Drone not found."

    drone = swarm_data[drone_id]
    report = f"--- MULTI-SENSOR SCAN FROM {drone_id} ---\n"

    # Check for survivors
    if abs(drone["x"] - 50) <= 10 and abs(drone["y"] - 20) <= 10:
        report += "[THERMAL] Survivor signature detected!\n"
    else:
        report += "[THERMAL] Clear.\n"

    # Check for hazards
    for hazard, (hx, hy) in environmental_hazards.items():
        if abs(drone["x"] - hx) <= 15 and abs(drone["y"] - hy) <= 15:
            report += f"[WARNING] {hazard.upper()} detected nearby!\n"

    return report


@mcp.tool()
def inject_human_intelligence(intel_report: str) -> str:
    """
    [COMMAND TOOL] Used by HUMAN COMMANDERS to override AI assumptions.
    Injects verbal intelligence from survivors into the swarm's memory.
    """
    global human_intelligence_database, _human_intelligence_fresh
    human_intelligence_database = intel_report
    _human_intelligence_fresh = True
    return f"CRITICAL OVERRIDE: Human intelligence registered -> '{intel_report}'"


@mcp.tool()
def get_human_intelligence() -> str:
    """
    [TELEMETRY TOOL] Reads the latest manual overrides from human commanders.
    Always run this to check for high-priority human instructions.
    """
    global human_intelligence_database, _human_intelligence_fresh
    if _human_intelligence_fresh and human_intelligence_database != "No manual intelligence provided yet.":
        _human_intelligence_fresh = False
        return f"HIGH PRIORITY INTEL: {human_intelligence_database}"
    return "No new human intelligence."


class MCPServer:
    """
    Wrapper class for FastMCP server to maintain compatibility with existing code.
    """
    
    def __init__(self, host: str = "localhost", port: int = 8765):
        self.host = host
        self.port = port
        self._running = False
    
    def register_tools(self):
        """Tools are registered via @mcp.tool() decorators."""
        pass  # Tools auto-registered by FastMCP decorators
    
    def start(self):
        """Start the MCP server."""
        self._running = True
        mcp.run()
    
    def stop(self):
        """Gracefully shut down the server."""
        self._running = False


if __name__ == "__main__":
    mcp.run()
