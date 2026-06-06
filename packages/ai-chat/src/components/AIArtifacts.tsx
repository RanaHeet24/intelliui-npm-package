import React, { useState } from "react";
import { AIArtifact } from "../types/artifact";

export interface AIArtifactsProps {
  artifacts: AIArtifact[];
  className?: string;
}

/**
 * Reusable primitive for rendering rich content objects, documents, codes, and canvases.
 */
export const AIArtifacts: React.FC<AIArtifactsProps> = ({ artifacts, className = "" }) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    artifacts && artifacts.length > 0 ? artifacts[0].id : null
  );

  if (!artifacts || artifacts.length === 0) return null;

  const activeArtifact = artifacts.find(art => art.id === selectedId) || artifacts[0];

  return (
    <div className={`ai-artifacts mt-4 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/40 shadow-sm ${className}`}>
      {/* Tab bar / Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {artifacts.map((art) => (
            <button
              key={art.id}
              onClick={() => setSelectedId(art.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors focus:outline-none ${
                art.id === activeArtifact.id
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {art.title || `Artifact (${art.type})`}
            </button>
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold ml-2 flex-shrink-0">
          {activeArtifact.type}
        </span>
      </div>

      {/* Artifact content container */}
      <div className="p-4 overflow-y-auto max-h-[350px]">
        {activeArtifact.type === "code" ? (
          <pre className="font-mono text-xs text-gray-850 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/40 p-3 rounded-lg overflow-x-auto border border-gray-200/50 dark:border-gray-700/50">
            <code>{activeArtifact.content}</code>
          </pre>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-850 dark:text-gray-200">
            {activeArtifact.content}
          </div>
        )}
      </div>
    </div>
  );
};
