export type AdaptiveMode = "workspace" | "compact" | "drawer" | "widget" | "mobile";

export type AIChatModeProp = "auto" | AdaptiveMode;

export interface LayoutState {
  mode: AdaptiveMode;
  width: number;
  height: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  adaptive: boolean;
}
