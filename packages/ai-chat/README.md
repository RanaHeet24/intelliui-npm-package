# IntelliUI AI Chat

AI-native React chat runtime and orchestration system for building modern AI applications.

IntelliUI provides composable AI interaction primitives, streaming orchestration, extensible rendering systems, and customizable AI-native UX foundations for React applications.

---

# Features

* AI-native chat architecture
* Streaming responses
* Markdown rendering
* Syntax highlighted code blocks
* AI reasoning renderer
* Artifact rendering
* File attachment support
* Extensible renderer system
* Component override system
* Headless runtime hooks
* Backend agnostic architecture
* Modern AI workspace UI
* TypeScript support
* Custom adapters
* Slot-based customization
* Local persistence
* Modern AI UX orchestration

---

# Installation

```bash
npm install intelliui-ai-chat
```

or

```bash
pnpm add intelliui-ai-chat
```

---

# Quick Start (Next.js)

## 1. Install Dependencies

```bash
npm install intelliui-ai-chat @google/generative-ai
```

---

## 2. Create Environment Variable

Create:

```bash
.env.local
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
```

IMPORTANT:

Never expose API keys in frontend React components.

API keys should always remain server-side.

---

## 3. Create API Route

Create:

```bash
app/api/chat/route.ts
```

Add:

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userMessage = body.message;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(
      userMessage
    );

    const response = result.response.text();

    return Response.json({
      role: "assistant",
      content: response,
      status: "done",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
```

---

## 4. Use IntelliUI

```tsx
"use client";

import { AIChat } from "intelliui-ai-chat";

export default function Page() {
  return (
    <div className="h-screen">
      <AIChat api="/api/chat" />
    </div>
  );
}
```

---

# Quick Start (Node.js + Express)

## 1. Install Dependencies

```bash
npm install express cors dotenv @google/generative-ai
```

---

## 2. Create Environment Variable

Create:

```bash
.env
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 3. Create Server

Create:

```bash
server.js
```

Add:

```js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(
      message
    );

    const response = result.response.text();

    res.json({
      role: "assistant",
      content: response,
      status: "done",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
```

---

## 4. Run Server

```bash
node server.js
```

---

## 5. Connect IntelliUI Frontend

```tsx
"use client";

import { AIChat } from "intelliui-ai-chat";

export default function Page() {
  return (
    <div className="h-screen">
      <AIChat api="http://localhost:3001/api/chat" />
    </div>
  );
}
```

---

# Core Components

## AIChat

Main orchestration component responsible for:

* runtime state
* streaming
* rendering pipeline
* orchestration flow
* AI-native interaction UX

```tsx
<AIChat api="/api/chat" />
```

---

## AIMessage

Composable AI message renderer.

Supports:

* reasoning
* artifacts
* tools
* markdown
* future renderers

```tsx
<AIMessage message={message} />
```

---

## AIReasoning

Lightweight reasoning/thinking renderer.

```tsx
<AIReasoning reasoning="Analyzing prompt..." />
```

---

## AIArtifacts

Render generated AI artifacts such as:

* code
* markdown
* tables
* future interactive outputs

```tsx
<AIArtifacts artifacts={artifacts} />
```

---

## useChat

Headless runtime hook for fully custom AI interfaces.

```tsx
const chat = useChat();
```

---

# Backend Architecture

IntelliUI is backend agnostic.

Frontend handles:

* rendering
* orchestration
* streaming UX
* runtime state

Backend handles:

* API keys
* providers
* business logic
* tools
* orchestration
* databases

Recommended architecture:

```txt
Frontend (IntelliUI)
↓
Backend Route / API
↓
Provider / AI Runtime
```

---

# Extensibility

IntelliUI is designed to be fully customizable.

---

## Component Overrides

Replace internal components while preserving runtime.

```tsx
<AIChat
  components={{
    Message: CustomMessage,
    Input: CustomInput,
  }}
/>
```

---

## Custom Renderers

Inject custom rendering behavior.

```tsx
<AIChat
  renderers={{
    reasoning: MyReasoningRenderer,
  }}
/>
```

---

## Headless Usage

Build fully custom AI workspaces.

```tsx
const chat = useChat();
```

---

## Adapter System

Connect custom backends.

```tsx
<AIProvider adapter={customAdapter} />
```

Example:

```ts
const customAdapter = {
  async sendMessage(payload) {
    return fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
```

---

## Slots

Customize workspace layout.

```tsx
<AIChat
  slots={{
    sidebar: MySidebar,
  }}
/>
```
# Adaptive Embeddable Runtime

IntelliUI now supports adaptive embeddable AI runtime architecture.

AIChat can automatically adapt inside:

* drawers
* widgets
* dashboards
* sidebars
* modals
* split layouts
* ecommerce assistants
* SaaS copilots
* mobile views

without requiring manual layout fixes.

---

## Adaptive Layout Modes

IntelliUI supports multiple adaptive runtime modes:

* workspace
* compact
* drawer
* widget
* mobile

Modes can automatically switch based on container size using ResizeObserver-powered layout orchestration.

You can also manually override runtime behavior:

```tsx
<AIChat mode="drawer" />
```

```tsx
<AIChat adaptive={false} mode="workspace" />
```

---

## Container-Aware Runtime

Unlike traditional fullscreen chat UIs, IntelliUI is designed to become fully embeddable AI infrastructure.

The runtime automatically adapts:

* sidebar visibility
* prompt input density
* message spacing
* renderer visibility
* compact layouts
* responsive interactions

based on available container constraints.

---

## Drawer Integration Example

```tsx
import { AIChat } from "intelliui-ai-chat";

export default function AIDrawer() {
  return (
    <div className="drawer">
      <AIChat mode="drawer" />
    </div>
  );
}
```

---

## Adaptive Orchestration

The runtime intelligently adjusts:

* AIReasoning
* AICitations
* AIArtifacts
* AIToolRenderer
* PromptInput
* AIConversationSidebar

depending on active layout mode.

Example:

* workspace → full orchestration
* drawer → compact orchestration
* widget → minimal rendering
* mobile → simplified runtime

---

## Extensible Runtime Architecture

Adaptive behavior works together with:

* custom slots
* renderer overrides
* custom layouts
* headless usage
* custom message components
* external adapters

without breaking runtime orchestration.

Example:

```tsx
<AIChat
  components={{
    Message: CustomMessage,
  }}
  slots={{
    header: CustomHeader,
  }}
/>
```

---

## Embeddable AI Infrastructure

IntelliUI is designed for modern AI-native products:

* ecommerce AI assistants
* AI dashboards
* SaaS copilots
* workspace agents
* customer support panels
* floating assistants
* embedded AI systems

The package no longer assumes fullscreen ownership and now behaves as adaptive AI infrastructure.

---

# Architecture

IntelliUI internally follows:

```txt
Prompt
↓
Runtime
↓
Structured Message
↓
AIMessage
↓
Renderers
```

Rendering pipeline:

```txt
AIMessage
 ├── AIReasoning
 ├── AIContent
 ├── AIArtifacts
 ├── AIToolRenderer
 └── AIMessageActions
```

---

# Examples

Planned examples:

* Next.js Starter
* Express Backend
* Headless Chat
* Custom Renderers
* Custom Sidebar
* Adapter Examples

---

# Roadmap

Planned future systems:

* AI workflows
* MCP tools
* Agent orchestration
* RAG systems
* Multimodal rendering
* AI workspaces
* Streaming artifacts
* AI memory systems

---

# Philosophy

IntelliUI is not designed to be a locked chat component.

The goal is to provide extensible AI-native interaction infrastructure that developers can customize, extend, and build upon.

---

# Documentation

Docs:
https://intelliui.vercel.app

---

# License

MIT
