import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Joshua Brochot — Portfolio développeur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFontData() {
  // First try the module-resolved URL (works when bundler rewrites it).
  try {
    const url = new URL("../../public/fonts/RubikMonoOne-Regular.ttf", import.meta.url);
    const res = await fetch(url.toString());
    if (res.ok) return await res.arrayBuffer();
  } catch (err) {
    // continue to fallback
  }

  // Fallback to an absolute URL. Set NEXT_PUBLIC_SITE_URL in production.
  const origin = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http'))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `http://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}`;
  const fallbackUrl = `${origin.replace(/\/$/, '')}/fonts/RubikMonoOne-Regular.ttf`;
  const res = await fetch(fallbackUrl);
  if (!res.ok) throw new Error(`Failed to load font from ${fallbackUrl}`);
  return await res.arrayBuffer();
}

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
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(121,144,255,0.17) 0%, transparent 65%)",
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
              fontSize: "24px",
              color: "#A0A0A0",
              letterSpacing: "1px",
              marginBottom: "48px",
            }}
          >
            Junior Developer 
          </div>

          {/* Tags technos */}
          <div style={{ display: "flex", gap: "12px" }}>
            {["React", "TypeScript", "Python", "PHP", "SQL"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "8px 18px",
                    background: "rgba(121,144,255,0.10)",
                    border: "1px solid rgba(121,144,255,0.35)",
                    borderRadius: "6px",
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

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "100px",
            fontSize: "18px",
            color: "#555555",
            letterSpacing: "1px",
          }}
        >
          jbrochot.fr
        </div>
      </div>
    ),
    { ...size, fonts: [
        { name: "Rubik Mono One", data: await loadFontData(), weight: 400, style: "normal" }
      ]
    }
  );
}
