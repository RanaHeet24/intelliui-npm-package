import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Import and register only common developer languages to dramatically shrink bundle size
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("ts", ts);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", html);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("shell", bash);

export interface CodeBlockProps {
  language: string;
  children: string;
}

/**
 * Highly reusable code block renderer with syntax highlighting.
 * Handles diverse programming languages and is completely dark mode compliant out-of-the-box.
 */
export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="relative group my-2 border border-zinc-200/50 dark:border-zinc-800/50 rounded-md overflow-hidden">
      {/* Code Header / Language Badge */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-200/60 dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/50 text-xs font-mono text-zinc-600 dark:text-zinc-400 select-none">
        <span>{language || "code"}</span>
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        className="!my-0 !p-4 font-mono text-sm leading-relaxed"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
