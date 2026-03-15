from vhack_engine.database.database import Database

class BatteryTool:
    """Reports the current battery percentage of a specified drone."""

    name = "check_battery"
    description = "Return the current battery level of a drone. Required: drone_id."

    def run(self, params: dict) -> dict:
        """
        Query real-time drone battery from MongoDB.
        """
        drone_id = params.get("drone_id")
        db = Database()
        
        try:
            db.connect()
            
            # 1. 从基础数据库查找无人机实时数据
            results = db.find("drones", {"drone_id": drone_id})
            
            if not results:
                return {"error": f"Drone {drone_id} status not found in database."}
            
            battery = results[0].get("battery", 0.0)
            
            # 2. 顺便记录一下电量检查事件 (可选)
            if battery < 20:
                db.log_event("WARNING", f"Drone {drone_id} battery critically low: {battery}%")

            return {
                "drone_id": drone_id, 
                "battery_pct": battery,
                "status": "Critical" if battery < 20 else "Normal"
            }
            
        except Exception as e:
            return {"error": f"Battery check failed: {str(e)}"}
        finally:
            db.close()