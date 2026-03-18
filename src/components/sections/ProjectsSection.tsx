"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/data/portfolio";
import { ProjectModal } from "@/components/ui/ProjectModal";

type Project = (typeof PROJECTS)[number];

export function ProjectsSection() {
  const [isMobile, setIsMobile] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Scroll listener — détecte quand les cartes entrent dans le viewport
  // Utilise getBoundingClientRect() qui ignoré les transforms
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        // Considérer la carte comme visible si elle est dans le viewport + une marge de 5%
        const isInViewport = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;

        if (isInViewport) {
          setVisibleCards((prev) => {
            if (prev.has(index)) return prev;
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger immédiatement au montage pour les cartes déjà visibles
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handleTransitionEnd = (index: number) => {
    setAnimatedCards((prev) => new Set(prev).add(index));
  };

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="projets"
        className="grid-background relative py-24"
        style={{ backgroundColor: "var(--bg-base)", overflowX: "hidden" }}
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

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <section
      id="projets"
      className="grid-background relative py-24"
      // overflow-x: hidden ici est le correctif clé :
      // il empêche les cards en translateX(110vw) de créer une scrollbar horizontale
      // et force l'IntersectionObserver à se déclencher au scroll vertical uniquement.
      style={{ backgroundColor: "var(--bg-base)", overflowX: "hidden" }}
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
            className="mt-2 font-display text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Projets
          </h2>
        </div>

        {/* overflow-x: hidden sur la grille en complément de la section */}
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          style={{ overflowX: "hidden" }}
        >
          {PROJECTS.map((project, index) => {
            const isVisible = visibleCards.has(index);
            const hasAnimated = animatedCards.has(index);
            const delay = index * 120;

            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                data-card-index={index}
                style={{
                  transform:
                    isVisible || prefersReducedMotion
                      ? "translateX(0)"
                      : "translateX(110vw)",
                  opacity: isVisible ? 1 : 0,
                  transition: prefersReducedMotion
                    ? "opacity 0.3s ease-out"
                    : `transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                  // will-change retiré après la fin de l'animation pour libérer le layer GPU
                  willChange: hasAnimated ? "auto" : "transform",
                }}
                onTransitionEnd={() => handleTransitionEnd(index)}
              >
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full text-left"
                  data-cursor
                  data-cursor-label="View →"
                >
                  <div
                    className="group relative h-[400px] overflow-hidden rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: project.color || "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-display text-[200px] font-bold opacity-5"
                        style={{ color: "var(--accent)" }}
                      >
                        {project.number}
                      </span>
                    </div>

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
              </div>
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
