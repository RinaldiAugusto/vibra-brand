"use client";

import { motion } from "framer-motion";

interface LampSectionProps {
  title: string;
  description: string;
}

// Solo dispara la animacion cuando la lamp ya esta bien dentro del viewport,
// asi no se cruza con el final de la animacion del hero.
const trigger = { once: true, margin: "-25% 0px" };

/**
 * Efecto "lamp" adaptado de Aceternity UI (originalmente en Tailwind) a CSS
 * plano para convivir con el resto del sitio. El haz de luz ilumina el titulo
 * de la seccion "El problema".
 */
export default function LampSection({
  title,
  description,
}: LampSectionProps) {
  return (
    <section className="lamp-section">
      <div className="lamp-stage">
        <motion.div
          initial={{ opacity: 0.5, width: "21rem" }}
          whileInView={{ opacity: 1, width: "44rem" }}
          viewport={trigger}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="lamp-beam lamp-beam-left"
        >
          <div className="lamp-mask-bottom" />
          <div className="lamp-mask-side lamp-mask-side-left" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "21rem" }}
          whileInView={{ opacity: 1, width: "44rem" }}
          viewport={trigger}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="lamp-beam lamp-beam-right"
        >
          <div className="lamp-mask-side lamp-mask-side-right" />
          <div className="lamp-mask-bottom" />
        </motion.div>

        <div className="lamp-blur-block" />
        <div className="lamp-backdrop" />
        <div className="lamp-glow-big" />
        <motion.div
          initial={{ width: "11rem" }}
          whileInView={{ width: "22rem" }}
          viewport={trigger}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="lamp-glow-inner"
        />
        <motion.div
          initial={{ width: "21rem" }}
          whileInView={{ width: "44rem" }}
          viewport={trigger}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="lamp-line"
        />
        <div className="lamp-top-mask" />
      </div>

      <div className="lamp-content">
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={trigger}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="lamp-title font-heading"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={trigger}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="lamp-description"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
