# intelliui-ai-chat

AI-native React chat infrastructure for modern AI applications.

Built for developers who want production-style AI interactions without rebuilding streaming, markdown rendering, syntax highlighting, orchestration, and conversational UX from scratch.

---

## Overview

`intelliui-ai-chat` is the first package in the IntelliUI ecosystem — a growing collection of AI-native React primitives focused on conversational interfaces and AI application UX.

Unlike traditional React UI libraries that focus on generic web interfaces, IntelliUI is designed specifically for AI interaction systems.

---

# Features

* Real-time token streaming
* Markdown + GFM rendering
* Syntax-highlighted code blocks
* AI-native message orchestration
* Provider-ready architecture
* Smart auto-scroll behavior
* Loading and thinking states
* Reusable renderer system
* Portable styles distribution
* TypeScript support
* ESM + CommonJS exports
* Secure server-side integration support

---

## Installation

```bash
npm install intelliui-ai-chat
```

```bash
pnpm add intelliui-ai-chat
```

```bash
yarn add intelliui-ai-chat
```

### 2. Wrap App with config (Optional) or directly configure the Prop

# Quick Start

## 1. Import the component

```tsx
import { AIChat, AIProvider } from "intelliui-ai-chat"
import "intelliui-ai-chat/styles.css"
```

---

## 2. Configure the provider

```tsx
export default function App() {
  return (
    <AIProvider
      provider="gemini"
      apiEndpoint="/api/chat"
      persist
    >
      <AIChat />
    </AIProvider>
  )
}
```

### 3. Setup a Secure Server Route

## 3. Create a secure server route

Example Next.js route:

```ts
import { NextResponse } from "next/server"
import { streamGeminiResponse } from "intelliui-ai-chat/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      )
    }

    const stream = await streamGeminiResponse(messages, apiKey)

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
```

---

# Example

```tsx
import { AIChat, AIProvider } from "intelliui-ai-chat"
import "intelliui-ai-chat/styles.css"

export default function App() {
  return (
    <AIProvider
      provider="gemini"
      apiEndpoint="/api/chat"
      persist
    >
      <AIChat />
    </AIProvider>
  )
}
```

---

# Advanced Usage

You can compose lower-level primitives directly for custom AI experiences.

```tsx
import {
  useChat,
  PromptInput,
  MessageRenderer
} from "intelliui-ai-chat"

export function CustomChat() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading
  } = useChat({
    provider: "gemini",
    persist: true
  })

  return (
    <div className="custom-chat">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageRenderer message={message} />
          </div>
        ))}
      </div>

      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}
```

---

# Architecture

The package uses a dual-entry architecture:

## Client Entry

```ts
intelliui-ai-chat
```

Contains:

* UI components
* hooks
* renderers
* orchestration
* styles

---

## Server Entry

```ts
intelliui-ai-chat/server
```

Contains:

* secure provider communication
* streaming helpers
* backend utilities

This separation keeps API keys securely on the server.

---

# Current Focus

The IntelliUI ecosystem is currently focused on:

* AI chat interfaces
* streaming UX
* AI renderer systems
* provider abstractions
* conversational frontend primitives

---

# Planned Ecosystem

Future packages and primitives may include:

* AIInput
* AIMessage
* AICodeBlock
* AIReasoning
* AICitations
* AIFileUpload
* AISearchAssistant
* Tool rendering systems
* Multi-provider orchestration

---

# Tech Stack

* React
* TypeScript
* Turborepo
* pnpm
* tsup
* react-markdown
* react-syntax-highlighter

---

# License

MIT
