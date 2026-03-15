from vhack_engine.database.database import Database
from datetime import datetime

class MoveTool:
    """Instructs a drone to navigate to a specified (x, y) position."""

    name = "move_drone"
    description = "Move a drone to a target grid coordinate. Required: drone_id, x, y."

    def run(self, params: dict) -> dict:
        """
        Execute a move command and update the database.
        """
        # 1. 提取参数
        drone_id = params.get("drone_id")
        # 兼容性处理：防止 AI 传进来的是字符串格式的数字
        try:
            x = int(params.get("x", 0))
            y = int(params.get("y", 0))
        except (ValueError, TypeError):
            x, y = 0, 0

        # 2. 🌟 核心：更新数据库状态 (替代原来的 TODO)
        db = Database()
        try:
            db.connect()
            # 更新 drones 集合中的坐标
            db.update_drone_status(drone_id, {
                "position": {"x": x, "y": y},
                "last_update": datetime.now().strftime("%H:%M:%S"),
                "status": "Scanning Area" # 移动后自动转入扫描状态
            })
            
            # 同时记录一条任务事件日志
            db.log_event("MOVE", f"Drone {drone_id} moved to ({x}, {y})")
            
            return {
                "success": True, 
                "drone_id": drone_id, 
                "position": [x, y],
                "message": f"Drone {drone_id} reached target and database updated."
            }
        except Exception as e:
            return {"success": False, "error": f"Database sync failed: {str(e)}"}
        finally:
            db.close()