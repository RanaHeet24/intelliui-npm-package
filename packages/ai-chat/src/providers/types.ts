import type { ChatMessage } from "../types";

/**
 * Provider-agnostic interface for AI chat providers.
 * Every provider (Gemini, OpenAI, Anthropic, local) must implement this contract.
 * This ensures the useChat hook and API routes never depend on vendor-specific APIs.
 */
export interface AIProvider {
  /** Unique identifier for routing (e.g., "gemini", "openai") */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Sends messages and returns a ReadableStream of text chunks */
  streamResponse(messages: ChatMessage[], apiKey: string): Promise<ReadableStream>;
}

/** Configuration passed from the client to the API route */
export interface ChatRequestBody {
  messages: ChatMessage[];
  provider: string;
}

/** Shape of a successful streaming response — just a raw ReadableStream */
export type ChatStreamResponse = ReadableStream;

/** Shape of an error response from the API route */
export interface ChatErrorResponse {
  error: string;
}
