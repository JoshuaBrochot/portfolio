"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Users } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { useLocale } from "@/context/LocaleContext";

type Project = (typeof PROJECTS)[number];

interface ProjectData {
  id: string;
  number: string;
  name: string;
  period: string;
  desc: string;
  missions: string[];
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t, tArray } = useLocale();
  const projectsData = tArray<ProjectData>("projectsData");
  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            onClick={onClose}
          />

          {/* Modal panel - slide in from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-[101] w-full overflow-y-auto md:w-[600px]"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
              aria-label={t("projectModal.close")}
            >
              <X size={20} style={{ color: "var(--text-primary)" }} />
            </button>

            {/* Content */}
            <div className="p-8 pt-16 md:p-12">
              {(() => {
                const index = PROJECTS.findIndex(p => p.id === project.id);
                const translatedProject = projectsData[index] || project;
                return (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <span
                        className="font-mono text-xs font-medium uppercase tracking-widest"
                        style={{ color: "var(--accent)" }}
                      >
                        {t("projectModal.project")} {project.number} · {translatedProject.period}
                      </span>
                      <h2
                        className="mt-2 font-display text-3xl font-bold md:text-4xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {translatedProject.name}
                      </h2>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <p
                        className="font-mono text-base font-light leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {translatedProject.desc}
                      </p>
                    </div>

                    {/* Missions */}
                    <div className="mb-8">
                      <h3
                        className="mb-4 font-display text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t("projectModal.missions")}
                      </h3>
                      <ul className="space-y-3">
                        {translatedProject.missions.map((mission, mIndex) => (
                          <li
                            key={mIndex}
                            className="flex items-start gap-3 font-mono text-sm font-light"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <span
                              className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                            {mission}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                      <h3
                        className="mb-4 font-display text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t("projectModal.technologies")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
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

                    {/* Team */}
                    {project.team && (
                      <div className="mb-8">
                        <h3
                          className="mb-4 flex items-center gap-2 font-display text-lg font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <Users size={18} style={{ color: "var(--accent)" }} />
                          {t("projectModal.team")}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.team.map((member) => (
                            <span
                              key={member}
                              className="rounded-full px-3 py-1 font-mono text-sm"
                              style={{
                                backgroundColor: "var(--bg-card)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-medium transition-colors duration-200"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <Github size={16} />
                          GitHub
                          <ExternalLink size={12} style={{ color: "var(--text-subtle)" }} />
                        </a>
                      )}

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-medium transition-colors duration-200"
                          style={{
                            backgroundColor: "var(--accent)",
                            color: "var(--bg-base)",
                          }}
                        >
                          {t("projectModal.viewProject")}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
