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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress through section
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

      // Different parallax speeds for each column
      const offset1 = progress * 0;
      const offset2 = progress * -60;
      const offset3 = progress * 40;

      setColumnOffsets([offset1, offset2, offset3]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
                className="flip-card h-56"
                style={{
                  transform: isMobile ? "none" : `translateY(${columnOffsets[index]}px)`,
                  transition: "transform 0.1s linear",
                }}
              >
                <div className="flip-card-inner h-full w-full">
                  {/* Front */}
                  <div
                    className="flip-card-front flex flex-col items-center justify-center rounded-xl p-6"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={32}
                        color="var(--accent)"
                        className="mb-4"
                      />
                    )}
                    <h3
                      className="font-display text-lg font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {interest.label}
                    </h3>
                  </div>

                  {/* Back */}
                  <div
                    className="flip-card-back flex flex-col items-center justify-center rounded-xl p-6 text-center"
                    style={{
                      backgroundColor: "var(--accent-ghost)",
                      border: "1px solid var(--accent-border)",
                    }}
                  >
                    <p
                      className="font-mono text-sm font-light leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
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
