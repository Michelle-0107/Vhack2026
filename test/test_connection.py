from vhack_engine.database.database import Database

def test_my_db():
    print("正在初始化数据库连接...")
    # 实例化你队友写的类
    db = Database()
    
    # 建立连接
    db.connect()
    print("连接指令已发送，正在尝试写入测试数据...")

    # 准备一条 Case Study 里要求的“无人机状态”测试数据
    test_drone_data = {
        "drone_id": "Drone_Alpha",
        "battery_level": 95,
        "status": "idle",
        "location": {"x": 10, "y": 20}
    }

    # 调用 insert 方法，存入名为 'drones_telemetry' 的表 (collection) 里
    inserted_id = db.insert("drones_telemetry", test_drone_data)

    if inserted_id:
        print(f"✅ 太棒了！测试数据写入成功，文档 ID: {inserted_id}")
        
        # 顺便测试一下查询功能
        result = db.find("drones_telemetry", {"drone_id": "Drone_Alpha"})
        print(f"✅ 查询结果: {result}")
    else:
        print("❌ 写入失败，请检查 .env 里的密码和白名单设置。")

    # 关闭连接
    db.close()

if __name__ == "__main__":
    test_my_db()