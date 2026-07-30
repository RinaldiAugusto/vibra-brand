"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhoneShell from "../../PhoneShell";
import WhatsAppChat from "../../whatsapp/WhatsAppChat";
import { EASE_OUT } from "../../motion";
import BrowserFrame from "../chrome/BrowserFrame";
import {
  CHAT,
  CHAT_HASTA_PASO_1,
  NEGOCIO,
  PRIMER_MENSAJE,
  TURNO,
} from "../script";
import { useStepPlayer } from "../useStepPlayer";

/**
 * PANTALLA 1 — de la web a WhatsApp.
 *
 * La web de la barberia (no la de Vibra: es la del cliente) con un boton que
 * abre WhatsApp con el mensaje ya escrito. Es el link wa.me de toda la vida,
 * pero mostrado: el visitante ve que el cliente no llena ningun formulario ni
 * instala nada.
 *
 * El cursor va en porcentajes del area de pantalla, no en px: asi apunta al
 * boton en cualquier ancho sin medir nada en runtime.
 */

const SERVICIOS = [
  { nombre: "Corte clásico", precio: "$9.500" },
  { nombre: "Corte + barba", precio: TURNO.precio },
  { nombre: "Perfilado de barba", precio: "$7.000" },
];

// Posicion del boton dentro de .demo-browser-screen (en %).
const BOTON = { x: 50, y: 74 };

export default function Step1WebToWhatsapp() {
  const [cursor, setCursor] = useState<"fuera" | "boton">("fuera");
  const [click, setClick] = useState(false);
  const [telefono, setTelefono] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useStepPlayer(
    async ({ wait, alive }) => {
      await wait(450);
      setCursor("boton");
      await wait(1000);
      if (!alive()) return;
      setClick(true);
      await wait(260);
      setClick(false);
      await wait(180);
      setTelefono(true); // WhatsApp se abre con el mensaje precargado
      await wait(1500);
      if (!alive()) return;
      setEnviando(true); // se toca enviar
      await wait(220);
      setEnviando(false);
      setEnviado(true);
    },
    // Estado final para reduced-motion: el telefono ya abierto y el mensaje ya
    // enviado, que es lo que la pantalla tiene que contar.
    () => {
      setCursor("boton");
      setTelefono(true);
      setEnviado(true);
    },
  );

  return (
    <div className="demo-escena demo-escena-1">
      {/* El wrapper existe para que el celular se posicione contra el NAVEGADOR
          y no contra el escenario: asi mantiene la misma relacion con la web en
          cualquier ancho, en vez de irse flotando cuando sobra alto. */}
      <div className="demo-escena-1-inner">
        <BrowserFrame url={NEGOCIO.web} className="demo-browser-web">
          {/* ---- Web de la barberia ---- */}
          <div className="bz-site">
            <div className="bz-nav">
              <span className="bz-logo">
                <span className="bz-logo-mark" aria-hidden>
                  ✂
                </span>
                {NEGOCIO.nombre}
              </span>
              <span className="bz-nav-links" aria-hidden>
                <span>Servicios</span>
                <span>Nosotros</span>
                <span>Contacto</span>
              </span>
            </div>

            <div className="bz-hero">
              <p className="bz-eyebrow">Palermo · desde 2014</p>
              <h3 className="bz-title font-heading">
                Cortes que se notan.
                <br />
                Turnos que no te hacen esperar.
              </h3>

              <ul className="bz-servicios">
                {SERVICIOS.map((s) => (
                  <li key={s.nombre}>
                    <span>{s.nombre}</span>
                    <span className="bz-precio">{s.precio}</span>
                  </li>
                ))}
              </ul>

              <motion.span
                className="bz-cta"
                animate={click ? { scale: 0.95 } : { scale: 1 }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.51-.07-.15-.66-1.62-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34M12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.09.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4z" />
                </svg>
                Agendar turno por WhatsApp
              </motion.span>

              <p className="bz-legal">
                También podés escribirnos al {TURNO.telefono}
              </p>
            </div>

            {/* Cursor simulado */}
            <motion.span
              className="bz-cursor"
              aria-hidden
              initial={false}
              animate={
                cursor === "boton"
                  ? { left: `${BOTON.x}%`, top: `${BOTON.y}%`, opacity: 1 }
                  : { left: "88%", top: "108%", opacity: 0 }
              }
              transition={{ duration: 0.95, ease: EASE_OUT }}
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M5.5 2.8l13.2 8.3-5.7 1.1 3 5.7-2.6 1.4-3-5.7-4 4.2z"
                  fill="#fff"
                  stroke="rgba(0,0,0,.45)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
              {click && <span className="bz-cursor-ping" />}
            </motion.span>
          </div>
        </BrowserFrame>

        {/* ---- El celular sube por encima con WhatsApp ya abierto ---- */}
        <motion.div
          className="demo-escena-1-phone"
          initial={false}
          animate={
            telefono
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 70, scale: 0.94 }
          }
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          <PhoneShell>
            <WhatsAppChat
              contactName={NEGOCIO.nombre}
              messages={enviado ? CHAT.slice(0, CHAT_HASTA_PASO_1) : []}
              draft={enviado ? undefined : PRIMER_MENSAJE}
              sendPressed={enviando}
              unreadCount={3}
            />
          </PhoneShell>
        </motion.div>
      </div>
    </div>
  );
}
