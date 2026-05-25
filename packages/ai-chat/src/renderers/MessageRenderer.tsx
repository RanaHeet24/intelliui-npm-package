import React from "react";
import { MarkdownRenderer } from "./markdown/MarkdownRenderer";
import { ToolsRenderer } from "./tools/ToolsRenderer";
import { CitationsRenderer } from "./citations/CitationsRenderer";
import type { ChatMessage } from "../types";

export interface MessageRendererProps {
  message: ChatMessage;
}

/**
 * Scalable Orchestrator for rendering message content and metadata.
 * Routes the message to appropriate renderers: text markdown, functional tool blocks, or citation widgets.
 */
export function MessageRenderer({ message }: MessageRendererProps) {
  return (
    <div className="space-y-2">
      <MarkdownRenderer content={message.content} />
      <ToolsRenderer message={message} />
      <CitationsRenderer message={message} />
    </div>
  );
}
