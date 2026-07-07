import VibraHero from "@/components/VibraHero";
import SectionFeature from "@/components/SectionFeature";
import ServicesSection from "@/components/ServicesSection";
import CtaSection from "@/components/CtaSection";

export default function Home() {
  return (
    <main>
      <VibraHero />

      <SectionFeature
        eyebrow="01 — El problema"
        title="Tu tiempo vale más que responder mensajes."
        description="Sos un profesional que quiere dedicarse a su oficio, no a estar pegado al teléfono. Sabemos que la gestión de turnos y las consultas repetitivas te roban horas clave todos los días. Es hora de delegar."
      />

      <SectionFeature
        eyebrow="02 — La solución"
        title="Automatizamos tu agenda."
        description="Desarrollamos sistemas de Inteligencia Artificial que se integran en tu web, WhatsApp o teléfono para atender a tus clientes y agendar turnos automáticamente. Recuperá tu libertad."
      />

      <ServicesSection />

      <CtaSection />
    </main>
  );
}
