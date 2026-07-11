"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeItem, staggerContainer, viewportOnce } from "./motion";

// ---- ESQUELETO ----
// Sección "Cómo trabajamos": pasos del servicio en orden.
// Reemplazar los pasos placeholder por el copy real (título + descripción).
// El orden del array define el orden visual y la numeración.
const steps = [
  {
    title: "[Paso 1 — Diagnóstico]",
    description: "[Texto placeholder — describir qué pasa en esta etapa]",
  },
  {
    title: "[Paso 2 — Propuesta]",
    description: "[Texto placeholder — describir qué pasa en esta etapa]",
  },
  {
    title: "[Paso 3 — Desarrollo]",
    description: "[Texto placeholder — describir qué pasa en esta etapa]",
  },
  {
    title: "[Paso 4 — Entrega y soporte]",
    description: "[Texto placeholder — describir qué pasa en esta etapa]",
  },
];

export default function ProcesoSection() {
  return (
    <section className="section" id="proceso">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <p className="eyebrow">[EYEBROW — ej. Nuestro Proceso]</p>
        <h2 className="font-heading">[TÍTULO DE LA SECCIÓN — Cómo trabajamos]</h2>
        <p style={{ margin: "0 auto" }}>
          [Subtítulo placeholder — completar después]
        </p>
      </motion.div>

      <motion.div
        className="process-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            variants={fadeItem}
            className="process-step"
          >
            <span className="process-step-number font-heading">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="process-step-title font-heading">{step.title}</h3>
            <p className="process-step-desc">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
