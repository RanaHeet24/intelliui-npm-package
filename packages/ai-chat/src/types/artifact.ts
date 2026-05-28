export type ArtifactType =
  | "code"
  | "table"
  | "chart"
  | "markdown"
  | "html";

export interface AIArtifact {
  id: string;
  type: ArtifactType;
  title?: string;
  content: string;
}
