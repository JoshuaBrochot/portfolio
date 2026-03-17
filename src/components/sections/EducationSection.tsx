"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION } from "@/data/portfolio";

export function EducationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(EDUCATION.map(() => false));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setProgress(1);
      setVisibleItems(EDUCATION.map(() => true));
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollableDistance = containerHeight - windowHeight;

      if (scrollableDistance <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }

      const currentProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance));
      setProgress(currentProgress);

      // Reveal items based on progress (first at 0, last at 0.8)
      const newVisible = EDUCATION.map((_, index) => {
        const itemCount = EDUCATION.length;
        const threshold = itemCount === 1
          ? 0
          : 0 + (index / (itemCount - 1)) * 0.8;
        return currentProgress >= threshold;
      });
      setVisibleItems(newVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile view - simple vertical timeline
  if (isMobile) {
    return (
      <section
        id="formation"
        className="grid-background relative py-24"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <span
              className="font-mono text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Parcours
            </span>
            <h2
              className="mt-2 font-display text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Formation
            </h2>
          </div>

          <div className="relative pl-8">
            {/* Timeline line */}
            <div
              className="absolute bottom-0 left-3 top-0 w-px"
              style={{ backgroundColor: "var(--border)" }}
            />

            {EDUCATION.map((item, index) => (
              <div key={index} className="relative mb-8 last:mb-0">
                {/* Node */}
                <div
                  className="absolute -left-5 top-1 h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: item.current ? "var(--accent)" : "var(--bg-elevated)",
                    border: `2px solid ${item.current ? "var(--accent)" : "var(--border)"}`,
                    boxShadow: item.current ? "0 0 12px var(--accent-glow)" : "none",
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: `1px solid ${item.current ? "var(--accent-border)" : "var(--border)"}`,
                  }}
                >
                  <span
                    className="font-mono text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--accent)" }}
                  >
                    {item.period}
                  </span>
                  <h3
                    className="mt-2 font-display text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.degree}
                  </h3>
                  <p
                    className="mt-1 font-mono text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.school}
                  </p>
                  <p
                    className="mt-2 font-mono text-sm font-light"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop view - sticky timeline
  return (
    <section
      id="formation"
      className="grid-background-fixed relative"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div ref={containerRef} style={{ height: "300vh" }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto flex w-full max-w-7xl gap-12 px-6">
            {/* Left panel - fixed */}
            <div className="w-[30%]">
              <span
                className="font-mono text-xs font-medium uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                Parcours
              </span>
              <h2
                className="mt-2 font-display text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Formation
              </h2>

              {/* Progress bar */}
              <div
                className="mt-8 h-1 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    backgroundColor: "var(--accent)",
                    width: `${progress * 100}%`,
                  }}
                />
              </div>
              <p
                className="mt-2 font-mono text-xs"
                style={{ color: "var(--text-subtle)" }}
              >
                {Math.round(progress * 100)}% scrolled
              </p>
            </div>

            {/* Right panel - timeline */}
            <div className="relative flex-1 py-12">
              {/* SVG Timeline line */}
              <svg
                className="absolute left-8 top-0 h-full w-px"
                style={{ overflow: "visible" }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="var(--border)"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - progress * 1000}
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>

              {/* Timeline items */}
              <div className="relative space-y-16 pl-20">
                {EDUCATION.map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${index % 2 === 0 ? "slide-from-left" : "slide-from-right"} ${
                      visibleItems[index] ? "is-visible" : ""
                    }`}
                  >
                    {/* Node */}
                    <div
                      className="absolute -left-12 top-4 h-4 w-4 -translate-x-1/2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: item.current || visibleItems[index] ? "var(--accent)" : "var(--bg-elevated)",
                        border: `2px solid ${item.current || visibleItems[index] ? "var(--accent)" : "var(--border)"}`,
                        boxShadow: item.current ? "0 0 12px var(--accent-glow)" : "none",
                        opacity: visibleItems[index] ? 1 : 0.3,
                      }}
                    />

                    {/* Card */}
                    <div
                      className="rounded-xl p-6 transition-all duration-300"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        border: `1px solid ${item.current ? "var(--accent-border)" : "var(--border)"}`,
                        opacity: visibleItems[index] ? 1 : 0.3,
                      }}
                    >
                      <span
                        className="font-mono text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--accent)" }}
                      >
                        {item.period}
                      </span>
                      <h3
                        className="mt-2 font-display text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.degree}
                      </h3>
                      <p
                        className="mt-1 font-mono text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.school}
                      </p>
                      <p
                        className="mt-2 font-mono text-sm font-light"
                        style={{ color: "var(--text-subtle)" }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
