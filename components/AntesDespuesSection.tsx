"use client";

import { motion } from "framer-motion";
import {
  fadeUp,
  fadeItem,
  staggerContainer,
  viewportOnce,
  HOVER_SPRING,
} from "./motion";

// "Antes / Después": comparación visual del dolor actual vs. la solución con IA.
// Los dos arrays van apareados: cada item de `despues` responde al de `antes`
// en la misma posicion. Si se agrega uno, agregar su par del otro lado.
const antes = [
  "Mensajes que entran a la noche y contestás al otro día — si te acordás",
  "Tu equipo pierde horas cargando datos y pasando info de un lado a otro",
  "Si vos parás, el negocio para: todo pasa por vos",
];

const despues = [
  "Cada mensaje y cada llamada respondida al instante, a cualquier hora",
  "Las tareas repetitivas se hacen solas y sin errores de carga",
  "El sistema sigue atendiendo y vendiendo aunque te tomes el día",
];

export default function AntesDespuesSection() {
  return (
    <section className="section" id="antes-despues">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <p className="eyebrow">
          <span className="marker-underline">El cambio</span>
        </p>
        <h2 className="font-heading">Cómo cambia tu semana</h2>
        <p style={{ margin: "0 auto" }}>
          El mismo negocio, con y sin un sistema que trabaje por vos.
        </p>
      </motion.div>

      <div className="compare-grid">
        {/* Columna ANTES (dolor actual) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -6, transition: HOVER_SPRING }}
          className="compare-card compare-card-before"
        >
          <h3 className="compare-heading font-heading">Hoy, sin sistema</h3>
          <motion.ul
            className="compare-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {antes.map((item) => (
              <motion.li key={item} variants={fadeItem}>
                <span className="compare-mark compare-mark-before" aria-hidden>
                  ✕
                </span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Columna DESPUÉS (solución con IA) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ y: -6, transition: HOVER_SPRING }}
          className="compare-card compare-card-after"
        >
          <h3 className="compare-heading font-heading">Con Vibra</h3>
          <motion.ul
            className="compare-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {despues.map((item) => (
              <motion.li key={item} variants={fadeItem}>
                <span className="compare-mark compare-mark-after" aria-hidden>
                  ✓
                </span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
