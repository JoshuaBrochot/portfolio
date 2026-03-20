"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EDUCATION } from "@/data/portfolio";
import { useScrollRAF } from "@/hooks/useScrollRAF";

export function EducationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(EDUCATION.map(() => false));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle visibility based on progress
  const handleProgressUpdate = useCallback((currentProgress: number) => {
    const newVisible = EDUCATION.map((_, index) => {
      const itemCount = EDUCATION.length;
      const threshold = itemCount === 1
        ? 0.05
        : 0.05 + (index / (itemCount - 1)) * 0.25;
      return currentProgress >= threshold;
    });
    setVisibleItems(newVisible);
  }, []);

  // Use RAF hook for optimized scroll calculations
  const progress = useScrollRAF({
    enabled: !isMobile,
    containerRef,
    onUpdate: handleProgressUpdate,
  });

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

          <div className="relative">
            {/* Timeline line */}

            {EDUCATION.map((item, index) => (
              <div key={index} className="relative mb-8 last:mb-0">

                {/* Card */}
                <div
                  className="timeline-cards rounded-xl p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: `1px solid ${item.current ? "var(--accent-border)" : "var(--border)"}`,
                  }}
                >
                  {/* Period and status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="font-mono text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--accent)" }}
                    >
                      {item.period}
                    </span>
                    {item.current && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                        style={{
                          backgroundColor: "var(--accent-ghost)",
                          color: "var(--accent)",
                        }}
                      >
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                        en cours
                      </span>
                    )}
                  </div>
                  
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
      <div ref={containerRef} style={{ height: "180vh" }}>
        <div
          className="sticky top-0 flex h-screen items-center"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
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
                  style={{ willChange: "stroke-dashoffset" }}
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
                        willChange: "opacity, background-color, border-color",
                      }}
                    />

                    {/* Card */}
                    <div
                      className="timeline-cards rounded-xl p-6 transition-all duration-300"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        border: `1px solid ${item.current ? "var(--accent-border)" : "var(--border)"}`,
                        opacity: visibleItems[index] ? 1 : 0.3,
                        willChange: "opacity",
                      }}
                    >
                      {/* Period and status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="font-mono text-xs font-medium uppercase tracking-wider"
                          style={{ color: "var(--accent)" }}
                        >
                          {item.period}
                        </span>
                        {item.current && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                            style={{
                              backgroundColor: "var(--accent-ghost)",
                              color: "var(--accent)",
                            }}
                          >
                            <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                            en cours
                          </span>
                        )}
                      </div>
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
