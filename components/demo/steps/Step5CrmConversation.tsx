"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../../motion";
import BrowserFrame from "../chrome/BrowserFrame";
import CrmShell from "../chrome/CrmShell";
import { CHAT, NEGOCIO, TURNO } from "../script";
import { useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 5 — la conversacion, del lado del dueño.
 *
 * Es LA MISMA charla de las pantallas 1 y 2 (sale del mismo CHAT del guion),
 * pero vista desde el CRM: cada mensaje del agente viene etiquetado, y el turno
 * quedo enganchado a la ficha del cliente.
 *
 * El remate es el boton "Responder manual": el punto no es que el agente
 * atiende solo, es que vos podes meterte cuando quieras sin cambiar de app.
 */

const OTRAS = [
  { nombre: "Sofía Ruiz", ultimo: "¿Atienden el sábado?", hora: "15:41", estado: "Atendido" },
  { nombre: "Martín Díaz", ultimo: "Turno confirmado", hora: "14:20", estado: "Turno" },
  { nombre: "Lucía Ferrari", ultimo: "Recordatorio enviado", hora: "12:05", estado: "Turno" },
];

export default function Step5CrmConversation() {
  const [visibles, setVisibles] = useState(0);
  const [resalta, setResalta] = useState(false);
  const [composer, setComposer] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(380);

      for (let i = 0; i < CHAT.length && alive(); i++) {
        setVisibles(i + 1);
        await wait(160);
      }

      await wait(900);
      if (!alive()) return;
      setResalta(true);
      await wait(700);
      setComposer(true);
    },
    () => {
      setVisibles(CHAT.length);
      setResalta(true);
      setComposer(true);
    }
  );

  return (
    <div className="demo-escena demo-escena-5">
      <BrowserFrame url={NEGOCIO.crm}>
        <CrmShell activa="conversaciones" negocio={NEGOCIO.nombre}>
          {/* ---- Lista de conversaciones ---- */}
          <div className="crmx-lista">
            <span className="crmx-lista-head">
              Conversaciones
              <span className="crmx-lista-badge">4</span>
            </span>

            <div className="crmx-conv crmx-conv-on">
              <span className="crmx-conv-top">
                <span className="crmx-conv-nombre">{TURNO.cliente}</span>
                <span className="crmx-conv-hora">16:03</span>
              </span>
              <span className="crmx-conv-ultimo">Turno confirmado ✅</span>
              <span className="crmx-chip crmx-chip-ia">Agente IA</span>
            </div>

            {OTRAS.map((c) => (
              <div key={c.nombre} className="crmx-conv">
                <span className="crmx-conv-top">
                  <span className="crmx-conv-nombre">{c.nombre}</span>
                  <span className="crmx-conv-hora">{c.hora}</span>
                </span>
                <span className="crmx-conv-ultimo">{c.ultimo}</span>
                <span className="crmx-chip crmx-chip-ia">Agente IA</span>
              </div>
            ))}
          </div>

          {/* ---- El hilo ---- */}
          <div className="crmx-hilo">
            <div className="crmx-hilo-head">
              <div className="crmx-hilo-quien">
                <span className="crmx-hilo-nombre">{TURNO.cliente}</span>
                <span className="crmx-hilo-tel">
                  {TURNO.telefono} · WhatsApp
                </span>
              </div>

              <div className="crmx-hilo-acciones">
                <span className="crmx-chip crmx-chip-turno">
                  Turno · hoy {TURNO.hora}
                </span>
                <motion.span
                  className={`crmx-btn-manual${
                    resalta ? " crmx-btn-manual-on" : ""
                  }`}
                  animate={resalta ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  Responder manual
                </motion.span>
              </div>
            </div>

            <div className="crmx-mensajes">
              {CHAT.slice(0, visibles).map((m, i) => (
                <motion.div
                  key={i}
                  className={`crmx-msg crmx-msg-${
                    m.who === "bot" ? "saliente" : "entrante"
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  <span className="crmx-msg-autor">
                    {m.who === "bot" ? "Agente IA" : TURNO.cliente}
                    <span className="crmx-msg-hora">{m.time}</span>
                  </span>
                  {m.text && <span className="crmx-msg-texto">{m.text}</span>}
                  {m.card && (
                    <span className="crmx-msg-turno">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                        <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
                      </svg>
                      TRN-2148 · {TURNO.servicio} · hoy {TURNO.hora} · {TURNO.profesional}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="crmx-composer"
              initial={false}
              animate={
                composer
                  ? { opacity: 1, y: 0, height: "auto" }
                  : { opacity: 0, y: 12, height: 0 }
              }
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <span className="crmx-composer-field">
                Escribí para tomar la conversación…
              </span>
              <span className="crmx-composer-send" aria-hidden>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.39 1l1.49 5.16a1 1 0 00.83.72l9.1 1.35c.34.05.34.49 0 .54l-9.1 1.35a1 1 0 00-.83.72L2.01 19.4a1 1 0 001.39 1z" />
                </svg>
              </span>
            </motion.div>
          </div>
        </CrmShell>
      </BrowserFrame>
    </div>
  );
}
