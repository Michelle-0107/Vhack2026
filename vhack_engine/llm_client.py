import ollama

class OllamaAgent:
    def __init__(self, model_name="llama3"):
        self.model = model_name

    def chat(self, prompt):
        response = ollama.chat(model=self.model, messages=[
            {'role': 'user', 'content': prompt},
        ])
        return response['message']['content']