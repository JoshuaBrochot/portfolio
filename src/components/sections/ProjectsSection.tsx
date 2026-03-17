"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/data/portfolio";
import { ProjectModal } from "@/components/ui/ProjectModal";

type Project = (typeof PROJECTS)[number];

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200); // Default for SSR

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current || !stripRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;
      const scrollableDistance = containerHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      const currentProgress = Math.min(1, Math.max(0, -containerRect.top / scrollableDistance));
      setProgress(currentProgress);

      // Calculate active card index
      const newActiveIndex = Math.min(
        PROJECTS.length - 1,
        Math.floor(currentProgress * PROJECTS.length)
      );
      setActiveIndex(newActiveIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Mobile view - vertical stack
  if (isMobile) {
    return (
      <section
        id="projets"
        className="grid-background relative py-24"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <span
              className="font-mono text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Réalisations
            </span>
            <h2
              className="mt-2 font-display text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Projets
            </h2>
          </div>

          <div className="space-y-6">
            {PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="w-full text-left"
                data-cursor
                data-cursor-label="View →"
              >
                <div
                  className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300"
                  style={{
                    backgroundColor: project.color || "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Project number */}
                  <span
                    className="font-display text-6xl font-bold opacity-10"
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "-0.5rem",
                      color: "var(--accent)",
                    }}
                  >
                    {project.number}
                  </span>

                  <span
                    className="font-mono text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--accent)" }}
                  >
                    {project.period}
                  </span>

                  <h3
                    className="mt-2 font-display text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {project.name}
                  </h3>

                  <p
                    className="mt-2 line-clamp-2 font-mono text-sm font-light"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {project.desc}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          backgroundColor: "var(--accent-ghost)",
                          color: "var(--accent)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span
                        className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          backgroundColor: "var(--accent-ghost)",
                          color: "var(--accent)",
                        }}
                      >
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </section>
    );
  }

  // Desktop view - horizontal film strip
  const cardWidth = Math.min(380, Math.max(280, windowWidth * 0.4));
  const gap = 24;
  const totalWidth = PROJECTS.length * (cardWidth + gap) - gap;
  const maxTranslate = totalWidth - windowWidth + 200;

  return (
    <section
      id="projets"
      className="grid-background-fixed relative"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div ref={containerRef} style={{ height: "400vh" }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {/* Header */}
          <div className="mx-auto w-full max-w-7xl px-6 pb-8">
            <span
              className="font-mono text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Réalisations
            </span>
            <h2
              className="mt-2 font-display text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Projets
            </h2>
          </div>

          {/* Film strip - centered */}
          <div
            ref={stripRef}
            className="flex justify-center gap-6 px-6"
            style={{
              transform: `translateX(-${progress * maxTranslate}px)`,
              transition: "transform 0.1s linear",
            }}
          >
            {PROJECTS.map((project, index) => {
              const isActive = index === activeIndex;
              const imageParallaxOffset = progress * (cardWidth * 0.3);

              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="flex-shrink-0 text-left transition-all duration-300"
                  style={{
                    width: `clamp(280px, 40vw, 380px)`,
                    opacity: isActive ? 1 : 0.5,
                    transform: `scale(${isActive ? 1 : 0.97})`,
                  }}
                  data-cursor
                  data-cursor-label="View →"
                >
                  <div
                    className="group relative h-[400px] overflow-hidden rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: project.color || "var(--bg-card)",
                      border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`,
                    }}
                  >
                    {/* Image placeholder with parallax */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `translateX(${-imageParallaxOffset * 0.3}px)`,
                      }}
                    >
                      {/* Project number as visual element */}
                      <span
                        className="font-display text-[200px] font-bold opacity-5"
                        style={{ color: "var(--accent)" }}
                      >
                        {project.number}
                      </span>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <span
                        className="font-mono text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--accent)" }}
                      >
                        {project.period}
                      </span>

                      <h3
                        className="mt-2 font-display text-2xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {project.name}
                      </h3>

                      <p
                        className="mt-2 line-clamp-2 font-mono text-sm font-light"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {project.desc}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                            style={{
                              backgroundColor: "var(--accent-ghost)",
                              color: "var(--accent)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span
                            className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                            style={{
                              backgroundColor: "var(--accent-ghost)",
                              color: "var(--accent)",
                            }}
                          >
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dots navigation */}
          <div className="mt-8 flex justify-center gap-2">
            {PROJECTS.map((_, index) => (
              <button
                key={index}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    index === activeIndex ? "var(--accent)" : "var(--bg-elevated)",
                  transform: index === activeIndex ? "scale(1.2)" : "scale(1)",
                }}
                onClick={() => {
                  // Calculate scroll position to reach this project
                  if (containerRef.current) {
                    const containerTop =
                      containerRef.current.getBoundingClientRect().top + window.scrollY;
                    const containerHeight = containerRef.current.offsetHeight;
                    const windowHeight = window.innerHeight;
                    const scrollableDistance = containerHeight - windowHeight;
                    const targetProgress = index / (PROJECTS.length - 1);
                    const targetScroll = containerTop + targetProgress * scrollableDistance;
                    window.scrollTo({ top: targetScroll, behavior: "smooth" });
                  }
                }}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
