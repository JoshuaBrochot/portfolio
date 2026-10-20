import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Joshua Brochot — Portfolio développeur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Grille de fond */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(121,144,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(121,144,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Halo accent haut-droite */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(121,144,255,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Halo accent bas-gauche */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(121,144,255,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Contenu */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>

          {/* Badge disponibilité */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#7990FF",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#7990FF",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              Disponible
            </span>
          </div>

          {/* Prénom */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#F0F0F0",
              lineHeight: 1,
              marginBottom: "8px",
              letterSpacing: "-2px",
            }}
          >
            Joshua
          </div>

          {/* Nom en accent */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#7990FF",
              lineHeight: 1,
              marginBottom: "32px",
              letterSpacing: "-2px",
            }}
          >
            Brochot
          </div>

          {/* Sous-titre */}
          <div
            style={{
              fontSize: "26px",
              color: "#A0A0A0",
              fontFamily: "monospace",
              letterSpacing: "1px",
              marginBottom: "48px",
            }}
          >
            Diplômé d'un BUT Informatique · IUT de Metz
          </div>

          {/* Tags technos */}
          <div style={{ display: "flex", gap: "12px" }}>
            {["Git", "React", "Python", "Java", "PHP", "Docker", "SQL"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "8px 18px",
                    background: "rgba(121,144,255,0.10)",
                    border: "1px solid rgba(121,144,255,0.35)",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "18px",
                    color: "#7990FF",
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>

        {/* Initiales JB en filigrane */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            bottom: "40px",
            fontSize: "260px",
            fontWeight: 800,
            color: "rgba(121,144,255,0.08)",
            lineHeight: 1,
            letterSpacing: "-8px",
          }}
        >
          JB
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "100px",
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#555555",
            letterSpacing: "1px",
          }}
        >
          jbrochot.fr
        </div>
      </div>
    ),
    { ...size }
  );
}
