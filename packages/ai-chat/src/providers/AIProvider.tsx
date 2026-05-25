import React, { createContext, useContext, ReactNode } from "react";

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | string;
  apiEndpoint?: string;
  persist?: boolean;
}

const AIProviderContext = createContext<AIProviderConfig | undefined>(undefined);

export interface AIProviderProps extends AIProviderConfig {
  children: ReactNode;
}

/**
 * Root context provider for configuring AI chat settings globally.
 * Centrally configures the chosen AI provider, api route, and persistence options.
 * Target usage:
 * <AIProvider provider="gemini">
 *   <AIChat />
 * </AIProvider>
 */
export function AIProvider({ provider, apiEndpoint = '/api/chat', persist = false, children }: AIProviderProps) {
  return (
    <AIProviderContext.Provider value={{ provider, apiEndpoint, persist }}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAIConfig() {
  const context = useContext(AIProviderContext);
  return context || { provider: 'gemini', apiEndpoint: '/api/chat', persist: false };
}
