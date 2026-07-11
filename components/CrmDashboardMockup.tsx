"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";

/**
 * Mockup de la fila destacada "Solución a Medida": dashboard tipo CRM mostrado
 * en DOS dispositivos a la vez para demostrar que el sistema es responsive.
 *   - Compu (adelante, protagonista): el dashboard completo en layout ancho.
 *   - Celular (atrás, escalonado): EL MISMO dashboard, pero apilado en columna
 *     como se vería de verdad en mobile (mismos datos, otro arreglo).
 *
 * Ambas pantallas leen del MISMO estado (counts, feed, chart activo), así que
 * siempre muestran los mismos números y eventos — solo cambia la disposición.
 *
 * Todo animado en código (sin imágenes ni videos):
 *   - Stats con count-up al entrar en viewport.
 *   - Gráfico semanal cuyas barras suben escalonadas al entrar.
 *   - Feed de actividad en vivo: los ítems entran de a uno en loop (el más
 *     nuevo arriba, sale el más viejo) para dar sensación de tiempo real.
 * Respeta prefers-reduced-motion: números/barras en su valor final, feed
 * estático de 3 ítems, sin loops ni pulsos.
 */

/* ============================================================
   Iconos SVG (no emoji)
   ============================================================ */
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 01-9 8.5 9.5 9.5 0 01-4-.9L3 20l1.9-4.1A8.38 8.38 0 013.5 11 8.5 8.5 0 0112 3a8.38 8.38 0 019 8.5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.6a16 16 0 006 6l1.2-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 7l-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PhoneMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.6a16 16 0 006 6l1.2-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.463 3.488A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.463 3.488" />
    </svg>
  );
}

/* ============================================================
   Datos (compartidos por compu + celular)
   ============================================================ */
type StatDef = {
  icon: React.ReactNode;
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STAT_DEFS: StatDef[] = [
  { icon: <ChatIcon />, target: 128, label: "Conversaciones" },
  { icon: <PhoneIcon />, target: 45, label: "Llamadas" },
  { icon: <CalendarIcon />, target: 67, label: "Turnos" },
  { icon: <TrendingIcon />, target: 18, prefix: "+", suffix: "%", label: "Crecimiento" },
];

type Channel = "wa" | "phone";
type Status = "atendido" | "turno" | "pendiente";

type Convo = {
  name: string;
  channel: Channel;
  action: string;
  status: Status;
};

const CONVERSATIONS: Convo[] = [
  { name: "Juan Pérez", channel: "wa", action: "Consultó precios", status: "atendido" },
  { name: "María González", channel: "phone", action: "Pidió un turno", status: "turno" },
  { name: "Carlos Ramírez", channel: "wa", action: "Dejó un mensaje", status: "pendiente" },
  { name: "Lucía Fernández", channel: "wa", action: "Confirmó asistencia", status: "atendido" },
];

const STATUS_LABEL: Record<Status, string> = {
  atendido: "Atendido",
  turno: "Turno agendado",
  pendiente: "Pendiente",
};

// Barras del gráfico semanal (Lun→Dom), en % de altura.
const CHART = [
  { day: "L", h: 44 },
  { day: "M", h: 66 },
  { day: "M", h: 52 },
  { day: "J", h: 78 },
  { day: "V", h: 60 },
  { day: "S", h: 90 },
  { day: "D", h: 72 },
];

type FeedKind = "chat" | "call" | "bell" | "check";
type FeedEvent = { kind: FeedKind; text: string };

const FEED_EVENTS: FeedEvent[] = [
  { kind: "chat", text: "Bot respondió a Juan P." },
  { kind: "call", text: "Llamada atendida — turno agendado" },
  { kind: "bell", text: "Recordatorio enviado a María G." },
  { kind: "check", text: "Turno confirmado — Lucía R." },
  { kind: "chat", text: "Nueva conversación — Carlos M." },
];

// El más nuevo arriba: el tope siempre se siente "recién ocurrido".
const FEED_TIMES = ["ahora", "hace 1 min", "hace 4 min"];

function FeedKindIcon({ kind }: { kind: FeedKind }) {
  if (kind === "call") return <PhoneMiniIcon />;
  if (kind === "bell") return <BellIcon />;
  if (kind === "check") return <CheckIcon />;
  return <ChatIcon />;
}

function ChannelIcon({ channel }: { channel: Channel }) {
  if (channel === "wa") return <WhatsAppMark />;
  return (
    <span className="crm-ch-phone" aria-hidden>
      <PhoneMiniIcon />
    </span>
  );
}

/* ============================================================
   Vista COMPU — dashboard ancho
   ============================================================ */
function DesktopCRM({
  counts,
  active,
  feed,
}: {
  counts: number[];
  active: boolean;
  feed: { id: number; ev: FeedEvent }[];
}) {
  return (
    <div className="crm-dash" aria-hidden>
      {/* Stats */}
      <div className="crm-stats">
        {STAT_DEFS.map((s, i) => (
          <div key={s.label} className="crm-stat">
            <span className="crm-stat-icon">{s.icon}</span>
            <div className="crm-stat-value">
              {s.prefix}
              {counts[i]}
              {s.suffix}
            </div>
            <div className="crm-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Centro: lista + gráfico | feed */}
      <div className="crm-main">
        <div className="crm-col crm-col-list">
          <div className="crm-panel crm-panel-grow">
            <span className="crm-sec-title">Conversaciones recientes</span>
            <div className="crm-list">
              {CONVERSATIONS.map((c) => (
                <div key={c.name} className="crm-row">
                  <span className="crm-row-ch">
                    <ChannelIcon channel={c.channel} />
                  </span>
                  <div className="crm-row-main">
                    <span className="crm-row-name">{c.name}</span>
                    <span className="crm-row-action">{c.action}</span>
                  </div>
                  <span className={`crm-badge crm-badge-${c.status}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="crm-panel">
            <span className="crm-sec-title">Actividad semanal</span>
            <div className="crm-chart">
              {CHART.map((b, i) => (
                <motion.span
                  key={i}
                  className="crm-bar"
                  initial={false}
                  animate={{ scaleY: active ? b.h / 100 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: active ? 0.15 + i * 0.06 : 0 }}
                />
              ))}
            </div>
            <div className="crm-chart-labels">
              {CHART.map((b, i) => (
                <span key={i}>{b.day}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="crm-col crm-col-feed">
          <div className="crm-panel crm-panel-grow">
            <span className="crm-sec-title crm-feed-title">
              Actividad en vivo
              <span className="crm-live" aria-hidden>
                <span className="crm-live-dot" />
                Live
              </span>
            </span>
            <div className="crm-feed">
              <AnimatePresence initial={false}>
                {feed.map((f, i) => (
                  <motion.div
                    key={f.id}
                    layout
                    className="crm-feed-item"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: i === 0 ? 1 : 0.72, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="crm-feed-icon">
                      <FeedKindIcon kind={f.ev.kind} />
                    </span>
                    <div className="crm-feed-body">
                      <span className="crm-feed-text">{f.ev.text}</span>
                      <span className="crm-feed-time">
                        {FEED_TIMES[i] ?? "hace unos min"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Vista CELULAR — MISMO dashboard, apilado en columna (responsive real)
   ============================================================ */
function PhoneCRM({
  counts,
  active,
  feed,
}: {
  counts: number[];
  active: boolean;
  feed: { id: number; ev: FeedEvent }[];
}) {
  return (
    <div className="crm-phone-ui" aria-hidden>
      <span className="crm-m-head">CRM · Panel</span>

      {/* Stats apilados 2×2 */}
      <div className="crm-mstats">
        {STAT_DEFS.map((s, i) => (
          <div key={s.label} className="crm-mstat">
            <span className="crm-mstat-icon">{s.icon}</span>
            <div className="crm-mstat-value">
              {s.prefix}
              {counts[i]}
              {s.suffix}
            </div>
            <div className="crm-mstat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="crm-mchart">
        {CHART.map((b, i) => (
          <motion.span
            key={i}
            className="crm-mbar"
            initial={false}
            animate={{ scaleY: active ? b.h / 100 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: active ? 0.15 + i * 0.06 : 0 }}
          />
        ))}
      </div>

      {/* Lista (apilada) */}
      <div className="crm-mlist">
        {CONVERSATIONS.slice(0, 3).map((c) => (
          <div key={c.name} className="crm-mrow">
            <span className="crm-mrow-ch">
              <ChannelIcon channel={c.channel} />
            </span>
            <span className="crm-mrow-name">{c.name}</span>
            <span className={`crm-mbadge crm-badge-${c.status}`}>
              {STATUS_LABEL[c.status]}
            </span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="crm-mfeed">
        <AnimatePresence initial={false}>
          {feed.slice(0, 2).map((f, i) => (
            <motion.div
              key={f.id}
              layout
              className="crm-mfeed-item"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: i === 0 ? 1 : 0.7, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="crm-mfeed-icon">
                <FeedKindIcon kind={f.ev.kind} />
              </span>
              <span className="crm-mfeed-text">{f.ev.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   Orquestador: estado compartido + los dos dispositivos en fan
   ============================================================ */
const TARGETS = STAT_DEFS.map((s) => s.target);

export default function CrmDashboardMockup() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Arranca las animaciones recién cuando el mockup entra en pantalla.
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const active = reduce || inView;

  const [counts, setCounts] = useState<number[]>(
    reduce ? TARGETS : TARGETS.map(() => 0)
  );
  const [feed, setFeed] = useState<{ id: number; ev: FeedEvent }[]>(() =>
    FEED_EVENTS.slice(0, 3).map((ev, i) => ({ id: i, ev }))
  );

  // Count-up de los 4 stats al entrar (rAF, ease-out cúbico).
  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      setCounts(TARGETS.map((v) => Math.round(v * ease(t))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView]);

  // Feed en vivo: cada ~2.2s entra un evento nuevo arriba y sale el más viejo.
  useEffect(() => {
    if (reduce || !inView) return;
    let n = FEED_EVENTS.length; // los 3 iniciales ya usaron ids 0..2
    let next = 3;
    const id = setInterval(() => {
      setFeed((prev) => {
        const ev = FEED_EVENTS[n % FEED_EVENTS.length];
        n += 1;
        next += 1;
        return [{ id: next, ev }, ...prev].slice(0, 3);
      });
    }, 2200);
    return () => clearInterval(id);
  }, [reduce, inView]);

  return (
    <div className="crm-fan" ref={ref}>
      {/* Celular atrás/escalonado: mismo dashboard, apilado en mobile */}
      <div className="crm-fan-phone">
        <div className="mockup-phone">
          <div className="mockup-phone-camera" aria-hidden />
          <div className="mockup-phone-display">
            <PhoneCRM counts={counts} active={active} feed={feed} />
          </div>
        </div>
      </div>

      {/* Compu adelante y protagonista: el dashboard completo */}
      <div className="mockup mockup-desktop crm-fan-desktop">
        <div className="mockup-desktop-bar" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="mockup-screen crm-screen">
          <DesktopCRM counts={counts} active={active} feed={feed} />
        </div>
      </div>
    </div>
  );
}
