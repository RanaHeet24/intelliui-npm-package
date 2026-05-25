import type { ChatMessage } from "../types";

const STORAGE_KEY = "ai-chat-messages";

/**
 * Saves messages to localStorage.
 * Silently fails if localStorage is unavailable (SSR, private browsing).
 */
export function saveMessages(messages: ChatMessage[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Silently fail — persistence is optional
  }
}

/**
 * Loads messages from localStorage.
 * Returns empty array if nothing is stored or during SSR.
 */
export function loadMessages(): ChatMessage[] {
  try {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ChatMessage[];
  } catch {
    return [];
  }
}

/**
 * Clears persisted messages.
 */
export function clearMessages(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
