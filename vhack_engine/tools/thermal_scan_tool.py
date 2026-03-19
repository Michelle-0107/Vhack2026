from typing import Any

scanned_history = set()

def execute_thermal_scan(drone: Any) -> str:
    pos = drone.pos
    if pos in scanned_history:
        return f"WARNING: Coordinates already scanned. Move to new coordinates."
    
    scanned_history.add(pos)
    
    # Query simulation model if available
    survivors = []
    if getattr(drone, 'model', None):
        survivors = [s for s in drone.scan(radius=2) if not s.rescued]
    
    if survivors:
        survivor_details = []
        for s in survivors:
            dist = abs(s.pos[0] - pos[0]) + abs(s.pos[1] - pos[1])
            survivor_details.append(f"ID:{s.unique_id}, Pos:{s.pos}, Dist:{dist}")
        return f"[THERMAL] SURVIVOR(S) DETECTED! Count: {len(survivors)}. Details: {'; '.join(survivor_details)}"
    
    return f"[THERMAL] No heat signatures detected within 2-cell radius of {pos}."