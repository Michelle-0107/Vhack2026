"""
MCP Server - Hosts the Model Context Protocol server that exposes drone tools.
Uses FastMCP to provide MCP-compatible tool interface for LangChain agents.
"""
from mcp.server.fastmcp import FastMCP
import math

# Initialize the Server
mcp = FastMCP("BeaconNetServer")

# --- SHARED STATE (will be synchronized with DroneManager) ---
swarm_data = {}
known_dead_zones = []
environmental_hazards = {"gas_leak": (15, 15), "fire": (45, 25)}
human_intelligence_database = "No manual intelligence provided yet."

# Reference to DroneManager (set by MCPServer.initialize())
_drone_manager = None
# Reference to MESA DisasterModel (for direct simulation control)
_simulation_model = None


def set_drone_manager(manager):
    """Link the DroneManager to synchronize state with swarm_data."""
    global _drone_manager, swarm_data
    _drone_manager = manager
    # Initialize swarm_data from DroneManager
    if manager:
        for drone in manager.list_drones():
            swarm_data[drone["id"]] = {
                "x": drone["position"][0],
                "y": drone["position"][1],
                "battery": drone["battery"],
                "role": "searcher",
                "status": drone.get("status", "idle")
            }


def set_simulation_model(model):
    """Link the MESA DisasterModel for direct drone control."""
    global _simulation_model
    _simulation_model = model


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


# --- CORE DRONE TOOLS ---
@mcp.tool()
def get_swarm_status() -> str:
    """Returns the current status, location, and battery of all drones."""
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
        
        # Sync with DroneManager
        if _drone_manager:
            _drone_manager.update_battery(drone_id, battery)
        return f"{drone_id} battery is at {battery:.1f}%."
    return "Drone not found."


@mcp.tool()
def move_to(drone_id: str, x: int, y: int) -> str:
    """Move a drone to specific x, y coordinates."""
    if drone_id in swarm_data:
        # Update swarm_data dict
        swarm_data[drone_id]["x"] = x
        swarm_data[drone_id]["y"] = y
        
        # Sync with DroneManager
        if _drone_manager:
            _drone_manager.update_position(drone_id, x, y)
        
        # CRITICAL: Actually move the MESA drone in simulation
        drone_agent = _get_drone_agent(drone_id)
        if drone_agent and _simulation_model:
            # Ensure coordinates are within grid bounds
            x_clamped = max(0, min(x, _simulation_model.grid.width - 1))
            y_clamped = max(0, min(y, _simulation_model.grid.height - 1))
            drone_agent.move_to(x_clamped, y_clamped)
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
    grid[0][0] = " H "  # Home Base

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
        survivors = drone_agent.scan(radius=2)
        
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
def check_signal_network(drone_id: str) -> str:
    """Checks signal strength. Intelligent Dead Zone Detection."""
    if drone_id not in swarm_data:
        return "Drone not found."

    drone = swarm_data[drone_id]
    dist_to_base = math.sqrt(drone["x"] ** 2 + drone["y"] ** 2)
    
    # Check distance to nearest relay
    dist_to_relay = dist_to_base
    for d_id, data in swarm_data.items():
        if data.get("role") == "relay" and d_id != drone_id:
            d = math.sqrt((drone["x"] - data["x"]) ** 2 + (drone["y"] - data["y"]) ** 2)
            dist_to_relay = min(dist_to_relay, d)

    if dist_to_relay > 40:
        known_dead_zones.append((drone["x"], drone["y"]))
        return f"CRITICAL: {drone_id} is in a Dead Zone (Signal 0%). Memory updated."
    elif dist_to_relay > 20:
        return f"WARNING: {drone_id} signal weak (40%). Consider deploying relay."
    else:
        return f"{drone_id} signal is strong (95%)."


@mcp.tool()
def deploy_relay(drone_id: str, x: int, y: int) -> str:
    """Deploys a new relay drone to heal network dead zones."""
    swarm_data[drone_id] = {"x": x, "y": y, "battery": 100, "role": "relay", "status": "active"}
    # Register with DroneManager
    if _drone_manager:
        _drone_manager.register(drone_id, {"position": [x, y], "battery": 100, "role": "relay"})
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
        
        # Sync with DroneManager
        if _drone_manager:
            _drone_manager.update_position(tired_drone_id, 0, 0)
            _drone_manager.update_position(fresh_drone_id, target_x, target_y)
        
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
    global human_intelligence_database
    human_intelligence_database = intel_report
    return f"CRITICAL OVERRIDE: Human intelligence registered -> '{intel_report}'"


@mcp.tool()
def get_human_intelligence() -> str:
    """
    [TELEMETRY TOOL] Reads the latest manual overrides from human commanders.
    Always run this to check for high-priority human instructions.
    """
    global human_intelligence_database
    if human_intelligence_database != "No manual intelligence provided yet.":
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
    
    def initialize(self, drone_manager):
        """Initialize with DroneManager for state synchronization."""
        set_drone_manager(drone_manager)
    
    def start(self):
        """Start the MCP server."""
        self._running = True
        mcp.run()
    
    def stop(self):
        """Gracefully shut down the server."""
        self._running = False


if __name__ == "__main__":
    mcp.run()
