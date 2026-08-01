"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeUp,
  fadeItem,
  staggerContainer,
  viewportOnce,
  EASE_OUT,
} from "./motion";
import { useBorderGlow } from "./useBorderGlow";

// FAQ en formato acordeón funcional (abrir/cerrar con estado).
// Las preguntas se usan como key del map: tienen que ser únicas entre sí.
// Los precios no van en la página a propósito — se dan en la llamada.
const faqs = [
  {
    // Dos semanas: mismo plazo que el paso 03 de ProcesoSection.tsx. Si cambia
    // uno, cambiar el otro.
    question: "¿Cuánto tarda en estar funcionando?",
    answer:
      "Dos semanas. Una vez que entendimos tu negocio y definimos el alcance, construimos tu sistema y te lo entregamos terminado, listo para implementar.",
  },
  {
    question: "¿Cuánto cuesta?",
    answer:
      "No vendemos paquetes cerrados: cada sistema se cotiza según lo que tu negocio necesita. En la llamada de diagnóstico te damos un rango concreto, y la propuesta llega con precio cerrado antes de que te comprometas a nada.",
  },
  {
    question: "¿Necesito saber de tecnología?",
    answer:
      "No. Vos ponés el conocimiento de tu negocio, nosotros la parte técnica. Te entregamos todo andando y le enseñamos a tu equipo a usarlo. Si algo falla o querés cambiar algo, nos escribís y lo resolvemos nosotros.",
  },
  {
    question: "¿Mis clientes se van a dar cuenta de que hablan con una IA?",
    answer:
      "El agente habla natural y con el tono de tu negocio, y conoce tus precios, tu agenda y tus servicios. Cuando una consulta se sale de lo que puede resolver, la deriva a una persona de tu equipo en vez de improvisar.",
  },
  {
    question: "¿Esto se suma a las herramientas que ya uso?",
    answer:
      "No es una app más para agregar a la pila. Te entregamos la solución completa —el CRM, los agentes y las automatizaciones— en un solo sistema hecho para tu negocio. Toda tu operación en un lugar, en vez de repartida entre planillas, apps y casillas sueltas.",
  },
];

// Cada item es su propio componente porque useBorderGlow es un hook y no se
// puede llamar dentro del .map(). Mismo efecto de borde que la franja de
// Vibra Care. El estado de abierto/cerrado lo sigue manejando el padre, asi
// que solo puede haber uno abierto a la vez.
function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const glow = useBorderGlow<HTMLDivElement>();

  return (
    <motion.div
      ref={glow.ref}
      {...glow.handlers}
      variants={fadeItem}
      className={`faq-item border-glow ${isOpen ? "faq-item-open" : ""}`}
    >
      <span className="edge-light" aria-hidden />
      <button
        type="button"
        id={`faq-trigger-${index}`}
        className="faq-question font-heading"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
      >
        <span>{faq.question}</span>
        <motion.span
          className="faq-icon"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          aria-hidden
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-answer-wrapper"
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <p className="faq-answer">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <section className="section" id="faq">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="section-head"
      >
        <p className="eyebrow">
          <span className="marker-underline">Preguntas Frecuentes</span>
        </p>
        <h2 className="font-heading">Lo que nos preguntan antes de empezar</h2>
        <p>
          Si tenés una que no está acá, escribinos — te contestamos en el día.
        </p>
      </motion.div>

      <motion.div
        className="faq-list"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {faqs.map((faq, index) => (
          <FaqItem
            key={faq.question}
            faq={faq}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </motion.div>
    </section>
  );
}
