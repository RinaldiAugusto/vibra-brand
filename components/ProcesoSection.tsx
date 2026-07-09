"use client";

import { motion } from "framer-motion";

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
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">[EYEBROW — ej. Nuestro Proceso]</p>
        <h2 className="font-heading">[TÍTULO DE LA SECCIÓN — Cómo trabajamos]</h2>
        <p style={{ margin: "0 auto" }}>
          [Subtítulo placeholder — completar después]
        </p>
      </div>

      <div className="process-grid">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="process-step"
          >
            <span className="process-step-number font-heading">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="process-step-title font-heading">{step.title}</h3>
            <p className="process-step-desc">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
