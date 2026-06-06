import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../code/CodeBlock";

export interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Isolated markdown engine utilizing remarkGfm.
 * Complete custom typographic mapper providing breathtaking modern readability,
 * complete with a dynamic neon VFX streaming cursor indicator.
 */
export function MarkdownRenderer({ content, isStreaming = false }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 select-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 text-[14.5px] leading-[1.68] text-zinc-755 dark:text-zinc-300 font-normal">
              {children}
            </p>
          ),
          h1: ({ children }) => <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-7 mb-3 tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2.5 tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-5 mb-2 tracking-tight">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-4.5 space-y-2 text-zinc-755 dark:text-zinc-300 text-[14.5px]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-4.5 space-y-2 text-zinc-755 dark:text-zinc-300 text-[14.5px]">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
          blockquote: ({ children }) => <blockquote className="border-l-3 border-zinc-300 dark:border-zinc-700 pl-4 py-2 italic text-zinc-500 my-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-r-lg">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-450 hover:underline font-semibold transition-colors">{children}</a>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-5.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-3xs">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-50/70 dark:bg-zinc-900/40 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200/50 dark:border-zinc-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 bg-white dark:bg-zinc-950/40">{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3.5 text-left font-bold">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3.5 text-zinc-650 dark:text-zinc-300 font-medium">{children}</td>,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <div className="my-4.5">
                  <CodeBlock language={match[1]}>
                    {String(children).replace(/\n$/, "")}
                  </CodeBlock>
                </div>
              );
            }
            return (
              <code
                {...props}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-md px-1.5 py-0.5 text-xs font-mono text-zinc-800 dark:text-zinc-200"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && <span className="vfx-stream-indicator" />}
    </div>
  );
}
