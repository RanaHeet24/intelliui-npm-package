import React from "react";
import { AIMessageType } from "../types/message";
import { AIContent } from "./AIContent";
import { AIToolRenderer } from "./AIToolRenderer";
import { AIArtifacts } from "./AIArtifacts";
import { AIFileUpload } from "./AIFileUpload";
import { AIMessageActions } from "./AIMessageActions";
import { AIReasoning } from "./AIReasoning";
import { useAdaptiveLayout } from "../layout";

export interface AIMessageProps {
  message: AIMessageType;
  className?: string;
  onCopy?: () => void;
  onRetry?: () => void;
  onRegenerate?: () => void;
  
  // Custom developer-injected rendering layers (Step 2 & 3)
  components?: {
    Reasoning?: React.ComponentType<any>;
    [key: string]: any;
  };
  renderers?: {
    artifact?: React.ComponentType<any>;
    reasoning?: React.ComponentType<any>;
    content?: React.ComponentType<any>;
    [key: string]: any;
  };
}

/**
 * Central AI message rendering orchestrator.
 * 
 * Elegant support for component injection, layout slots, and custom rendering overrides.
 */
export const AIMessage: React.FC<AIMessageProps> = ({ 
  message, 
  className = "",
  onCopy,
  onRetry,
  onRegenerate,
  components,
  renderers,
}) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  const { mode } = useAdaptiveLayout();

  const isCompact = mode === "widget" || mode === "mobile" || mode === "drawer";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  
  // Custom bubble layout for user, full-width borderless panels for assistant
  const containerWidth = isUser 
    ? `${isCompact ? "max-w-[90%]" : "max-w-[75%]"} rounded-2xl rounded-tr-xs bg-zinc-900 text-white dark:bg-zinc-800 px-4.5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] font-medium text-[14px] leading-relaxed` 
    : isSystem
    ? "w-full max-w-2xl mx-auto px-4 py-2 bg-zinc-100/40 dark:bg-zinc-900/10 rounded-xl text-zinc-400 dark:text-zinc-550 italic text-center text-[11px]"
    : "w-full bg-transparent text-zinc-900 dark:text-zinc-100";

  const handleCopy = onCopy || (() => {
    navigator.clipboard.writeText(message.content);
  });

  // Resolve injected custom component/renderer targets (Step 2 & 3)
  const ReasoningComponent = renderers?.reasoning || components?.Reasoning || AIReasoning;
  const ContentComponent = renderers?.content || AIContent;
  const ArtifactsComponent = renderers?.artifact || AIArtifacts;

  return (
    <div
      className={`flex w-full first:mt-2 last:mb-2 transition-all animate-in fade-in slide-in-from-bottom-3 duration-400 ease-out ${
        isCompact ? "mb-5" : "mb-8"
      } ${alignmentClass} ${className}`}
      data-testid={`ai-message-${message.id}`}
      data-role={message.role}
      data-status={message.status}
    >
      {/* Avatar or Visual Origin Indicators - Container Aware */}
      {!isUser && !isSystem && mode === "workspace" && (
        <div className="flex-shrink-0 mr-4 mt-1 select-none">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-50 border border-zinc-200/50 dark:border-zinc-800 text-white dark:text-zinc-950 font-bold text-[10px] shadow-2xs">
            AI
          </div>
        </div>
      )}

      <div className={`flex flex-col ${containerWidth}`}>
        <div className="flex flex-col space-y-4">

          {/* 1. Reasoning / Thought Process Block */}
          {message.reasoning && (
            <div className="animate-in fade-in duration-300">
              <ReasoningComponent content={message.reasoning} />
            </div>
          )}

          {/* 2. Content Renderer Block */}
          <div className={`text-[14.5px] leading-relaxed font-sans ${isUser ? 'text-zinc-50' : 'text-zinc-800 dark:text-zinc-200'}`}>
            <ContentComponent 
              content={message.content} 
              isStreaming={message.status === "streaming"}
              className={`${isUser ? 'prose-invert text-white' : 'dark:prose-invert'} ${isSystem ? 'text-center font-serif text-zinc-400 dark:text-zinc-500' : ''}`}
            />
          </div>

          {/* 3. Tool Executions */}
          {message.tools && message.tools.length > 0 && (
            <div className="animate-in fade-in duration-300">
              <AIToolRenderer tools={message.tools} />
            </div>
          )}

          {/* 4. Artifacts rendering */}
          {message.artifacts && message.artifacts.length > 0 && (
            <div className="pt-2 animate-in fade-in duration-400">
              <ArtifactsComponent artifacts={message.artifacts} />
            </div>
          )}

          {/* 5. File Uploads List (if present) */}
          {message.files && message.files.length > 0 && (
            <div className="mt-1">
              <AIFileUpload files={message.files} />
            </div>
          )}

          {/* 6. Actions Bar */}
          {message.role === "assistant" && message.status === "done" && (
            <div className="pt-1 flex justify-start animate-in fade-in duration-300">
              <AIMessageActions 
                onCopy={handleCopy}
                onRetry={isUser ? onRetry : undefined}
                onRegenerate={isAssistant ? onRegenerate : undefined}
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
