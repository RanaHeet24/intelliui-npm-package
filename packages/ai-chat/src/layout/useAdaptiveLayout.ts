import { useContext } from "react";
import { AIChatLayoutContext } from "./AIChatLayoutProvider";
import { LayoutState } from "./layout.types";

export function useAdaptiveLayout(): LayoutState {
  const context = useContext(AIChatLayoutContext);
  if (!context) {
    // Graceful fallback for custom outer rendering trees
    return {
      mode: "workspace",
      width: 1024,
      height: 768,
      sidebarCollapsed: false,
      setSidebarCollapsed: () => {},
      adaptive: false
    };
  }
  return context;
}
