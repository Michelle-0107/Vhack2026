🚨 Beacon-Net: Autonomous Edge Swarm Commander
Beacon-Net is an AI-driven, self-healing drone swarm control system designed for First Responder search and rescue missions. Built using local Large Language Models (Llama 3.1) and the Model Context Protocol (MCP), it allows an autonomous AI agent to evaluate environmental telemetry, dynamically route communication relays, and execute multi-sensor rescue operations in real-time.

✨ Core Features
Intelligent Dead Zone Detection: Continuously calculates drone distance from base and relays to predict and identify network drop-offs.

Signal Relay & Self-Healing: Autonomously deploys new relay drones (e.g., Node 4) to bridge communication gaps when searcher drones enter dead zones.

Environmental Awareness & Multi-Sensor Fusion: Executes complex area scans utilizing simulated thermal, gas, and fire sensors to locate survivors and flag operational hazards.

Real-Time Tactical Dashboard: Generates live ASCII radar mapping and outputs detailed, military-style tactical reports based on autonomous actions.

🛠️ Tech Stack
AI Engine: Local llama3.1 (via Ollama) for completely offline, edge-capable reasoning.

Agent Framework: LangChain & LangGraph (create_react_agent) for sequential Chain-of-Thought tool execution.

Tooling Protocol: Model Context Protocol (MCP) using fastmcp to expose Python functions to the AI.

🚀 Quick Start Guide
1. Prerequisites
Ensure you have the following installed on your machine:

Python 3.10+

Ollama (Running locally)

The llama3.1 model downloaded in Ollama: ollama run llama3.1

2. Install Dependencies
Open your terminal and install the required Python libraries:

Bash
pip install mcp langchain-ollama langchain-mcp-adapters langgraph
3. Running the Live Demo
You do not need to start the server separately. The Client is configured to automatically spawn the Server via standard input/output (stdio) using a persistent session.

To execute the autonomous rescue mission, simply run:

Bash
python mcp_client.py
Watch the terminal as the AI Commander evaluates the dead zone, deploys the self-healing relay, discovers the survivor, and prints the real-time radar map!

🧠 Architecture Overview 
If you are building the frontend (e.g., the Flutter Tactical Dashboard), here is how the backend is structured:

mcp_server.py (The State & Tools): This file acts as our "Database" and API. It holds the swarm_data (where every drone is located) and defines the @mcp.tool() functions. If you need to add a new sensor or drone capability, add it here.

mcp_client.py (The AI Brain): This file connects to the server. It feeds the system_prompt and user_command to Llama 3.1. The AI reads the available tools from the server and decides which ones to execute in order to complete the mission.

Frontend Integration Note: Currently, the tactical map and reports print to the terminal. To connect this to a Flutter UI, we can intercept the msg.content and clean_text variables in the mcp_client.py async loop and push them to your UI via WebSockets or a local API endpoint!