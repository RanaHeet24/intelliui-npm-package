import { useState, useRef, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../types';

export interface UseChatOptions {
  apiEndpoint?: string;
  provider?: string;
  /** Enable localStorage persistence (default: false) */
  persist?: boolean;
}

export function useChat({ apiEndpoint = '/api/chat', provider = 'gemini', persist = false }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hydrate from localStorage once after mount to prevent SSR hydration mismatches
  useEffect(() => {
    if (persist) {
      try {
        const stored = window.localStorage.getItem('ai-chat-messages');
        if (stored) {
          setMessages(JSON.parse(stored) as ChatMessage[]);
        }
      } catch { /* ignore */ }
    }
  }, [persist]);

  // Persist messages to localStorage whenever they change
  const updateMessages = useCallback((updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setMessages((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (persist && typeof window !== 'undefined') {
        try { window.localStorage.setItem('ai-chat-messages', JSON.stringify(next)); } catch { /* ignore */ }
      }
      return next;
    });
  }, [persist]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    abort();
    setMessages([]);
    setError(null);
    if (persist && typeof window !== 'undefined') {
      try { window.localStorage.removeItem('ai-chat-messages'); } catch { /* ignore */ }
    }
  }, [abort, persist]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Abort any in-flight request
    abort();

    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMessage];
    updateMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Create placeholder assistant message to stream into
    const assistantId = Math.random().toString(36).substring(7);
    updateMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', createdAt: new Date() },
    ]);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, provider }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 502 || response.status === 504) {
          throw new Error(`Could not connect to the chat API backend at '${apiEndpoint}'. Please ensure your backend dev server is running and CORS/Proxy settings are correct.`);
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          updateMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunkText }
                : msg
            )
          );
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return; // User cancelled — not an error
      setError(err.message || 'Failed to fetch AI response');
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    error,
    abort,
    clearChat,
  };
}
