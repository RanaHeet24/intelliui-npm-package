import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { AdaptiveMode, AIChatModeProp, LayoutState } from "./layout.types";

export const AIChatLayoutContext = createContext<LayoutState | undefined>(undefined);

export interface AIChatLayoutProviderProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  mode?: AIChatModeProp;
  adaptive?: boolean;
}

export const AIChatLayoutProvider: React.FC<AIChatLayoutProviderProps> = ({
  children,
  containerRef,
  mode = "auto",
  adaptive = true
}) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Measure and update container size
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !adaptive) return;

    // Initial check
    const rect = element.getBoundingClientRect();
    setDimensions({
      width: rect.width || 800,
      height: rect.height || 600
    });

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      
      // Support borderBoxSize if present, fall back to contentRect
      let width = 0;
      let height = 0;
      
      if (entry.borderBoxSize && entry.borderBoxSize[0]) {
        width = entry.borderBoxSize[0].inlineSize;
        height = entry.borderBoxSize[0].blockSize;
      } else {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }

      setDimensions({
        width: width || 800,
        height: height || 600
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, adaptive]);

  // Compute layout mode
  let calculatedMode: AdaptiveMode = "workspace";

  if (!adaptive) {
    calculatedMode = mode === "auto" ? "workspace" : mode;
  } else if (mode && mode !== "auto") {
    calculatedMode = mode;
  } else {
    // Container-aware auto detection thresholds
    const w = dimensions.width;
    if (w >= 768) {
      calculatedMode = "workspace";
    } else if (w >= 600) {
      calculatedMode = "compact";
    } else if (w >= 450) {
      calculatedMode = "drawer";
    } else if (w >= 320) {
      calculatedMode = "widget";
    } else {
      calculatedMode = "mobile";
    }
  }

  // Synchronize sidebar defaults on mode shifts (compact layout sidebar starts collapsed)
  const previousModeRef = useRef<AdaptiveMode>(calculatedMode);
  useEffect(() => {
    if (previousModeRef.current !== calculatedMode) {
      if (calculatedMode !== "workspace") {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
      previousModeRef.current = calculatedMode;
    }
  }, [calculatedMode]);

  return (
    <AIChatLayoutContext.Provider
      value={{
        mode: calculatedMode,
        width: dimensions.width,
        height: dimensions.height,
        sidebarCollapsed,
        setSidebarCollapsed,
        adaptive
      }}
    >
      {children}
    </AIChatLayoutContext.Provider>
  );
};
