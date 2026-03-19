"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(true);

  useEffect(() => {
    // Check if device has coarse pointer (touch device)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setIsCoarsePointer(isCoarse);

    if (isCoarse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Cursor follows exactly without delay
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [data-cursor-clickable], input, textarea, select'
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (isCoarsePointer) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[99999] flex items-center justify-center"
      style={{
        width: isHovering ? "48px" : "32px",
        height: isHovering ? "48px" : "32px",
        marginLeft: isHovering ? "-24px" : "-16px",
        marginTop: isHovering ? "-24px" : "-16px",
        border: "2px solid rgba(121, 144, 255, 0.4)",
        borderRadius: "50%",
        backgroundColor: isHovering ? "var(--accent-ghost)" : "transparent",
        opacity: isVisible ? 1 : 0,
        transition:
          "width 0.2s ease, height 0.2s ease, margin 0.2s ease, background-color 0.2s ease, opacity 0.2s ease",
      }}
    >
      {cursorLabel && (
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          {cursorLabel}
        </span>
      )}
    </div>
  );
}
