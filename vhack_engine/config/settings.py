"""
Settings - Central configuration for the VHack engine.
Values can be overridden via environment variables.
"""
import os


class Settings:
    """Application-wide configuration loaded from environment variables with defaults."""

    # LLM
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama3")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "vhack2026")

    # MCP Server
    MCP_HOST: str = os.getenv("MCP_HOST", "localhost")
    MCP_PORT: int = int(os.getenv("MCP_PORT", "8765"))

    # Simulation
    GRID_WIDTH: int = int(os.getenv("GRID_WIDTH", "20"))
    GRID_HEIGHT: int = int(os.getenv("GRID_HEIGHT", "20"))
    DEFAULT_DRONES: int = int(os.getenv("DEFAULT_DRONES", "3"))
    DEFAULT_SURVIVORS: int = int(os.getenv("DEFAULT_SURVIVORS", "5"))

    # API
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
