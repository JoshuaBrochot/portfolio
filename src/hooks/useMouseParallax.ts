import { useEffect, useState } from "react";

interface MouseParallax {
  x: number;
  y: number;
}

interface UseMouseParallaxOptions {
  strength?: number;
  smoothing?: number;
}

export function useMouseParallax(
  options: UseMouseParallaxOptions = {}
): MouseParallax {
  const { strength = 1, smoothing = 0.1 } = options;
  const [position, setPosition] = useState<MouseParallax>({ x: 0, y: 0 });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Check for coarse pointer (touch device)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      return;
    }

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      target.x = ((e.clientX - centerX) / centerX) * strength;
      target.y = ((e.clientY - centerY) / centerY) * strength;
    };

    const animate = () => {
      // Lerp towards target
      current.x += (target.x - current.x) * smoothing;
      current.y += (target.y - current.y) * smoothing;

      setPosition({ x: current.x, y: current.y });
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [strength, smoothing]);

  return position;
}
