"use client";

import { useEffect, useState } from "react";

export function TransitionOrb() {
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ x: 120, y: 60 });

  useEffect(() => {
    const handleScroll = () => {
      // Récupérer les sections
      const formationSection = document.getElementById("formation");
      const experiencesSection = document.getElementById("experiences");

      if (!formationSection || !experiencesSection) return;

      const viewportHeight = window.innerHeight;

      // Position de la fin de la section formation et début de la section expériences
      const formationRect = formationSection.getBoundingClientRect();
      const experiencesRect = experiencesSection.getBoundingClientRect();

      // Zone de transition : entre la fin de formation et le début d'expériences
      const transitionStart = formationRect.bottom;
      const transitionEnd = experiencesRect.top;
      const transitionMiddle = (transitionStart + transitionEnd) / 2;

      // Distance par rapport au centre du viewport pour gérer le fade
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = Math.abs(transitionMiddle - viewportCenter);

      // Calcul de l'opacité basé sur la proximité du centre du viewport
      const fadeRange = viewportHeight * 0.8; // Zone de fade étendue
      const newOpacity = Math.max(0, Math.min(1, 1 - distanceFromCenter / fadeRange));

      setOpacity(newOpacity);

      // Calcul de la progression du scroll dans la zone de transition
      // On commence quand la zone de transition entre dans le viewport (par le bas)
      // et termine quand elle sort (par le haut)
      const transitionHeight = Math.max(100, transitionEnd - transitionStart);
      const scrollProgress = (viewportHeight - transitionMiddle) / (viewportHeight + transitionHeight);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      // Position diagonale : bas-droite vers haut-gauche
      // X: 120% (hors écran droite) -> -20% (hors écran gauche)
      // Y: 60% (bas) -> -40% (haut)
      const xPosition = 120 - clampedProgress * 140; // 120 -> -20
      const yPosition = 60 - clampedProgress * 100; // 60 -> -40

      setPosition({ x: xPosition, y: yPosition });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute"
        style={{
          width: "600px",
          height: "600px",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: opacity,
          transition: "opacity 0.05s linear",
          willChange: "opacity, left, top",
        }}
      >
        {/* Orbe principal avec dégradé radial */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center,
              var(--accent) 0%,
              rgba(var(--accent-rgb), 0.6) 20%,
              rgba(var(--accent-rgb), 0.3) 40%,
              rgba(var(--accent-rgb), 0.1) 60%,
              transparent 80%)`,
            filter: "blur(60px)",
            borderRadius: "50%",
          }}
        />

        {/* Orbe secondaire pour plus de profondeur */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center,
              rgba(var(--accent-rgb), 0.4) 0%,
              rgba(var(--accent-rgb), 0.2) 30%,
              transparent 60%)`,
            filter: "blur(40px)",
            borderRadius: "50%",
            transform: "scale(0.7)",
          }}
        />
      </div>
    </div>
  );
}
