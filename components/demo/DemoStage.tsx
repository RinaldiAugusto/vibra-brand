"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "../motion";
import DemoNarration from "./DemoNarration";
import { PASOS } from "./script";

/**
 * El escenario: mockup a la izquierda, relato a la derecha (una sola columna
 * abajo de 1024px, con el mockup arriba).
 *
 * Acá vive la transicion entre pantallas y nada mas: quien decide el paso es
 * DemoPlayer. El slide es direccional —al avanzar entra desde la derecha, al
 * volver desde la izquierda— para que se sienta un recorrido con un orden.
 *
 * mode="wait" es importante: los pasos son mockups pesados, y solapar dos
 * durante la transicion mostraria dos escenas a la vez.
 */
const SLIDE = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

export default function DemoStage({
  paso,
  dir,
  children,
}: {
  paso: number;
  dir: number;
  children: React.ReactNode;
}) {
  return (
    <div className="demo-stage">
      <div className="demo-stage-mockup">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={paso}
            className="demo-slide"
            custom={dir}
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE_OUT }}
            role="group"
            aria-label={`Pantalla ${paso + 1}: ${PASOS[paso].titulo}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <DemoNarration paso={paso} />
    </div>
  );
}
