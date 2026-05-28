import React, { createContext, useContext, ReactNode } from "react";

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | string;
  apiEndpoint?: string;
  persist?: boolean;
  adapter?: {
    sendMessage?: (payload: { message: string; history: any[]; files?: any[] }) => Promise<Response | any>;
  };
  theme?: string;
}

const AIProviderContext = createContext<AIProviderConfig | undefined>(undefined);

export interface AIProviderProps extends AIProviderConfig {
  children: ReactNode;
}

/**
 * Root context provider for configuring AI chat settings globally.
 * Centrally configures the chosen AI provider, api route, adapter layers, and persistence options.
 * Target usage:
 * <AIProvider provider="gemini" adapter={customAdapter} theme="dark">
 *   <AIChat />
 * </AIProvider>
 */
export function AIProvider({ 
  provider, 
  apiEndpoint = '/api/chat', 
  persist = false, 
  adapter,
  theme,
  children 
}: AIProviderProps) {
  return (
    <AIProviderContext.Provider value={{ provider, apiEndpoint, persist, adapter, theme }}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAIConfig() {
  const context = useContext(AIProviderContext);
  return context || { provider: 'gemini', apiEndpoint: '/api/chat', persist: false };
}
