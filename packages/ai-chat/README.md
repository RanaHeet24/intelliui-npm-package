# IntelliUI

Adaptive AI Chat Runtime for React.

Write your AI provider logic once on the server.

Drop `<AIChat />` anywhere in your React application.

```jsx
import { AIChat } from 'intelliui-ai-chat';
import 'intelliui-ai-chat/styles.css';

function App() {
  return <AIChat api="/api/chat" />;
}
```

By decoupling the frontend interface from the backend LLM orchestrator, IntelliUI removes all the typical complexity associated with building AI interfaces:

* **No frontend streaming logic:** Handles server-sent events, response chunking, and streaming text updates automatically.
* **No chat state management:** Maintains message history, typing indicators, thinking indicators, and error states internally.
* **No message orchestration:** Standardizes payload delivery and handles conversational turns transparently.
* **No AI UI plumbing:** No need to build auto-scrolling containers, custom markdown parsers, or code block syntax highlight configurations from scratch.

---

## Integrates Anywhere

The same `AIChat` component can be embedded inside:

* Ecommerce stores
* SaaS products
* Admin panels
* Sidebars
* Drawers
* Widgets
* Internal tools

intelliui/packages/ai-chat/image.png

The example above uses the exact same component:

```jsx
<AIChat api="/api/chat" />
```

---

## Workspace Mode

IntelliUI can also run as a full AI workspace.

intelliui/packages/ai-chat/image-1.png

Adaptive Modes:

* Workspace
* Drawer
* Widget
* Compact
* Mobile

---

## Features

* **Adaptive Runtime:** Adapts its interface dynamically depending on the layout mode (Drawer, Widget, Workspace, Compact, Mobile).
* **Workspace Mode:** Render a full-featured standalone AI chat workspace interface.
* **Drawer Mode:** Slide out a clean sidebar overlay for contextual AI assistance.
* **Widget Mode:** Embed a floating helper bubble or minimal chat window.
* **Mobile Mode:** Fully responsive UI layout optimized for touch targets.
* **Streaming Responses:** Seamlessly consumes chunked text streams and updates the UI in real-time.
* **Component Overrides:** Override individual layout parts to control style and layout behavior.
* **Slots:** Inject custom headers, input sections, or action drawers via defined React slot APIs.
* **Custom Renderers:** Swap out default text/code blocks with customized renderers.
* **Headless Hooks:** Don't want our UI? Build your own styling with the core state-machine hooks (`useChat`).
* **Backend Agnostic:** Works with any backend endpoint (Next.js, Node/Express, FastAPI, Python, Nest.js, etc.) that outputs plain text streams.
* **TypeScript Support:** Written in TypeScript with full type-safety for all components and configurations.

---

## Feature Comparison

| Feature             | IntelliUI | Basic Chat UI |
| ------------------- | --------- | ------------- |
| Adaptive Runtime    | ✅         | ❌             |
| Drawer Mode         | ✅         | ❌             |
| Widget Mode         | ✅         | ❌             |
| Sidebar Mode        | ✅         | ❌             |
| Component Overrides | ✅         | ❌             |
| Headless Hooks      | ✅         | ❌             |
| Backend Agnostic    | ✅         | ❌             |

---

## Use Cases

* **Ecommerce Assistants:** Product recommendations, item searches, and customer shopping drawer assistance.
* **SaaS Assistants:** Contextual help bars, billing queries, and dashboard sidebars.
* **Customer Support:** Auto-reply panels and troubleshooting chats embedded in user account consoles.
* **Internal Tools:** Developer dashboards, prompt playgrounds, and quick analytics chats.
* **Embedded Widgets:** Minimal floating chat bubbles in marketing landing pages.
* **Sidebar Assistants:** Collapsible panels nested inside existing application layouts.
* **Workspace Interfaces:** Rich standalone chat workspaces designed for heavy document querying or analysis.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install intelliui-ai-chat
# or
pnpm add intelliui-ai-chat
# or
yarn add intelliui-ai-chat
```

### 2. Wrap App with config (Optional) or directly configure the Prop

You can either pass settings through `AIProvider` or pass props directly to `<AIChat />`.

```tsx
import { AIChat, AIProvider } from "intelliui-ai-chat";
import "intelliui-ai-chat/styles.css";

export default function App() {
  return (
    <AIProvider provider="gemini" apiEndpoint="/api/chat" persist>
      <AIChat />
    </AIProvider>
  );
}
```

### 3. Setup a Secure Server Route

Create a backend route on your server (e.g., Next.js App Router) to call the Gemini, OpenAI, or Claude API securely.

```ts
import { NextResponse } from 'next/server';
import { streamGeminiResponse } from 'intelliui-ai-chat/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const stream = await streamGeminiResponse(messages, apiKey);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## Architecture

The package splits the code into client and server entry points to keep dependencies decoupled and prevent server-side LLM dependencies (like API keys and provider client SDKs) from bloating the React client bundle.

### Client Entry (`intelliui-ai-chat`)
* React Primitives (`AIChat`, `PromptInput`)
* React State Machine Hook (`useChat`)
* Style Utilities and Layout Classes

### Server Entry (`intelliui-ai-chat/server`)
* Stream processing utilities
* LLM provider stream wrapper (`streamGeminiResponse`)

---

## License

MIT
