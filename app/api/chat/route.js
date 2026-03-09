import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";

const ollama = createOllama({
  baseURL: "http://192.168.56.1:11434/api", // Placeholder remote IP
});

export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama("llama3.2"), // Assuming llama3.2 is available on the remote instance
    messages,
  });

  return result.toDataStreamResponse();
}
