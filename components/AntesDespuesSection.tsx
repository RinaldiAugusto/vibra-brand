"use client";

import { motion } from "framer-motion";

// ---- ESQUELETO ----
// "Antes / Después": comparación visual del dolor actual vs. la solución con IA.
// Dos bloques comparativos. Reemplazar los ítems de cada columna por el copy real.
const antes = [
  "[Dolor 1 — placeholder]",
  "[Dolor 2 — placeholder]",
  "[Dolor 3 — placeholder]",
];

const despues = [
  "[Solución 1 — placeholder]",
  "[Solución 2 — placeholder]",
  "[Solución 3 — placeholder]",
];

export default function AntesDespuesSection() {
  return (
    <section className="section" id="antes-despues">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">[EYEBROW — ej. El cambio]</p>
        <h2 className="font-heading">[TÍTULO DE LA SECCIÓN — Antes vs. Después]</h2>
        <p style={{ margin: "0 auto" }}>
          [Subtítulo placeholder — completar después]
        </p>
      </div>

      <div className="compare-grid">
        {/* Columna ANTES (dolor actual) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="compare-card compare-card-before"
        >
          <h3 className="compare-heading font-heading">[Antes — Sin IA]</h3>
          <ul className="compare-list">
            {antes.map((item) => (
              <li key={item}>
                <span className="compare-mark compare-mark-before" aria-hidden>
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Columna DESPUÉS (solución con IA) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="compare-card compare-card-after"
        >
          <h3 className="compare-heading font-heading">[Después — Con Vibra IA]</h3>
          <ul className="compare-list">
            {despues.map((item) => (
              <li key={item}>
                <span className="compare-mark compare-mark-after" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
