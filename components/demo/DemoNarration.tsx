"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "../motion";
import { PASOS, TOTAL_PASOS } from "./script";

/**
 * Panel de relato: lo que convierte la demo en un argumento y no en una
 * animacion linda. Dice en que paso estamos y que esta pasando adentro del
 * mockup, que es justo lo que un mockup no puede explicar solo.
 *
 * Va en una region aria-live: al cambiar de paso, un lector de pantalla anuncia
 * el titulo y la bajada nuevos (el mockup en si es decorativo).
 */
export default function DemoNarration({ paso }: { paso: number }) {
  const meta = PASOS[paso];

  return (
    <div className="demo-narration" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          <p className="demo-narration-count">
            Paso {paso + 1} de {TOTAL_PASOS}
          </p>
          <h2 className="demo-narration-title font-heading">{meta.titulo}</h2>
          <p className="demo-narration-body">{meta.bajada}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
