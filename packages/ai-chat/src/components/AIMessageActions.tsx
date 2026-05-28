import React, { useState } from "react";

export interface AIMessageActionsProps {
  onCopy?: () => void;
  onRetry?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

/**
 * Reusable actions bar representing quick interaction items on an AI message response.
 */
export const AIMessageActions: React.FC<AIMessageActionsProps> = ({
  onCopy,
  onRetry,
  onRegenerate,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`ai-message-actions mt-3 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700/50 pt-2.5 ${className}`}>
      {onCopy && (
        <button
          onClick={handleCopy}
          className="px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          Retry
        </button>
      )}

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          Regenerate
        </button>
      )}
    </div>
  );
};
