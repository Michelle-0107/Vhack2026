from mcp.server.fastmcp import FastMCP
import math

# Initialize the Server
mcp = FastMCP("BeaconNetServer")

# --- 1. THE IN-MEMORY DATABASE ---
swarm_data = {
    "node_1": {"x": 0, "y": 0, "battery": 100, "role": "relay"},
    "node_2": {"x": 50, "y": 20, "battery": 85, "role": "searcher"},
    "node_3": {"x": 10, "y": 10, "battery": 15, "role": "searcher"}
}

known_dead_zones = []  # Memory & Learning
environmental_hazards = {"gas_leak": (15, 15), "fire": (45, 25)}  # Multi-sensor


# --- 2. EXISTING CORE TOOLS ---
@mcp.tool()
def get_swarm_status() -> str:
    """Returns the current status, location, and battery of all drones."""
    return str(swarm_data)


@mcp.tool()
def get_battery_status(drone_id: str) -> str:
    """Check the specific battery level of a single drone."""
    if drone_id in swarm_data:
        return f"{drone_id} battery is at {swarm_data[drone_id]['battery']}%."
    return "Drone not found."


@mcp.tool()
def move_to(drone_id: str, x: int, y: int) -> str:
    """Move a drone to specific x, y coordinates."""
    if drone_id in swarm_data:
        swarm_data[drone_id]["x"] = x
        swarm_data[drone_id]["y"] = y
        return f"SUCCESS: {drone_id} is now at ({x}, {y})."
    return "Drone not found."


@mcp.tool()
def show_disaster_map() -> str:
    """Displays a visual ASCII radar map of the swarm."""
    # A simple 5x5 grid representation for the terminal
    grid = [[" . " for _ in range(6)] for _ in range(6)]
    grid[0][0] = " H "  # Home Base

    for d_id, data in swarm_data.items():
        gx, gy = min(data["x"] // 10, 5), min(data["y"] // 10, 5)
        if gx >= 0 and gy >= 0:
            grid[gy][gx] = f" {d_id[-1]} "

    map_str = "\n--- BEACON-NET REAL-TIME RADAR ---\n"
    for row in reversed(grid):
        map_str += "".join(row) + "\n"
    map_str += "----------------------------------\nH = Base | Numbers = Drones\n"
    return map_str


# --- 3. NEW ADVANCED HACKATHON TOOLS ---

@mcp.tool()
def check_signal_network(drone_id: str) -> str:
    """Checks signal strength. Intelligent Dead Zone Detection."""
    if drone_id not in swarm_data:
        return "Drone not found."

    drone = swarm_data[drone_id]

    # Calculate distance to base (0,0)
    dist_to_base = math.sqrt(drone["x"] ** 2 + drone["y"] ** 2)

    # Check distance to nearest relay
    dist_to_relay = dist_to_base
    for d_id, data in swarm_data.items():
        if data["role"] == "relay" and d_id != drone_id:
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
    swarm_data[drone_id] = {"x": x, "y": y, "battery": 100, "role": "relay"}
    return f"SELF-HEALING SUCCESS: Relay {drone_id} deployed at ({x}, {y})."


@mcp.tool()
def swap_drones(tired_drone_id: str, fresh_drone_id: str) -> str:
    """Energy Rotation: Sends a tired drone home and sends a fresh one to its exact spot."""
    if tired_drone_id in swarm_data and fresh_drone_id in swarm_data:
        target_x = swarm_data[tired_drone_id]["x"]
        target_y = swarm_data[tired_drone_id]["y"]

        # Move tired home, move fresh to target
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

    # Check for hardcoded victim
    if abs(drone["x"] - 50) <= 10 and abs(drone["y"] - 20) <= 10:
        report += "[THERMAL] Survivor signature detected!\n"
    else:
        report += "[THERMAL] Clear.\n"

    # Check for hazards
    for hazard, (hx, hy) in environmental_hazards.items():
        if abs(drone["x"] - hx) <= 15 and abs(drone["y"] - hy) <= 15:
            report += f"[WARNING] {hazard.upper()} detected nearby!\n"

    return report


if __name__ == "__main__":
    mcp.run()