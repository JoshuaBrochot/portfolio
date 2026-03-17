"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowDown, Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { PROFILE } from "@/data/portfolio";

const ICON_MAP: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(PROFILE.title[0]);
      return;
    }

    const currentTitle = PROFILE.title[titleIndex];
    const typeSpeed = isDeleting ? 30 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % PROFILE.title.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  // Parallax grid effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (gridRef.current) {
        const scrollY = window.scrollY;
        gridRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight keywords in bio
  const highlightBio = (text: string) => {
    const keywords = ["BUT Informatique", "IUT de Metz", "stage", "23 février", "12 juin 2026"];
    let result = text;

    keywords.forEach((keyword) => {
      result = result.replace(
        new RegExp(`(${keyword})`, "gi"),
        '<span class="font-medium text-[var(--text-primary)]">$1</span>'
      );
    });

    return result;
  };

  return (
    <section
      id="profil"
      className="relative min-h-dvh overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Grid background with parallax */}
      <div
        ref={gridRef}
        className="grid-background pointer-events-none absolute inset-0"
        style={{ height: "120%" }}
      />

      {/* Fade gradient at bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          background: "linear-gradient(to top, var(--bg-base), transparent)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-6 py-20 lg:flex-row lg:items-center lg:gap-16">
        {/* Left side - Text content */}
        <div className="flex-1">
          {/* Availability badge */}
          {PROFILE.available && (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: "var(--accent-ghost)",
                border: "1px solid var(--accent-border)",
              }}
            >
              <span
                className="pulse-dot h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span
                className="font-mono text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
              >
                {PROFILE.availableLabel}
              </span>
            </div>
          )}

          {/* Name */}
          <h1
            className="font-display font-extrabold leading-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{PROFILE.firstName} </span>
            <span style={{ color: "var(--accent)" }}>{PROFILE.lastName}</span>
            <span style={{ color: "var(--accent)" }}>.</span>
          </h1>

          {/* Typing effect title */}
          <div className="mt-4 h-8">
            <span
              className="font-mono text-lg font-light"
              style={{ color: "var(--text-muted)" }}
            >
              {displayText}
              <span className="typing-cursor" style={{ color: "var(--accent)" }}>
                |
              </span>
            </span>
          </div>

          {/* Bio */}
          <p
            className="mt-6 max-w-xl font-mono text-base font-light leading-relaxed"
            style={{ color: "var(--text-muted)" }}
            dangerouslySetInnerHTML={{ __html: highlightBio(PROFILE.bio) }}
          />

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#projets" className="btn-primary">
              Voir mes projets
              <ArrowDown size={16} />
            </a>
            <a href={`mailto:${PROFILE.email}`} className="btn-outline">
              Me contacter
            </a>
          </div>

          {/* Socials */}
          <div className="mt-8 flex gap-4">
            {PROFILE.socials.map((social) => {
              const Icon = ICON_MAP[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                  aria-label={social.label}
                >
                  {Icon && <Icon size={18} color="var(--text-muted)" />}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right side - Avatar and stats */}
        <div className="mt-12 flex flex-col items-center lg:mt-0">
          {/* Avatar */}
          <div className="relative">
            {/* Outer ring */}
            <div
              className="absolute -inset-4 rounded-full"
              style={{
                border: "1px solid rgba(121, 144, 255, 0.2)",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                border: "1px solid rgba(121, 144, 255, 0.3)",
              }}
            />
            {/* Avatar circle */}
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "2px solid var(--accent-border)",
              }}
            >
              {PROFILE.avatarSrc ? (
                <img
                  src={PROFILE.avatarSrc}
                  alt={`${PROFILE.firstName} ${PROFILE.lastName}`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span
                  className="font-display text-5xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {PROFILE.initials}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-10 flex divide-x"
            style={{ borderColor: "var(--border)" }}
          >
            {PROFILE.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center px-6 ${
                  index === 0 ? "pl-0" : ""
                } ${index === PROFILE.stats.length - 1 ? "pr-0" : ""}`}
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <span
                  className="font-display text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <div
          className="scroll-indicator-line h-8 w-px"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-subtle)" }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}
