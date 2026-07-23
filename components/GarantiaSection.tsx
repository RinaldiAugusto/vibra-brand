"use client";

import { motion } from "framer-motion";
import { HOVER_SPRING, POP_SPRING } from "./motion";

// "Garantía": reducción de riesgo. Texto + badge/ícono.
// La promesa es diagnostico y propuesta sin costo — no hay devolucion de
// dinero ni pago por etapas; no prometer eso en el copy.
export default function GarantiaSection() {
  return (
    <section className="section" id="garantia">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ y: -6, transition: HOVER_SPRING }}
        className="guarantee-card"
      >
        <motion.div
          className="guarantee-badge"
          aria-hidden
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ ...POP_SPRING, delay: 0.25 }}
        >
          {/* Ícono/badge placeholder — reemplazar por SVG o <Image> */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </motion.div>

        <p className="eyebrow">
          <span className="marker-underline">Sin riesgo</span>
        </p>
        {/* Titulo corto a proposito: .guarantee-title es un h2 de hasta 3.25rem
            dentro de un card de 46rem, arriba de ~40 caracteres se va a 4 lineas. */}
        <h2 className="font-heading guarantee-title">
          Primero el plan. Después decidís.
        </h2>
        <p className="guarantee-text">
          La llamada de diagnóstico y la propuesta no te cuestan nada. Salís con
          un plan concreto: qué se automatiza, en cuánto tiempo y a qué precio.
          Si decidís no avanzar, te quedás igual con el diagnóstico.
        </p>
      </motion.div>
    </section>
  );
}
