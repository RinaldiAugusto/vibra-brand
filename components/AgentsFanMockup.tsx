"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Mockup de la fila "Agentes para Atención Automática": dos celulares
 * escalonados (fan). Adelante y protagonista, el Agente Telefónico (llamada
 * en curso). Detrás/escalonado, el Agente de WhatsApp (chat animado).
 *
 * Ambas UIs se animan enteramente en código (sin videos ni imágenes) y
 * loopean de forma suave. Las animaciones puramente decorativas (ondas de
 * audio, puntitos de "escribiendo", caret) viven como keyframes CSS, asi el
 * bloque global de prefers-reduced-motion las congela solo. Las secuencias JS
 * (chat, transcripcion, timer) se cortan bajo reduced-motion mostrando el
 * estado final estatico.
 */

// Frame de celular reutilizando el device del sitio (.mockup-phone).
export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mockup-phone">
      <div className="mockup-phone-camera" aria-hidden />
      <div className="mockup-phone-display">{children}</div>
    </div>
  );
}

/* ============================================================
   CELULAR 1 (detrás) — Agente de WhatsApp (chat)
   ============================================================ */

type ChatMsg = { who: "client" | "bot"; text: string; time: string };

const CHAT_SCRIPT: ChatMsg[] = [
  { who: "client", text: "Hola! Atienden hoy?", time: "16:02" },
  {
    who: "bot",
    text: "¡Hola! 😊 Sí, tenemos turnos hoy a las 16:00 y 18:30. ¿Te reservo alguno?",
    time: "16:02",
  },
  { who: "client", text: "El de las 16", time: "16:03" },
  { who: "bot", text: "¡Listo! Turno confirmado para hoy 16:00 ✅", time: "16:03" },
];

export function ChatPhone() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reduce ? CHAT_SCRIPT.length : 0);
  const [typing, setTyping] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (reduce) {
      setVisible(CHAT_SCRIPT.length);
      setTyping(false);
      return;
    }
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    (async () => {
      // ritmo tranquilo, comodo de leer
      while (alive) {
        setFading(false);
        setVisible(0);
        setTyping(false);
        await wait(700);
        for (let i = 0; i < CHAT_SCRIPT.length && alive; i++) {
          if (CHAT_SCRIPT[i].who === "bot") {
            setTyping(true);
            await wait(1500);
            if (!alive) break;
            setTyping(false);
          }
          setVisible(i + 1);
          await wait(CHAT_SCRIPT[i].who === "bot" ? 1600 : 1300);
        }
        await wait(2400); // se deja leer la confirmacion
        setFading(true);
        await wait(900); // fade out suave antes de reiniciar
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="wa-ui">
      <div className="wa-header">
        <div className="wa-avatar" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
          </svg>
        </div>
        <div className="wa-header-info">
          <span className="wa-name">Cliente</span>
          <span className="wa-status">en línea</span>
        </div>
      </div>

      <div
        className="wa-body"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
      >
        {CHAT_SCRIPT.slice(0, visible).map((m, i) => (
          <motion.div
            key={i}
            className={`wa-row wa-row-${m.who}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className={`wa-bubble wa-bubble-${m.who}`}>
              <span className="wa-text">{m.text}</span>
              <span className="wa-meta">
                {m.time}
                {m.who === "bot" && <span className="wa-checks">✓✓</span>}
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
  );
}

/* ============================================================
   CELULAR 2 (adelante) — Agente Telefónico (llamada)
   ============================================================ */

const CALL_LINES = [
  "Perfecto, te agendo para el jueves a las 10:00…",
  "Genial, te llega la confirmación por WhatsApp.",
];

const WAVE_BARS = 13;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function CallPhone() {
  const reduce = useReducedMotion();
  const [sec, setSec] = useState(1);
  const [typed, setTyped] = useState(reduce ? CALL_LINES[0] : "");
  const [transDim, setTransDim] = useState(false);

  // Timer de llamada: corre siempre; reinicia a 00:01 cada 30s (loop suave).
  useEffect(() => {
    const id = setInterval(() => {
      setSec((s) => (s >= 30 ? 1 : s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Transcripción en vivo (typewriter) en loop.
  useEffect(() => {
    if (reduce) {
      setTyped(CALL_LINES[0]);
      return;
    }
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    (async () => {
      while (alive) {
        for (const line of CALL_LINES) {
          setTransDim(false);
          setTyped("");
          for (let i = 1; i <= line.length && alive; i++) {
            setTyped(line.slice(0, i));
            await wait(48); // tecleo tranquilo
          }
          await wait(2400); // se deja leer
          setTransDim(true); // fade suave antes de la siguiente linea
          await wait(500);
        }
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="call-ui">
      <div className="call-top">
        <span className="call-state">Llamada en curso</span>
        <span className="call-timer">{formatTime(sec)}</span>
      </div>

      <div className="call-main">
        <div className="call-avatar" aria-hidden>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a8 8 0 0116 0" />
            <rect x="2.5" y="11" width="4" height="7" rx="2" />
            <rect x="17.5" y="11" width="4" height="7" rx="2" />
            <path d="M20 18a4 4 0 01-4 4h-2" />
          </svg>
        </div>
        <span className="call-name">Asistente IA — Vibra</span>
        <span className="call-sub">Llamada de voz</span>

        <div className="call-waves" aria-hidden>
          {Array.from({ length: WAVE_BARS }).map((_, i) => (
            <span
              key={i}
              className="call-bar"
              style={{
                animationDelay: `${(i % 6) * 0.16}s`,
                animationDuration: `${1.5 + (i % 4) * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="call-transcript"
        style={{ opacity: transDim ? 0.35 : 1, transition: "opacity 0.4s ease" }}
      >
        <span className="call-transcript-dot" aria-hidden />
        <span className="call-transcript-text">
          {typed}
          {!reduce && <span className="call-caret" aria-hidden />}
        </span>
      </div>

      <div className="call-actions" aria-hidden>
        <span className="call-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" />
          </svg>
        </span>
        <span className="call-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="5" r="1.6" /><circle cx="12" cy="5" r="1.6" /><circle cx="19" cy="5" r="1.6" />
            <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
            <circle cx="5" cy="19" r="1.6" /><circle cx="12" cy="19" r="1.6" /><circle cx="19" cy="19" r="1.6" />
          </svg>
        </span>
        <span className="call-action call-action-end">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9c-2.4 0-4.7.4-6.8 1.1-.5.2-.8.7-.8 1.2v2.1c0 .5.4.9.9.9.4 0 .8-.2 1-.6l1-1.6c.1-.2.1-.5-.1-.7C9.5 11 10.7 10.8 12 10.8s2.5.2 3.7.9c-.2.2-.2.5-.1.7l1 1.6c.2.4.6.6 1 .6.5 0 .9-.4.9-.9v-2.1c0-.5-.3-1-.8-1.2C16.7 9.4 14.4 9 12 9z" transform="rotate(135 12 12)" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Fan: llamada adelante, chat detrás
   ============================================================ */

export default function AgentsFanMockup() {
  return (
    <div className="agents-fan" aria-hidden>
      <div className="agents-fan-phone agents-fan-phone-back">
        <PhoneShell>
          <ChatPhone />
        </PhoneShell>
      </div>
      <div className="agents-fan-phone agents-fan-phone-front">
        <PhoneShell>
          <CallPhone />
        </PhoneShell>
      </div>
    </div>
  );
}

/* ============================================================
   Mockups standalone de un solo celular (cards separadas):
   uno para Agente de Chat, otro para Agente Telefónico. Cada
   uno flota suavemente para dar vida sin distraer. Bajo
   reduced-motion queda quieto.
   ============================================================ */

function SinglePhone({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <div className="agents-single" aria-hidden>
      <motion.div
        className="agents-single-phone"
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <PhoneShell>{children}</PhoneShell>
      </motion.div>
    </div>
  );
}

export function AgentChatMockup() {
  return (
    <SinglePhone>
      <ChatPhone />
    </SinglePhone>
  );
}

export function AgentCallMockup() {
  return (
    <SinglePhone>
      <CallPhone />
    </SinglePhone>
  );
}
