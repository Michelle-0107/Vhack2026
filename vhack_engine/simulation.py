from mesa import Agent, Model
from .llm_client import OllamaAgent

class VhackAgent(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.brain = OllamaAgent()

    def step(self):
        # Call Ollama to make decisions
        # res = self.brain.chat("What should do next?")
        pass