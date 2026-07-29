"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import ServiceRow, { ServiceRowProps } from "./ServiceRow";
import { fadeUp, viewportOnce } from "./motion";
import { useBorderGlow } from "./useBorderGlow";

// Mismo destino que el botón principal de la landing (Header → CTA final).
const CTA_HREF = "#contacto-final";

// ---- Datos de las filas de servicio ----
// El lado del mockup alterna solo: filas pares (index 0, 2, 4) llevan reverse
// (mockup a la izquierda).
const rows: Omit<ServiceRowProps, "reverse" | "ctaHref">[] = [
  {
    // FILA 1 — Sistema Total (mockup izquierda / card derecha, DESTACADA)
    title: "Sistema Total",
    tagline:
      "Tu software, con tu lógica, tus procesos ahora automatizados y tus agentes adentro.",
    description:
      "No es una herramienta más: es TU sistema, hecho a medida. Toda tu operación —captar, atender, vender y hacer seguimiento— en un solo lugar que es 100% tuyo.",
    bullets: [
      "Hecho a tu medida, con las operaciones que necesites",
      "Todo integrado: web, agentes y automatizaciones",
      "Es tuyo y escala con vos",
    ],
    // Render 3D de una MacBook con el dashboard del sistema (marco incluido
    // en el video).
    mockup: "desktop-render",
    phoneVideoSrc: "/videos/sistema-total-render.mp4",
    highlighted: true,
    badge: "MÁS POPULAR",
  },
  {
    // FILA 2 — Agente Telefónico (card izquierda / mockup derecha)
    title: "Agente Telefónico",
    tagline:
      "Un empleado que atiende y llama por voz — el teléfono que nunca suena ocupado.",
    description:
      "Atiende llamadas entrantes y hace llamadas salientes con voz natural. Confirma, coordina y da la correcta información sin que nadie de tu equipo levante un teléfono.",
    bullets: [
      "Cero llamadas perdidas, aunque suenen todas a la vez",
      "Llama por vos: confirma turnos y recuerda pagos",
      "Habla natural y deriva a un humano cuando hace falta",
    ],
    // Celular con la llamada en curso: device = frame nuevo, UI animada en
    // codigo (timer, ondas de audio, transcripcion). Ver AgentsFanMockup.
    mockup: "call",
  },
  {
    // FILA 3 — Agente de Chat (mockup izquierda / card derecha)
    title: "Agente de Chat",
    tagline: "Un empleado que atiende por texto 24/7 — y nunca se toma franco.",
    description:
      "Contesta a tus clientes al instante por web y WhatsApp, a cualquier hora. Vende, agenda y responde como tu mejor empleado, sin sueldo fijo ni descansos.",
    bullets: [
      "Nunca pierdas un cliente por no contestar a tiempo",
      "Atiende a 100 personas a la vez, sin esperas",
      "Trabaja sobre tu agenda y tu CRM, todo dentro del sistema",
    ],
    // Celular con el chat de WhatsApp: device = frame nuevo, conversacion
    // animada en codigo (burbujas, "escribiendo…"). Ver AgentsFanMockup.
    mockup: "chat",
  },
  {
    // FILA 4 — Operaciones Automatizadas (card izquierda / mockup derecha)
    title: "Operaciones Automatizadas",
    tagline:
      "Las tareas repetitivas de tus empleados, ahora hechas solas — ahorrando tu tiempo.",
    description:
      "Todo ese trabajo manual que come horas —cargar datos, mandar mails, pasar info de un lado a otro— pasa a hacerse solo y sin errores. Tu equipo se dedica a lo que de verdad importa.",
    bullets: [
      "Recuperá las horas que tu equipo pierde en lo manual",
      "Cero errores de carga: la info fluye sola",
      "Todo ocurre dentro de tu sistema, sin apps sueltas",
    ],
    // Render 3D de una MacBook con 2 escenas (flujo + dashboard) en loop
    // (marco incluido en el video).
    mockup: "desktop-render",
    phoneVideoSrc: "/videos/operaciones-render.mp4",
    caption: "Así se ve el sistema que trabaja por vos",
  },
  {
    // FILA 5 — Presencia (mockup izquierda / card derecha)
    title: "Presencia",
    tagline:
      "La cara de tu negocio online — hecha para vender, no solo para verse linda.",
    description:
      "Tu web, landing o aplicación web diseñada para convertir visitas en clientes. Rápida, profesional y pensada para que la gente te encuentre y te elija.",
    bullets: [
      "Una primera impresión que genera confianza",
      "Hecha para convertir visitas en contactos",
      "Rápida, optimizada para Google y celulares",
    ],
    // Acá el contenido ES una web, así que sigue siendo video: presencia-pantalla.mp4
    // es el tramo frontal de presencia-render.mp4 recortado A LA PANTALLA (sin el
    // iPhone del render, que ahora lo pone el frame) y cerrado en loop con un
    // crossfade de 0.7s. Su aspect (688/1466) es el del hueco del frame.
    mockup: "phone",
    phoneVideoSrc: "/videos/presencia-pantalla.mp4",
  },
];

// ---- Franja de cierre: Vibra Care (ancho completo, sin botón) ----
const VIBRA_CARE_BULLETS = [
  "Todo siempre funcionando: monitoreo y soporte",
  "Mejora continua: tus agentes se afinan mes a mes",
  "Un equipo detrás para ajustar y sumar lo que necesites",
];

export default function ServicesSection() {
  const careGlow = useBorderGlow<HTMLDivElement>();
  return (
    <section className="section services-section" id="servicios">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <p className="eyebrow">
          <span className="marker-underline">Nuestros Servicios</span>
        </p>
        <h2 className="font-heading">Soluciones que liberan tu tiempo.</h2>
        <p style={{ margin: "0 auto" }}>
          Elegí el nivel de automatización que tu negocio necesita.
        </p>
      </motion.div>

      <div className="service-rows">
        {rows.map((row, index) => (
          <Fragment key={row.title}>
            <ServiceRow {...row} reverse={index % 2 === 0} ctaHref={CTA_HREF} />

            {/* Conector: los dos agentes se pueden combinar en uno solo. */}
            {row.title === "Agente Telefónico" && (
              <div className="combine-connector" aria-label="Se pueden combinar ambos agentes">
                <span className="combine-line" aria-hidden />
                <span className="combine-pill">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="8 3 4 7 8 11" />
                    <polyline points="16 13 20 17 16 21" />
                    <path d="M4 7h11a5 5 0 015 5v0" />
                    <path d="M20 17H9a5 5 0 01-5-5v0" />
                  </svg>
                  Combiná ambos en un solo agente
                </span>
                <span className="combine-line" aria-hidden />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* Vibra Care — no es un servicio más: sostiene a todos. Sin CTA. */}
      <motion.div
        ref={careGlow.ref}
        {...careGlow.handlers}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="vibra-care-strip border-glow"
      >
        <span className="edge-light" aria-hidden />
        <div className="vibra-care-icon" aria-hidden>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        <div className="vibra-care-content">
          <p className="eyebrow">El plan que lo sostiene todo</p>
          <h3 className="font-heading">Vibra Care</h3>
          <p className="vibra-care-desc">
            Tu sistema siempre funcionando, mejorando y actualizado — sin que te
            preocupes. Nosotros lo cuidamos, vos te dedicás a tu negocio.
          </p>
          <ul className="vibra-care-features">
            {VIBRA_CARE_BULLETS.map((feat) => (
              <li key={feat}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
