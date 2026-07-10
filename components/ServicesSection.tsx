"use client";

import ServiceRow, { ServiceRowProps } from "./ServiceRow";

// Mismo destino que el botón principal de la landing (Header → CTA final).
const CTA_HREF = "#contacto-final";

// ---- Datos de las 4 filas ----
// El lado del mockup alterna solo: filas impares (index 1, 3) llevan reverse.
const rows: Omit<ServiceRowProps, "reverse" | "ctaHref">[] = [
  {
    // FILA 1 — card izquierda / mockup derecha
    title: "Presencia Digital",
    description:
      "Tu negocio, visible y profesional en internet. Creamos la página que hace que tus clientes te encuentren, confíen en vos y te contacten.",
    bullets: [
      "Diseño profesional a medida",
      "Rápida y lista en cualquier pantalla",
      "Preparada para captar clientes",
    ],
    mockup: "phone",
    // Demo viva en el frame de celular.
    phoneVideoSrc: "/videos/presencia-digital-demo.mp4",
  },
  {
    // FILA 2 — mockup izquierda / card derecha
    title: "Agentes para Atención Automática",
    description:
      "Nunca más dejes a un cliente esperando. Creamos asistentes con inteligencia artificial que responden consultas y agendan turnos por vos, las 24 horas. Elegí el canal que tu negocio necesita.",
    subBlocks: [
      {
        title: "Agente de Chat",
        description:
          "Atiende por WhatsApp y tu web. Responde consultas, agenda turnos y capta clientes por texto, al instante.",
      },
      {
        title: "Agente Telefónico",
        description:
          "Contesta las llamadas con voz natural. Agenda citas y filtra consultas por teléfono, sin que tengas que atender vos.",
      },
    ],
    bullets: [
      "Responde al instante, siempre",
      "Agenda turnos automáticamente",
      "Uno, otro, o los dos combinados",
    ],
    // Dos celulares animados en fan: llamada adelante, chat de WhatsApp detrás.
    mockup: "agents",
  },
  {
    // FILA 3 — card izquierda / mockup derecha (compu / n8n)
    title: "Operaciones Automatizadas",
    description:
      "Dejá de perder horas en tareas repetitivas. Conectamos y automatizamos los procesos internos de tu negocio para que todo funcione solo, sin errores ni olvidos.",
    bullets: [
      "Menos trabajo manual",
      "Tus herramientas, conectadas entre sí",
      "Reportes y seguimientos automáticos",
    ],
    // Mockup de compu con animacion de 2 escenas (flujo + dashboard) en loop.
    mockup: "ops",
    caption: "Así se ve el sistema que trabaja por vos",
  },
  {
    // FILA 4 — mockup izquierda / card derecha (DESTACADA)
    title: "Solución a Medida",
    description:
      "La solución definitiva. Desarrollamos un sistema completo y a medida para tu negocio, que combina web, atención automática y automatización de procesos en una sola herramienta hecha para vos.",
    bullets: [
      "Todo integrado en un solo sistema",
      "Hecho 100% a tu medida",
      "Web + atención + automatización",
    ],
    mockup: "combo",
    highlighted: true,
    badge: "MÁS POPULAR",
  },
];

export default function ServicesSection() {
  return (
    <section className="section services-section" id="servicios">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p className="eyebrow">Nuestros Servicios</p>
        <h2 className="font-heading">Soluciones que liberan tu tiempo.</h2>
        <p style={{ margin: "0 auto" }}>
          Elegí el nivel de automatización que tu negocio necesita.
        </p>
      </div>

      <div className="service-rows">
        {rows.map((row, index) => (
          <ServiceRow
            key={row.title}
            {...row}
            reverse={index % 2 === 1}
            ctaHref={CTA_HREF}
          />
        ))}
      </div>
    </section>
  );
}
