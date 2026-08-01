"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./motion";

// "Sobre Nosotros": historia breve de la agencia.
// Las tarjetas de equipo se sacaron a proposito (no hay fotos ni roles
// definidos todavia); el CSS de .team-grid / .team-card tambien se borro.
export default function SobreNosotrosSection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="section"
      id="sobre-nosotros"
    >
      {/* Sin bajada: el h2 solo cierra el bloque contra la historia de abajo. */}
      <div className="section-head">
        <p className="eyebrow">
          <span className="marker-underline">Sobre Nosotros</span>
        </p>
        <h2 className="font-heading">Obsesionados con que funcione</h2>
      </div>

      {/* Historia breve */}
      <div className="about-story">
        <p>
          Vibra nació de una idea simple: la mayoría de los negocios no necesita
          más software, necesita que el software que ya tiene deje de darles
          trabajo. Empezamos automatizando tareas sueltas para PyMEs argentinas
          y terminamos construyendo sistemas completos.
        </p>
        <p>
          No vendemos IA como si fuera magia. Construimos cosas que andan en
          producción todos los días, con clientes reales del otro lado — de esas
          que se rompen si están mal hechas y se notan cuando están bien.
        </p>
        <p>
          Por eso medimos todo con la misma vara: si no te devuelve tiempo, no lo
          hacemos.
        </p>
      </div>
    </motion.section>
  );
}
