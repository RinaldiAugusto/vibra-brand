"use client";

import { motion } from "framer-motion";

/**
 * UI de WhatsApp (iOS, modo CLARO) — presentacional pura.
 *
 * Replica el kit "WhatsApp UI Kit (iOS)" de Figma (file pho1tO7zqclyfrc1RoUOiA,
 * node 22:82): status bar, title bar con avatar/llamadas, fondo de doodles,
 * burbujas con cola y bottom bar con campo de texto.
 *
 * Todos los iconos son los SVG exportados del kit y viven en public/whatsapp/
 * (los assets remotos de Figma caducan a los 7 dias, por eso estan
 * commiteados). Las medidas en CSS son las del diseño (375pt de ancho) y
 * escalan solas: ver la unidad --u en globals.css.
 *
 * NO tiene estado ni timers: quien la usa decide que mensajes se ven y cuando.
 * Hoy la consumen el mockup del landing (components/AgentsFanMockup.tsx, con su
 * loop) y la demo interactiva (components/demo, guiada por pasos).
 */

export type WaMessage = {
  who: "client" | "bot";
  /** Texto de la burbuja. Puede ir junto con `card` (texto arriba). */
  text?: string;
  time: string;
  /** Tarjeta de turno confirmado dentro de la burbuja. */
  card?: {
    title: string;
    rows: { label: string; value: string }[];
    footer?: string;
  };
};

// Iconos del kit de Figma. Se referencian por ruta (no se redibujan a mano)
// para no perder la geometria original.
const WA_ICON = {
  chevron: "/whatsapp/chevron-left.svg",
  videoCall: "/whatsapp/icon-video-call.svg",
  audioCall: "/whatsapp/icon-audio-call.svg",
  attachment: "/whatsapp/icon-attachment.svg",
  camera: "/whatsapp/icon-camera.svg",
  microphone: "/whatsapp/icon-microphone.svg",
  statusRight: "/whatsapp/status-right.svg",
  check: "/whatsapp/checkmark.svg",
  plusV: "/whatsapp/icon-plus-v.svg",
  plusH: "/whatsapp/icon-plus-h.svg",
} as const;

export interface WhatsAppChatProps {
  messages: WaMessage[];
  /** Burbuja de puntitos: el agente esta escribiendo. */
  typing?: boolean;
  /** "escribiendo…" del contacto en la barra de titulo. */
  contactTyping?: boolean;
  contactName?: string;
  dateLabel?: string;
  unreadCount?: number;
  /** Texto tipeado en el campo pero todavia sin enviar. */
  draft?: string;
  /** Resalta el boton de enviar (se toca). */
  sendPressed?: boolean;
  /** Opacidad del hilo: la usa el loop del landing para el fade de reinicio. */
  threadOpacity?: number;
  /** Anima la entrada de cada burbuja. Off bajo reduced-motion. */
  animateBubbles?: boolean;
}

export default function WhatsAppChat({
  messages,
  typing = false,
  contactTyping = false,
  contactName = "Martina Gómez",
  dateLabel = "Hoy",
  unreadCount = 12,
  draft,
  sendPressed = false,
  threadOpacity = 1,
  animateBubbles = true,
}: WhatsAppChatProps) {
  return (
    <div className="wa-ui">
      {/* ---- Status bar (UI / App Bar) ---- */}
      <div className="wa-statusbar">
        <span className="wa-statusbar-time">9:41</span>
        <img className="wa-statusbar-icons" src={WA_ICON.statusRight} alt="" />
      </div>

      {/* ---- Title bar (UI / Title Bar / Account) ---- */}
      <div className="wa-titlebar">
        <div className="wa-titlebar-back">
          <img className="wa-chevron" src={WA_ICON.chevron} alt="" />
          <span className="wa-unread">{unreadCount}</span>
        </div>

        <div className="wa-profile">
          {/* El kit trae una foto de stock; acá va un avatar neutro. */}
          <div className="wa-avatar" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
            </svg>
          </div>
          <div className="wa-profile-text">
            <span className="wa-name">{contactName}</span>
            <span className="wa-status">
              {contactTyping ? "escribiendo…" : "en línea"}
            </span>
          </div>
        </div>

        <div className="wa-titlebar-actions">
          <img className="wa-icon" src={WA_ICON.videoCall} alt="" />
          <img className="wa-icon" src={WA_ICON.audioCall} alt="" />
        </div>
      </div>

      {/* ---- Conversación sobre el fondo de doodles (Chat Background) ---- */}
      <div className="wa-body">
        <div
          className="wa-thread"
          style={{ opacity: threadOpacity, transition: "opacity 0.6s ease" }}
        >
          <div className="wa-date">
            <span>{dateLabel}</span>
          </div>

          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`wa-row wa-row-${m.who}`}
              initial={animateBubbles ? { opacity: 0, y: 8, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={`wa-bubble wa-bubble-${m.who}`}>
                {m.text && <span className="wa-text">{m.text}</span>}

                {m.card && (
                  <div className="wa-card">
                    <span className="wa-card-title">{m.card.title}</span>
                    <dl className="wa-card-rows">
                      {m.card.rows.map((r) => (
                        <div key={r.label} className="wa-card-row">
                          <dt>{r.label}</dt>
                          <dd>{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                    {m.card.footer && (
                      <span className="wa-card-footer">{m.card.footer}</span>
                    )}
                  </div>
                )}

                <span className="wa-meta">
                  <span className="wa-time">{m.time}</span>
                  {m.who === "bot" && (
                    <img className="wa-checks" src={WA_ICON.check} alt="" />
                  )}
                </span>
              </div>
            </motion.div>
          ))}

          {typing && (
            <div className="wa-row wa-row-bot">
              <div className="wa-bubble wa-bubble-bot wa-typing" aria-hidden>
                <span className="wa-dot" />
                <span className="wa-dot" />
                <span className="wa-dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Bottom bar (UI / Bottom Bar) ----
          Con texto tipeado, iOS reemplaza camara y microfono por el boton de
          enviar; sin texto, el campo va vacio con el clip a la derecha. */}
      <div className="wa-bottombar">
        <div className="wa-bottombar-row">
          <span className="wa-plus" aria-hidden>
            <img src={WA_ICON.plusH} alt="" className="wa-plus-h" />
            <img src={WA_ICON.plusV} alt="" className="wa-plus-v" />
          </span>
          <div className="wa-field">
            {draft ? (
              <span className="wa-field-text">{draft}</span>
            ) : (
              <img className="wa-field-icon" src={WA_ICON.attachment} alt="" />
            )}
          </div>
          {draft ? (
            <span
              className={`wa-send${sendPressed ? " wa-send-pressed" : ""}`}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.39 1l1.49 5.16a1 1 0 00.83.72l9.1 1.35c.34.05.34.49 0 .54l-9.1 1.35a1 1 0 00-.83.72L2.01 19.4a1 1 0 001.39 1z" />
              </svg>
            </span>
          ) : (
            <>
              <img className="wa-icon" src={WA_ICON.camera} alt="" />
              <img className="wa-icon" src={WA_ICON.microphone} alt="" />
            </>
          )}
        </div>
        <div className="wa-home-indicator" aria-hidden>
          <span />
        </div>
      </div>
    </div>
  );
}
