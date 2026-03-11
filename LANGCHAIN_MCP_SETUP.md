# LangChain CommandAgent with MCP Integration - Setup Guide

## Overview

This implementation integrates LangChain with Ollama and MCP (Model Context Protocol) to create an autonomous AI-powered drone command agent for search and rescue operations.

## Architecture

```
┌─────────────────────────────────────────────────┐
│           FastAPI REST API (main.py)            │
│    Endpoints: /mission/start, /api/deploy, etc  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         MissionManager (Orchestrator)           │
│   Coordinates CommandAgent + DroneManager       │
└─────────────┬───────────────┬───────────────────┘
              │               │
      ┌───────▼──────┐ ┌─────▼──────────┐
      │ CommandAgent │ │  DroneManager  │
      │  (LangChain) │ │ (State Keeper) │
      └───────┬──────┘ └─────┬──────────┘
              │               │
              │   Synchronized State
              │               │
      ┌───────▼───────────────▼───────────┐
      │    MCP Server (FastMCP)           │
      │  12 Drone Tools (@mcp.tool())     │
      └───────────────────────────────────┘
```

## Key Components

### 1. **MCP Server** (`vhack_engine/mcp/server.py`)
- Uses **FastMCP** to expose drone tools via MCP protocol
- Synchronizes with DroneManager for state consistency
- Provides 12 tools:
  - `get_swarm_status` - View all drones
  - `get_battery_status` - Check battery
  - `move_to` - Move drone to coordinates
  - `get_drone_status` - Full drone status
  - `thermal_scan` - Detect survivors
  - `check_signal_network` - Network diagnostics
  - `deploy_relay` - Deploy relay drones
  - `swap_drones` - Battery rotation
  - `multi_sensor_scan` - Environmental scan
  - `show_disaster_map` - ASCII map
  - `inject_human_intelligence` - HITL override
  - `get_human_intelligence` - Read HITL data

### 2. **CommandAgent** (`vhack_engine/agents/command_agent.py`)
- Uses **ChatOllama** for local LLM inference
- Uses **LangGraph's create_react_agent** for tool calling
- Executes one tool at a time (ReAct pattern)
- Returns tactical reports after analysis

### 3. **MCP Client** (`vhack_engine/mcp/client.py`)
- Loads MCP tools as LangChain `StructuredTool` objects
- Supports two modes:
  - **Direct**: In-process tool calls (default, faster)
  - **Subprocess**: Full MCP protocol via stdio (for external clients)

### 4. **MissionManager** (`vhack_engine/services/mission_manager.py`)
- Orchestrates the entire mission lifecycle
- Initializes all components
- Provides human-in-the-loop (`inject_intelligence`)

## Installation

### 1. Install Dependencies

```bash
# Activate virtual environment
.venv\Scripts\Activate.ps1

# Install updated packages
pip install -r requirements.txt
```

### 2. Install Ollama and Model

```bash
# Download and install Ollama from https://ollama.ai
# Then pull the model:
ollama pull llama3.1
```

### 3. Verify Installation

```powershell
# Test if Ollama is running
ollama list

# Should show llama3.1 in the list
```

## Usage

### Method 1: REST API (Recommended)

```bash
# Start the FastAPI server
python main.py
```

Then use the API:

```bash
# Start a mission
curl -X POST "http://localhost:8000/mission/start?num_drones=3&num_survivors=5"

# Inject human intelligence
curl -X POST "http://localhost:8000/api/deploy" \
  -H "Content-Type: application/json" \
  -d '{"intelligence_report": "3 survivors trapped near building B"}'

# Step the mission (runs CommandAgent)
curl -X POST "http://localhost:8000/mission/step"

# Get status
curl "http://localhost:8000/status"

# List available tools
curl "http://localhost:8000/tools"
```

### Method 2: Direct Python Test

```bash
# Run the test script
python test_command_agent.py
```

This will:
1. Test MCP tools directly
2. Initialize CommandAgent with MCP tools
3. Run a sample mission briefing
4. Display the AI's tactical response

### Method 3: React Frontend Integration

The `/api/deploy` endpoint is compatible with your teammate's React frontend:

```javascript
// React component example
const deployMission = async (intel) => {
  const response = await fetch('http://localhost:8000/api/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intelligence_report: intel })
  });
  const data = await response.json();
  console.log(data.mission_logs);
};
```

## Configuration

### Model Selection

Edit the model in `command_agent.py`:

```python
agent = CommandAgent(model_name="llama3.1")  # or "mistral", "llama3", etc.
```

### Temperature/Creativity

In `command_agent.py`:

```python
self.llm = ChatOllama(model=self.model_name, temperature=0.2)
# Lower = more deterministic, Higher = more creative
```

### Tool Loading Mode

In `mission_manager.py`:

```python
self.tool_loader = MCPToolLoader(use_subprocess=False)
# False = Direct integration (faster)
# True = Full MCP protocol via subprocess
```

## How It Works

### ReAct Agent Loop

The CommandAgent uses the ReAct (Reasoning + Acting) pattern:

1. **Thought**: Agent analyzes the mission brief
2. **Action**: Agent selects ONE tool to call
3. **Observation**: Tool executes and returns result
4. **Repeat**: Agent loops until objective is complete
5. **Final Answer**: Agent provides a tactical report

### Example Execution Flow

```
User: "3 survivors reported near node_2"
  ↓
[THOUGHT] Need to check human intelligence first
[ACTION] Call get_human_intelligence()
[OBSERVATION] "HIGH PRIORITY INTEL: 3 survivors near node_2"
  ↓
[THOUGHT] Need to check drone positions
[ACTION] Call get_swarm_status()
[OBSERVATION] "{'node_2': {'x': 50, 'y': 20, 'battery': 85}}"
  ↓
[THOUGHT] node_2 is already near the location
[ACTION] Call thermal_scan(drone_id='node_2')
[OBSERVATION] "SURVIVOR SIGNATURE DETECTED!"
  ↓
[FINAL REPORT] "Mission successful. node_2 has located 3 survivors
at coordinates (50, 20). Recommend immediate rescue deployment."
```

## Troubleshooting

### "Import could not be resolved" errors
- These are linting errors. Run `pip install -r requirements.txt` to install packages.

### "Ollama connection refused"
- Ensure Ollama is running: `ollama serve`
- Check if model is installed: `ollama list`

### "Agent not initialized with MCP tools"
- Ensure you call `agent.initialize(mcp_tools=tools)` before `agent.run()`

### Agent outputs JSON instead of calling tools
- This is a known LLM hallucination. The system prompt tries to prevent it.
- Try lowering temperature to 0 for more deterministic behavior.

### Tools not updating DroneManager state
- Ensure `mcp_server.set_drone_manager(drone_manager)` is called during initialization
- Check that `mission_manager.start_mission()` is called before agent execution

## Advanced Features

### Human-in-the-Loop (HITL)

```python
# Inject critical intelligence
mission_manager.inject_intelligence("Fire detected in sector C")

# Agent will automatically check this when running
response = agent.run("Coordinate rescue operations")
```

### Dead Zone Self-Healing

The agent can autonomously deploy relay drones:

```python
# Agent detects dead zone and deploys relay
# No manual intervention needed
[AGENT] check_signal_network('node_3') → Dead Zone detected
[AGENT] deploy_relay('node_4', x=25, y=10) → Relay deployed
```

### Energy Management

```python
# Agent can swap tired drones automatically
[AGENT] get_battery_status('node_3') → 15%
[AGENT] swap_drones('node_3', 'node_5') → Fresh drone deployed
```

## Code Quality Notes

- All tools are type-hinted for better IDE support
- Async/sync wrappers provided for flexibility
- State synchronization between MCP and DroneManager
- Comprehensive error handling
- Extensive logging for debugging

## Next Steps

1. **Deploy to production**: Configure CORS, add authentication
2. **Expand tools**: Add camera_feed, voice_communication, etc.
3. **Multi-agent**: Add specialized agents (medic, fire, hazmat)
4. **Observability**: Add prometheus metrics, tracing
5. **Simulation**: Integrate with MESA simulation framework

## Team Integration

This implementation is compatible with:
- ✅ Teammate's FastMCP server tools
- ✅ Teammate's LangChain client pattern
- ✅ Teammate's FastAPI wrapper
- ✅ React frontend (via `/api/deploy` endpoint)
- ✅ Existing DroneManager/MissionManager architecture

---

**Questions? Issues?**
Check the test script (`test_command_agent.py`) for working examples.
