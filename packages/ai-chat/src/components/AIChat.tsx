"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AIMessage } from './AIMessage';
import { PromptInput } from './PromptInput';
import { ThinkingIndicator } from './ThinkingIndicator';
import { AIConversationSidebar, ConversationItem } from './AIConversationSidebar';
import { useChat } from '../hooks/useChat';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useAIConfig } from '../providers/AIProvider';
import { AIChatLayoutProvider, useAdaptiveLayout, AdaptiveMode, AIChatModeProp } from '../layout';

export interface AIChatProps {
  /** Override the provider configured in <AIProvider> */
  provider?: 'gemini' | 'openai' | 'anthropic' | string;
  /** Quick-bind API endpoint shortcut */
  api?: string;
  /** Override the API endpoint configured in <AIProvider> */
  apiEndpoint?: string;
  /** Override the localStorage persistence setting configured in <AIProvider> */
  persist?: boolean;
  className?: string;

  // Custom Component Overrides
  components?: {
    Message?: React.ComponentType<any>;
    Input?: React.ComponentType<any>;
    Sidebar?: React.ComponentType<any>;
    Reasoning?: React.ComponentType<any>;
  };

  // Custom Renderer Overrides
  renderers?: {
    artifact?: React.ComponentType<any>;
    reasoning?: React.ComponentType<any>;
    content?: React.ComponentType<any>;
  };

  // Layout slots overrides
  slots?: {
    header?: React.ComponentType<any>;
    footer?: React.ComponentType<any>;
    sidebar?: React.ComponentType<any>;
  };

  // Event Lifecycle Hooks
  onMessage?: (message: any) => void;
  onResponse?: (response: any) => void;
  onError?: (error: string) => void;

  // Adaptive layout configuration
  adaptive?: boolean;
  mode?: AIChatModeProp;
}

/**
 * Public component wrapping the chat with dynamic layout orchestrations
 */
export function AIChat(props: AIChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden relative">
      <AIChatLayoutProvider
        containerRef={containerRef}
        mode={props.mode}
        adaptive={props.adaptive}
      >
        <AIChatInner {...props} />
      </AIChatLayoutProvider>
    </div>
  );
}

/**
 * Internal chat workspace engine consuming ResizeObserver container values
 */
function AIChatInner({ 
  provider, 
  api,
  apiEndpoint, 
  persist,
  className = "",
  components,
  renderers,
  slots,
  onMessage,
  onResponse,
  onError
}: AIChatProps) {
  const config = useAIConfig();
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useAdaptiveLayout();

  const activeProvider = provider || config.provider;
  const activeEndpoint = api || apiEndpoint || config.apiEndpoint;
  const activePersist = persist !== undefined ? persist : config.persist;

  // Primary hook orchestrating message data with event callbacks and adapter layer
  const { messages, input, setInput, sendMessage, isLoading, error, abort, clearChat } = useChat({
    provider: activeProvider,
    apiEndpoint: activeEndpoint,
    persist: activePersist,
    adapter: config.adapter,
    onMessage,
    onResponse,
    onError
  });

  // Conversations History States
  const [conversations, setConversations] = useState<ConversationItem[]>([
    { id: "c_general", title: "New Chat", updatedAt: new Date() }
  ]);
  const [activeConversationId, setActiveConversationId] = useState("c_general");
  
  const { containerRef, endRef, handleScroll } = useAutoScroll([messages]);

  const isThinking = isLoading && messages.length > 0 && messages[messages.length - 1]?.content === '';

  // Hydrate conversations from localStorage
  useEffect(() => {
    if (activePersist) {
      try {
        const saved = window.localStorage.getItem('intelliui-conversations');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setConversations(parsed);
            setActiveConversationId(parsed[0].id);
          }
        }
      } catch { /* ignore */ }
    }
  }, [activePersist]);

  // Handle switching mock history tabs
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    clearChat();
  };

  // Handle adding new conversation tabs
  const handleNewConversation = () => {
    const newId = `c_${Math.random().toString(36).substring(7)}`;
    const newChat: ConversationItem = {
      id: newId,
      title: `New Chat`,
      updatedAt: new Date()
    };
    const next = [newChat, ...conversations];
    setConversations(next);
    setActiveConversationId(newId);
    clearChat();
    if (activePersist && typeof window !== 'undefined') {
      try { window.localStorage.setItem('intelliui-conversations', JSON.stringify(next)); } catch { /* ignore */ }
    }
  };

  // Intercept sending a message
  const handleSendMessage = (files?: any[]) => {
    const prompt = input.trim();
    const hasFiles = files && files.length > 0;
    if (!prompt && !hasFiles) return;

    const firstPrompt = prompt || (files && files[0] ? `Upload: ${files[0].name}` : "New Chat");
    const threadTitle = firstPrompt.length > 25 ? firstPrompt.slice(0, 25) + "..." : firstPrompt;

    if (messages.length === 0) {
      const isPlaceholder = conversations.some(c => c.id === activeConversationId && (c.title === "New Chat" || c.title === "General Workspace"));
      
      if (isPlaceholder) {
        setConversations(prev => {
          const next = prev.map(c => c.id === activeConversationId ? { ...c, title: threadTitle } : c);
          if (activePersist && typeof window !== 'undefined') {
            try { window.localStorage.setItem('intelliui-conversations', JSON.stringify(next)); } catch { /* ignore */ }
          }
          return next;
        });
      } else {
        const newId = `c_${Math.random().toString(36).substring(7)}`;
        const newChat: ConversationItem = {
          id: newId,
          title: threadTitle,
          updatedAt: new Date()
        };
        const next = [newChat, ...conversations];
        setConversations(next);
        setActiveConversationId(newId);
        if (activePersist && typeof window !== 'undefined') {
          try { window.localStorage.setItem('intelliui-conversations', JSON.stringify(next)); } catch { /* ignore */ }
        }
      }
    }

    sendMessage(files);
  };

  // Rename action
  const handleRenameConversation = (id: string, newTitle: string) => {
    const next = conversations.map(c => c.id === id ? { ...c, title: newTitle } : c);
    setConversations(next);
    if (activePersist && typeof window !== 'undefined') {
      try { window.localStorage.setItem('intelliui-conversations', JSON.stringify(next)); } catch { /* ignore */ }
    }
  };

  // Delete action
  const handleDeleteConversation = (id: string) => {
    const next = conversations.filter(c => c.id !== id);
    setConversations(next);
    if (activePersist && typeof window !== 'undefined') {
      try { window.localStorage.setItem('intelliui-conversations', JSON.stringify(next)); } catch { /* ignore */ }
    }
    if (activeConversationId === id) {
      clearChat();
      if (next.length > 0) {
        setActiveConversationId(next[0].id);
      } else {
        setActiveConversationId("");
      }
    }
  };

  // Dynamic component resolving
  const SidebarComponent = components?.Sidebar || slots?.sidebar || AIConversationSidebar;
  const InputComponent = components?.Input || PromptInput;
  const MessageComponent = components?.Message || AIMessage;

  const HeaderSlot = slots?.header;
  const FooterSlot = slots?.footer;

  return (
    <div className={`ai-chat-root dark flex h-full w-full bg-[#07070a] text-zinc-150 overflow-hidden font-sans mode-${mode} ${className}`}>
      
      {/* Dimmed backdrop to close overlay sidebar on click outside */}
      {mode !== "workspace" && (
        <div 
          className={`sidebar-overlay-backdrop ${!sidebarCollapsed ? 'active' : ''}`}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* 1. Sidebar Panel */}
      <SidebarComponent
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        className="border-r border-zinc-900 bg-[#0a0a0f]"
      />

      {/* 2. Workspace Content Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07070a] relative">
        
        {/* Header Block */}
        {HeaderSlot ? (
          <HeaderSlot />
        ) : (
          <header className="flex h-14 items-center justify-between border-b border-zinc-900/60 bg-[#09090d]/80 px-6 backdrop-blur-md z-10 shrink-0 select-none">
            <div className="flex items-center gap-3">
              {mode !== "workspace" && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="sidebar-toggle-btn mr-1 shrink-0"
                  title="Toggle Sidebar"
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950 font-bold text-xs shadow-md shadow-violet-500/10">
                I
              </span>
              <span className="font-extrabold text-[11px] tracking-[0.2em] text-zinc-400 uppercase font-mono truncate max-w-[150px] sm:max-w-none">
                {mode === "widget" || mode === "mobile" ? "IntelliUI" : "IntelliUI Workspace"}
              </span>
            </div>
            
            <div className="flex items-center gap-3.5">
              {messages.length > 0 && mode !== "mobile" && (
                <button
                  onClick={clearChat}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
              <span className="text-[10px] px-2.5 py-1 bg-zinc-900/60 border border-zinc-800/60 rounded-md text-violet-400 font-bold uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(168,85,247,0.05)]">
                {activeProvider}
              </span>
            </div>
          </header>
        )}

        {/* Scrollable Messages Area with Radial Ambient Glow VFX */}
        <main
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full select-text scroll-smooth relative overflow-hidden"
        >
          {/* Glowing Ambient VFX Layers */}
          <div className="vfx-ambient-glow" />
          <div className="vfx-ambient-glow-secondary" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto py-10 animate-in fade-in duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800/60 text-violet-400 shadow-[0_4px_30px_rgba(168,85,247,0.1)] mb-6 shrink-0">
                  <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white font-mono uppercase tracking-widest bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  IntelliUI Workspace
                </h2>
                <p className="text-zinc-400 mt-2.5 text-xs leading-relaxed max-w-sm">
                  Welcome to your AI workspace dashboard. Click any visual prompt preset to start:
                </p>
                
                {/* Helper triggers cards (VFX Space Themed Cards) */}
                <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md welcome-cards-grid">
                  <button 
                    onClick={() => { setInput("Explain why React components re-render step-by-step"); }}
                    className="p-4 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-violet-500/40 rounded-2xl text-left shadow-xs transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] active:scale-[0.98]"
                  >
                    <span className="font-bold text-[9px] text-violet-400 block mb-1.5 uppercase tracking-widest font-mono">Cognition</span>
                    <span className="text-[11.5px] text-zinc-300 leading-snug">"Explain why React components re-render step-by-step"</span>
                  </button>
                  <button 
                    onClick={() => { setInput("Search the latest Next.js updates"); }}
                    className="p-4 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-blue-500/40 rounded-2xl text-left shadow-xs transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] active:scale-[0.98]"
                  >
                    <span className="font-bold text-[9px] text-blue-400 block mb-1.5 uppercase tracking-widest font-mono">Search RAG</span>
                    <span className="text-[11.5px] text-zinc-300 leading-snug">"Search the latest Next.js updates"</span>
                  </button>
                  <button 
                    onClick={() => { setInput("Generate code for an analytical dashboard"); }}
                    className="p-4 bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-emerald-500/40 rounded-2xl text-left shadow-xs transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-[0.98]"
                  >
                    <span className="font-bold text-[9px] text-emerald-400 block mb-1.5 uppercase tracking-widest font-mono">Canvas</span>
                    <span className="text-[11.5px] text-zinc-300 leading-snug">"Generate code for an analytical dashboard"</span>
                  </button>
                  <div className="p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl text-left shadow-xs select-none">
                    <span className="font-bold text-[9px] text-amber-400 block mb-1.5 uppercase tracking-widest font-mono">Uplink</span>
                    <span className="text-[11.5px] text-zinc-400 leading-normal">Attach CSV/PDF files using paperclip to run file analysis queries.</span>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageComponent 
                  key={msg.id} 
                  message={msg} 
                  components={components} 
                  renderers={renderers} 
                />
              ))
            )}
            
            {isThinking && <ThinkingIndicator />}

            {error && (
              <div className="flex items-center text-sm text-red-400 p-4 bg-red-950/20 rounded-xl border border-red-900/50 shadow-3xs select-none">
                Error: {error}
              </div>
            )}
            
            <div ref={endRef} />
          </div>
        </main>

        {/* Input Dock Area */}
        <footer className="w-full shrink-0 z-10 pb-6 px-4 bg-transparent select-none">
          <div className="max-w-3xl mx-auto">
            {FooterSlot ? (
              <FooterSlot />
            ) : (
              <InputComponent
                value={input}
                onChange={setInput}
                onSubmit={(files?: any[]) => handleSendMessage(files)}
                disabled={isLoading}
              />
            )}
            <div className="text-[9px] text-zinc-500 text-center mt-2.5 select-none font-mono tracking-widest">
              INTELLIUI WORKSPACE ENGINE v0.1.2
            </div>
          </div>
        </footer>
        
      </div>
      
    </div>
  );
}