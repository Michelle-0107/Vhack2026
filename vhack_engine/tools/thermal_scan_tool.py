from vhack_engine.database.database import Database

class ThermalScanTool:
    """Performs a thermal scan and returns detected heat signatures from the database."""

    name = "thermal_scan"
    description = "Scan current position for survivors. Required: drone_id."

    def run(self, params: dict) -> dict:
        """
        Check if any targets (survivors) exist at the drone's current coordinates.
        """
        drone_id = params.get("drone_id")
        db = Database()
        
        try:
            db.connect()
            
            # 1. 获取无人机的当前位置
            drone_data = db.find("drones", {"drone_id": drone_id})
            if not drone_data:
                return {"error": f"Drone {drone_id} not found."}
            
            current_pos = drone_data[0].get("position", {"x": 0, "y": 0})
            drone_x, drone_y = current_pos.get("x"), current_pos.get("y")

            # 2. 🌟 核心：在 'targets' 集合中搜索坐标匹配的幸存者
            # 这里我们加一点“容错范围”，比如坐标差 5 以内都算发现
            search_range = 5
            query = {
                "location.x": {"$gte": drone_x - search_range, "$lte": drone_x + search_range},
                "location.y": {"$gte": drone_y - search_range, "$lte": drone_y + search_range}
            }
            
            found_targets = db.find("targets", query)

            # 3. 记录扫描结果到日志
            db.log_event("SCAN", f"Drone {drone_id} scanned ({drone_x}, {drone_y}). Found {len(found_targets)} signatures.")

            return {
                "drone_id": drone_id,
                "position": [drone_x, drone_y],
                "signatures": found_targets,
                "message": f"Scan complete. {len(found_targets)} survivors detected." if found_targets else "No heat signatures detected."
            }

        except Exception as e:
            return {"error": f"Scan failed: {str(e)}"}
        finally:
            db.close()