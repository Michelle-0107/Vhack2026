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
        {"rule_id": "SOP_SEC_001", "rule_text": "When battery < 20%, execute RTH protocol immediately."},
        {"rule_id": "SOP_SEC_002", "rule_text": "Loss of signal for 5s: climb to 100m and hover."},
        {"rule_id": "SOP_SEC_003", "rule_text": "Obstacle avoidance: Brake at 2m and bypass at 5m."},
        {"rule_id": "SOP_SRH_001", "rule_text": "Use Lawnmower algorithm; maintain 10m drone interval."},
        {"rule_id": "SOP_RES_001", "rule_text": "Mark 'Suspected Survivor' if confidence score > 0.85."}
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