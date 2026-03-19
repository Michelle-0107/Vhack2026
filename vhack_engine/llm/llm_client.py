"""
LLM Client - Wraps Ollama to provide a consistent chat interface for agents.
Migrated and extended from vhack_engine/llm_client.py.
"""
import ollama


class OllamaClient:
    """
    Thin wrapper around the Ollama Python client.
    Provides synchronous chat and streaming interfaces.
    """

    def __init__(self, model_name: str = "llama3"):
        self.model = model_name

    def chat(self, prompt: str, system: str | None = None) -> str:
        """
        Send a prompt to the local LLM and return the response text.

        Args:
            prompt: User message.
            system: Optional system instruction to prepend.

        Returns:
            Model response as a string.
        """
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        response = ollama.chat(model=self.model, messages=messages)
        return response["message"]["content"]

    def stream(self, prompt: str):
        """Yield response tokens as they arrive from Ollama."""
        for chunk in ollama.chat(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        ):
            yield chunk["message"]["content"]


# Backwards-compatible alias used by legacy simulation.py
OllamaAgent = OllamaClient
