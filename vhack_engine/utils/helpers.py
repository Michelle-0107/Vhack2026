"""
Helpers - Shared utility functions used across the VHack engine.
"""
import json
from typing import Any


def safe_json_parse(text: str, default: Any = None) -> Any:
    """Parse JSON text, returning `default` if parsing fails."""
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return default


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a value to [min_val, max_val]."""
    return max(min_val, min(max_val, value))


def flatten_list(nested: list) -> list:
    """Flatten one level of nesting in a list."""
    return [item for sublist in nested for item in sublist]
