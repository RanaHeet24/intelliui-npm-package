import React from "react";
import type { ChatMessage } from "../../types";

export interface ToolsRendererProps {
  message: ChatMessage;
}

/**
 * Placeholder for future tool calling / functional UI widgets.
 * Keeps the architecture highly modular and extensible.
 */
export function ToolsRenderer({ message }: ToolsRendererProps) {
  // Tool execution status and results go here in the future
  return null;
}
