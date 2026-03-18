"use client";

import { useEffect, useRef, useState } from "react";
import { Dribbble, Gamepad2, Cpu, type LucideIcon } from "lucide-react";
import { INTERESTS } from "@/data/portfolio";

const ICON_MAP: Record<string, LucideIcon> = {
  dribbble: Dribbble,
  "gamepad-2": Gamepad2,
  cpu: Cpu,
};

export function InterestsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [columnOffsets, setColumnOffsets] = useState([0, 0, 0]);
  const [isMobile, setIsMobile] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isMobile) return;

    const updateParallax = () => {
      if (!sectionRef.current || !isScrollingRef.current) {
        rafIdRef.current = null;
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress through section
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

      // Different parallax speeds for each column
      const offset1 = progress * 0;
      const offset2 = progress * -60;
      const offset3 = progress * 40;

      setColumnOffsets([offset1, offset2, offset3]);

      // Continue RAF loop while scrolling
      rafIdRef.current = requestAnimationFrame(updateParallax);
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
        rafIdRef.current = requestAnimationFrame(updateParallax);
      }

      // Stop RAF loop 150ms after last scroll event
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="grid-background relative py-24"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <span
            className="font-mono text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            À propos
          </span>
          <h2
            className="mt-2 font-display text-3xl font-bold md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Centres d&apos;intérêt
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {INTERESTS.map((interest, index) => {
            const Icon = ICON_MAP[interest.icon];

            return (
              <div
                key={interest.label}
                style={{
                  transform: isMobile ? "translateZ(0)" : `translateY(${columnOffsets[index]}px) translateZ(0)`,
                  willChange: isMobile ? "auto" : "transform",
                }}
              >
                <div
                  className="interest-card relative h-56 overflow-hidden rounded-xl md:h-56"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  {/* Desktop: Contenu principal (icône + titre) */}
                  <div className="relative z-10 hidden flex-col items-center justify-center p-6 md:flex h-full">
                    {Icon && (
                      <Icon
                        size={32}
                        color="var(--accent)"
                        className="interest-icon mb-4"
                      />
                    )}
                    <h3
                      className="font-display text-lg font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {interest.label}
                    </h3>
                  </div>

                  {/* Desktop: Description — apparaît au hover */}
                  <div className="interest-textbox absolute inset-0 z-20 hidden items-center justify-center p-6 md:flex">
                    <p
                      className="text-center font-mono text-[18px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {interest.desc}
                    </p>
                  </div>

                  {/* Mobile: Contenu complet (icône + titre + description) */}
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-6 md:hidden">
                    {Icon && (
                      <Icon
                        size={32}
                        color="var(--accent)"
                        className="interest-icon"
                      />
                    )}
                    <h3
                      className="font-display text-lg font-bold text-center"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {interest.label}
                    </h3>
                    <p
                      className="text-center font-mono text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {interest.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
