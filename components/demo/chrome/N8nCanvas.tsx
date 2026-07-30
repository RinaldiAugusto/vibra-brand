"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";

/**
 * Canvas de n8n: los cuatro nodos del flujo de turnos, en cadena.
 *
 * Lo comparten la pantalla 3 (el flujo ejecutandose) y la 4 (el mismo canvas
 * atenuado, con el panel del ultimo nodo abierto encima).
 *
 * ESCALA: mismo truco que la UI de WhatsApp (ver .wa-ui en globals.css). El
 * canvas se diseña a 720px de ancho y declara una unidad --n = 1px de diseño,
 * asi el mismo markup entra igual en un celular y en un desktop sin media
 * queries. --n solo se puede usar en los HIJOS de .n8n-canvas.
 *
 * Los colores son los de n8n (canvas gris azulado, verde de "ejecutado",
 * naranja del trigger): pintarlos con el cyan de Vibra haria que no se lea como
 * n8n, que es justamente lo que la pantalla tiene que demostrar.
 */

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.51-.07-.15-.66-1.62-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34M12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.09.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4z" />
    </svg>
  );
}

function AgentGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#ff6d5a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="8" width="16" height="12" rx="3.5" />
      <path d="M12 4.2v3.8" />
      <circle cx="12" cy="3.1" r="1.2" fill="#ff6d5a" stroke="none" />
      <circle cx="9.2" cy="14" r="1.3" fill="#ff6d5a" stroke="none" />
      <circle cx="14.8" cy="14" r="1.3" fill="#ff6d5a" stroke="none" />
      <path d="M2.5 12.5v3M21.5 12.5v3" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#7d8bff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
      <path d="M9 14.2l2 2 4-4" />
    </svg>
  );
}

export type N8nNodo = {
  titulo: string;
  sub: string;
  glyph: React.ReactNode;
  /** El trigger se dibuja con el lado izquierdo redondeado, como en n8n. */
  trigger?: boolean;
};

export const N8N_NODOS: N8nNodo[] = [
  { titulo: "Mensaje del cliente", sub: "WhatsApp Trigger", glyph: <WhatsAppGlyph />, trigger: true },
  { titulo: "Agente WhatsApp", sub: "AI Agent", glyph: <AgentGlyph /> },
  { titulo: "Recordatorio 24 h", sub: "Schedule", glyph: <ClockGlyph /> },
  { titulo: "Turno agendado", sub: "Sistema · Turnos", glyph: <CalendarGlyph /> },
];

export default function N8nCanvas({
  ejecutando = -1,
  listos = 0,
  conectores = 0,
  seleccionado = -1,
  atenuado = false,
}: {
  /** Indice del nodo corriendo ahora (-1: ninguno). */
  ejecutando?: number;
  /** Cuantos nodos ya terminaron. */
  listos?: number;
  /** Cuantas conexiones ya pasaron el dato. */
  conectores?: number;
  /** Nodo resaltado con el borde de seleccion (pantalla 4). */
  seleccionado?: number;
  atenuado?: boolean;
}) {
  return (
    <div className={`n8n-canvas${atenuado ? " n8n-canvas-dim" : ""}`}>
      <div className="n8n-chain">
        {N8N_NODOS.map((nodo, i) => (
          <Fragment key={nodo.titulo}>
            <div className="n8n-cell">
              <motion.div
                className={[
                  "n8n-node",
                  nodo.trigger ? "n8n-node-trigger" : "",
                  i < listos ? "n8n-node-listo" : "",
                  i === ejecutando ? "n8n-node-corriendo" : "",
                  i === seleccionado ? "n8n-node-sel" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                animate={{ scale: i === ejecutando ? 1.06 : 1 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                <span className="n8n-node-glyph">{nodo.glyph}</span>

                {i < listos && (
                  <motion.span
                    className="n8n-node-check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.28, ease: "backOut" }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.span>
                )}
              </motion.div>

              <span className="n8n-node-titulo">{nodo.titulo}</span>
              <span className="n8n-node-sub">{nodo.sub}</span>
            </div>

            {i < N8N_NODOS.length - 1 && (
              <div className="n8n-conn" aria-hidden>
                <span className="n8n-conn-base" />
                <motion.span
                  className="n8n-conn-fill"
                  initial={false}
                  animate={{ scaleX: i < conectores ? 1 : 0 }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                />
                <motion.span
                  className="n8n-conn-dot"
                  initial={false}
                  animate={{
                    left: i < conectores ? "100%" : "0%",
                    opacity: i === conectores - 1 ? [0, 1, 1, 0] : 0,
                  }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                />
                <span className="n8n-conn-arrow" />
                {i < conectores && <span className="n8n-conn-items">1 item</span>}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
