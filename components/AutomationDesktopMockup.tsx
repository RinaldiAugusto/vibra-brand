"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Mockup de compu de la fila "Operaciones Automatizadas": dentro de la
 * pantalla de la laptop, un carrusel de 2 escenas en loop.
 *   Escena 1 (~4s): flujo de un dato entre 4 apps (WhatsApp → IA → Sheets → Email).
 *   Escena 2 (~8s): dashboard de resultados con 3 stats en count-up + mini chart.
 * Slide lateral tipo carrusel entre escenas; loop infinito suave.
 * Todo en código (sin imágenes ni videos). Tipografías via tokens
 * (--font-heading / --font-body). Respeta prefers-reduced-motion: sin slides
 * ni loop, muestra el dashboard estatico con los numeros finales.
 */

/* ---- Iconos SVG (no emoji) ---- */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4" />
      <circle cx="12" cy="3" r="1.1" fill="var(--accent)" stroke="none" />
      <circle cx="9" cy="14" r="1.2" fill="var(--accent)" stroke="none" />
      <circle cx="15" cy="14" r="1.2" fill="var(--accent)" stroke="none" />
      <path d="M2 12v4M22 12v4" />
    </svg>
  );
}

function SheetsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="#188038" />
      <rect x="7" y="7" width="10" height="10" rx="1" fill="#fff" opacity="0.95" />
      <path d="M7 11h10M7 14h10M12 7v10" stroke="#188038" strokeWidth="1.1" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#e9edef" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

const NODES = [
  { icon: <WhatsAppIcon />, label: "WhatsApp" },
  { icon: <AiIcon />, label: "IA" },
  { icon: <SheetsIcon />, label: "Sheets" },
  { icon: <MailIcon />, label: "Email" },
];

/* ---- Escena 1: flujo ---- */
function FlowScene({ step }: { step: number }) {
  return (
    <div className="auto-scene">
      <div className="flow">
        <span className="flow-head">Flujo en tiempo real</span>
        <div className="flow-chain">
          {NODES.map((n, i) => (
            <Fragment key={i}>
              <div className="flow-cell">
                <motion.div
                  className={`flow-node ${step >= i + 1 ? "flow-node-active" : ""}`}
                  animate={{ scale: step === i + 1 ? [1, 1.14, 1] : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="flow-icon">{n.icon}</span>
                </motion.div>
                <span className="flow-label">{n.label}</span>
              </div>
              {i < NODES.length - 1 && (
                <div className="flow-conn" aria-hidden>
                  <motion.div
                    className="flow-conn-fill"
                    initial={false}
                    animate={{ scaleX: step >= i + 2 ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="flow-conn-dot"
                    initial={false}
                    animate={{
                      left: step >= i + 2 ? "100%" : "0%",
                      opacity: step === i + 2 ? [0, 1, 1, 0] : 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Escena 2: dashboard ---- */
const BARS = [42, 58, 34, 72, 50, 86, 64];

function StatCard({
  value,
  suffix,
  label,
  sub,
}: {
  value: number;
  suffix?: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="dash-stat">
      <div className="dash-value">
        {value}
        {suffix && <span className="dash-unit">{suffix}</span>}
      </div>
      <div className="dash-label">{label}</div>
      {sub && <div className="dash-sub">{sub}</div>}
    </div>
  );
}

function DashScene({
  active,
  c1,
  c2,
  c3,
}: {
  active: boolean;
  c1: number;
  c2: number;
  c3: number;
}) {
  return (
    <div className="auto-scene">
      <div className="dash">
        <span className="dash-head">Automatización Recepcionista - Semanal</span>
        <div className="dash-stats">
          <StatCard value={c1} label="Recordatorios enviados" />
          <StatCard value={c2} label="Turnos agendados" />
          <StatCard value={c3} suffix=" hs" label="Tiempo ahorrado" sub="esta semana" />
        </div>
        <div className="dash-chart" aria-hidden>
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              className="dash-bar"
              initial={false}
              animate={{ scaleY: active ? h / 100 : 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: active ? 0.2 + i * 0.06 : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AutomationDesktopMockup() {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(reduce ? 1 : 0);
  const [step, setStep] = useState(reduce ? 4 : 0);
  const [c1, setC1] = useState(reduce ? 47 : 0);
  const [c2, setC2] = useState(reduce ? 23 : 0);
  const [c3, setC3] = useState(reduce ? 12 : 0);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    const countUp = (target: number, setter: (n: number) => void, dur = 1400) =>
      new Promise<void>((res) => {
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = () => {
          if (!alive) return res();
          const t = Math.min(1, (performance.now() - start) / dur);
          setter(Math.round(target * ease(t)));
          if (t < 1) requestAnimationFrame(tick);
          else res();
        };
        requestAnimationFrame(tick);
      });

    (async () => {
      while (alive) {
        // --- Escena 1: flujo (~4s) ---
        setScene(0);
        setStep(0);
        setC1(0);
        setC2(0);
        setC3(0);
        await wait(600);
        for (let s = 1; s <= 4 && alive; s++) {
          setStep(s);
          await wait(850);
        }
        await wait(300);
        // --- slide a Escena 2 ---
        setScene(1);
        await wait(750);
        // count-up en paralelo + hold hasta completar ~8s
        await Promise.all([
          countUp(47, setC1),
          countUp(23, setC2),
          countUp(12, setC3),
        ]);
        // dashboard visible ~6s: count-up (~1.4s) + este hold (~4.6s)
        await wait(4600);
        // --- slide de vuelta a Escena 1 ---
        setScene(0);
        await wait(750);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="mockup mockup-desktop mockup-desktop-ops">
      <div className="mockup-desktop-bar" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="mockup-screen auto-screen">
        <div className="auto-stage" aria-hidden>
          <motion.div
            className="auto-track"
            initial={false}
            animate={{ x: scene === 0 ? "0%" : "-50%" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <FlowScene step={step} />
            <DashScene active={scene === 1} c1={c1} c2={c2} c3={c3} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
