import { AIChat, AIProvider } from "@intelliui/ai-chat";

export default function Home() {
  return (
    <main>
      <AIProvider provider="gemini" persist>
        <AIChat />
      </AIProvider>
    </main>
  );
}
