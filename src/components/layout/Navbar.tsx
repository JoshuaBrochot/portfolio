"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";
import ContactModal from "@/components/ui/ContactModal";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "#profil", key: "profil" },
  { href: "#formation", key: "formation" },
  { href: "#experiences", key: "experiences" },
  { href: "#competences", key: "competences" },
  { href: "#projets", key: "projets" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("profil");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

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
                {t(`nav.${link.key}`)}
              </a>
            ))}

            {/* Language Switcher */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
              }}
            >
              {(["fr", "en"] as Locale[]).map((l, i) => (
                <span key={l} style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setLocale(l)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 6px",
                      borderRadius: "4px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: locale === l ? "var(--accent)" : "var(--text-muted)",
                      fontWeight: locale === l ? 500 : 300,
                      transition: "color 0.2s",
                    }}
                    aria-label={`Switch to ${l.toUpperCase()}`}
                  >
                    {l.toUpperCase()}
                  </button>
                  {i === 0 && (
                    <span style={{ color: "var(--text-subtle)", fontSize: "0.65rem" }}>
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* CTA Contact */}
            <button
              onClick={() => setContactOpen(true)}
              className="font-mono text-[11px] font-medium uppercase tracking-wider transition-colors duration-200"
              style={{
                color: "var(--accent)",
                padding: "0.5rem 1rem",
                border: "1px solid var(--accent-border)",
                borderRadius: "4px",
                background: "none",
              }}
            >
              {t("nav.contact")}
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            aria-label={isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'none',
              padding: '0',
              position: 'relative',
            }}
          >
            {/* Trait haut */}
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--text-muted)',
              borderRadius: '2px',
              transformOrigin: 'center',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isMobileMenuOpen
                ? 'translateY(6.5px) rotate(45deg)'
                : 'translateY(0) rotate(0deg)',
            }} />

            {/* Trait milieu */}
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--text-muted)',
              borderRadius: '2px',
              transformOrigin: 'center',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
              transform: isMobileMenuOpen ? 'scaleX(0)' : 'scaleX(1)',
              opacity: isMobileMenuOpen ? 0 : 1,
            }} />

            {/* Trait bas */}
            <span style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: 'var(--text-muted)',
              borderRadius: '2px',
              transformOrigin: 'center',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isMobileMenuOpen
                ? 'translateY(-6.5px) rotate(-45deg)'
                : 'translateY(0) rotate(0deg)',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay — toujours dans le DOM, animé par transform */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(10, 10, 10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          // Slide depuis le haut
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isMobileMenuOpen ? 1 : 0,
          transition: isMobileMenuOpen
            ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
            : 'transform 0.4s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textDecoration: 'none',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-16px)',
              transition: isMobileMenuOpen
                ? `opacity 0.4s ease ${index * 60 + 150}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 60 + 150}ms`
                : 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            {t(`nav.${link.key}`).toUpperCase()}
          </a>
        ))}

        {/* Language Switcher Mobile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-16px)',
            transition: isMobileMenuOpen
              ? `opacity 0.4s ease ${NAV_LINKS.length * 60 + 120}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${NAV_LINKS.length * 60 + 120}ms`
              : 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {(["fr", "en"] as Locale[]).map((l, i) => (
            <span key={l} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setLocale(l)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: locale === l ? "var(--accent)" : "var(--text-muted)",
                  fontWeight: locale === l ? 500 : 300,
                  transition: "color 0.2s",
                }}
                aria-label={`Switch to ${l.toUpperCase()}`}
              >
                {l.toUpperCase()}
              </button>
              {i === 0 && (
                <span style={{ color: "var(--text-subtle)", fontSize: "0.85rem" }}>
                  /
                </span>
              )}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            setContactOpen(true);
          }}
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            color: 'var(--accent)',
            marginTop: '1rem',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-16px)',
            transition: isMobileMenuOpen
              ? `opacity 0.4s ease ${NAV_LINKS.length * 60 + 200}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${NAV_LINKS.length * 60 + 200}ms`
              : 'opacity 0.2s ease, transform 0.2s ease',
            background: 'none',
            border: 'none',
          }}
        >
          {t("nav.contact").toUpperCase()}
        </button>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
</>
  );
}
