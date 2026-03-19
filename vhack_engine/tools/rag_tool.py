# DEPRECATED — NOT imported in the active agent flow.
# Live telemetry is read from mcp_server.swarm_data in sop_agent.py.
# The hardcoded drone_target="D1" and MongoDB drones-collection reads below are stale.
import ollama
from vhack_engine.database.database import Database

# 初始化数据库连接 (建议在系统启动时统一初始化，这里为了演示写在一起)
db = Database()
try:
    db.connect()
except Exception as e:
    print(f"RAG Tool DB Connection Error: {e}")

def retrieve_sop(query: str) -> str:
    """
    [这是给大模型看的 Tool Description，非常重要！]
    Use this tool to search the standard operating procedures (SOP) database 
    when you encounter a situation (e.g., low battery, survivor found) and need rules.
    
    Args:
        query: A natural language description of the current situation or problem.
    """
    print(f"\n🔍 [SOP Expert] 正在思考并检索关于: '{query}' 的规则...")
    
    try:
        # 1. 将用户的查询转换为 768 维向量 (必须和你存数据的模型一致)
        response = ollama.embeddings(model='nomic-embed-text', prompt=query)
        query_vector = response['embedding']
        
        # 2. 调用你写好的数据库检索方法
        # limit=2 表示每次只取最相关的 2 条，防止 Token 爆炸
        results = db.vector_search(collection="sops", query_vector=query_vector, limit=2)
        
        # 3. 将结果格式化为大模型易读的字符串
        if not results:
            return "No relevant SOPs found for this situation. Proceed with general logic."
            
        formatted_result = "### RELEVANT SOPs TO FOLLOW:\n"
        for idx, res in enumerate(results, 1):
            rule = res.get("rule_text", "")
            score = res.get("score", 0)
            formatted_result += f"{idx}. {rule} (Match Score: {score:.2f})\n"
            
        print(f"✅ [SOP Expert] 检索到规则: {results[0].get('rule_text')[:30]}...")
        return formatted_result
        
    except Exception as e:
        return f"Error occurred during SOP retrieval: {str(e)}"