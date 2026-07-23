"use client";

import { motion } from "framer-motion";

// "Sobre Nosotros": historia breve de la agencia.
// Las tarjetas de equipo se sacaron a proposito (no hay fotos ni roles
// definidos todavia); si vuelven, el CSS de .team-grid / .team-card sigue en
// globals.css listo para usarse.
export default function SobreNosotrosSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="section"
      id="sobre-nosotros"
    >
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
