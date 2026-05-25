import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "../types";
import type { AIProvider } from "./types";

/**
 * Gemini provider implementing the AIProvider interface.
 * Encapsulates all Google Generative AI SDK logic.
 */
export const geminiProvider: AIProvider = {
  id: "gemini",
  name: "Gemini",

  async streamResponse(messages: ChatMessage[], apiKey: string): Promise<ReadableStream> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Convert generic messages to Gemini's history format
    // Exclude the last message — it's the new prompt
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1]?.content || "";
    const result = await chat.sendMessageStream(lastMessage);

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });
  },
};

// Re-export for backward compatibility with the existing API route
export async function streamGeminiResponse(
  messages: ChatMessage[],
  apiKey: string
): Promise<ReadableStream> {
  return geminiProvider.streamResponse(messages, apiKey);
}
