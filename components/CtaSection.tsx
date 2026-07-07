"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="cta-section"
      id="contacto-final"
    >
      <div className="cta-content">
        <h2 className="cta-title">¿Listo para escalar con IA?</h2>
        <p className="cta-description">
          Agenda una llamada con nuestro equipo técnico y descubrí cómo podemos transformar tu negocio con agentes de IA a medida.
        </p>
        <a href="mailto:contacto@vibra.agency">
          <Button style={{ padding: "1rem 2rem", fontSize: "1.125rem" }}>
            Hablar con un experto
          </Button>
        </a>
      </div>
    </motion.section>
  );
}
