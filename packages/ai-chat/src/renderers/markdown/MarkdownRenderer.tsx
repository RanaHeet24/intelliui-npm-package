import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../code/CodeBlock";

export interface MarkdownRendererProps {
  content: string;
}

/**
 * Isolated markdown engine utilizing remarkGfm.
 * Routes code blocks directly to our modular CodeBlock renderer.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 prose-headings:mb-2 prose-headings:mt-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <CodeBlock language={match[1]}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            }
            return (
              <code
                {...props}
                className="bg-zinc-200 dark:bg-zinc-700 rounded px-1.5 py-0.5 text-sm font-mono"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content || "..."}
      </ReactMarkdown>
    </div>
  );
}
