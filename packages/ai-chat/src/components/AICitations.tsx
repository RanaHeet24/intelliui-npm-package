import React, { useState } from "react";
import { AICitation } from "../types/citation";

export interface AICitationsProps {
  citations: AICitation[];
  className?: string;
}

/**
 * Reusable primitive for rendering source citations in an expandable UI.
 */
export const AICitations: React.FC<AICitationsProps> = ({ citations, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className={`ai-citations mt-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 ${className}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none"
      >
        <span className="mr-1.5 w-3 text-center">{isExpanded ? "▼" : "▶"}</span>
        Sources ({citations.length})
      </button>

      {isExpanded && (
        <div className="mt-3 flex flex-wrap gap-2">
          {citations.map((citation) => (
            <a 
              key={citation.id}
              href={citation.url || "#"}
              target={citation.url ? "_blank" : undefined}
              rel={citation.url ? "noopener noreferrer" : undefined}
              className="inline-flex items-center px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <span className="truncate max-w-[150px] font-medium">{citation.title}</span>
              {citation.source && (
                <span className="ml-1.5 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider">
                  {citation.source}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
