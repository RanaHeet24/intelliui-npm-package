import { useRef, useEffect, useCallback } from "react";

/**
 * Auto-scroll hook with smart detection.
 * Only scrolls if the user is near the bottom of the container.
 * Prevents annoying jumps when the user scrolls up to read history.
 */
export function useAutoScroll(deps: any[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // If user is within 120px of the bottom, keep auto-scrolling
    const threshold = 120;
    const { scrollTop, scrollHeight, clientHeight } = container;
    shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, deps);

  return { containerRef, endRef, handleScroll };
}
