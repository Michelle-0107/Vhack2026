"""
Reasoning utilities for AI agents.
Provides state summarisation for LLM prompts and Mission Log generation.
"""
from datetime import datetime

def summarise_mission_state(state: dict) -> str:
    """
    Convert raw simulation state into a detailed natural-language summary
    suitable for the Swarm Commander to make decisions.
    """
    drones = state.get("drones", [])
    survivors = state.get("survivors", [])
    step = state.get("step", 0)
    
    rescued = sum(1 for s in survivors if s.get("rescued", False))
    
    summary = f"--- SIMULATION STATE UPDATE (Step {step}) ---\n"
    summary += f"Status: {rescued}/{len(survivors)} survivors rescued.\n"
    
    summary += "Drone Telemetry:\n"
    for d in drones:
        summary += f" - [{d.get('id', 'Unknown')}]: Pos {d.get('position', 'N/A')}, Battery {d.get('battery', 0)}%\n"
        
    return summary

def export_mission_log(chat_results, filepath: str = "mission_log.txt") -> str:
    """
    Export AutoGen chat history to a text file for competition judging.
    """
    log_content = f"=== VHACK SWARM MISSION LOG ===\n"
    log_content += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    if hasattr(chat_results, 'chat_history'):
        for msg in chat_results.chat_history:
            sender = msg.get('name', 'System')
            content = msg.get('content', '')
            if content and content.strip():
                log_content += f"[{sender}]:\n{content}\n"
                log_content += "-" * 40 + "\n"
    else:
        log_content += "No chat history available.\n"
        
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(log_content)
        print(f"📄 Mission Log successfully exported to {filepath}")
        return filepath
    except Exception as e:
        print(f"❌ Failed to write Mission Log: {e}")
        return ""