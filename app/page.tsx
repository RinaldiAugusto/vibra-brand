import VibraHero from "@/components/VibraHero";

export default function Home() {
  return (
    <main>
      <VibraHero />

      {/* Contenido de ejemplo: se ve la marca de agua hero_2 girando detrás */}
      <section className="section">
        <p className="eyebrow">01 — El problema</p>
        <h2>Hay demasiado ruido.</h2>
        <p>
          Existe una avalancha de agencias de IA vendiendo lo mismo. Vibra
          construye sistemas de IA que de verdad se destacan: claros, seguros y
          hechos para producción.
        </p>
      </section>

      <section className="section">
        <p className="eyebrow">02 — La señal</p>
        <h2>IA que se escucha claro.</h2>
        <p>
          Diseñamos, entrenamos y desplegamos agentes que resuelven problemas
          reales de negocio, con la nitidez de una marca premium.
        </p>
      </section>

      <section className="section" style={{ paddingBottom: "12rem" }}>
        <p className="eyebrow">03 — Empecemos</p>
        <h2>Construyamos algo que vibre.</h2>
        <p>
          Contanos tu idea y la convertimos en un sistema de IA listo para
          producción.
        </p>
      </section>
    </main>
  );
}
