"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- ESQUELETO ----
// FAQ en formato acordeón funcional (abrir/cerrar con estado).
// Reemplazar cada { question, answer } por el copy real.
const faqs = [
  {
    question: "[Pregunta 1 — placeholder]",
    answer: "[Respuesta 1 placeholder — completar después]",
  },
  {
    question: "[Pregunta 2 — placeholder]",
    answer: "[Respuesta 2 placeholder — completar después]",
  },
  {
    question: "[Pregunta 3 — placeholder]",
    answer: "[Respuesta 3 placeholder — completar después]",
  },
  {
    question: "[Pregunta 4 — placeholder]",
    answer: "[Respuesta 4 placeholder — completar después]",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <section className="section" id="faq">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">[EYEBROW — ej. Preguntas Frecuentes]</p>
        <h2 className="font-heading">[TÍTULO DE LA SECCIÓN — FAQ]</h2>
        <p style={{ margin: "0 auto" }}>
          [Subtítulo placeholder — completar después]
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
            >
              <button
                type="button"
                id={`faq-trigger-${index}`}
                className="faq-question font-heading"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => toggle(index)}
              >
                <span>{faq.question}</span>
                <motion.span
                  className="faq-icon"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
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
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="faq-answer">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
