# 🛸 VHack 2026: Autonomous Drone Orchestrator

An AI-powered Search and Rescue (SAR) mission control system. This project utilizes a multi-agent swarm logic to coordinate 12 autonomous drones in real-time disaster scenarios, powered by a local LLM and a FastAPI physics engine.

## 🌟 Key Features
* **Autonomous Swarm Intelligence**: Real-time multi-agent coordination for sector patrolling.
* **LLM Integration**: Brain powered by **Llama 3.1 (Ollama)** for tactical decision-making.
* **MCP Tool Server**: Standardized Model Context Protocol for drone tool-calling.
* **Real-time Dashboard**: React-based UI with WebSocket telemetry and mission logs.
* **Human-in-the-Loop (HITL)**: Ability to inject intelligence reports to override AI patrol paths.

## 🏗️ Project Architecture
* **Backend**: Python / FastAPI / Pydantic
* **Frontend**: React.js / Canvas API / WebSockets
* **AI Engine**: Ollama (Llama 3.1 / Qwen2.5-Coder)
* **Simulation**: Custom `vhack_engine` discrete-event physics model.

## 🚀 Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js & npm
* [Ollama](https://ollama.com/) (installed and running)

### 2. Backend Setup
```bash
# Navigate to root
cd mergefile

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pydantic langchain_community
