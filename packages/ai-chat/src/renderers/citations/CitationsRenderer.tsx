import React from "react";
import type { ChatMessage } from "../../types";

export interface CitationsRendererProps {
  message: ChatMessage;
}

/**
 * Placeholder for future citations/sources renderer.
 * Keeps the architecture highly modular and extensible.
 */
export function CitationsRenderer({ message }: CitationsRendererProps) {
  // Citations parsing and rendering logic goes here in the future
  return null;
}
