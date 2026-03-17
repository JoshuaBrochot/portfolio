import { useEffect, useRef, useState, RefObject } from "react";

interface UseScrollRAFOptions {
  enabled?: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onUpdate?: (progress: number) => void;
}

/**
 * Optimized scroll progress calculation using RAF
 * Only triggers RAF when scrolling, prevents multiple RAF loops
 */
export function useScrollRAF({ enabled = true, containerRef, onUpdate }: UseScrollRAFOptions) {
  const [progress, setProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const updateProgress = () => {
      if (!containerRef.current || !isScrollingRef.current) {
        rafIdRef.current = null;
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollableDistance = containerHeight - windowHeight;

      if (scrollableDistance <= 0) {
        const newProgress = rect.top <= 0 ? 1 : 0;
        setProgress(newProgress);
        onUpdate?.(newProgress);
        rafIdRef.current = null;
        return;
      }

      const currentProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      setProgress(currentProgress);
      onUpdate?.(currentProgress);

      // Continue RAF loop while scrolling
      rafIdRef.current = requestAnimationFrame(updateProgress);
    };

    const handleScroll = () => {
      // Mark as scrolling
      isScrollingRef.current = true;

      // Clear existing timeout
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // Start RAF loop only if not already running
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateProgress);
      }

      // Stop RAF loop 150ms after last scroll event
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, containerRef, onUpdate]);

  return progress;
}
