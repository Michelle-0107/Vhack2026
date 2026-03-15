import autogen
from vhack_engine.database.database import Database
import ollama

def retrieve_sop(situation_query: str) -> str:
    """Search SOP database and cross-reference with real-time drone telemetry."""
    print(f"\n🔥 [RAG TRIGGERED] 正在為查詢生成向量並檢索 MongoDB Atlas: '{situation_query}'")
    db = Database()
    try:
        db.connect()
        
        # 1. 执行向量检索 (RAG) - 查规程
        response = ollama.embeddings(model='nomic-embed-text', prompt=situation_query)
        sop_results = db.vector_search(collection="sops", query_vector=response['embedding'], limit=2)
        
        # 2. 尝试从查询中提取无人机 ID (简单逻辑：搜索 D1 或 Drone 1)
        # 默认查 D1，如果你的系统里有 D2，可以根据 situation_query 动态匹配
        drone_target = "D1" 
        if "Drone 2" in situation_query or "D2" in situation_query:
            drone_target = "D2"

        # 3. 执行基础检索 - 查实况 (Telemetry)
        # 对应你刚在 MongoDB 手动创建的 "drones" collection
        telemetry = db.find(collection="drones", query={"drone_id": drone_target})
        
        # 4. 整合返回内容
        output = "### APPLICABLE SOPs:\n"
        if sop_results:
            output += "\n".join([f"{i+1}. {r.get('rule_text')}" for i, r in enumerate(sop_results)])
        else:
            output += "No specific SOP found in knowledge base."

        if telemetry:
            status = telemetry[0]
            output += f"\n\n### REAL-TIME TELEMETRY ({drone_target}):\n"
            output += f"- Current Battery: {status.get('battery')}% \n"
            output += f"- Current Status: {status.get('status')} \n"
            output += f"- Last Position: {status.get('position')}"
        
        db.log_event("SOP_QUERY", f"AI searched for: {situation_query}")

        return output

    except Exception as e:
        return f"Retrieval Error: {e}"
    finally:
        db.close()

def create_sop_expert(llm_config):
    # 🌟 请确保参数之间的逗号（,）都在正确的位置
    return autogen.AssistantAgent(
        name="SOP_Expert",
        system_message="""You are the Compliance Officer. 
        CRITICAL: No drone is allowed to move until you verify the SOP and the real-time battery.
        Whenever the Planner suggests a move, you MUST call 'retrieve_sop' and report:
        1. What the SOP says.
        2. What the current battery in MongoDB is.
        Only then, say 'APPROVED' or 'REJECTED'.
        You must start your response with: 'Based on SOP retrieval from MongoDB...'. Mention the specific rule index found,
        """,
        llm_config=llm_config,
    )