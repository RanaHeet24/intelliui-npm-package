import React from "react";
import { AIToolCall } from "../types/tool";

export interface AIToolRendererProps {
  tools: AIToolCall[];
  className?: string;
}

/**
 * Reusable premium primitive for rendering agent tool execution states.
 */
export const AIToolRenderer: React.FC<AIToolRendererProps> = ({ tools, className = "" }) => {
  if (!tools || tools.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]";
      case "completed": return "text-emerald-400 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]";
      case "error": return "text-rose-400 bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]";
      default: return "text-zinc-500 bg-zinc-500";
    }
  };

  return (
    <div className={`ai-tools mt-3 flex flex-col gap-2.5 ${className}`}>
      {tools.map((tool) => (
        <div 
          key={tool.id} 
          className="flex items-center gap-3 p-3 rounded-xl bg-[#111119]/80 border border-zinc-800/60 text-xs shadow-3xs"
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${tool.status === 'running' ? 'animate-pulse' : ''} ${getStatusColor(tool.status)}`} />
          </div>
          <div className="flex-1 font-mono text-zinc-300 font-semibold uppercase tracking-wider text-[10px]">
            {tool.name}
          </div>
          {tool.description && (
            <div className="text-zinc-400 truncate max-w-[200px] text-[11px] italic font-sans">
              {tool.description}
            </div>
          )}
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-2 font-mono">
            {tool.status}
          </div>
        </div>
      ))}
    </div>
  );
};
