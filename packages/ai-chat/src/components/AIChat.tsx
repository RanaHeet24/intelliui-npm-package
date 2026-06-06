"use client";

import React from 'react';
import { Message } from './Message';
import { PromptInput } from './PromptInput';
import { ThinkingIndicator } from './ThinkingIndicator';
import { useChat } from '../hooks/useChat';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useAIConfig } from '../providers/AIProvider';

export interface AIChatProps {
  /** Override the provider configured in <AIProvider> */
  provider?: 'gemini' | 'openai' | 'anthropic' | string;
  /** Override the API endpoint configured in <AIProvider> */
  apiEndpoint?: string;
  /** Override the localStorage persistence setting configured in <AIProvider> */
  persist?: boolean;
}

export function AIChat({ provider, apiEndpoint, persist }: AIChatProps) {
  // Grab settings from the nearest <AIProvider> context, defaulting if not wrapped
  const config = useAIConfig();

  const activeProvider = provider || config.provider;
  const activeEndpoint = apiEndpoint || config.apiEndpoint;
  const activePersist = persist !== undefined ? persist : config.persist;

  const { messages, input, setInput, sendMessage, isLoading, error, abort, clearChat } = useChat({
    provider: activeProvider,
    apiEndpoint: activeEndpoint,
    persist: activePersist,
  });
  
  const { containerRef, endRef, handleScroll } = useAutoScroll([messages]);

  const isThinking = isLoading && messages.length > 0 && messages[messages.length - 1]?.content === '';

  return (
    <div className="flex h-[600px] w-full max-w-3xl flex-col rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50 shadow-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">AI Chat</span>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs px-2 py-1 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
            Send a message to start chatting.
          </div>
        ) : (
          messages.map((msg) => <Message key={msg.id} message={msg} />)
        )}
        
        {isThinking && <ThinkingIndicator />}

        {error && (
          <div className="flex items-center text-sm text-red-500 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
            Error: {error}
          </div>
        )}
        
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <PromptInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}