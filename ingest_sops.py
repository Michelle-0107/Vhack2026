import ollama
from vhack_engine.database.database import Database

def get_embedding(text):
    """使用本地 Ollama 生成 768 维向量"""
    try:
        response = ollama.embeddings(model='nomic-embed-text', prompt=text)
        return response['embedding']
    except Exception as e:
        print(f"❌ Ollama 调用失败，请确保 Ollama 已启动: {e}")
        raise e

def run_ingestion():
    print("🚀 启动基于 Ollama 的本地 SOP 知识库导入...")
    db = Database()
    db.connect()

    # 准备英文 SOP 数据
    sop_data = [
        # 1. 资源与状态管理 (基于 battery 和 step)
        {"rule_id": "SIM_BAT_001", "rule_text": "When a drone's battery drops below 20%, it must abort its current task and immediately route back to base to prevent crashing."},
        {"rule_id": "SIM_BAT_002", "rule_text": "Drones with battery > 80% should be prioritized for long-distance exploration tasks."},
        
        # 2. 探索与建图 (模拟环境网格搜索)
        {"rule_id": "SIM_SRH_001", "rule_text": "For area coverage, drones should execute a systematic grid search. Avoid sending multiple drones to the same target coordinates unless necessary."},
        {"rule_id": "SIM_SRH_002", "rule_text": "When a drone reaches a new waypoint or unexplored grid, it must execute 'thermal_scan' to check for hidden survivors."},
        
        # 3. 目标处理与救援 (基于 survivors 状态)
        {"rule_id": "SIM_RES_001", "rule_text": "If a missing survivor is located (position known but not rescued), dispatch the single nearest available drone to their exact coordinates."},
        {"rule_id": "SIM_RES_002", "rule_text": "If multiple survivors are unrescued, prioritize dispatching drones to the survivor with the lowest 'health' percentage."},
        {"rule_id": "SIM_RES_003", "rule_text": "Once a drone shares the exact same position coordinates as a survivor, mark the survivor as 'rescued'."},
        
        # 4. 外部情报与指令 (基于模拟器 API)
        {"rule_id": "SIM_CMD_001", "rule_text": "At the start of every 10 simulation steps, execute 'get_human_intelligence()' to update the map with potential new survivor locations."}
    ]

    # 清空旧测试数据
    db._db["sops"].delete_many({})

    print(f"📦 正在处理 {len(sop_data)} 条规则...")
    for item in sop_data:
        print(f"正在本地转换并写入: {item['rule_id']}...")
        item["embedding"] = get_embedding(item["rule_text"])
        db.insert("sops", item)

    print("\n🎉 大功告成！SOP 知识库已通过本地模型成功存入云端数据库。")

if __name__ == "__main__":
    run_ingestion()