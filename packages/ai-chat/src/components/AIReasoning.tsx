import React from "react";

export interface AIReasoningProps {
  content: string;
  className?: string;
}

/**
 * Reusable premium primitive for rendering compact, non-expandable thinking summaries.
 */
export const AIReasoning: React.FC<AIReasoningProps> = ({ content, className = "" }) => {
  if (!content) return null;

  // Format verbose thought logs into clean visual points
  const lines = content
    .split("\n")
    .map(line => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  return (
    <div className={`ai-reasoning my-2 bg-[#12121c]/60 border-l-2 border-violet-500/40 rounded-r-xl p-3 select-none ${className}`}>
      <span className="text-[9.5px] font-bold uppercase tracking-widest text-violet-400 block mb-1.5 font-mono">
        Thinking Process
      </span>
      <div className="space-y-0.5">
        {lines.slice(0, 3).map((line, i) => (
          <div key={i} className="flex gap-1.5 items-start text-[11px] text-zinc-400 leading-relaxed font-sans italic">
            <span className="text-violet-400 select-none font-serif">•</span>
            <span className="truncate max-w-full">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
