"""
VHack Engine - Autonomous Search and Rescue Drone Orchestrator.

Package structure:
  agents/      - LLM-powered decision making (CommandAgent, PlannerAgent)
  llm/         - Ollama client, prompt templates, embeddings
  mcp/         - Model Context Protocol server, bridge, and tool registry
  tools/       - MCP-compatible drone action tools
  simulation/  - Mesa-based disaster simulation (DisasterModel, DroneAgent)
  environment/ - Grid maps and sector definitions
  services/    - MissionManager, FleetOptimizer
  database/    - MongoDB persistence layer
  config/      - Settings and model configuration
  utils/       - Logging and shared helpers
"""
from vhack_engine.services.mission_manager import MissionManager
from vhack_engine.simulation.disaster_model import DisasterModel

__all__ = ["MissionManager", "DisasterModel"]
