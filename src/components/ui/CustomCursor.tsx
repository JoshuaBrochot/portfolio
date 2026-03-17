"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(true);

  useEffect(() => {
    // Check if device has coarse pointer (touch device)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setIsCoarsePointer(isCoarse);

    if (isCoarse) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mouse = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    const lerpSpeed = prefersReducedMotion ? 1 : 0.14;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Dot follows exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [data-cursor], input, textarea, select'
      );

      if (interactive) {
        setIsHovering(true);
        const label = interactive.getAttribute("data-cursor-label");
        setCursorLabel(label);
      } else {
        setIsHovering(false);
        setCursorLabel(null);
      }
    };

    // Animation loop for ring with lerp
    let animationId: number;
    const animate = () => {
      ring.x += (mouse.x - ring.x) * lerpSpeed;
      ring.y += (mouse.y - ring.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (isCoarsePointer) return null;

  return (
    <>
      {/* Dot - follows exactly */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[2.5px] -mt-[2.5px]"
        style={{
          width: "5px",
          height: "5px",
          backgroundColor: "var(--accent)",
          borderRadius: "50%",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Ring - follows with lag */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center"
        style={{
          width: isHovering ? "48px" : "32px",
          height: isHovering ? "48px" : "32px",
          marginLeft: isHovering ? "-24px" : "-16px",
          marginTop: isHovering ? "-24px" : "-16px",
          border: "1px solid rgba(121, 144, 255, 0.4)",
          borderRadius: "50%",
          backgroundColor: isHovering ? "var(--accent-ghost)" : "transparent",
          opacity: isVisible ? 1 : 0,
          transition:
            "width 0.2s ease, height 0.2s ease, margin 0.2s ease, background-color 0.2s ease, opacity 0.2s ease",
        }}
      >
        {cursorLabel && (
          <span
            ref={labelRef}
            className="font-mono text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--accent)" }}
          >
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}
