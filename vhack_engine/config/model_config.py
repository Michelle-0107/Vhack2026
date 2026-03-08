"""
Model Config - LLM model parameters and capability profiles.
"""

MODEL_PROFILES: dict = {
    "llama3": {
        "context_window": 8192,
        "supports_tools": True,
        "temperature": 0.2,
    },
    "mistral": {
        "context_window": 8192,
        "supports_tools": True,
        "temperature": 0.2,
    },
    "phi3": {
        "context_window": 4096,
        "supports_tools": False,
        "temperature": 0.3,
    },
}


def get_model_profile(model_name: str) -> dict:
    """Return configuration profile for the given model, defaulting to llama3."""
    return MODEL_PROFILES.get(model_name, MODEL_PROFILES["llama3"])
