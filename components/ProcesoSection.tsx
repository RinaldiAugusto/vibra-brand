"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeItem, staggerContainer, viewportOnce } from "./motion";

// Sección "Cómo trabajamos": pasos del servicio en orden.
// El orden del array define el orden visual y la numeración.
// Cada paso engancha con algo que ya vive en la página: el 01 es la llamada de
// 30 min del CTA de Cal.com, el 02 es la garantía, el 04 es Vibra Care.
const steps = [
  {
    title: "Diagnóstico",
    description:
      "En una llamada entendemos tu negocio: dónde están los cuellos de botella y qué se puede optimizar. Salís con un diagnóstico claro, avancemos o no.",
  },
  {
    title: "Definición",
    description:
      "Definimos tu agente de mensajes y/o llamadas: qué hace, hasta dónde llega y qué queda afuera. Todo a medida, ajustado a cómo trabaja tu negocio.",
  },
  {
    // El plazo de dos semanas tiene que coincidir con la respuesta de
    // "¿Cuánto tarda en estar funcionando?" en FaqSection.tsx.
    title: "Construcción",
    description:
      "Con tu negocio entendido y el alcance definido, en dos semanas tenemos el producto terminado y listo para implementar.",
  },
  {
    title: "Capacitación y seguimiento",
    description:
      "Capacitamos a tu equipo y no te soltamos: con Vibra Care seguimos con monitoreo, ajustes y mejoras mes a mes.",
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
        <p className="eyebrow">
          <span className="marker-underline">Nuestro Proceso</span>
        </p>
        <h2 className="font-heading">De la primera charla a tu sistema andando</h2>
        <p style={{ margin: "0 auto" }}>
          Cuatro etapas claras. En cada una sabés qué se está haciendo y cuándo
          lo vas a ver funcionando.
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
