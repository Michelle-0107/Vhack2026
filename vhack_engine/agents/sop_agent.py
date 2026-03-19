import autogen
from vhack_engine.database.database import Database
from vhack_engine.mcp import server as mcp_server
import ollama

def retrieve_sop(situation_query: str) -> str:
    """Search SOP database and cross-reference with real-time drone telemetry."""
    print(f"\n🔥 [RAG TRIGGERED] 正在為查詢生成向量並檢索 MongoDB Atlas: '{situation_query}'")
    db = None
    try:
        db = Database()
        db.connect()
        
        # 1. 执行向量检索 (RAG) - 查规程
        response = ollama.embeddings(model='nomic-embed-text', prompt=situation_query)
        sop_results = db.vector_search(collection="sops", query_vector=response['embedding'], limit=2)
        
        # 2. 从当前仿真状态读取实时遥测（不再依赖可能过期的 MongoDB drones 集合）
        live_swarm = mcp_server.swarm_data
        
        # 4. 整合返回内容
        output = "### APPLICABLE SOPs:\n"
        if sop_results:
            output += "\n".join([f"{i+1}. {r.get('rule_text')}" for i, r in enumerate(sop_results)])
        else:
            output += "No specific SOP found in knowledge base."

        if live_swarm:
            for drone_id in sorted(live_swarm.keys()):
                status = live_swarm[drone_id]
                output += f"\n\n### REAL-TIME TELEMETRY ({drone_id}):\n"
                output += f"- Current Battery: {float(status.get('battery', 0.0)):.1f}%\n"
                output += f"- Current Status: {status.get('status', 'idle')}\n"
                output += f"- Last Position: {{'x': {status.get('x', 0)}, 'y': {status.get('y', 0)}}}"
        else:
            output += "\n\n### REAL-TIME TELEMETRY:\n- No live swarm telemetry available yet."
        
        db.log_event("SOP_QUERY", f"AI searched for: {situation_query}")

        return output

    except Exception as e:
        return f"Retrieval Error: {e}"
    finally:
        if db is not None:
            db.close()

def create_sop_expert(llm_config):
    # 🌟 请确保参数之间的逗号（,）都在正确的位置
    return autogen.AssistantAgent(
        name="SOP_Expert",
        system_message="""You are the Compliance Officer. 
        CRITICAL: No drone is allowed to move until you verify the SOP and the real-time battery.
        Call 'retrieve_sop' ONCE per mission brief, then produce a strict decision.
        Your output must include:
        1. Applicable SOP rule(s).
        2. Battery/safety check summary.
        3. Final verdict line exactly as either 'APPROVED FOR COMMANDER' or 'REJECTED'.
        After your verdict, DO NOT call retrieve_sop again unless the mission brief changes.
        Keep response concise and operational.
        """,
        llm_config=llm_config,
    )