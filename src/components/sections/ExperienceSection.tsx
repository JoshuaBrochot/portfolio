"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { EXPERIENCES } from "@/data/portfolio";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(EXPERIENCES.map(() => false));

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
      setVisibleItems(EXPERIENCES.map(() => true));
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
      const newVisible = EXPERIENCES.map((_, index) => {
        const itemCount = EXPERIENCES.length;
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

  // Mobile view
  if (isMobile) {
    return (
      <section
        id="experiences"
        className="grid-background relative py-24"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <span
              className="font-mono text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Parcours professionnel
            </span>
            <h2
              className="mt-2 font-display text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Expériences
            </h2>
          </div>

          <div className="relative pl-8">
            {/* Timeline line */}
            <div
              className="absolute bottom-0 left-3 top-0 w-px"
              style={{ backgroundColor: "var(--border)" }}
            />

            {EXPERIENCES.map((exp, index) => (
              <div key={index} className="relative mb-8 last:mb-0">
                {/* Node */}
                <div
                  className="absolute -left-5 top-1 h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: exp.current ? "var(--accent)" : "var(--bg-elevated)",
                    border: `2px solid ${exp.current ? "var(--accent)" : "var(--border)"}`,
                    boxShadow: exp.current ? "0 0 12px var(--accent-glow)" : "none",
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: `1px solid ${exp.current ? "var(--accent-border)" : "var(--border)"}`,
                  }}
                >
                  {/* Period and status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="font-mono text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--accent)" }}
                    >
                      {exp.period}
                    </span>
                    {exp.current && (
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

                  {/* Company */}
                  <h3
                    className="mt-2 font-display text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {exp.company}
                  </h3>

                  {/* Location */}
                  <div className="mt-1 flex items-center gap-1">
                    <MapPin size={12} style={{ color: "var(--text-subtle)" }} />
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      {exp.location}
                    </span>
                  </div>

                  {/* Role */}
                  <p
                    className="mt-2 font-mono text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.role}
                  </p>

                  {/* Missions */}
                  <ul className="mt-4 space-y-2">
                    {exp.missions.map((mission, mIndex) => (
                      <li
                        key={mIndex}
                        className="flex items-start gap-2 font-mono text-sm font-light"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span style={{ color: "var(--accent)" }}>→</span>
                        {mission}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          backgroundColor: "var(--accent-ghost)",
                          color: "var(--accent)",
                          border: "0.5px solid var(--accent-border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
      id="experiences"
      className="grid-background-fixed relative"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div ref={containerRef} style={{ height: "400vh" }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto flex w-full max-w-7xl gap-12 px-6">
            {/* Left panel */}
            <div className="w-[30%]">
              <span
                className="font-mono text-xs font-medium uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                Parcours professionnel
              </span>
              <h2
                className="mt-2 font-display text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Expériences
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
              <div className="relative space-y-12 pl-20">
                {EXPERIENCES.map((exp, index) => (
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
                        backgroundColor: exp.current || visibleItems[index] ? "var(--accent)" : "var(--bg-elevated)",
                        border: `2px solid ${exp.current || visibleItems[index] ? "var(--accent)" : "var(--border)"}`,
                        boxShadow: exp.current ? "0 0 12px var(--accent-glow)" : "none",
                        opacity: visibleItems[index] ? 1 : 0.3,
                      }}
                    />

                    {/* Card */}
                    <div
                      className="rounded-xl p-6 transition-all duration-300"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        border: `1px solid ${exp.current ? "var(--accent-border)" : "var(--border)"}`,
                        opacity: visibleItems[index] ? 1 : 0.3,
                      }}
                    >
                      {/* Period and status */}
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-xs font-medium uppercase tracking-wider"
                          style={{ color: "var(--accent)" }}
                        >
                          {exp.period}
                        </span>
                        {exp.current && (
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

                      {/* Company and location */}
                      <div className="mt-2 flex items-center gap-3">
                        <h3
                          className="font-display text-xl font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {exp.company}
                        </h3>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} style={{ color: "var(--text-subtle)" }} />
                          <span
                            className="font-mono text-xs"
                            style={{ color: "var(--text-subtle)" }}
                          >
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      {/* Role */}
                      <p
                        className="mt-1 font-mono text-sm font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {exp.role}
                      </p>

                      {/* Missions */}
                      <ul className="mt-4 space-y-2">
                        {exp.missions.map((mission, mIndex) => (
                          <li
                            key={mIndex}
                            className="flex items-start gap-2 font-mono text-sm font-light"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <span style={{ color: "var(--accent)" }}>→</span>
                            {mission}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                            style={{
                              backgroundColor: "var(--accent-ghost)",
                              color: "var(--accent)",
                              border: "0.5px solid var(--accent-border)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
