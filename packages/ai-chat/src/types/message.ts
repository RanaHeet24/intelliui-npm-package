import { AICitation } from "./citation";
import { AIToolCall } from "./tool";
import { AIArtifact } from "./artifact";
import { AIFileAttachment } from "./file";

export type MessageRole = "user" | "assistant" | "system" | "tool" | "data";

export type MessageStatus = "idle" | "streaming" | "error" | "done";

/**
 * Core interface for AI messages, designed to be scalable for future features.
 */
export interface AIMessageType {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: Date | number | string;
  status?: MessageStatus;
  
  // Future extensibility fields
  reasoning?: string;
  citations?: AICitation[];
  tools?: AIToolCall[];
  files?: AIFileAttachment[];
  artifacts?: AIArtifact[];
  
  // Additional meta fields for future-proofing
  meta?: Record<string, any>;
  metadata?: Record<string, unknown>;
  custom?: Record<string, unknown>;
}
