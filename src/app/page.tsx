export default function Home() {
  return (
    <main className="grid-background min-h-screen">
      {/* Hero Section */}
      <section id="profil" className="min-h-dvh">
        <div className="mx-auto max-w-7xl px-6 pt-32">
          <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
            Infrastructure ready - sections à venir
          </p>
        </div>
      </section>

      {/* Formation Section */}
      <section id="formation" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-3xl font-bold">Formation</h2>
        </div>
      </section>

      {/* Expériences Section */}
      <section id="experiences" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-3xl font-bold">Expériences</h2>
        </div>
      </section>

      {/* Compétences Section */}
      <section id="competences" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-3xl font-bold">Compétences</h2>
        </div>
      </section>

      {/* Projets Section */}
      <section id="projets" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-3xl font-bold">Projets</h2>
        </div>
      </section>
    </main>
  );
}
