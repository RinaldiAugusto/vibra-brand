import VibraHero from "@/components/VibraHero";
import LampSection from "@/components/LampSection";

export default function Home() {
  return (
    <main>
      <VibraHero />

      {/* espacio vacio: la animacion del hero termina antes de la lamp */}
      <div className="hero-lamp-gap" aria-hidden />

      <LampSection
        title="Tu tiempo es lo más valioso"
        description="Tu negocio no necesita más horas. Necesita más sistema. Creamos la web, los agentes y las automatizaciones que hacen crecer tu operación sin que vos estés atrás de cada tarea."
      />

      {/* A partir de acá desarrollamos las próximas secciones */}
    </main>
  );
}
