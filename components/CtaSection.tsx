"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import { fadeUp, fadeItem, staggerContainer, viewportOnce } from "./motion";

export default function CtaSection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="cta-section"
      id="contacto-final"
    >
      <motion.div
        className="cta-content"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.h2 variants={fadeItem} className="cta-title font-heading">
          ¿Listo para escalar con IA?
        </motion.h2>
        <motion.p variants={fadeItem} className="cta-description">
          Agenda una llamada con nuestro equipo técnico y descubrí cómo podemos transformar tu negocio con agentes de IA a medida.
        </motion.p>
        <motion.div variants={fadeItem} className="cta-actions">
          <Button
            data-cal-link="vibra-z23fu3/30min"
            data-cal-config='{"layout":"month_view"}'
            style={{ padding: "1rem 2rem", fontSize: "1.125rem" }}
          >
            Hablar con un experto
          </Button>
          <a href="mailto:contacto@vibra.agency" className="cta-mail-secondary">
            ¿Preferís escribirnos? Mandanos un mail
          </a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
