import { useEffect, useRef, useState } from "react";

interface UseScrollProgressOptions {
  offset?: number; // Additional offset from top (e.g., navbar height)
}

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollProgressOptions = {}
) {
  const { offset = 0 } = options;
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top - offset;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress based on how much of the section has been scrolled through
      // Progress is 0 when section top enters viewport
      // Progress is 1 when section bottom leaves viewport
      const scrollableDistance = elementHeight - windowHeight;

      if (scrollableDistance <= 0) {
        // Section is smaller than viewport
        setProgress(elementTop <= 0 ? 1 : 0);
        return;
      }

      // When elementTop is 0, we're at the start of the section
      // When elementTop is -scrollableDistance, we're at the end
      const currentProgress = Math.min(
        1,
        Math.max(0, -elementTop / scrollableDistance)
      );

      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return { ref, progress };
}
