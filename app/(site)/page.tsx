import VibraHero from "@/components/VibraHero";
import LampSection from "@/components/LampSection";
import ServicesSection from "@/components/ServicesSection";
import ProcesoSection from "@/components/ProcesoSection";
import FaqSection from "@/components/FaqSection";
import SobreNosotrosSection from "@/components/SobreNosotrosSection";
import GarantiaSection from "@/components/GarantiaSection";
import AntesDespuesSection from "@/components/AntesDespuesSection";
import CtaSection from "@/components/CtaSection";

export default function Home() {
  return (
    <main id="contenido">
      <VibraHero />

      {/* espacio vacio: la animacion del hero termina antes de la lamp */}
      <div className="hero-lamp-gap" aria-hidden />

      <LampSection
        title="Tu tiempo es lo más valioso"
        description="Tu negocio no necesita más horas. Necesita más sistema. Creamos la web, los agentes y las automatizaciones que hacen crecer tu operación sin que vos estés atrás de cada tarea."
      />

      {/* ---- Flujo de secciones ---- */}
      {/* 1. Servicios (contenido real ya existente) */}
      <ServicesSection />

      {/* 2. Proceso — cómo trabajamos */}
      <ProcesoSection />

      {/* 3. FAQ — acordeón */}
      <FaqSection />

      {/* 4. Sobre Nosotros */}
      <SobreNosotrosSection />

      {/* 5. Garantía */}
      <GarantiaSection />

      {/* 6. Antes / Después */}
      <AntesDespuesSection />

      {/* CTA final */}
      <CtaSection />
    </main>
  );
}
