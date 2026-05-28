export type ToolStatus =
  | "pending"
  | "running"
  | "completed"
  | "error";

export interface AIToolCall {
  id: string;
  name: string;
  status: ToolStatus;
  description?: string;
}
