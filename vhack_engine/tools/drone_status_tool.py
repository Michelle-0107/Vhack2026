from vhack_engine.database.database import Database

class DroneStatusTool:
    """Returns comprehensive status information for a drone or all drones."""

    name = "get_drone_status"
    description = "Get drone status. Provide 'drone_id' for one, or leave empty to list ALL drones."

    def run(self, params: dict) -> dict:
        """
        Fetch real-time status from MongoDB.
        """
        drone_id = params.get("drone_id")
        db = Database()
        
        try:
            db.connect()
            
            # 💡 逻辑分叉：
            if drone_id:
                # 模式 A: 查找特定无人机
                results = db.find("drones", {"drone_id": drone_id})
                if not results:
                    return {"error": f"Drone {drone_id} not found in database."}
                return results[0]
            else:
                # 模式 B: 查找所有无人机 (Multi-Agent 协作的核心)
                all_drones = db.find("drones", {})
                return {
                    "count": len(all_drones),
                    "drones": all_drones,
                    "summary": f"Detected {len(all_drones)} drones in the swarm."
                }
                
        except Exception as e:
            return {"error": f"Failed to retrieve status: {str(e)}"}
        finally:
            db.close()