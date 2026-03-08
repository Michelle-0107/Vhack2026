"""
Reasoning utilities for AI agents.
Provides chain-of-thought helpers and state summarisation for LLM prompts.
"""


def summarise_mission_state(state: dict) -> str:
    """
    Convert raw simulation state into a concise natural-language summary
    suitable for injecting into an LLM prompt.
    """
    drones = state.get("drones", [])
    survivors = state.get("survivors", [])
    return (
        f"{len(drones)} drones active. "
        f"{len(survivors)} survivors detected. "
        f"Mission step: {state.get('step', 0)}."
    )


def build_context_window(history: list[str], max_turns: int = 5) -> str:
    """Return the last `max_turns` conversation turns as a single string."""
    return "\n".join(history[-max_turns:])
