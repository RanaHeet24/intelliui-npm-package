export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: Date;
};

export * from "./message";
export * from "./citation";
export * from "./tool";
export * from "./artifact";
export * from "./file";

