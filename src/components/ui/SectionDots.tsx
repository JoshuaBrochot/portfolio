"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";

const SECTIONS = [
  { id: "profil", label: "Profil" },
  { id: "formation", label: "Formation" },
  { id: "experiences", label: "Expériences" },
  { id: "competences", label: "Compétences" },
  { id: "projets", label: "Projets" },
];

export function SectionDots() {
  const [activeSection, setActiveSection] = useState("profil");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show dots after initial scroll
    const handleVisibility = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleVisibility, { passive: true });
    handleVisibility();

    return () => window.removeEventListener("scroll", handleVisibility);
  }, []);

  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;

    if (target && lenis) {
      lenis.scrollTo(target, { offset: -56 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-300 lg:flex ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${section.label}`}
        >
          {/* Label tooltip */}
          <span
            className="absolute right-6 whitespace-nowrap rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {section.label}
          </span>

          {/* Dot */}
          <span
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                activeSection === section.id ? "var(--accent)" : "var(--bg-elevated)",
              boxShadow:
                activeSection === section.id ? "0 0 8px var(--accent-glow)" : "none",
              transform: activeSection === section.id ? "scale(1.25)" : "scale(1)",
            }}
          />
        </button>
      ))}
    </div>
  );
}
