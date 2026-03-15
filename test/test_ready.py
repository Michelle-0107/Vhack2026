# test_ready.py
from vhack_engine.database.database import Database

def verify_system():
    print("🧪 正在执行正式环境就绪测试...")
    db = Database()
    db.connect()
    
    # 尝试检索我们刚才存入的那条“普天同庆”数据
    mock_vector = [0.1] * 1536 # 随便给个测试向量
    results = db.vector_search("sops", mock_vector, limit=1)
    
    if results:
        print("✅ 正式环境配置成功！已能自动读取 .env 并执行检索。")
        print(f"📄 检索到的内容: {results[0].get('rule_text')}")
    else:
        print("⚠️ 连接成功但未搜到内容，可能是索引正在同步或表为空。")

if __name__ == "__main__":
    verify_system()