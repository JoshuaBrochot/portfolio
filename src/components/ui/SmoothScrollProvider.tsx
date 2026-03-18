"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { CustomCursor } from "./CustomCursor";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Exponential easing function
    const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    const lenis = new Lenis({
      duration: 1.2,
      easing,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as unknown as { lenis: Lenis | null }).lenis = lenis;

    // Separate RAF for Lenis only - no other calculations here
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
      (window as unknown as { lenis: Lenis | null }).lenis = null;
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
