"use client";

import { motion } from "framer-motion";

// ---- ESQUELETO ----
// "Garantía": reducción de riesgo. Texto + badge/ícono.
// Reemplazar el título, el texto y (opcional) el ícono del badge por el real.
export default function GarantiaSection() {
  return (
    <section className="section" id="garantia">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="guarantee-card"
      >
        <div className="guarantee-badge" aria-hidden>
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
        </div>

        <p className="eyebrow">[EYEBROW — ej. Sin riesgo]</p>
        <h2 className="font-heading guarantee-title">
          [TÍTULO DE LA GARANTÍA — placeholder]
        </h2>
        <p className="guarantee-text">
          [Texto placeholder — describir la garantía y cómo reduce el riesgo del
          cliente. Completar después.]
        </p>
      </motion.div>
    </section>
  );
}
