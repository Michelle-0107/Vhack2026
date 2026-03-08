"""
Planner Agent - Responsible for decomposing high-level mission objectives
into concrete drone task assignments.
"""
from vhack_engine.llm.llm_client import OllamaClient
from vhack_engine.llm.prompts import MISSION_PLANNING_PROMPT


class PlannerAgent:
    """
    Generates step-by-step action plans for the drone fleet based on
    the current state of the disaster simulation.
    """

    def __init__(self, model_name: str = "llama3"):
        self.llm = OllamaClient(model_name=model_name)

    def plan(self, mission_state: dict) -> list[dict]:
        """
        Generate a prioritized list of drone tasks given the current mission state.

        Args:
            mission_state: Current simulation state including drone positions,
                           battery levels, and known survivor locations.

        Returns:
            List of task dicts e.g. [{"drone_id": "D1", "action": "move", "target": (3, 4)}]
        """
        prompt = MISSION_PLANNING_PROMPT.format(
            drones=mission_state.get("drones", []),
            survivors=mission_state.get("survivors", []),
            step=mission_state.get("step", 0),
            battery=mission_state.get("battery", "unknown"),
        )
        # response = self.llm.chat(prompt)
        # return self._parse_plan(response)
        return []

    def _parse_plan(self, response: str) -> list[dict]:
        """Parse LLM response into structured task list."""
        from vhack_engine.utils.helpers import safe_json_parse
        return safe_json_parse(response, default=[])
