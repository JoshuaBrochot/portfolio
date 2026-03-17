"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type Lenis from "lenis";

const NAV_LINKS = [
  { href: "#profil", label: "profil" },
  { href: "#formation", label: "formation" },
  { href: "#experiences", label: "expériences" },
  { href: "#competences", label: "compétences" },
  { href: "#projets", label: "projets" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profil");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle active section detection
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href)
    ).filter(Boolean) as Element[];

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

  // Handle smooth scroll
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector<HTMLElement>(href);
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -56 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 h-14 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.90)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <a
            href="#profil"
            onClick={(e) => handleNavClick(e, "#profil")}
            className="font-display text-lg font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            _portfolio<span style={{ color: "var(--accent)" }}>.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-mono text-[11px] font-medium uppercase tracking-wider transition-colors duration-200"
                style={{
                  color:
                    activeSection === link.href.slice(1)
                      ? "var(--accent)"
                      : "var(--text-muted)",
                }}
              >
                {link.label}
              </a>
            ))}

            {/* CTA Contact */}
            <a
              href="mailto:joshua.brochot@gmail.com"
              className="font-mono text-[11px] font-medium uppercase tracking-wider transition-colors duration-200"
              style={{
                color: "var(--accent)",
                padding: "0.5rem 1rem",
                border: "1px solid var(--accent-border)",
                borderRadius: "4px",
              }}
            >
              contact
            </a>
          </div>

          {/* Mobile Burger */}
          <button
            className="flex h-10 w-10 items-center justify-center md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} style={{ color: "var(--text-primary)" }} />
            ) : (
              <Menu size={24} style={{ color: "var(--text-primary)" }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-display text-2xl font-bold transition-colors duration-200"
              style={{
                color:
                  activeSection === link.href.slice(1)
                    ? "var(--accent)"
                    : "var(--text-primary)",
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="mailto:joshua.brochot@gmail.com"
            className="mt-4 font-display text-2xl font-bold"
            style={{ color: "var(--accent)" }}
          >
            contact
          </a>
        </div>
      </div>
    </>
  );
}
