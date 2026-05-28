import React from "react";
import { MarkdownRenderer } from "../renderers/markdown/MarkdownRenderer";

export interface AIContentProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

/**
 * Reusable primitive specifically responsible for rendering AI text content.
 * Abstracts markdown and code-block parsing away from AIMessage.
 */
export const AIContent: React.FC<AIContentProps> = ({ content, className = "", isStreaming = false }) => {
  if (!content) return null;

  return (
    <div className={`ai-content ${className}`}>
      <MarkdownRenderer content={content} isStreaming={isStreaming} />
    </div>
  );
};
