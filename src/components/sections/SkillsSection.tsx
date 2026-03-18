"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILLS, SKILL_CATEGORIES, type Skill, type SkillLevel } from "@/data/portfolio";
import { useMouseParallax } from "@/hooks/useMouseParallax";

// Seeded random for consistent layout
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSkillStyles(level: SkillLevel) {
  switch (level) {
    case "expert":
      return {
        fontSize: "16px",
        opacity: 1,
        borderOpacity: 1,
      };
    case "intermédiaire":
      return {
        fontSize: "13px",
        opacity: 0.75,
        borderOpacity: 0.6,
      };
    case "débutant":
      return {
        fontSize: "11px",
        opacity: 0.45,
        borderOpacity: 0.3,
      };
  }
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const mouse = useMouseParallax({ strength: 1, smoothing: 0.05 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get all skills flattened with their category
  const allSkills = useMemo(() => {
    const skills: Array<Skill & { category: string; seed: number }> = [];
    let seed = 0;

    Object.entries(SKILLS).forEach(([category, categorySkills]) => {
      categorySkills.forEach((skill) => {
        skills.push({ ...skill, category, seed: seed++ });
      });
    });

    return skills;
  }, []);

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "Tout") return allSkills;
    return allSkills.filter((skill) => skill.category === activeCategory);
  }, [activeCategory, allSkills]);

  return (
    <section
      id="competences"
      className="grid-background-fixed relative py-24"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span
            className="font-mono text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            Expertise
          </span>
          <h2
            className="mt-2 font-display text-3xl font-bold md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Compétences
          </h2>
        </div>

        {/* Category filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {SKILL_CATEGORIES.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="rounded-full px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-200"
              data-cursor
              data-cursor-label="Filter"
              style={{
                backgroundColor:
                  activeCategory === category ? "var(--accent)" : "var(--bg-card)",
                color:
                  activeCategory === category ? "var(--bg-base)" : "var(--text-muted)",
                border: `1px solid ${activeCategory === category ? "var(--accent)" : "var(--border)"}`,
              }}
              animate={{
                opacity: activeCategory === category || activeCategory === "Tout" ? 1 : 0.4,
                scale: activeCategory === category ? 1 : 0.95,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Skills cloud */}
        <div className="mx-auto flex min-h-[300px] max-w-4xl flex-wrap items-center justify-center gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const styles = getSkillStyles(skill.level);
              // Generate random gap offset based on seed
              const gapX = seededRandom(skill.seed * 2) * 16 - 8;
              const gapY = seededRandom(skill.seed * 3) * 16 - 8;

              // Calculate parallax offset based on font size (smaller = more movement)
              const parallaxStrength = isMobile ? 0 : (1 / parseInt(styles.fontSize)) * 0.3;
              const offsetX = mouse.x * parallaxStrength * 30;
              const offsetY = mouse.y * parallaxStrength * 30;

              return (
                <motion.span
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: styles.opacity,
                    scale: 1,
                    x: offsetX + gapX,
                    y: offsetY + gapY,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    opacity: { duration: 0.2 },
                  }}
                  className="cursor-default rounded px-3 py-1.5 font-mono"
                  style={{
                    fontSize: styles.fontSize,
                    backgroundColor: "var(--accent-ghost)",
                    color: "var(--accent)",
                    border: `0.5px solid rgba(121, 144, 255, ${styles.borderOpacity * 0.38})`,
                  }}
                >
                  {skill.name}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {(["expert", "intermédiaire", "débutant"] as SkillLevel[]).map((level) => {
            const styles = getSkillStyles(level);
            return (
              <div key={level} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "var(--accent)",
                    opacity: styles.opacity,
                  }}
                />
                <span
                  className="font-mono text-xs capitalize"
                  style={{
                    color: "var(--text-muted)",
                    opacity: styles.opacity,
                  }}
                >
                  {level}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
