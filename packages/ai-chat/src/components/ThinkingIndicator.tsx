import React from "react";

/**
 * Animated thinking indicator — three pulsing dots.
 * Shown while the AI is processing before streaming begins.
 */
export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">Thinking...</span>
    </div>
  );
}
